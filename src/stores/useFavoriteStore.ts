import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoriteStore {
  // State
  favorites: number[];
  isLoading: boolean;

  // Actions
  toggleFavorite: (episodeId: number) => void;
  isFavorite: (episodeId: number) => boolean;
  getFavorites: () => number[];
  clearAllFavorites: () => void;
}

const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      // State
      favorites: [],
      isLoading: false,

      // Actions
      toggleFavorite: episodeId => {
        set(state => {
          const isFavorite = state.favorites.includes(episodeId);
          const updatedFavorites = isFavorite
            ? state.favorites.filter(id => id !== episodeId)
            : [...state.favorites, episodeId];

          return {favorites: updatedFavorites};
        });
      },

      isFavorite: episodeId => {
        return get().favorites.includes(episodeId);
      },

      getFavorites: () => {
        return get().favorites;
      },

      clearAllFavorites: () => {
        set({favorites: []});
      },
    }),
    {
      name: 'ted-lasso-favorites',
      storage: {
        getItem: async name => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async name => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);

export default useFavoriteStore;
