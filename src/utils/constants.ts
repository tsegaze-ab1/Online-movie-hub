// TMDB API base URL for images
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const IMAGE_SIZES = {
  poster: {
    small: `${IMAGE_BASE_URL}/w185`,
    medium: `${IMAGE_BASE_URL}/w342`,
    large: `${IMAGE_BASE_URL}/w500`,
    xlarge: `${IMAGE_BASE_URL}/w780`,
  },
  backdrop: {
    small: `${IMAGE_BASE_URL}/w300`,
    medium: `${IMAGE_BASE_URL}/w780`,
    large: `${IMAGE_BASE_URL}/w1280`,
    original: `${IMAGE_BASE_URL}/original`,
  },
};

// Genre IDs
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

// Profile avatars
export const PROFILE_AVATARS = [
  '👤', '👨', '👩', '🧑', '👦', '👧', '👴', '👵', '🧓', '👶',
  '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🧠',
];

// Helper function to get image URL
export const getImageUrl = (
  path: string | null,
  type: 'poster' | 'backdrop' = 'poster',
  size: 'small' | 'medium' | 'large' | 'xlarge' | 'original' = 'large'
): string => {
  if (!path) {
    return '/placeholder-image.jpg'; // Fallback image
  }
  const sizeMap = type === 'poster' ? IMAGE_SIZES.poster : IMAGE_SIZES.backdrop;
  return `${sizeMap[size as keyof typeof sizeMap]}${path}`;
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

