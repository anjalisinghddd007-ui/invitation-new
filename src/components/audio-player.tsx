'use client';

import { useEffect, useState, useRef } from 'react';
import audioInstance from '@/lib/synth';
import { Volume2, VolumeX, Play, Pause, SkipForward, Music } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showControls, setShowControls] = useState(false);
  
  const tracks = [
    { name: 'Wedding BGM (A Aa Theme)', desc: 'Inviting instrumental music' }
  ];

  useEffect(() => {
    // Synchronize initial state
    if (audioInstance) {
      setIsPlaying(audioInstance.isPlaying());
      setCurrentTrack(audioInstance.getTrack());
    }

    // Keep checking state (e.g., if started from scratch-reveal)
    const interval = setInterval(() => {
      if (audioInstance) {
        setIsPlaying(audioInstance.isPlaying());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    if (!audioInstance) return;
    if (isPlaying) {
      audioInstance.stop();
      setIsPlaying(false);
    } else {
      audioInstance.start(currentTrack);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (!audioInstance) return;
    const nextIdx = (currentTrack + 1) % tracks.length;
    setCurrentTrack(nextIdx);
    audioInstance.start(nextIdx);
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioInstance) {
      audioInstance.setVolume(val);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9000] flex flex-col items-start gap-2">
      {/* Floating control widget */}
      <div 
        className="flex items-center gap-3 bg-[#FAF8F3]/90 backdrop-blur-md border border-[#C5A880]/30 py-2.5 px-4 rounded-full shadow-[0_4px_30px_rgba(197,168,128,0.15)] interactive transition-all duration-300"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="w-9 h-9 rounded-full bg-[#C5A880] text-white flex items-center justify-center hover:bg-[#A27B5C] transition-colors"
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Animated wave showing playing state */}
        <div className="flex items-end gap-[3px] h-5 w-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`w-[2.5px] bg-[#C5A880] rounded-full transition-all duration-300 origin-bottom`}
              style={{
                height: isPlaying ? '100%' : '15%',
                transform: isPlaying ? `scaleY(${0.3 + Math.sin(Date.now() / 150 + i) * 0.7})` : 'scaleY(1)',
                animation: isPlaying ? `bounceSynth 1.2s ease-in-out infinite alternate` : 'none',
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>

        {/* Track Title */}
        <div className="flex flex-col text-left max-w-[110px] overflow-hidden">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C5A880] truncate">
            {isPlaying ? 'Playing' : 'Music Off'}
          </span>
          <span className="text-[12px] font-medium text-zinc-800 truncate">
            {tracks[currentTrack].name}
          </span>
        </div>

        {/* Extra Controls Slideout */}
        <div 
          className={`flex items-center gap-3 overflow-hidden transition-all duration-500 ease-in-out`}
          style={{ 
            width: showControls ? '120px' : '0px',
            opacity: showControls ? 1 : 0
          }}
        >
          {/* Volume Icon */}
          <div className="flex items-center gap-2">
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#C5A880]" />
            )}
            
            {/* Volume Slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-[#C5A880]/20 accent-[#C5A880] rounded-lg cursor-pointer range-sm"
            />
          </div>
        </div>
      </div>
      
      {/* CSS animation bounceSynth */}
      <style jsx global>{`
        @keyframes bounceSynth {
          0% { transform: scaleY(0.2); }
          100% { transform: scaleY(1.0); }
        }
      `}</style>
    </div>
  );
}
