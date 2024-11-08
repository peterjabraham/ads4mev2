export const apiConfig = {
  openai: {
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    maxTokens: parseInt(process.env.MAX_TOKENS || '500', 10),
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
  }
};

export const validateEnvVars = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
}; 