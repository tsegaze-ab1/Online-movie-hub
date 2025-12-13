import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { FiMail, FiLock } from 'react-icons/fi';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // Small delay to ensure React has processed the state update
      setTimeout(() => {
        navigate('/profiles');
      }, 100);
    } catch (err) {
      // Error is handled by store
      console.error('Sign in error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Small delay to ensure React has processed the state update
      setTimeout(() => {
        navigate('/profiles');
      }, 100);
    } catch (err) {
      // Error is handled by store
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="block mb-8">
          <span className="text-netflix-red text-4xl font-bold">NETFLIX</span>
        </Link>

        {/* Form */}
        <div className="bg-black/80 p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-6">Sign In</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded px-10 py-3 text-white focus:outline-none focus:border-white"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded px-10 py-3 text-white focus:outline-none focus:border-white"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-netflix-red text-white py-3 rounded font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Google Sign In */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/80 text-gray-400">OR</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mt-4 bg-white text-black py-3 rounded font-semibold hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-gray-400">
            New to Netflix?{' '}
            <Link to="/signup" className="text-white hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;

