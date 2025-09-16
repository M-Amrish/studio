// The extractRooftopDimensionsFromBlueprint flow extracts rooftop dimensions from a building blueprint image.
// It takes a data URI of the blueprint image as input and returns the extracted dimensions (length and width).

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractRooftopDimensionsFromBlueprintInputSchema = z.object({
  blueprintDataUri: z
    .string()
    .describe(
      "A building blueprint image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractRooftopDimensionsFromBlueprintInput =
  z.infer<typeof ExtractRooftopDimensionsFromBlueprintInputSchema>;

const ExtractRooftopDimensionsFromBlueprintOutputSchema = z.object({
  length: z.number().describe('The length of the rooftop in meters.'),
  width: z.number().describe('The width of the rooftop in meters.'),
});
export type ExtractRooftopDimensionsFromBlueprintOutput =
  z.infer<typeof ExtractRooftopDimensionsFromBlueprintOutputSchema>;

export async function extractRooftopDimensionsFromBlueprint(
  input: ExtractRooftopDimensionsFromBlueprintInput
): Promise<ExtractRooftopDimensionsFromBlueprintOutput> {
  return extractRooftopDimensionsFromBlueprintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractRooftopDimensionsFromBlueprintPrompt',
  input: {schema: ExtractRooftopDimensionsFromBlueprintInputSchema},
  output: {schema: ExtractRooftopDimensionsFromBlueprintOutputSchema},
  prompt: `You are an expert in analyzing building blueprints and extracting rooftop dimensions.

  Analyze the provided blueprint image and identify the length and width of the rooftop.
  Ensure the measurements are accurate and in meters.

  Blueprint Image: {{media url=blueprintDataUri}}

  Provide the length and width of the rooftop as accurately as possible.
  `,
});

const extractRooftopDimensionsFromBlueprintFlow = ai.defineFlow(
  {
    name: 'extractRooftopDimensionsFromBlueprintFlow',
    inputSchema: ExtractRooftopDimensionsFromBlueprintInputSchema,
    outputSchema: ExtractRooftopDimensionsFromBlueprintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
