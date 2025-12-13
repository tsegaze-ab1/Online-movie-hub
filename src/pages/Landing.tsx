import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMovieStore } from '../store/useMovieStore';
import { useAuthStore } from '../store/useAuthStore';
import Banner from '../components/Banner';
import { BannerSkeleton } from '../components/Skeleton';
import { DemoBanner } from '../components/DemoBanner';

const Landing = () => {
  const navigate = useNavigate();
  const { featuredMovie, loading, fetchHomePageData } = useMovieStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Redirect to home if already logged in
    if (user) {
      navigate('/home');
      return;
    }
    // Fetch featured movie for landing page
    fetchHomePageData();
  }, [user, navigate, fetchHomePageData]);

  return (
    <div className="relative min-h-screen">
      <DemoBanner />
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <span className="text-netflix-red text-3xl font-bold">NETFLIX</span>
        <button
          onClick={() => navigate('/signin')}
          className="bg-netflix-red text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      {loading ? (
        <BannerSkeleton />
      ) : (
        <Banner movie={featuredMovie} />
      )}

      {/* CTA Section */}
      <div className="bg-netflix-black py-16 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Unlimited movies, TV shows, and more
          </h2>
          <p className="text-xl mb-8 text-gray-400">
            Watch anywhere. Cancel anytime.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-netflix-red text-white px-8 py-4 text-lg rounded hover:bg-red-700 transition"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;

