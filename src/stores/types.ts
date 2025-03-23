import {CastMemberResponse, EpisodeResponse, ShowResponse} from '../api/types';

export interface ShowStoreState {
  showInfo: ShowResponse | null;
  episodes: EpisodeResponse[];
  cast: CastMemberResponse[];
  isLoading: {
    showInfo: boolean;
    episodes: boolean;
    cast: boolean;
  };
  error: string | null;
}

export interface ShowStoreActions {
  fetchShowInfo: () => Promise<void>;
  fetchEpisodes: () => Promise<void>;
  fetchCast: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  //   getEpisodeById: (episodeId: number) => EpisodeResponse | undefined;
}

export type ShowStore = ShowStoreState & ShowStoreActions;

export interface FavoriteStoreState {
  favorites: number[];
  isLoading: boolean;
}

export interface FavoriteStoreActions {
  toggleFavorite: (episodeId: number) => void;
  isFavorite: (episodeId: number) => boolean;
  getFavorites: () => number[];
  clearAllFavorites: () => void;
}
