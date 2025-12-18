'use server';
/**
 * @fileOverview A cracker analysis AI flow.
 *
 * - analyzeCracker - A function that handles the cracker analysis process.
 */

import { ai } from '@/ai/genkit';
import { AnalyzeCrackerInputSchema, AnalyzeCrackerOutputSchema, type AnalyzeCrackerInput, type AnalyzeCrackerOutput } from '@/ai/schemas/crackerAnalysis';

export async function analyzeCracker(input: AnalyzeCrackerInput): Promise<AnalyzeCrackerOutput> {
    return analyzeCrackerFlow(input);
}

const analyzeCrackerFlow = ai.defineFlow(
    {
        name: 'analyzeCrackerFlow',
        inputSchema: AnalyzeCrackerInputSchema,
        outputSchema: AnalyzeCrackerOutputSchema,
    },
    async (input) => {
        const prompt = `You are a firecracker expert. Analyze the provided image.

Your task is to identify if the image contains a firecracker.

If it is not a firecracker, set isCracker to false and provide a reason. The pollutionPoints should be 0.

If it is a firecracker, identify its type (e.g., sparkler, rocket, fountain, etc.) and assign it a pollution point value. The more polluting the cracker, the more negative the point value should be. The range is from -10 for something small like a sparkler to -500 for a large aerial firework. Provide a brief reason for your assessment.

Image: {{media url=photoDataUri}}`;

        const { output } = await ai.generate({
            prompt: prompt,
            model: 'googleai/gemini-2.5-flash',
            output: {
                schema: AnalyzeCrackerOutputSchema,
            },
            context: {
                photoDataUri: input.photoDataUri,
            }
        });

        return output!;
    }
);
