import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ApiResponse } from '../../types';
import { getApiKey } from '../storage/settings';

let genAI: GoogleGenerativeAI | null = null;

export function initializeGemini(apiKey: string): void {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateEmbedding(
  text: string,
  apiKey?: string
): Promise<ApiResponse<number[]>> {
  try {
    // If genAI not initialized, try to get API key from storage
    if (!genAI) {
      const storedKey = apiKey || await getApiKey();
      if (!storedKey) {
        return {
          success: false,
          error: 'API key not configured. Please add your Gemini API key in settings.',
        };
      }
      initializeGemini(storedKey);
    }

    const model = genAI!.getGenerativeModel({ model: 'text-embedding-004' });

    // Truncate text to max 2048 tokens (~8000 chars)
    const truncatedText = text.slice(0, 8000);

    const result = await model.embedContent(truncatedText);
    const embedding = result.embedding;

    return {
      success: true,
      data: embedding.values,
    };
  } catch (error: unknown) {
    console.error('Gemini API error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('quota') || errorMessage.includes('rate')) {
      return {
        success: false,
        error: 'Rate limit exceeded. Try again later.',
        rateLimited: true,
      };
    }

    return {
      success: false,
      error: errorMessage || 'Failed to generate embedding',
    };
  }
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  const result = await generateEmbedding('test', apiKey);
  return result.success;
}
