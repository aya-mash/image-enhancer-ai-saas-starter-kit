# Architecture Overview

Understanding the technical stack and data flow.

## Tech Stack

*   **Frontend**: React Native (Expo), TypeScript, Expo Router.
*   **Backend**: Firebase Cloud Functions (Node.js 22).
*   **Database**: Cloud Firestore (NoSQL).
*   **Storage**: Cloud Storage for Firebase.
*   **Auth**: Firebase Authentication.
*   **AI**: Google Gemini (via Vertex AI or AI Studio).
*   **Payments**: Paystack (Client-side trigger, Server-side verification).

## Data Flow: Image Enhancement

1.  **Upload**: User selects an image. It is converted to Base64 (or uploaded to temp storage).
2.  **Request**: App calls `analyzeAndEnhance` Cloud Function.
3.  **Analysis**: Function calls Gemini Vision (Gemini Pro) to describe the image.
4.  **Generation**: Function calls Gemini Image (Nano Banana Pro) with the description + style prompt.
5.  **Processing**:
    *   The generated image is watermarked using `sharp`.
    *   Both original and preview images are saved to Firebase Storage.
    *   A record is created in Firestore (`users/{uid}/glowups/{id}`) with status `locked`.
6.  **Response**: Function returns the `projectId` and preview URL.
7.  **Display**: App shows the watermarked preview.

## Data Flow: Payment & Unlock

1.  **Trigger**: User clicks "Unlock".
2.  **Payment**: App opens Paystack modal. User pays.
3.  **Verification**:
    *   App calls `verifyAndUnlock` Cloud Function with the transaction reference.
    *   Function verifies the transaction with Paystack API.
    *   If valid, Function updates Firestore document status to `unlocked`.
    *   Function generates a signed URL (or public URL) for the high-res, un-watermarked image.
4.  **Result**: App displays the full image and allows download.

## Folder Structure

```
/
├── app/                  # Frontend screens (Expo Router)
│   ├── (auth)/           # Protected routes (Upload, Preview, Result)
│   ├── (tabs)/           # Main tab navigation
│   ├── _layout.tsx       # Root layout & providers
├── components/           # Reusable UI components
├── config/               # Global app configuration
├── constants/            # Theme colors and static values
├── docs/                 # Documentation (You are here)
├── functions/            # Backend Cloud Functions
│   ├── src/
│   │   ├── index.ts      # Main entry point
│   │   ├── payments.ts   # Payment verification logic
├── hooks/                # Custom React hooks (useAuth, useGlowups)
├── lib/                  # Utility libraries (Firebase init, API clients)
├── prompt-kit/           # AI Style definitions
├── providers/            # Context providers (Auth)
├── types/                # TypeScript interfaces
```
