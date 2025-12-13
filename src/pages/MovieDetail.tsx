import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiPlay, FiPlus, FiCheck, FiArrowLeft, FiStar } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import MovieRow from '../components/MovieRow';
import { tmdbAPI } from '../services/api';
import { useProfileStore } from '../store/useProfileStore';
import { getImageUrl, formatDate } from '../utils/constants';
import { Movie } from '../store/useMovieStore';

const MovieDetail = () => {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentProfile, addToWatchlist, removeFromWatchlist } = useProfileStore();

  const isInWatchlist = currentProfile?.watchlist.includes(Number(id)) || false;

  useEffect(() => {
    const fetchData = async () => {
      if (!type || !id) return;
      try {
        setLoading(true);
        
        // Check if we're in demo mode
        const { isDemoMode, mockMovies } = await import('../utils/mockData');
        if (isDemoMode()) {
          // Use mock data in demo mode
          const mockMovie = mockMovies.find(m => m.id === Number(id)) || mockMovies[0];
          setMovie({
            ...mockMovie,
            title: mockMovie.title || mockMovie.name,
            overview: mockMovie.overview,
            backdrop_path: mockMovie.backdrop_path,
            poster_path: mockMovie.poster_path,
            vote_average: mockMovie.vote_average,
            release_date: mockMovie.release_date || mockMovie.first_air_date,
            runtime: 120,
            genres: [{ id: 1, name: 'Action' }],
            credits: { cast: [] },
            production_companies: [],
          });
          setRecommendations(mockMovies.slice(0, 6));
          setLoading(false);
          return;
        }
        
        const [movieData, recommendationsData] = await Promise.all([
          tmdbAPI.getDetails(type, Number(id)),
          tmdbAPI.getRecommendations(type, Number(id)),
        ]);
        setMovie(movieData);
        setRecommendations(recommendationsData.results || []);
      } catch (error) {
        // Silently handle connection errors in demo mode
        if (error instanceof Error && error.message.includes('ERR_CONNECTION_REFUSED')) {
          // Use mock data as fallback
          const { mockMovies } = await import('../utils/mockData');
          const mockMovie = mockMovies.find(m => m.id === Number(id)) || mockMovies[0];
          setMovie({
            ...mockMovie,
            title: mockMovie.title || mockMovie.name,
            overview: mockMovie.overview,
            backdrop_path: mockMovie.backdrop_path,
            poster_path: mockMovie.poster_path,
            vote_average: mockMovie.vote_average,
            release_date: mockMovie.release_date || mockMovie.first_air_date,
            runtime: 120,
            genres: [{ id: 1, name: 'Action' }],
            credits: { cast: [] },
            production_companies: [],
          });
          setRecommendations(mockMovies.slice(0, 6));
        } else {
          console.error('Error fetching movie details:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  const handleWatchlistToggle = async () => {
    if (!currentProfile) return;
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(Number(id));
      } else {
        await addToWatchlist(Number(id));
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-white text-xl">Movie not found</p>
        </div>
      </div>
    );
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  // Get multiple images for carousel (backdrop + poster variations)
  const imageUrls = [
    getImageUrl(movie.backdrop_path, 'backdrop', 'original'),
    getImageUrl(movie.poster_path, 'poster', 'xlarge'),
    getImageUrl(movie.backdrop_path, 'backdrop', 'large'),
  ].filter(Boolean);

  // Auto-scroll images
  useEffect(() => {
    if (imageUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [imageUrls.length]);

  // Get genre-based color theme
  const getGenreColor = () => {
    const primaryGenre = movie.genres?.[0]?.name?.toLowerCase() || '';
    const colorMap: Record<string, string> = {
      action: 'from-red-600 via-orange-600 to-yellow-600',
      thriller: 'from-purple-600 via-pink-600 to-red-600',
      horror: 'from-gray-900 via-red-900 to-black',
      comedy: 'from-yellow-500 via-orange-500 to-pink-500',
      drama: 'from-blue-600 via-purple-600 to-pink-600',
      romance: 'from-pink-500 via-rose-500 to-red-500',
      'sci-fi': 'from-cyan-500 via-blue-500 to-purple-500',
      'science fiction': 'from-cyan-500 via-blue-500 to-purple-500',
      fantasy: 'from-indigo-600 via-purple-600 to-pink-600',
    };
    return colorMap[primaryGenre] || 'from-netflix-red via-red-600 to-orange-600';
  };

  return (
    <div className="min-h-screen bg-netflix-black overflow-hidden">
      <Navbar />

      {/* Modern Hero Section with Scrolling Images */}
      <div ref={containerRef} className="relative h-[90vh] md:h-[95vh] overflow-hidden">
        {/* Scrolling Image Carousel */}
        <div className="absolute inset-0">
          {imageUrls.map((url, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${url})`,
                scale,
                y,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentImageIndex === index ? 1 : 0,
                scale: currentImageIndex === index ? [1, 1.05, 1] : 1,
              }}
              transition={{
                opacity: { duration: 1.5, ease: 'easeInOut' },
                scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          ))}
        </div>

        {/* Dynamic Color Gradient Overlay Based on Genre */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${getGenreColor()} opacity-60`}
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Dark Overlay for Text Readability */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40"
          style={{ opacity }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent"
          style={{ opacity }}
        />

        {/* Animated Color Accent Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getGenreColor()}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.div
            className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${getGenreColor()}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </div>

        {/* Enhanced Particle Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                background: `rgba(255, 255, 255, ${Math.random() * 0.3})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, -200],
                x: [0, Math.random() * 100 - 50],
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        {/* Image Indicator Dots */}
        {imageUrls.length > 1 && (
          <div className="absolute top-24 right-8 z-20 flex flex-col gap-2">
            {imageUrls.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-8 rounded-full transition-all ${
                  currentImageIndex === index
                    ? 'bg-white shadow-lg shadow-white/50'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}

        {/* Back Button with Animation */}
        <motion.button
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-20 left-8 z-20 flex items-center space-x-2 text-white hover:text-gray-300 transition-all duration-300 group"
        >
          <motion.div
            whileHover={{ x: -5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <FiArrowLeft size={24} className="group-hover:scale-110 transition-transform" />
          </motion.div>
          <span className="font-medium">Back</span>
        </motion.button>

        {/* Modern Hero Content with Glassmorphism */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16 z-10"
          style={{ opacity }}
        >
          <div className="max-w-5xl">
            {/* Glassmorphism Container */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="backdrop-blur-xl bg-black/30 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
              }}
            >
              {/* Title with Gradient Text Effect */}
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
              >
                <span
                  className={`bg-gradient-to-r ${getGenreColor()} bg-clip-text text-transparent`}
                  style={{
                    textShadow: '0 0 40px rgba(255,255,255,0.3)',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))',
                  }}
                >
                  {movie.title || movie.name}
                </span>
              </motion.h1>

              {/* Modern Info Badges with Color Accents */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap items-center gap-3 mb-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className={`flex items-center space-x-2 bg-gradient-to-r ${getGenreColor()} px-5 py-2.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20`}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiStar className="text-white" size={20} fill="white" />
                  </motion.div>
                  <span className="text-white font-bold text-base md:text-lg">
                    {Math.round(movie.vote_average * 10)}% Match
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                >
                  <span className="text-white font-semibold text-sm md:text-base">
                    {formatDate(movie.release_date || movie.first_air_date)}
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                >
                  <span className="text-white font-semibold text-sm md:text-base">
                    {movie.runtime || movie.episode_run_time?.[0] || 0} min
                  </span>
                </motion.div>

                {movie.genres?.slice(0, 3).map((genre: any, idx: number) => (
                  <motion.span
                    key={genre.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + idx * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    className={`px-4 py-2 bg-gradient-to-r ${getGenreColor()} bg-opacity-30 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30 text-white shadow-md`}
                  >
                    {genre.name}
                  </motion.span>
                ))}
              </motion.div>

              {/* Description with Modern Typography */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base md:text-lg lg:text-xl text-gray-100 mb-8 max-w-3xl leading-relaxed font-light"
                style={{
                  textShadow: '0 2px 20px rgba(0,0,0,0.9)',
                  lineHeight: '1.8',
                }}
              >
                {movie.overview}
              </motion.p>

              {/* Premium Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                {/* Play Button with Gradient */}
                <motion.button
                  onClick={() => navigate(`/player/${type}/${id}`)}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex items-center space-x-3 bg-gradient-to-r ${getGenreColor()} text-white px-10 py-4 rounded-xl font-bold text-lg md:text-xl overflow-hidden shadow-2xl border-2 border-white/20`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiPlay size={28} className="relative z-10" fill="white" />
                  </motion.div>
                  <span className="relative z-10">Play</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.button>

                {/* My List Button with Glassmorphism */}
                <motion.button
                  onClick={handleWatchlistToggle}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group relative flex items-center space-x-3 px-10 py-4 rounded-xl font-bold text-lg md:text-xl backdrop-blur-xl border-2 transition-all duration-300 shadow-xl ${
                    isInWatchlist
                      ? `bg-gradient-to-r ${getGenreColor()} bg-opacity-40 text-white border-white/40`
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <motion.div
                    animate={{
                      rotate: isInWatchlist ? [0, 360] : 0,
                      scale: isInWatchlist ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {isInWatchlist ? (
                      <FiCheck size={28} className="text-green-300" />
                    ) : (
                      <FiPlus size={28} />
                    )}
                  </motion.div>
                  <span>{isInWatchlist ? 'In My List' : 'My List'}</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-transparent pointer-events-none" />
      </div>

      {/* Movie Info Section with Smooth Scroll Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="px-8 md:px-16 py-12 bg-netflix-black"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">Genres</h3>
            <div className="flex flex-wrap gap-3">
              {movie.genres?.map((genre: any, idx: number) => (
                <motion.span
                  key={genre.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-sm border border-gray-700/50 cursor-default transition-colors"
                >
                  {genre.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">Cast</h3>
            <p className="text-gray-300 leading-relaxed">
              {movie.credits?.cast?.slice(0, 5).map((actor: any, idx: number) => (
                <motion.span
                  key={actor.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="inline-block mr-2 mb-2"
                >
                  <span className="hover:text-white transition-colors cursor-default">
                    {actor.name}
                  </span>
                  {idx < Math.min(4, (movie.credits?.cast?.length || 0) - 1) && ','}
                </motion.span>
              ))}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 text-white">Details</h3>
            <div className="space-y-2 text-gray-300">
              <p className="hover:text-white transition-colors">
                <span className="text-gray-500">Studio: </span>
                {movie.production_companies?.[0]?.name || 'N/A'}
              </p>
              <p className="hover:text-white transition-colors">
                <span className="text-gray-500">Rating: </span>
                {movie.vote_average?.toFixed(1)}/10
              </p>
              <p className="hover:text-white transition-colors">
                <span className="text-gray-500">Runtime: </span>
                {movie.runtime || movie.episode_run_time?.[0] || 0} minutes
              </p>
            </div>
          </motion.div>
        </div>

        {/* Recommendations with Fade In */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-6 text-white"
            >
              More Like This
            </motion.h2>
            <MovieRow title="" movies={recommendations} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MovieDetail;

