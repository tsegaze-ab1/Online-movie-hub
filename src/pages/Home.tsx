import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import MovieRow from '../components/MovieRow';
import { MovieRowSkeleton, BannerSkeleton } from '../components/Skeleton';
import { DemoBanner } from '../components/DemoBanner';
import { useMovieStore } from '../store/useMovieStore';

const Home = () => {
  const {
    featuredMovie,
    trendingMovies,
    popularMovies,
    topRatedMovies,
    horrorMovies,
    actionMovies,
    romanceMovies,
    loading,
    fetchHomePageData,
  } = useMovieStore();

  useEffect(() => {
    fetchHomePageData();
  }, [fetchHomePageData]);

  return (
    <div className="min-h-screen bg-netflix-black">
      <DemoBanner />
      <Navbar />

      {/* Banner */}
      {loading ? <BannerSkeleton /> : <Banner movie={featuredMovie} />}

      {/* Movie Rows */}
      <div className="mt-8 pb-16">
        {loading ? (
          <>
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
          </>
        ) : (
          <>
            <MovieRow title="Trending Now" movies={trendingMovies} isLargeRow />
            <MovieRow title="Popular Movies" movies={popularMovies} />
            <MovieRow title="Top Rated" movies={topRatedMovies} />
            <MovieRow title="Horror Movies" movies={horrorMovies} />
            <MovieRow title="Action Movies" movies={actionMovies} />
            <MovieRow title="Romance Movies" movies={romanceMovies} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

