import {create} from 'zustand';
import {fetchShowInfo, fetchEpisodes, fetchCast} from '../api/showService';
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

  fetchAllData: async () => {
    // Fetch all data in parallel
    await Promise.all([
      get().fetchShowInfo(),
      get().fetchEpisodes(),
      get().fetchCast(),
    ]);
  },

  //   getEpisodeById: (episodeId) => {
  //     return get().episodes.find(episode => episode.id === episodeId);
  //   },
}));

export default useShowStore;
