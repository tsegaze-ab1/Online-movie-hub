import axios from 'axios';

// Fallback to deployed Render backend (includes /api/tmdb mount)
const RENDER_BACKEND = 'https://render-express-deployment-oeym.onrender.com/api/tmdb';
const API_BASE_URL = import.meta.env.VITE_API_URL ?? RENDER_BACKEND;

// Warn in production if env var wasn't provided (so you can set it in Vercel)
if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_API_URL not set in Vercel. Falling back to Render backend. Set VITE_API_URL in Vercel to override.'
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.code === 'ECONNREFUSED' ||
      error.message?.includes('Network Error')
    ) {
      console.warn('Backend not reachable');
    }
    return Promise.reject(error);
  }
);

// TMDB API service functions
export const tmdbAPI = {
  // Get trending content
  getTrending: async (
    type: 'movie' | 'tv',
    timeWindow: 'day' | 'week' = 'day'
  ) => {
    const response = await api.get(
      `/trending/${type}?time_window=${timeWindow}`
    );
    return response.data;
  },

  // Get popular content
  getPopular: async (
    type: 'movie' | 'tv',
    page: number = 1
  ) => {
    const response = await api.get(
      `/popular/${type}?page=${page}`
    );
    return response.data;
  },

  // Get top rated content
  getTopRated: async (
    type: 'movie' | 'tv',
    page: number = 1
  ) => {
    const response = await api.get(
      `/top-rated/${type}?page=${page}`
    );
    return response.data;
  },

  // Get content by genre
  getByGenre: async (
    type: 'movie' | 'tv',
    genreId: number,
    page: number = 1
  ) => {
    const response = await api.get(
      `/discover/${type}?genre=${genreId}&page=${page}`
    );
    return response.data;
  },

  // Get movie/TV details
  getDetails: async (
    type: 'movie' | 'tv',
    id: number
  ) => {
    const response = await api.get(
      `/${type}/${id}`
    );
    return response.data;
  },

  // Get videos (trailers)
  getVideos: async (
    type: 'movie' | 'tv',
    id: number
  ) => {
    const response = await api.get(
      `/${type}/${id}/videos`
    );
    return response.data;
  },

  // Search
  search: async (
    type: 'movie' | 'tv',
    query: string,
    page: number = 1
  ) => {
    const response = await api.get(
      `/search/${type}?query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.data;
  },

  // Get genres
  getGenres: async (
    type: 'movie' | 'tv'
  ) => {
    const response = await api.get(
      `/genre/${type}/list`
    );
    return response.data;
  },

  // Get recommendations
  getRecommendations: async (
    type: 'movie' | 'tv',
    id: number,
    page: number = 1
  ) => {
    const response = await api.get(
      `/${type}/${id}/recommendations?page=${page}`
    );
    return response.data;
  },
};

export default api;

