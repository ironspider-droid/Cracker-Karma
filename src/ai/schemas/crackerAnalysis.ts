import { z } from 'genkit';

export const AnalyzeCrackerInputSchema = z.object({
    photoDataUri: z
        .string()
        .describe(
            "A photo of a firecracker, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
});
export type AnalyzeCrackerInput = z.infer<typeof AnalyzeCrackerInputSchema>;

export const AnalyzeCrackerOutputSchema = z.object({
    crackerName: z.string().describe('The identified name of the firecracker.'),
    isCracker: z.boolean().describe('Whether the image contains a firecracker.'),
    reason: z.string().describe('The reasoning for the analysis.'),
    pollutionPoints: z.number().describe('A score from -10 to -500 representing the negative impact on the pollution budget. More polluting crackers get a more negative score.')
});
export type AnalyzeCrackerOutput = z.infer<typeof AnalyzeCrackerOutputSchema>;
