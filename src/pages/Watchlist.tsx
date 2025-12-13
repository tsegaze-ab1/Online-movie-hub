import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiX } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import { useProfileStore } from '../store/useProfileStore';
import { tmdbAPI } from '../services/api';
import { getImageUrl } from '../utils/constants';
import { Movie } from '../store/useMovieStore';
import Skeleton from '../components/Skeleton';

const Watchlist = () => {
  const { currentProfile, removeFromWatchlist } = useProfileStore();
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!currentProfile) return;

      setLoading(true);
      try {
        // Fetch watchlist movies
        const moviePromises = currentProfile.watchlist.map((id) =>
          tmdbAPI.getDetails('movie', id).catch(() => null)
        );
        const movies = await Promise.all(moviePromises);
        setWatchlistMovies(movies.filter(Boolean) as Movie[]);

        // Fetch continue watching
        const continuePromises = currentProfile.continueWatching.map(async (item) => {
          try {
            const details = await tmdbAPI.getDetails(item.type, item.id);
            return { ...details, progress: item.progress, duration: item.duration };
          } catch {
            return null;
          }
        });
        const continueData = await Promise.all(continuePromises);
        setContinueWatching(continueData.filter(Boolean));
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [currentProfile]);

  const handleRemove = async (movieId: number) => {
    try {
      await removeFromWatchlist(movieId);
      setWatchlistMovies((prev) => prev.filter((m) => m.id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handlePlay = (movie: Movie, type: 'movie' | 'tv' = 'movie') => {
    navigate(`/player/${type}/${movie.id}`);
  };

  const getProgressPercentage = (progress: number, duration: number) => {
    return duration > 0 ? (progress / duration) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-16 pb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">My List</h1>

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Continue Watching</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {continueWatching.map((item) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group cursor-pointer"
                  onClick={() => handlePlay(item, item.type)}
                >
                  <div className="relative aspect-[2/3] rounded overflow-hidden">
                    <img
                      src={getImageUrl(item.poster_path, 'poster', 'medium')}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                      <div
                        className="h-full bg-netflix-red"
                        style={{
                          width: `${getProgressPercentage(item.progress, item.duration)}%`,
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition flex items-center justify-center">
                      <FiPlay
                        size={40}
                        className="text-white opacity-0 group-hover:opacity-100 transition"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm line-clamp-1">{item.title || item.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Watchlist */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : watchlistMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {watchlistMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div
                  className="relative aspect-[2/3] rounded overflow-hidden cursor-pointer"
                  onClick={() => handlePlay(movie)}
                >
                  <img
                    src={getImageUrl(movie.poster_path, 'poster', 'medium')}
                    alt={movie.title || movie.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition flex items-center justify-center">
                    <FiPlay
                      size={40}
                      className="text-white opacity-0 group-hover:opacity-100 transition"
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(movie.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-black/90"
                >
                  <FiX size={16} className="text-white" />
                </button>
                <p className="mt-2 text-sm line-clamp-1">{movie.title || movie.name}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">Your watchlist is empty</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-4 px-6 py-2 bg-netflix-red text-white rounded hover:bg-red-700 transition"
            >
              Browse Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;

