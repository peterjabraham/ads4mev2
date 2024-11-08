import OpenAI from 'openai';
import { apiConfig } from '@/config/api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerationPrompt {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string[];
  additionalRules?: string;
  useLikedHeadlines?: boolean;
  likedHeadlines?: Array<{ headline: string }>;
}

export const generateAdCopy = async (prompt: GenerationPrompt) => {
  try {
    let likedHeadlinesPrompt = '';
    if (prompt.useLikedHeadlines && prompt.likedHeadlines?.length > 0) {
      likedHeadlinesPrompt = `Previously liked headlines for reference:\n${prompt.likedHeadlines.map(h => `- ${h.headline}`).join('\n')}\n\n`;
    }

    const response = await openai.chat.completions.create({
      model: apiConfig.openai.model,
      messages: [
        {
          role: 'system',
          content: `You are an expert copywriter. You have a deep understanding of the writing techniques of advertising legends like David Ogilvy, Dave Trott, Bill Bernbach, and Joseph Sugarman. Your ad text should be engaging and actionable.Generate 5 ad variations in this exact format:
          Headline 1: "headline text"
          Primary text 1: "primary text"
          
          Headline 2: "headline text"
          Primary text 2: "primary text"
          
          Headline 3: "headline text"
          Primary text 3: "primary text"

          Headline 4: "headline text"
          Primary text 4: "primary text"

          Headline 5: "headline text"
          Primary text 5: "primary text"`
        },
        {
          role: 'user',
          content: `${likedHeadlinesPrompt}Generate 5 ad variations for the following:
          Brand: ${prompt.brandName}
          Product: ${prompt.product}
          User Benefit: ${prompt.userBenefit}
          Promotion: ${prompt.promotion}
          Target Audience: ${prompt.audience}
          Goal: ${prompt.goal}
          Keywords: ${prompt.keywords.join(', ')}
          Additional Rules: ${prompt.additionalRules || 'None'}`
        }
      ],
      temperature: apiConfig.openai.temperature,
      max_tokens: apiConfig.openai.maxTokens,
    });

    const content = response.choices[0].message.content || '';
    
    // Split into individual ad variations
    const adVariations = content.split('\n\n').filter(Boolean);
    
    if (adVariations.length === 0) {
      throw new Error('Failed to generate ad variations');
    }

    // Parse first ad for main content
    const [firstHeadline, firstPrimaryText] = adVariations[0].split('\n');
    const mainTitle = firstHeadline.split(': "')[1]?.replace('"', '') || '';
    const mainDescription = firstPrimaryText.split(': "')[1]?.replace('"', '') || '';

    // Parse remaining ads as variations
    const variations = adVariations.slice(1).map(variation => {
      const [headline, primaryText] = variation.split('\n');
      const headlineText = headline.split(': "')[1]?.replace('"', '') || '';
      const primaryTextClean = primaryText.split(': "')[1]?.replace('"', '') || '';
      return `Headline: "${headlineText}"\nPrimary text: "${primaryTextClean}"`;
    });

    return {
      title: mainTitle,
      description: mainDescription,
      variations,
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}; 