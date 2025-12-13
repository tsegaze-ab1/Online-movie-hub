import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
          <span className="text-netflix-red text-2xl md:text-3xl font-bold">
            NETFLIX
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="text-white hover:text-gray-300 transition">
            Home
          </Link>
          <Link to="/watchlist" className="text-white hover:text-gray-300 transition">
            My List
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <Link
            to="/search"
            className="text-white hover:text-gray-300 transition"
          >
            <FiSearch size={24} />
          </Link>

          {/* Notifications */}
          <button className="text-white hover:text-gray-300 transition">
            <FiBell size={24} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition"
            >
              <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center">
                {currentProfile?.avatar || '👤'}
              </div>
              <FiChevronDown size={20} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-netflix-black border border-gray-800 rounded shadow-lg">
                <div className="p-4 border-b border-gray-800">
                  <p className="text-white font-semibold">{currentProfile?.name || 'Profile'}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/profiles"
                    className="block px-4 py-2 text-white hover:bg-gray-800 rounded transition"
                    onClick={() => setShowDropdown(false)}
                  >
                    Manage Profiles
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800 rounded transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

