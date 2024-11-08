interface APIConfig {
  openai: {
    model: string;
    maxTokens: number;
    temperature: number;
  }
}

interface ErrorResponse {
  success: false;
  error: string;
}

interface GenerationRequest {
  prompt: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

// Define a proper response type
interface GeneratedContent {
  headline: string;
  primaryText: string;
  variations?: string[];
}

interface GenerationResponse {
  success: boolean;
  data?: GeneratedContent;
  error?: string;
}

export const createErrorResponse = (message: string): ErrorResponse => ({
  success: false,
  error: message
});

const apiService = {
  config: {
    openai: {
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      maxTokens: parseInt(process.env.MAX_TOKENS || '500', 10),
      temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    }
  } as APIConfig,

  validateEnvVars: (): void => {
    const requiredEnvVars = ['OPENAI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  },

  generateAd: async (data: GenerationRequest): Promise<GenerationResponse> => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ad');
      }

      return await response.json();
    } catch (error) {
      return createErrorResponse(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
};

export default apiService;