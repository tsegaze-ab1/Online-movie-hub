// Demo banner component that shows a notice when in demo mode
import { isDemoMode } from '../utils/mockData';

export const DemoBanner = () => {
  if (!isDemoMode()) return null;

  return (
    <div className="bg-yellow-600 text-black text-center py-2 px-4">
      <p className="text-sm font-semibold">
        🎬 DEMO MODE: Using mock data. Set up API keys to see real movies!
      </p>
    </div>
  );
};

