import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore, Profile } from '../store/useProfileStore';
import { PROFILE_AVATARS } from '../utils/constants';

const ProfileSelection = () => {
  const { user } = useAuthStore();
  const { profiles, currentProfile, fetchProfiles, createProfile, setCurrentProfile } = useProfileStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PROFILE_AVATARS[0]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchProfiles(user.uid).catch(() => {
        // In demo mode, profiles will be empty, which is fine
        console.log('Demo mode: profiles will be stored in memory only');
      });
    }
  }, [user, fetchProfiles]);

  useEffect(() => {
    // Only auto-redirect if we have profiles and we're on the profile selection page
    // Don't auto-redirect if user just logged in and has no profiles yet
    if (profiles.length > 0 && !currentProfile && user) {
      const userProfile = profiles.find(p => p.userId === user.uid);
      if (userProfile) {
        setCurrentProfile(userProfile);
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 300);
      }
    } else if (profiles.length > 0 && currentProfile && currentProfile.userId === user?.uid) {
      // If profile is already selected, redirect to home
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 300);
    }
  }, [profiles, currentProfile, user, setCurrentProfile, navigate]);

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return;
    try {
      await createProfile(newProfileName.trim(), selectedAvatar);
      setShowCreateModal(false);
      setNewProfileName('');
      // Wait for state to update, then navigate
      setTimeout(() => {
        // Check if profile was created and set
        const { currentProfile } = useProfileStore.getState();
        if (currentProfile) {
          navigate('/home', { replace: true });
        } else {
          // If still not set, wait a bit more and try again
          setTimeout(() => {
            const { currentProfile: retryProfile } = useProfileStore.getState();
            if (retryProfile) {
              navigate('/home', { replace: true });
            }
          }, 200);
        }
      }, 400);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleSelectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    setTimeout(() => {
      navigate('/home', { replace: true });
    }, 200);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-12">Who's watching?</h1>

        {/* Profiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 mb-8">
          {profiles.map((profile) => (
            <motion.button
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded bg-gray-800 flex items-center justify-center text-4xl md:text-5xl hover:border-2 hover:border-white transition">
                {profile.avatar}
              </div>
              <p className="text-gray-400 text-lg">{profile.name}</p>
            </motion.button>
          ))}

          {/* Add Profile Button */}
          {profiles.length < 5 && (
            <motion.button
              onClick={() => setShowCreateModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
                <FiPlus size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">Add Profile</p>
            </motion.button>
          )}
        </div>

        {/* Manage Profiles Button */}
        <button className="px-8 py-3 border border-gray-600 text-gray-400 hover:border-white hover:text-white transition">
          Manage Profiles
        </button>

        {/* Create Profile Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-netflix-black rounded-lg p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-6">Add Profile</h2>

              {/* Avatar Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Choose Avatar</label>
                <div className="grid grid-cols-5 gap-2">
                  {PROFILE_AVATARS.slice(0, 10).map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`w-12 h-12 rounded flex items-center justify-center text-2xl ${
                        selectedAvatar === avatar
                          ? 'border-2 border-white'
                          : 'border border-gray-600'
                      }`}
                    >
                      {avatar}
                      {selectedAvatar === avatar && (
                        <FiCheck className="absolute text-white" size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter profile name"
                  maxLength={20}
                  className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProfileName('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 text-white rounded hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProfile}
                  disabled={!newProfileName.trim()}
                  className="flex-1 px-4 py-2 bg-netflix-red text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileSelection;

