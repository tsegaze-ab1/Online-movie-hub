import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Movie } from '../store/useMovieStore';
import { getImageUrl } from '../utils/constants';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLargeRow?: boolean;
}

const MovieRow = ({ title, movies, isLargeRow = false }: MovieRowProps) => {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMovieClick = (movie: Movie) => {
    const type = movie.media_type || (movie.title ? 'movie' : 'tv');
    navigate(`/movie/${type}/${movie.id}`);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 px-4 md:px-8">
        {title}
      </h2>
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <FiChevronLeft size={30} className="text-white" />
        </button>

        {/* Movie Row */}
        <div
          ref={rowRef}
          className="flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-8 scroll-smooth"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              className={`flex-shrink-0 cursor-pointer transition-transform duration-300 ${
                isLargeRow ? 'h-64 md:h-80' : 'h-32 md:h-48'
              }`}
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
              onClick={() => handleMovieClick(movie)}
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative w-full h-full">
                <img
                  src={getImageUrl(
                    movie.poster_path,
                    'poster',
                    isLargeRow ? 'large' : 'medium'
                  )}
                  alt={movie.title || movie.name}
                  className="w-full h-full object-cover rounded"
                />
                {hoveredMovie === movie.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/80 rounded flex items-center justify-center"
                  >
                    <div className="text-center p-4">
                      <p className="text-white font-semibold mb-2">
                        {movie.title || movie.name}
                      </p>
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {movie.overview}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
        >
          <FiChevronRight size={30} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;

