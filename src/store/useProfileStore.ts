import { create } from 'zustand';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuthStore } from './useAuthStore';

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  userId: string;
  watchlist: number[];
  continueWatching: Array<{
    id: number;
    type: 'movie' | 'tv';
    progress: number;
    duration: number;
    lastWatched: number;
  }>;
}

interface ProfileState {
  profiles: Profile[];
  currentProfile: Profile | null;
  loading: boolean;
  error: string | null;
  setProfiles: (profiles: Profile[]) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProfiles: (userId: string) => Promise<void>;
  createProfile: (name: string, avatar: string) => Promise<void>;
  updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<void>;
  addToWatchlist: (movieId: number) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  updateWatchProgress: (
    movieId: number,
    type: 'movie' | 'tv',
    progress: number,
    duration: number
  ) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null,

  setProfiles: (profiles) => set({ profiles }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchProfiles: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      
      // Check if Firebase is configured
      const { isFirebaseConfigured } = await import('../services/firebase');
      if (!isFirebaseConfigured) {
        // Demo mode - return empty profiles array
        set({ profiles: [], loading: false });
        return;
      }
      
      const profilesRef = collection(db, 'profiles');
      const q = query(profilesRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const profiles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Profile[];
      set({ profiles, loading: false });
    } catch (error: any) {
      // In demo mode, just set empty profiles
      set({ profiles: [], loading: false, error: null });
    }
  },

  createProfile: async (name: string, avatar: string) => {
    try {
      set({ loading: true, error: null });
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');

      // Check if Firebase is configured
      const { isFirebaseConfigured } = await import('../services/firebase');
      
      const profileData: Omit<Profile, 'id'> = {
        name,
        avatar,
        userId: user.uid,
        watchlist: [],
        continueWatching: [],
      };

      if (!isFirebaseConfigured) {
        // Demo mode - create profile in memory only
        const newProfile: Profile = { 
          id: `demo-${Date.now()}`, 
          ...profileData 
        };
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          currentProfile: newProfile,
          loading: false,
        }));
        return;
      }

      const profileRef = doc(collection(db, 'profiles'));
      await setDoc(profileRef, profileData);
      
      const newProfile: Profile = { id: profileRef.id, ...profileData };
      set((state) => ({
        profiles: [...state.profiles, newProfile],
        currentProfile: newProfile,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProfile: async (profileId: string, updates: Partial<Profile>) => {
    try {
      set({ loading: true, error: null });
      const profileRef = doc(db, 'profiles', profileId);
      await updateDoc(profileRef, updates);
      
      set((state) => ({
        profiles: state.profiles.map((p) =>
          p.id === profileId ? { ...p, ...updates } : p
        ),
        currentProfile:
          state.currentProfile?.id === profileId
            ? { ...state.currentProfile, ...updates }
            : state.currentProfile,
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addToWatchlist: async (movieId: number) => {
    try {
      const { currentProfile } = get();
      if (!currentProfile) throw new Error('No profile selected');

      const profileRef = doc(db, 'profiles', currentProfile.id);
      await updateDoc(profileRef, {
        watchlist: arrayUnion(movieId),
      });

      set((state) => ({
        currentProfile: state.currentProfile
          ? {
              ...state.currentProfile,
              watchlist: [...state.currentProfile.watchlist, movieId],
            }
          : null,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  removeFromWatchlist: async (movieId: number) => {
    try {
      const { currentProfile } = get();
      if (!currentProfile) throw new Error('No profile selected');

      const profileRef = doc(db, 'profiles', currentProfile.id);
      await updateDoc(profileRef, {
        watchlist: arrayRemove(movieId),
      });

      set((state) => ({
        currentProfile: state.currentProfile
          ? {
              ...state.currentProfile,
              watchlist: state.currentProfile.watchlist.filter((id) => id !== movieId),
            }
          : null,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateWatchProgress: async (
    movieId: number,
    type: 'movie' | 'tv',
    progress: number,
    duration: number
  ) => {
    try {
      const { currentProfile } = get();
      if (!currentProfile) throw new Error('No profile selected');

      const profileRef = doc(db, 'profiles', currentProfile.id);
      const continueWatching = currentProfile.continueWatching.filter(
        (item) => !(item.id === movieId && item.type === type)
      );
      
      continueWatching.push({
        id: movieId,
        type,
        progress,
        duration,
        lastWatched: Date.now(),
      });

      await updateDoc(profileRef, { continueWatching });

      set((state) => ({
        currentProfile: state.currentProfile
          ? { ...state.currentProfile, continueWatching }
          : null,
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));

