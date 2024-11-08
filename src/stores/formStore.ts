import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormState, SavedAd } from './index';
import { getUserAds, deleteAdFromFirebase } from '@/services/firebase';
import { toast } from 'react-hot-toast';

export const initialFormState: FormState = {
  campaignName: '',
  campaignDate: '',
  brandName: '',
  product: '',
  userBenefit: '',
  promotion: '',
  audience: '',
  goal: '',
  keywords: [],
  additionalRules: '',
  tone: 'professional',
  generatedAd: null,
  savedAds: [],
  isSubmitting: false,
  isDraft: false,
  progress: 0,
  errors: [],
  useLikedHeadlines: false,
  likedHeadlines: []
};

interface FormStore extends FormState {
  loadUserAds: (userId: string) => Promise<void>;
  removeSavedAd: (adId: string, userId: string) => Promise<void>;
  addSavedAd: (ad: SavedAd) => void;
  clearAllSavedAds: () => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      ...initialFormState,

      // User Ads Management
      loadUserAds: async (userId: string) => {
        try {
          const ads = await getUserAds(userId);
          set({ savedAds: ads });
        } catch (error) {
          console.error('Error loading user ads:', error);
          toast.error('Failed to load saved ads');
        }
      },

      removeSavedAd: async (adId: string, userId: string) => {
        try {
          await deleteAdFromFirebase(userId, adId);
          set((state) => ({
            savedAds: state.savedAds.filter((ad) => ad.id !== adId)
          }));
          toast.success('Ad removed successfully');
        } catch (error) {
          console.error('Error removing saved ad:', error);
          toast.error('Failed to remove ad');
          throw error;
        }
      },

      addSavedAd: (ad: SavedAd) => {
        set((state) => ({
          savedAds: [...state.savedAds, ad]
        }));
        toast.success('Ad saved successfully');
      },

      clearAllSavedAds: () => {
        set({ savedAds: [] });
        toast.success('All saved ads cleared');
      },
    }),
    {
      name: 'form-store',
      partialize: (state) => ({
        savedAds: state.savedAds,
      }),
    }
  )
);