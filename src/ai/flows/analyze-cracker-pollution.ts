'use server';

/**
 * @fileOverview An AI agent that analyzes a firecracker photo to estimate its pollution impact.
 *
 * - analyzeCrackerPollution - A function that handles the firecracker pollution analysis process.
 * - AnalyzeCrackerPollutionInput - The input type for the analyzeCrackerPollution function.
 * - AnalyzeCrackerPollutionOutput - The return type for the analyzeCrackerPollution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCrackerPollutionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a firecracker, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCrackerPollutionInput = z.infer<typeof AnalyzeCrackerPollutionInputSchema>;

const AnalyzeCrackerPollutionOutputSchema = z.object({
  estimatedPollution: z
    .string()
    .describe(
      'The estimated pollution caused by the firecracker, including types and amounts of pollutants.'
    ),
  budgetAdjustment: z
    .string()
    .describe(
      'A recommendation for adjusting the user budget based on the pollution caused by the firecracker.'
    ),
});
export type AnalyzeCrackerPollutionOutput = z.infer<typeof AnalyzeCrackerPollutionOutputSchema>;

export async function analyzeCrackerPollution(
  input: AnalyzeCrackerPollutionInput
): Promise<AnalyzeCrackerPollutionOutput> {
  return analyzeCrackerPollutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCrackerPollutionPrompt',
  input: {schema: AnalyzeCrackerPollutionInputSchema},
  output: {schema: AnalyzeCrackerPollutionOutputSchema},
  prompt: `You are an expert in assessing the environmental impact of firecrackers. Given a photo of a firecracker, estimate the amount and types of pollution it will cause, and provide a recommendation for adjusting the user's firecracker budget. Be very detailed in the estimated pollution, including the chemical compounds released, and the expected duration of the pollution.

Firecracker Photo: {{media url=photoDataUri}}`,
});

const analyzeCrackerPollutionFlow = ai.defineFlow(
  {
    name: 'analyzeCrackerPollutionFlow',
    inputSchema: AnalyzeCrackerPollutionInputSchema,
    outputSchema: AnalyzeCrackerPollutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
