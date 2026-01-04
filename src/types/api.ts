export interface GeminiEmbeddingResponse {
  embedding: {
    values: number[];
  };
}

export interface GeminiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

export interface ApiRequestOptions {
  apiKey: string;
  model: string;
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimited?: boolean;
}
