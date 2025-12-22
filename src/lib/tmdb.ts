const API_KEY = "d03c74b8163b3d5a1ddabe32b7d654b5";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
  original_language: string;
  popularity: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  air_date: string;
  runtime: number | null;
  vote_average: number;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  overview: string;
  air_date: string;
}

export interface TVShowDetails extends TVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  networks: { id: number; name: string; logo_path: string | null }[];
  created_by: { id: number; name: string; profile_path: string | null }[];
}

export interface SearchResult {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export const getImageUrl = (path: string | null, size: string = "w500"): string => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getTrending = async (): Promise<TVShow[]> => {
  const response = await fetch(
    `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getPopular = async (): Promise<TVShow[]> => {
  const response = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getTopRated = async (): Promise<TVShow[]> => {
  const response = await fetch(
    `${BASE_URL}/tv/top_rated?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getAiringToday = async (): Promise<TVShow[]> => {
  const response = await fetch(
    `${BASE_URL}/tv/airing_today?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getTVShowDetails = async (id: number): Promise<TVShowDetails> => {
  const response = await fetch(
    `${BASE_URL}/tv/${id}?api_key=${API_KEY}`
  );
  return response.json();
};

export const getSeasonEpisodes = async (
  showId: number,
  seasonNumber: number
): Promise<Episode[]> => {
  const response = await fetch(
    `${BASE_URL}/tv/${showId}/season/${seasonNumber}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.episodes || [];
};

export const searchTVShows = async (query: string): Promise<SearchResult> => {
  const response = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  return response.json();
};

export const getSimilarShows = async (id: number): Promise<TVShow[]> => {
  const response = await fetch(
    `${BASE_URL}/tv/${id}/similar?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};
