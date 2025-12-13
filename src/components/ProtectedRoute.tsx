import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuthStore();
  const { currentProfile, profiles } = useProfileStore();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-netflix-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Allow access to profile selection page without a profile
  if (window.location.pathname === '/profiles') {
    return <>{children}</>;
  }

  // For other protected routes, check if profile exists
  if (!currentProfile) {
    // If user has profiles but none selected, auto-select first one
    if (profiles.length > 0 && user) {
      const userProfile = profiles.find(p => p.userId === user.uid);
      if (userProfile) {
        useProfileStore.getState().setCurrentProfile(userProfile);
        return <>{children}</>;
      }
    }
    // No profile found, redirect to profile selection
    return <Navigate to="/profiles" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

