import type { FormState } from '@/stores/index';

export interface Template {
  id: string;
  name: string;
  description: string;
  fields: Partial<FormState>;
  savedAt: number;
}

export const templates: Template[] = [
  {
    id: 'default-template',
    name: 'Default Template',
    description: 'A basic template to get started',
    fields: {
      brandName: '',
      product: '',
      userBenefit: '',
      promotion: '',
      audience: '',
      goal: '',
      keywords: [],
    },
    savedAt: Date.now(),
  },
  // Add more templates as needed
];