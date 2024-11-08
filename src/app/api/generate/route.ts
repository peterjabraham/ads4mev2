import { NextRequest, NextResponse } from 'next/server';
import { GenerationRequest } from '@/types';
import { createErrorResponse } from '@/services/api';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
    
// Helper function to format the prompt
const formatPrompt = (data: GenerationRequest): string => {
  let prompt = `Generate creative and engaging ad copy for the following:
Brand: ${data.brandName}
Product: ${data.product}
User Benefit: ${data.userBenefit}
Promotion: ${data.promotion}
Target Audience: ${data.audience}
Marketing Goal: ${data.goal}
Keywords to include: ${data.keywords}
Additional Rules: ${data.additionalRules || 'None'}`;

  if (data.csvData) {
    prompt += `\nPrevious successful headlines: ${data.csvData}`;
  }

  if (data.useLikedHeadlines && data.likedHeadlines?.length) {
    prompt += `\nPreferred headline styles: ${data.likedHeadlines.join(', ')}`;
  }

  prompt += '\n\nPlease generate 5 unique, creative ad headlines and descriptions that capture attention and drive action.';
  return prompt;
};

export async function POST(request: NextRequest) {
  try {
    const data: GenerationRequest = await request.json();

    // Validate required fields
    const requiredFields = ['brandName', 'product', 'userBenefit', 'promotion', 'audience', 'goal', 'keywords'];
    const missingFields = requiredFields.filter(field => !data[field as keyof GenerationRequest]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`),
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: formatPrompt({
            brandName: data.brandName,
            product: data.product,
            userBenefit: data.userBenefit,
            promotion: data.promotion,
            audience: data.audience,
            goal: data.goal,
            keywords: data.keywords,
            additionalRules: data.additionalRules,
            csvData: data.csvData,
            useLikedHeadlines: data.useLikedHeadlines,
            likedHeadlines: data.likedHeadlines
          })
        }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      return NextResponse.json(
        createErrorResponse('No content generated'),
        { status: 500 }
      );
    }

    // Parse the generated content into structured format
    const lines = generatedContent.split('\n').filter(line => line.trim());
    const headlines: string[] = [];
    const descriptions: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('Headline:')) {
        headlines.push(line.replace('Headline:', '').trim());
      } else if (line.startsWith('Description:')) {
        descriptions.push(line.replace('Description:', '').trim());
      }
    });

    return NextResponse.json({
      success: true,
      generatedAd: {
        title: headlines[0] || '',
        description: descriptions[0] || '',
        variations: headlines.slice(1)
      }
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      createErrorResponse(error instanceof Error ? error.message : 'An error occurred during generation'),
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Generation API endpoint is working'
  });
}