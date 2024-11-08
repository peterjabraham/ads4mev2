# Project File Structure Overview

## Root Structure
- `src/` - Main source directory
  - `app/` - Next.js App Router pages
  - `components/` - React components
  - `stores/` - Zustand state management
  - `services/` - External services integration
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `styles/` - Global styles and themes
- `public/` - Static assets
- `.env.local` - Environment variables

## App Structure
- `src/app/`
  - `layout.tsx` - Root layout with providers
  - `page.tsx` - Main page with AdForm and Preview
  - `saved-ads/page.tsx` - Saved ads management
  - `api/`
    - `generate/route.ts` - OpenAI generation endpoint
    - `ads/route.ts` - Ad management endpoints

## Components
### Core Components
- `src/components/`
  - `AdForm.tsx` - Main form for ad generation
  - `Preview.tsx` - Live preview of generated ads
  - `LikedAdsManager.tsx` - Liked ads management
  - `LoadingAnimation.tsx` - Loading state component

### Form Components
- `src/components/form/`
  - `FormField.tsx` - Base form field component
  - `KeywordsField.tsx` - Keywords input with chip management
  - `TemplateSelector.tsx` - Template selection and management
  - `ToneSelector.tsx` - Tone selection dropdown

## State Management
- `src/stores/`
  - `index.ts` - Main store with form and ad state
  - `historyStore.ts` - Ad generation history
  - `formStore.ts` - Form-specific state management

## Services
- `src/services/`
  - `api.ts` - API utilities and error handling
  - `openai.ts` - OpenAI API integration
  - `validation.ts` - Form validation utilities

## Types
- `src/types/`
  - `index.ts` - Core type definitions
  - `api.ts` - API related types
  - `store.ts` - Store related types

## Styles
- `src/styles/`
  - `globals.css` - Global styles and Tailwind
  - `animations.css` - Custom animations

## Utils
- `src/utils/`
  - `validation.ts` - Form validation helpers
  - `formatting.ts` - Text formatting utilities
  - `date.ts` - Date handling utilities

## Configuration
- `.env.local` - Environment variables
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration