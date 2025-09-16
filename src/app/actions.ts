'use server';
import { extractRooftopDimensionsFromBlueprint } from '@/ai/flows/extract-rooftop-dimensions-from-blueprint';

export async function extractDimensionsAction(blueprintDataUri: string) {
  try {
    const result = await extractRooftopDimensionsFromBlueprint({ blueprintDataUri });
    return {
      length: result.length,
      width: result.width,
    };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return {
      error,
    };
  }
}
