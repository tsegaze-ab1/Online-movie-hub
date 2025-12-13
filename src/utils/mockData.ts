// Mock data for demo mode (when API keys are not set)
import { Movie } from '../store/useMovieStore';

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'The Dark Knight',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    release_date: '2008-07-18',
    vote_average: 9.0,
    media_type: 'movie',
  },
  {
    id: 2,
    title: 'Inception',
    overview: 'A skilled thief is given a chance at redemption if he can pull off an impossible heist: Inception, the implantation of another person\'s idea into a target\'s subconscious.',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    release_date: '2010-07-16',
    vote_average: 8.8,
    media_type: 'movie',
  },
  {
    id: 3,
    title: 'The Matrix',
    overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/ncEsesgOJDNrTUED89hYbA117wo.jpg',
    release_date: '1999-03-31',
    vote_average: 8.7,
    media_type: 'movie',
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    release_date: '1994-10-14',
    vote_average: 8.9,
    media_type: 'movie',
  },
  {
    id: 5,
    title: 'Interstellar',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    release_date: '2014-11-07',
    vote_average: 8.6,
    media_type: 'movie',
  },
  {
    id: 6,
    title: 'The Shawshank Redemption',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop_path: '/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg',
    release_date: '1994-09-23',
    vote_average: 9.3,
    media_type: 'movie',
  },
  {
    id: 7,
    title: 'Fight Club',
    overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    release_date: '1999-10-15',
    vote_average: 8.8,
    media_type: 'movie',
  },
  {
    id: 8,
    title: 'Forrest Gump',
    overview: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    poster_path: '/arw2vcBveROVTimgwR7UtjHAR1D.jpg',
    backdrop_path: '/Adrip2Jqzw56KeuV2nAxucKMNXA.jpg',
    release_date: '1994-07-06',
    vote_average: 8.8,
    media_type: 'movie',
  },
];

// Check if we're in demo mode (no API keys)
// Note: We check for server API availability, not direct TMDB key
// The frontend uses the server API, so demo mode is determined by server availability
export const isDemoMode = () => {
  // Always try to use the server API first
  // Demo mode is only used as fallback if server is unavailable
  return false; // Let the API calls fail gracefully and fall back to mock data
};

