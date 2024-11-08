      import { create } from 'zustand';
      import { persist } from 'zustand/middleware';
      export type ToneType = 'professional' | 'casual' | 'excited' | 'urgent' | 'friendly' | 'authoritative';
      export interface LikedHeadline {
        id: string;
        headline: string;
        primaryText: string;
        timestamp: number;
      }
      export interface GeneratedAd {
        id: string;
        headline: string;
        primaryText: string;
        timestamp: number;
      }
      export interface SavedAd extends GeneratedAd {
        campaignName: string;
        campaignDate: string;
        brandName: string;
        product: string;
      }
      export interface FormState {
        campaignName: string;
        campaignDate: string;
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
        savedAds: SavedAd[];
        isSubmitting: boolean;
        isDraft: boolean;
        progress: number;
        errors: string[];
        useLikedHeadlines: boolean;
        likedHeadlines: LikedHeadline[];
      }
      export interface StoreState extends FormState {
        setField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
        resetForm: () => void;
        setGeneratedAd: (ad: GeneratedAd | null) => void;
        addSavedAd: (ad: SavedAd) => void;
        removeSavedAd: (id: string) => void;
        toggleLikedHeadline: (headline: string, primaryText: string) => void;
        loadUserAds: (userId: string) => Promise<void>;
        clearAllSavedAds: () => void;
      }
      export const useStore = create<StoreState>()(
        persist(
          (set) => ({
            // ... initial state ...
            setField: (field, value) => set((state) => ({ ...state, [field]: value })),
            resetForm: () => set((state) => ({ ...state, ...initialState })),
            setGeneratedAd: (ad) => set({ generatedAd: ad }),
            addSavedAd: (ad) => set((state) => ({ savedAds: [ad, ...state.savedAds] })),
            removeSavedAd: (id) => set((state) => ({
              savedAds: state.savedAds.filter((ad) => ad.id !== id)
            })),
            toggleLikedHeadline: (headline, primaryText) => set((state) => {
              const newHeadline: LikedHeadline = {
                id: Date.now().toString(),
                headline,
                primaryText,
                timestamp: Date.now()
              };
              const exists = state.likedHeadlines.some(h => h.headline === headline);
              return {
                likedHeadlines: exists
                  ? state.likedHeadlines.filter(h => h.headline !== headline)
                  : [newHeadline, ...state.likedHeadlines]
              };
            }),
            // ... other actions ...
          }),
          {
            name: 'ad-generator-store',
            partialize: (state) => ({
              savedAds: state.savedAds,
              likedHeadlines: state.likedHeadlines,
            }),
          }
        )
      );
