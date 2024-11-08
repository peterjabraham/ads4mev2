export interface GenerationRequest {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string[];
  additionalRules?: string;
  csvData?: string;
  useLikedHeadlines?: boolean;
  likedHeadlines?: string[];
}
export interface GenerateApiResponse {
  success: boolean;
  generatedAd: {
    title: string;
    description: string;
    variations: string[];
  };
}

export interface SavedAd {
  id: string;
  timestamp: number;
  headline: string;      // Add this
  primaryText: string;   // Add this
  campaignName: string;
  campaignDate: string;
}