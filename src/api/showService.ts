import {fetchWithErrorHandling} from './index';
import { CastMemberResponse, EpisodeResponse, ShowResponse } from './types';

const BASE_URL = 'https://api.tvmaze.com';
const SHOW_ID = 44458; // Ted Lasso show ID

export const fetchShowInfo = (): Promise<ShowResponse> => {
  return fetchWithErrorHandling(`${BASE_URL}/shows/${SHOW_ID}`);
};

export const fetchEpisodes = (): Promise<EpisodeResponse[]> => {
  return fetchWithErrorHandling(`${BASE_URL}/shows/${SHOW_ID}/episodes`);
};

export const fetchCast = (): Promise<CastMemberResponse[]> => {
  return fetchWithErrorHandling(`${BASE_URL}/shows/${SHOW_ID}/cast`);
};

// Optional: Get specific episode detail (if needed beyond what's in episodes list)
export const fetchEpisodeDetail = (episodeId: string): Promise<EpisodeResponse> => {
  return fetchWithErrorHandling(`${BASE_URL}/episodes/${episodeId}`);
};
