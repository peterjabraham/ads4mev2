// src/stores/historyStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export type ToneType = 'professional' | 'casual' | 'excited' | 'urgent' | 'friendly' | 'authoritative';
export type SortField = 'timestamp' | 'title' | 'tone';
export type SortOrder = 'asc' | 'desc';

export interface HistoryInput {
  brandName: string;
  product: string;
  userBenefit: string;
  promotion: string;
  audience: string;
  goal: string;
  keywords: string[];
  additionalRules: string;
  tone: ToneType;  // Add this line
  title?: string;  // Add this since it's referenced in filteredAds
  description?: string;  // Add this since it's referenced in filteredAds
  targetAudience?: string;  // Add this since it's used in export functions
}

export interface GeneratedAd {
  id: string;
  timestamp: number;
  originalInput: HistoryInput;
  generatedContent: {
    title: string;
    description: string;
    variations: string[];
  };
}

export interface SelectionSet {
  id: string;
  name: string;
  adIds: string[];
  timestamp: number;
}

interface HistoryState {
  ads: GeneratedAd[];
  searchTerm: string;
  selectedTone: ToneType | 'all';
  dateRange: {
    start: number | null;
    end: number | null;
  };
  sortConfig: {
    field: SortField;
    order: SortOrder;
  };
  addToHistory: (ad: Omit<GeneratedAd, 'id' | 'timestamp'>) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  setSearchTerm: (term: string) => void;
  setSelectedTone: (tone: ToneType | 'all') => void;
  setDateRange: (start: number | null, end: number | null) => void;
  setSortConfig: (field: SortField, order: SortOrder) => void;
  filteredAds: () => GeneratedAd[];
  selectionSets: SelectionSet[];
  addSelectionSet: (name: string, adIds: string[]) => void;
  removeSelectionSet: (id: string) => void;
  loadSelectionSet: (id: string) => string[];
  updateSelectionSet: (id: string, updatedSet: SelectionSet) => void;
  importSelectionSets: (sets: SelectionSet[]) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      ads: [],
      searchTerm: '',
      selectedTone: 'all',
      dateRange: {
        start: null,
        end: null,
      },
      sortConfig: {
        field: 'timestamp',
        order: 'desc',
      },
      selectionSets: [],

      addToHistory: (ad) => set((state) => ({
        ads: [{
          ...ad,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }, ...state.ads].slice(0, 50)
      })),

      removeFromHistory: (id) => set((state) => ({
        ads: state.ads.filter(ad => ad.id !== id)
      })),

      clearHistory: () => set({ ads: [] }),

      setSearchTerm: (term) => set({ searchTerm: term }),

      setSelectedTone: (tone) => set({ selectedTone: tone }),

      setDateRange: (start, end) => set({
        dateRange: { start, end }
      }),

      setSortConfig: (field, order) => set({
        sortConfig: { field, order }
      }),

      filteredAds: () => {
        const state = get();
        const filtered = state.ads.filter(ad => {
          const matchesSearch = state.searchTerm === '' || 
            ad.originalInput.title?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            ad.originalInput.description?.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
            ad.originalInput.keywords.some(k => k.toLowerCase().includes(state.searchTerm.toLowerCase()));

          const matchesTone = state.selectedTone === 'all' || ad.tone === state.selectedTone;

          const withinDateRange = (!state.dateRange.start || ad.timestamp >= state.dateRange.start) &&
                                (!state.dateRange.end || ad.timestamp <= state.dateRange.end);

          return matchesSearch && matchesTone && withinDateRange;
        });

        return filtered.sort((a, b) => {
          const { field, order } = state.sortConfig;
          const multiplier = order === 'asc' ? 1 : -1;

          if (field === 'timestamp') {
            return (a.timestamp - b.timestamp) * multiplier;
          }

          return 0;
        });
      },

      addSelectionSet: (name, adIds) => set((state) => ({
        selectionSets: [...state.selectionSets, {
          id: crypto.randomUUID(),
          name,
          adIds,
          timestamp: Date.now()
        }]
      })),

      removeSelectionSet: (id) => set((state) => ({
        selectionSets: state.selectionSets.filter(set => set.id !== id)
      })),

      loadSelectionSet: (id) => {
        const state = get();
        const selectionSet = state.selectionSets.find(set => set.id === id);
        if (selectionSet) {
          const validIds = selectionSet.adIds.filter(id => 
            state.ads.some(ad => ad.id === id)
          );

          if (validIds.length !== selectionSet.adIds.length) {
            toast.error('Some ads in this set are no longer available');
          }

          return validIds;
        }
        return [];
      },

      updateSelectionSet: (id, updatedSet) => set((state) => ({
        selectionSets: state.selectionSets.map(set => 
          set.id === id ? updatedSet : set
        )
      })),

      importSelectionSets: (sets) => set((state) => ({
        selectionSets: [
          ...state.selectionSets,
          ...sets.map(set => ({
            ...set,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          }))
        ]
      })),
    }),
    {
      name: 'ad-history',
    }
  )
);