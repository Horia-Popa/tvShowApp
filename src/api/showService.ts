import {fetchWithErrorHandling} from './index';
import {CastMemberResponse, EpisodeResponse, ShowResponse} from './types';

const BASE_URL = 'https://api.tvmaze.com';
const SHOW_ID = 44458;

export const fetchShowInfo = (): Promise<ShowResponse> => {
  return fetchWithErrorHandling(`${BASE_URL}/shows/${SHOW_ID}`);
};

export const fetchEpisodes = (): Promise<EpisodeResponse[]> => {
  return fetchWithErrorHandling(`${BASE_URL}/shows/${SHOW_ID}/episodes`);
};

export const fetchCast = (): Promise<CastMemberResponse[]> => {
  return fetchWithErrorHandling(`${BASE_URL}/shows/${SHOW_ID}/cast`);
};

export const fetchEpisodeById = (
  episodeId: number,
): Promise<EpisodeResponse> => {
  return fetchWithErrorHandling(`${BASE_URL}/episodes/${episodeId}`);
};
