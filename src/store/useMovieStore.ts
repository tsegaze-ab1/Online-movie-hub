import { create } from 'zustand';
import { tmdbAPI } from '../services/api';
import { mockMovies } from '../utils/mockData';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  media_type?: 'movie' | 'tv';
}

interface MovieState {
  featuredMovie: Movie | null;
  trendingMovies: Movie[];
  popularMovies: Movie[];
  topRatedMovies: Movie[];
  horrorMovies: Movie[];
  actionMovies: Movie[];
  romanceMovies: Movie[];
  loading: boolean;
  error: string | null;
  setFeaturedMovie: (movie: Movie | null) => void;
  setTrendingMovies: (movies: Movie[]) => void;
  setPopularMovies: (movies: Movie[]) => void;
  setTopRatedMovies: (movies: Movie[]) => void;
  setHorrorMovies: (movies: Movie[]) => void;
  setActionMovies: (movies: Movie[]) => void;
  setRomanceMovies: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchHomePageData: () => Promise<void>;
}

// Genre IDs from TMDB
const GENRES = {
  HORROR: 27,
  ACTION: 28,
  ROMANCE: 10749,
};

export const useMovieStore = create<MovieState>((set) => ({
  featuredMovie: null,
  trendingMovies: [],
  popularMovies: [],
  topRatedMovies: [],
  horrorMovies: [],
  actionMovies: [],
  romanceMovies: [],
  loading: false,
  error: null,

  setFeaturedMovie: (movie) => set({ featuredMovie: movie }),
  setTrendingMovies: (movies) => set({ trendingMovies: movies }),
  setPopularMovies: (movies) => set({ popularMovies: movies }),
  setTopRatedMovies: (movies) => set({ topRatedMovies: movies }),
  setHorrorMovies: (movies) => set({ horrorMovies: movies }),
  setActionMovies: (movies) => set({ actionMovies: movies }),
  setRomanceMovies: (movies) => set({ romanceMovies: movies }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchHomePageData: async () => {
    try {
      set({ loading: true, error: null });

      // Always try to fetch from API first (server handles TMDB API key)
      console.log('Fetching movie data from API...');
      
      // Fetch all data in parallel from API
      const [
        trendingData,
        popularData,
        topRatedData,
        horrorData,
        actionData,
        romanceData,
      ] = await Promise.all([
        tmdbAPI.getTrending('movie', 'day'),
        tmdbAPI.getPopular('movie', 1),
        tmdbAPI.getTopRated('movie', 1),
        tmdbAPI.getByGenre('movie', GENRES.HORROR, 1),
        tmdbAPI.getByGenre('movie', GENRES.ACTION, 1),
        tmdbAPI.getByGenre('movie', GENRES.ROMANCE, 1),
      ]);

      // Set featured movie (first trending movie)
      const featured = trendingData.results?.[0] || null;

      console.log('Successfully fetched movie data from API');
      set({
        featuredMovie: featured,
        trendingMovies: trendingData.results || [],
        popularMovies: popularData.results || [],
        topRatedMovies: topRatedData.results || [],
        horrorMovies: horrorData.results || [],
        actionMovies: actionData.results || [],
        romanceMovies: romanceData.results || [],
        loading: false,
      });
    } catch (error: any) {
      // If API fails, fall back to mock data
      console.warn('API Error, using mock data:', error.message);
      console.log('Make sure the server is running on port 5000 with TMDB_API_KEY configured');
      set({
        featuredMovie: mockMovies[0],
        trendingMovies: mockMovies,
        popularMovies: [...mockMovies].reverse(),
        topRatedMovies: mockMovies.slice(0, 6),
        horrorMovies: mockMovies.slice(0, 5),
        actionMovies: mockMovies.slice(1, 6),
        romanceMovies: mockMovies.slice(2, 7),
        loading: false,
      });
    }
  },
}));

