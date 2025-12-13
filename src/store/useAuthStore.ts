import { create } from 'zustand';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      if (!isFirebaseConfigured) {
        // Demo mode - create mock user
        const mockUser = { uid: 'demo-user', email } as User;
        // Set user immediately in demo mode
        set({ user: mockUser, loading: false });
        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      if (!isFirebaseConfigured) {
        // Demo mode - create mock user
        const mockUser = { uid: 'demo-user', email } as User;
        // Set user immediately in demo mode
        set({ user: mockUser, loading: false });
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      if (!isFirebaseConfigured) {
        // Demo mode - create mock user
        const mockUser = { uid: 'demo-user', email: 'demo@example.com' } as User;
        // Set user immediately in demo mode
        set({ user: mockUser, loading: false });
        return;
      }
      const userCredential = await signInWithPopup(auth, googleProvider);
      set({ user: userCredential.user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      if (!isFirebaseConfigured) {
        // Demo mode - just clear user state
        set({ user: null, loading: false });
        return;
      }
      await signOut(auth);
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  initializeAuth: () => {
    if (!isFirebaseConfigured) {
      // Demo mode - no auth state
      set({ user: null, loading: false });
      return;
    }
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },
}));

