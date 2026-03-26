import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'NOISE_INJECTION_01', artist: 'SYS.AI', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CORRUPTED_SECTOR', artist: 'SYS.AI', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'KERNEL_PANIC', artist: 'SYS.AI', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full bg-black border-4 border-[#FF00FF] p-6 shadow-[8px_8px_0px_#00FFFF] relative">
      <div className="absolute top-0 left-0 bg-[#FF00FF] text-black px-2 py-1 font-mono text-sm font-bold">
        AUDIO_SUBSYSTEM
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-between mt-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-[#00FFFF]">
            <Terminal className="w-6 h-6 text-[#00FFFF]" />
          </div>
          <div>
            <h3 className="text-[#00FFFF] font-mono text-lg uppercase">
              {currentTrack.title}
            </h3>
            <p className="text-[#FF00FF] text-sm font-sans mt-1">
              SRC: {currentTrack.artist}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="text-[#00FFFF] hover:text-black hover:bg-[#00FFFF] transition-none p-2 border-2 border-transparent hover:border-[#00FFFF]"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-4 w-full bg-black border-2 border-[#333] mb-6 relative">
        <div
          className="h-full bg-[#FF00FF] transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={prevTrack} 
          className="text-[#00FFFF] border-2 border-[#00FFFF] p-2 hover:bg-[#00FFFF] hover:text-black transition-none"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={togglePlay}
          className="w-16 h-12 flex items-center justify-center bg-black border-2 border-[#FF00FF] text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black transition-none"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current" />
          )}
        </button>
        <button 
          onClick={nextTrack} 
          className="text-[#00FFFF] border-2 border-[#00FFFF] p-2 hover:bg-[#00FFFF] hover:text-black transition-none"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
