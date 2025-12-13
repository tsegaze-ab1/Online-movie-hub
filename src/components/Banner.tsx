import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiInfo } from 'react-icons/fi';
import { Movie } from '../store/useMovieStore';
import { getImageUrl, truncateText } from '../utils/constants';

interface BannerProps {
  movie: Movie | null;
}

const Banner = ({ movie }: BannerProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie) return;
      
      // Check if we're in demo mode
      const { isDemoMode } = await import('../utils/mockData');
      if (isDemoMode()) {
        // In demo mode, don't try to fetch trailers
        return;
      }
      
      try {
        // In production mode, could fetch trailer here
        // const type = movie.media_type || (movie.title ? 'movie' : 'tv');
        // const videos = await tmdbAPI.getVideos(type, movie.id);
        // Trailer could be used for autoplay in the future
      } catch (error) {
        // Silently fail in demo mode or if server is not running
        // Only log if not a connection error
        if (error instanceof Error && !error.message.includes('ERR_CONNECTION_REFUSED')) {
          console.error('Error fetching trailer:', error);
        }
      }
    };
    fetchTrailer();
  }, [movie]);

  if (!movie) return null;

  const handlePlay = () => {
    const type = movie.media_type || (movie.title ? 'movie' : 'tv');
    navigate(`/player/${type}/${movie.id}`);
  };

  const handleMoreInfo = () => {
    const type = movie.media_type || (movie.title ? 'movie' : 'tv');
    navigate(`/movie/${type}/${movie.id}`);
  };

  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[600px] w-full overflow-hidden">
      {/* Animated Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'backdrop', 'original')})`,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Animated Gradient Overlays */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"
          animate={{
            background: [
              'linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0.7), transparent)',
              'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.65), transparent)',
              'linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0.7), transparent)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.8, 0.9, 0.8] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Content with Enhanced Animations */}
      <div className="absolute bottom-[35%] left-4 md:left-16 max-w-[500px] z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight"
          style={{
            textShadow: '0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.6)',
          }}
        >
          {movie.title || movie.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-base lg:text-lg text-gray-200 mb-6 line-clamp-3 leading-relaxed"
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {truncateText(movie.overview, 150)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <motion.button
            onClick={handlePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center space-x-3 bg-white text-black px-6 py-3 rounded-lg font-bold text-base md:text-lg overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
            <FiPlay size={22} className="relative z-10 group-hover:scale-110 transition-transform" />
            <span className="relative z-10">Play</span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
          
          <motion.button
            onClick={handleMoreInfo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center space-x-3 bg-gray-600/70 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold text-base md:text-lg border border-gray-500/50 hover:bg-gray-600/90 transition-all"
          >
            <FiInfo size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>More Info</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Fade Bottom with Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default Banner;

