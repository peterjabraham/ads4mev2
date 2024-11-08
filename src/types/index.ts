// Generation Request Types
export interface GenerationRequest {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string | string[];
  additionalRules?: string;
  tone?: ToneType;
  useLikedHeadlines?: boolean;
  likedHeadlines?: string[];
  csvData?: string;
}

// API Response Types
export interface GenerateApiResponse {
  success: boolean;
  generatedAd: {
    title: string;
    description: string;
    variations: string[];
  };
  error?: string;
}

export interface GenerationResponse {
  success: boolean;
  data?: string[];
  generatedAd?: {
    title: string;
    description: string;
    variations: string[];
  };
  error?: string;
}

// Form State Types
export interface FormState {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string[];
  additionalRules: string;
  tone: ToneType;
  generatedAd: GeneratedAd | null;
  isSubmitting: boolean;
  useLikedHeadlines: boolean;
  likedHeadlines: string[];
  campaignName: string;
  campaignDate: string;
}

// Generated Content Types
export interface GeneratedAd {
  headlines: string[];
  descriptions: string[];
  timestamp: number;
  id: string;
}

export interface SavedAd {
  id: string;
  timestamp: number;
  headline: string;
  primaryText: string;
  campaignName: string;
  campaignDate: string;
}

// Core Types
export type ToneType = 'professional' | 'casual' | 'excited' | 'urgent' | 'friendly' | 'authoritative';

// Firebase Types
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Utility Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ProgressStatus {
  completed: number;
  total: number;
  percentage: number;
}

export interface SavedHeadline {
  id: string;
  text: string;
  type: 'headline' | 'description';
  timestamp: number;
}

// User Preferences
export interface UserPreferences {
  defaultTone: ToneType;
  savedTemplates: string[];
  theme: 'light' | 'dark';
}