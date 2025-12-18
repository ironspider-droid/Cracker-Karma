'use server';

import { analyzeCrackerPollution, type AnalyzeCrackerPollutionInput, type AnalyzeCrackerPollutionOutput } from '@/ai/flows/analyze-cracker-pollution';

export type ServerActionResult = {
  success: true;
  data: AnalyzeCrackerPollutionOutput;
} | {
  success: false;
  error: string;
}

export async function analyzeCrackerImage(input: AnalyzeCrackerPollutionInput): Promise<ServerActionResult> {
  try {
    const result = await analyzeCrackerPollution(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error analyzing cracker image:", error);
    // Return a generic error message to the client for security
    return { success: false, error: "Failed to analyze the cracker image. Please try again later." };
  }
}
