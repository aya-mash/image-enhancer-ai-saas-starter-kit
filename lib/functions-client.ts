import { httpsCallable } from 'firebase/functions';

import { functions } from '@/lib/firebase';

export interface AnalyzePayload {
  imageBase64: string;
  styleId: string;
  systemPrompt?: string;
}

export interface AnalyzeResponse {
  projectId: string;
  previewUrl: string;
  vision: string;
}

export interface VerifyPayload {
  glowupId: string;
  reference: string;
}

export interface VerifyResponse {
  downloadUrl: string;
}

export async function callAnalyzeAndEnhance(payload: AnalyzePayload): Promise<AnalyzeResponse> {
  const callable = httpsCallable<AnalyzePayload, AnalyzeResponse>(functions, 'analyzeAndEnhance');
  const result = await callable(payload);
  return result.data;
}

export async function callVerifyAndUnlock(payload: VerifyPayload): Promise<VerifyResponse> {
  const callable = httpsCallable<VerifyPayload, VerifyResponse>(functions, 'verifyAndUnlock');
  const result = await callable(payload);
  return result.data;
}
