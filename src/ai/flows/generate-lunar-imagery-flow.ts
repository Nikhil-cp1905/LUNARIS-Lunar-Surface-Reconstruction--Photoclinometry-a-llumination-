'use server';
/**
 * @fileOverview Generates lunar imagery and analysis using AI.
 *
 * - generateLunarImagery - A function that generates a DEM, a photoclinometry image, and topographic analysis from a source image.
 * - GenerateLunarImageryInput - The input type for the generateLunarImagery function.
 * - GenerateLunarImageryOutput - The return type for the generateLunarImagery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateLunarImageryInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a lunar surface, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateLunarImageryInput = z.infer<typeof GenerateLunarImageryInputSchema>;

const GenerateLunarImageryOutputSchema = z.object({
  dem: z.object({
    imageUri: z.string().describe('The generated Digital Elevation Model (DEM) image as a data URI.'),
    description: z.string().describe('A brief description of the topography and notable features.'),
    minElevation: z.number().describe('Estimated minimum elevation in meters relative to the mean.'),
    maxElevation: z.number().describe('Estimated maximum elevation in meters relative to the mean.'),
  }),
  photoclinometryImageUri: z.string().describe('The generated Photoclinometry image as a data URI.'),
});
export type GenerateLunarImageryOutput = z.infer<typeof GenerateLunarImageryOutputSchema>;

export async function generateLunarImagery(input: GenerateLunarImageryInput): Promise<GenerateLunarImageryOutput> {
  return generateLunarImageryFlow(input);
}

const topographyAnalysisPrompt = ai.definePrompt({
    name: 'topographyAnalysisPrompt',
    input: { schema: z.object({ photoDataUri: z.string() }) },
    output: {
        schema: z.object({
            description: z.string().describe('A brief description of the topography and notable features, in 2-3 sentences.'),
            minElevation: z.number().describe('Estimated minimum elevation in meters relative to the mean surface level.'),
            maxElevation: z.number().describe('Estimated maximum elevation in meters relative to the mean surface level.'),
        })
    },
    prompt: `You are a planetary scientist specializing in lunar topography. Analyze the provided image of the lunar surface.
    Based on the craters, shadows, and other features, provide a brief description of the topography and estimate the minimum and maximum elevation range in meters, relative to the average surface level in the image.
    
    Image: {{media url=photoDataUri}}`
});

const generateLunarImageryFlow = ai.defineFlow(
  {
    name: 'generateLunarImageryFlow',
    inputSchema: GenerateLunarImageryInputSchema,
    outputSchema: GenerateLunarImageryOutputSchema,
  },
  async (input) => {
    // Run requests sequentially to avoid potential concurrency issues with the model.
    const analysisResult = await topographyAnalysisPrompt(input);

    const demResult = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        { media: { url: input.photoDataUri } },
        { text: 'Generate a false-color Digital Elevation Model (DEM) of this lunar surface. Use a colormap where cool colors represent low elevation and warm colors represent high elevation. Include a color legend.' },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    const photoclinometryResult = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: [
        { media: { url: input.photoDataUri } },
        { text: 'Generate a photoclinometry map for this lunar surface image. The result should be a grayscale image highlighting the 3D shape derived from shading.' },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!demResult.media?.url || !photoclinometryResult.media?.url || !analysisResult.output) {
        throw new Error('AI processing failed to produce a complete output.');
    }
    
    return {
      dem: {
        imageUri: demResult.media.url,
        ...analysisResult.output,
      },
      photoclinometryImageUri: photoclinometryResult.media.url,
    };
  }
);
