import {create} from 'zustand';
import {
  fetchShowInfo,
  fetchEpisodes,
  fetchCast,
  fetchEpisodeById,
} from '../api/showService';
import {ShowStore} from './types';

const useShowStore = create<ShowStore>((set, get) => ({
  // State
  showInfo: null,
  episodes: [],
  cast: [],
  isLoading: {
    showInfo: false,
    episodes: false,
    cast: false,
  },
  error: null,

  // Actions
  fetchShowInfo: async () => {
    try {
      set(state => ({
        isLoading: {...state.isLoading, showInfo: true},
        error: null,
      }));
      const data = await fetchShowInfo();
      set({
        showInfo: data,
        isLoading: {...get().isLoading, showInfo: false},
      });
    } catch (error) {
      set({
        error: 'Failed to fetch show information',
        isLoading: {...get().isLoading, showInfo: false},
      });
    }
  },

  fetchEpisodes: async () => {
    try {
      set(state => ({
        isLoading: {...state.isLoading, episodes: true},
        error: null,
      }));
      const data = await fetchEpisodes();
      set({
        episodes: data,
        isLoading: {...get().isLoading, episodes: false},
      });
    } catch (error) {
      set({
        error: 'Failed to fetch episodes',
        isLoading: {...get().isLoading, episodes: false},
      });
    }
  },

  fetchCast: async () => {
    try {
      set(state => ({
        isLoading: {...state.isLoading, cast: true},
        error: null,
      }));
      const data = await fetchCast();
      set({
        cast: data,
        isLoading: {...get().isLoading, cast: false},
      });
    } catch (error) {
      set({
        error: 'Failed to fetch cast information',
        isLoading: {...get().isLoading, cast: false},
      });
    }
  },

  getEpisodeById: async (episodeId: number) => {
    const existingEpisode = get().episodes.find(
      episode => episode.id === episodeId,
    );

    if (existingEpisode) {
      return existingEpisode;
    }

    try {
      set(state => ({
        isLoading: {...state.isLoading, episodes: true},
        error: null,
      }));

      const episode = await fetchEpisodeById(episodeId);

      set(state => ({
        isLoading: {...state.isLoading, episodes: false},
      }));

      return episode;
    } catch (error) {
      set(state => ({
        error: `Failed to fetch episode with ID ${episodeId}`,
        isLoading: {...state.isLoading, episodes: false},
      }));
      return null;
    }
  },

  fetchAllData: async () => {
    await Promise.all([
      get().fetchShowInfo(),
      get().fetchEpisodes(),
      get().fetchCast(),
    ]);
  },
}));

export default useShowStore;
