import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EpisodeResponse} from '../api/types';

interface FavoriteEpisode {
  id: number;
  name: string;
  season: number;
  number: number;
  imageUrl?: string;
  dateAdded: number;
}

interface FavoriteStore {
  // State
  favorites: FavoriteEpisode[];
  isLoading: boolean;

  // Actions
  toggleFavorite: (episode: EpisodeResponse) => void;
  isFavorite: (episodeId: number) => boolean;
  getFavorites: () => FavoriteEpisode[];
  getFavoriteIds: () => number[];
  getRecentFavorites: (limit?: number) => FavoriteEpisode[];
  clearAllFavorites: () => void;
  removeFavorite: (episodeId: number) => void;
}

const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      // State
      favorites: [],
      isLoading: false,

      // Actions
      toggleFavorite: episode => {
        set(state => {
          const isFavorite = state.favorites.some(fav => fav.id === episode.id);

          if (isFavorite) {
            // Remove from favorites
            return {
              favorites: state.favorites.filter(fav => fav.id !== episode.id),
            };
          } else {
            // Add to favorites with additional metadata
            const newFavorite: FavoriteEpisode = {
              id: episode.id,
              name: episode.name,
              season: episode.season,
              number: episode.number,
              imageUrl: episode.image?.medium || undefined,
              dateAdded: Date.now(),
            };

            return {
              favorites: [...state.favorites, newFavorite],
            };
          }
        });
      },

      isFavorite: episodeId => {
        return get().favorites.some(fav => fav.id === episodeId);
      },

      getFavorites: () => {
        return get().favorites;
      },

      getFavoriteIds: () => {
        return get().favorites.map(fav => fav.id);
      },

      getRecentFavorites: (limit = 5) => {
        return [...get().favorites]
          .sort((a, b) => b.dateAdded - a.dateAdded)
          .slice(0, limit);
      },

      clearAllFavorites: () => {
        set({favorites: []});
      },

      removeFavorite: episodeId => {
        set(state => ({
          favorites: state.favorites.filter(fav => fav.id !== episodeId),
        }));
      },
    }),
    {
      name: 'ted-lasso-favorites',
      storage: {
        getItem: async name => {
          try {
            const value = await AsyncStorage.getItem(name);
            return value ? JSON.parse(value) : null;
          } catch (error) {
            console.error('Error loading favorites from storage:', error);
            return null;
          }
        },
        setItem: async (name, value) => {
          try {
            await AsyncStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Error saving favorites to storage:', error);
          }
        },
        removeItem: async name => {
          try {
            await AsyncStorage.removeItem(name);
          } catch (error) {
            console.error('Error removing favorites from storage:', error);
          }
        },
      },
    },
  ),
);

export default useFavoriteStore;
