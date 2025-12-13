import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiX } from 'react-icons/fi';
import { tmdbAPI } from '../services/api';
import { useProfileStore } from '../store/useProfileStore';

const Player = () => {
  const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const { currentProfile, updateWatchProgress } = useProfileStore();
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchData = async () => {
      if (!type || !id) return;
      try {
        const [movieData, videosData] = await Promise.all([
          tmdbAPI.getDetails(type, Number(id)),
          tmdbAPI.getVideos(type, Number(id)),
        ]);
        setMovie(movieData);

        // Find YouTube trailer or video
        const trailer = videosData.results?.find(
          (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
        );
        if (trailer) {
          setVideoUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        }
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };
    fetchData();
  }, [type, id]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [playing, showControls]);

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setProgress(state.played);
    if (currentProfile && duration > 0) {
      // Update progress in Firestore every 10 seconds
      if (Math.floor(state.playedSeconds) % 10 === 0) {
        updateWatchProgress(Number(id), type!, state.playedSeconds, duration);
      }
    }
  };

  const handleDuration = (dur: number) => {
    setDuration(dur);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (playerRef.current) {
      playerRef.current.seekTo(newProgress);
    }
  };

  const togglePlayPause = () => {
    setPlaying(!playing);
    setShowControls(true);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleFullscreen = () => {
    if (playerRef.current?.getInternalPlayer()) {
      const player = playerRef.current.getInternalPlayer() as any;
      if (player.requestFullscreen) {
        player.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!movie || !videoUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black z-50"
      onMouseMove={() => setShowControls(true)}
      onClick={togglePlayPause}
    >
      {/* Video Player */}
      <div className="relative w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          muted={muted}
          volume={volume}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
              },
            },
          }}
        />

        {/* Overlay Controls */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="text-white hover:text-gray-300 transition"
            >
              <FiX size={24} />
            </button>
            <h1 className="text-white text-lg font-semibold line-clamp-1">
              {movie.title || movie.name}
            </h1>
            <div className="w-6" /> {/* Spacer */}
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition"
            >
              {playing ? (
                <FiPause size={32} className="text-white" />
              ) : (
                <FiPlay size={32} className="text-white ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Progress Bar */}
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={progress}
                onChange={handleSeek}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #E50914 0%, #E50914 ${progress * 100}%, #666 ${progress * 100}%, #666 100%)`,
                }}
              />
              <span className="text-white text-sm min-w-[60px] text-right">
                {formatTime(progress * duration)} / {formatTime(duration)}
              </span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                  className="text-white hover:text-gray-300 transition"
                >
                  {playing ? <FiPause size={24} /> : <FiPlay size={24} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="text-white hover:text-gray-300 transition"
                >
                  {muted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setMuted(parseFloat(e.target.value) === 0);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                className="text-white hover:text-gray-300 transition"
              >
                <FiMaximize size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;

