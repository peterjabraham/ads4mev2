export interface ValidationError {
  field: string;
  message: string;
}

const CHARACTER_LIMITS = {
  brandName: 50,
  product: 100,
  userBenefit: 200,
  promotion: 200,
  audience: 100,
  goal: 150,
  additionalRules: 500,
} as const;

export const validateForm = (formData: {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string[];
  additionalRules?: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!formData.brandName.trim()) {
    errors.push({ field: 'brandName', message: 'Brand name is required' });
  } else if (formData.brandName.length > CHARACTER_LIMITS.brandName) {
    errors.push({ field: 'brandName', message: `Brand name must be less than ${CHARACTER_LIMITS.brandName} characters` });
  }

  if (!formData.product.trim()) {
    errors.push({ field: 'product', message: 'Product/Service is required' });
  } else if (formData.product.length > CHARACTER_LIMITS.product) {
    errors.push({ field: 'product', message: `Product/Service must be less than ${CHARACTER_LIMITS.product} characters` });
  }

  if (!formData.userBenefit.trim()) {
    errors.push({ field: 'userBenefit', message: 'User benefit is required' });
  } else if (formData.userBenefit.length > CHARACTER_LIMITS.userBenefit) {
    errors.push({ field: 'userBenefit', message: `User benefit must be less than ${CHARACTER_LIMITS.userBenefit} characters` });
  }

  if (!formData.audience.trim()) {
    errors.push({ field: 'audience', message: 'Target audience is required' });
  } else if (formData.audience.length > CHARACTER_LIMITS.audience) {
    errors.push({ field: 'audience', message: `Target audience must be less than ${CHARACTER_LIMITS.audience} characters` });
  }

  if (!formData.goal.trim()) {
    errors.push({ field: 'goal', message: 'Campaign goal is required' });
  } else if (formData.goal.length > CHARACTER_LIMITS.goal) {
    errors.push({ field: 'goal', message: `Campaign goal must be less than ${CHARACTER_LIMITS.goal} characters` });
  }

  // Optional fields with character limits
  if (formData.promotion && formData.promotion.length > CHARACTER_LIMITS.promotion) {
    errors.push({ field: 'promotion', message: `Promotion must be less than ${CHARACTER_LIMITS.promotion} characters` });
  }

  if (formData.additionalRules && formData.additionalRules.length > CHARACTER_LIMITS.additionalRules) {
    errors.push({ field: 'additionalRules', message: `Additional rules must be less than ${CHARACTER_LIMITS.additionalRules} characters` });
  }

  // Keywords validation
  if (formData.keywords.length === 0) {
    errors.push({ field: 'keywords', message: 'At least one keyword is required' });
  } else if (formData.keywords.length > 10) {
    errors.push({ field: 'keywords', message: 'Maximum 10 keywords allowed' });
  } else if (formData.keywords.some(k => k.length > 30)) {
    errors.push({ field: 'keywords', message: 'Each keyword must be less than 30 characters' });
  }

  return errors;
};

export const getCharacterLimit = (field: keyof typeof CHARACTER_LIMITS) => CHARACTER_LIMITS[field]; 