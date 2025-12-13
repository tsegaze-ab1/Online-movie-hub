import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { tmdbAPI } from '../services/api';
import { getImageUrl } from '../utils/constants';
import { Movie } from '../store/useMovieStore';
import Skeleton from '../components/Skeleton';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchMovies = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const [movieResults, tvResults] = await Promise.all([
        tmdbAPI.search('movie', searchQuery),
        tmdbAPI.search('tv', searchQuery),
      ]);
      const combined = [
        ...(movieResults.results || []).map((m: Movie) => ({ ...m, media_type: 'movie' as const })),
        ...(tvResults.results || []).map((m: Movie) => ({ ...m, media_type: 'tv' as const })),
      ];
      setResults(combined);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMovies(query);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, searchMovies]);

  const handleMovieClick = (movie: Movie) => {
    const type = movie.media_type || (movie.title ? 'movie' : 'tv');
    navigate(`/movie/${type}/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-8 pb-16">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, TV shows..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-12 py-4 text-white text-lg focus:outline-none focus:border-white"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {results.map((movie) => (
              <motion.div
                key={`${movie.media_type}-${movie.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleMovieClick(movie)}
                className="cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded overflow-hidden">
                  <img
                    src={getImageUrl(movie.poster_path, 'poster', 'medium')}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition flex items-center justify-center">
                    <p className="text-white font-semibold text-center px-2 opacity-0 hover:opacity-100 transition">
                      {movie.title || movie.name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : query ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">Start typing to search...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

