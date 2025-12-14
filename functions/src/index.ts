import { GoogleGenerativeAI } from "@google/generative-ai";
import { randomUUID } from "crypto";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import {
    HttpsError,
    onCall,
    type CallableRequest,
} from "firebase-functions/v2/https";
import sharp from "sharp";
import { z } from "zod";
import { getPaymentVerifier } from "./payments";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();
const bucket = getStorage().bucket();

// --- Configuration ---
// In a real deployment, these should be set via `firebase functions:secrets:set`
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PAYMENT_SECRET_KEY = process.env.PAYMENT_SECRET_KEY; // e.g., Paystack or Stripe

// --- Schemas ---
const analyzeSchema = z.object({
  imageBase64: z.string().min(10),
  styleId: z.string(), // Maps to an ID in prompt-kit/prompts.json
  systemPrompt: z.string().optional(), // Allow client to pass prompt, or look up on server
});

const verifySchema = z.object({
  resourceId: z.string().min(4),
  reference: z.string().min(4),
});

// --- Helpers ---
function assertEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new HttpsError(
      "failed-precondition",
      `${name} is not set in environment.`
    );
  }
  return value;
}

function stripDataUrlPrefix(base64: string) {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
}

function buildWatermarkSvg(text: string) {
  return Buffer.from(
    `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @font-face { font-family: 'Inter'; }
        </style>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="black" flood-opacity="0.5"/>
        </filter>
      </defs>
      <g transform="rotate(-35 400 400)" fill="none">
        <text x="50" y="430" font-size="56" font-family="Inter" fill="rgba(255,255,255,0.8)" filter="url(#shadow)" font-weight="bold">
          ${text}
        </text>
      </g>
    </svg>`
  );
}

// --- Core Logic ---

async function describeVision(genAI: GoogleGenerativeAI, base64: string) {
  const cleanBase64 = stripDataUrlPrefix(base64);
  const visionModel = genAI.getGenerativeModel({
    model: "gemini-pro",
  });
  const response = await visionModel.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: "Describe faces, expressions, lighting, and visible text succinctly." },
          { inlineData: { data: cleanBase64, mimeType: "image/jpeg" } },
        ],
      },
    ],
  });
  return response.response?.text()?.trim() || "No vision details provided.";
}

async function enhanceImage(
  genAI: GoogleGenerativeAI,
  base64: string,
  systemPrompt: string,
  vision: string
) {
  const cleanBase64 = stripDataUrlPrefix(base64);
  
  const fullPrompt = `${systemPrompt}
STRICTLY PRESERVE: ${vision}
Preserve the subject identity, pose, framing, and background. Remove artifacts. Do not add text or watermarks. Increase clarity, depth, dynamic range, and realistic skin tones.`;

  const model = genAI.getGenerativeModel({
    model: "nano-banana-pro",
  });
  
  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { text: fullPrompt },
          { inlineData: { data: cleanBase64, mimeType: "image/jpeg" } },
        ],
      },
    ],
  });

  const part = response.response?.candidates?.[0]?.content.parts?.find(
    (p: any) => "inlineData" in p
  );
  const data = part?.inlineData?.data as string | undefined;
  if (!data) {
    throw new Error("AI did not return an image.");
  }
  return Buffer.from(data, "base64");
}

// --- Cloud Functions ---

/**
 * Analyzes the uploaded image and generates an enhanced preview.
 * Stores the original and preview in Firebase Storage.
 */
export const analyzeAndEnhance = onCall(
  { region: "us-central1", memory: "2GiB", timeoutSeconds: 540 },
  async (request: CallableRequest) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Sign-in required.");
    }
    
    const parsed = analyzeSchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError("invalid-argument", "Invalid payload", parsed.error.format());
    }

    const { imageBase64, styleId, systemPrompt } = parsed.data;
    
    // In a real app, you might look up the systemPrompt from a database using styleId
    // to prevent users from injecting arbitrary prompts if you want to lock it down.
    const promptToUse = systemPrompt || "Enhance image quality.";

    try {
      const genAI = new GoogleGenerativeAI(assertEnv(GEMINI_API_KEY, "GEMINI_API_KEY"));

      const originalBuffer = Buffer.from(imageBase64, "base64");
      
      // 1. Analyze Image (Vision)
      const vision = await describeVision(genAI, imageBase64);
      
      // 2. Generate Enhanced Version
      const enhancedBuffer = await enhanceImage(genAI, imageBase64, promptToUse, vision);

      // 3. Process & Store
      const id = randomUUID();
      const originalPath = `originals/${uid}/${id}.jpg`;
      const previewPath = `previews/${uid}/${id}.jpg`;
      
      // Save Original
      await bucket.file(originalPath).save(originalBuffer, {
        metadata: { contentType: "image/jpeg" },
      });

      // Create Watermarked Preview
      const watermarkSvg = buildWatermarkSvg("PREVIEW MODE");
      const previewBuffer = await sharp(enhancedBuffer)
        .composite([{ input: watermarkSvg, gravity: "center", tile: true, blend: "overlay" }])
        .jpeg({ quality: 90 })
        .toBuffer();

      const previewFile = bucket.file(previewPath);
      await previewFile.save(previewBuffer, {
        metadata: { contentType: "image/jpeg", cacheControl: "public, max-age=31536000" },
      });
      await previewFile.makePublic();
      const previewUrl = previewFile.publicUrl();

      // Save Metadata to Firestore
      await db.doc(`users/${uid}/projects/${id}`).set({
        id,
        styleId,
        status: "locked",
        previewUrl,
        originalPath,
        previewPath,
        createdAt: new Date(),
        vision,
      });

      logger.info("Project prepared", { uid, id, styleId });

      return { projectId: id, previewUrl, vision };

    } catch (error: any) {
      logger.error("Error in analyzeAndEnhance", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Processing failed. Please try again.");
    }
  }
);

/**
 * Verifies payment and unlocks the full-resolution image.
 */
export const verifyAndUnlock = onCall(
  { region: "us-central1" },
  async (request: CallableRequest) => {
    const uid = request.auth?.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "Sign-in required.");
    }
    const parsed = verifySchema.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError("invalid-argument", "Invalid payload", parsed.error.format());
    }
    const { resourceId, reference } = parsed.data;

    try {
      const secret = assertEnv(PAYMENT_SECRET_KEY, "PAYMENT_SECRET_KEY");
      
      // Verify with Paystack (Modularize this for Stripe/others)
      const verifier = getPaymentVerifier("paystack");
      const success = await verifier.verifyTransaction(reference, secret);
      
      if (!success) {
        throw new HttpsError("permission-denied", "Payment verification failed.");
      }

      // Unlock Resource
      const ref = db.doc(`users/${uid}/projects/${resourceId}`);
      const snap = await ref.get();
      if (!snap.exists) throw new HttpsError("not-found", "Project not found.");
      
      const data = snap.data() as any;
      const originalPath = data.originalPath;

      // Generate Signed URL for Original
      const file = bucket.file(originalPath);
      const [downloadUrl] = await file.getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      });

      await ref.update({
        status: "unlocked",
        downloadUrl,
        paymentReference: reference,
        unlockedAt: new Date(),
      });

      return { downloadUrl };

    } catch (error: any) {
      logger.error("Error in verifyAndUnlock", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Verification failed.");
    }
  }
);
