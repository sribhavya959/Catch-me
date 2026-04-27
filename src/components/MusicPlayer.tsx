import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2, ListMusic } from 'lucide-react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'AI Synthwave',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f54b6795f9.mp3', // Generic cool track
    color: 'from-cyan-500 to-blue-500'
  },
  {
    id: '2',
    title: 'Pulse Drift',
    artist: 'AI Techno',
    url: 'https://cdn.pixabay.com/audio/2021/11/24/audio_83a5933939.mp3',
    color: 'from-pink-500 to-purple-500'
  },
  {
    id: '3',
    title: 'Echo Horizon',
    artist: 'AI Chill',
    url: 'https://cdn.pixabay.com/audio/2022/02/22/audio_d0c6ff1101.mp3',
    color: 'from-emerald-500 to-teal-500'
  }
];

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (val / 100) * duration;
      setProgress(val);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br ${currentTrack.color} blur-[100px] opacity-20`} />
      
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8 text-zinc-400">
          <Music2 size={24} className="animate-pulse" />
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={`transition-colors ${showQueue ? 'text-cyan-400' : 'hover:text-white'}`}
          >
            <ListMusic size={24} />
          </button>
        </div>

        <div className="text-center mb-10">
          <motion.div 
            key={currentTrack.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-2"
          >
            <h3 className="text-2xl font-bold tracking-tight text-white">{currentTrack.title}</h3>
            <p className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">{currentTrack.artist}</p>
          </motion.div>
        </div>

        {/* Custom Progress Bar */}
        <div className="relative mb-8 pt-4">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div 
            className={`absolute top-4 left-0 h-1 bg-gradient-to-r ${currentTrack.color} pointer-events-none rounded-lg transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <button onClick={handlePrev} className="p-2 text-zinc-400 hover:text-white transition-colors hover:scale-110 active:scale-95">
            <SkipBack size={32} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-5 rounded-full bg-white text-black shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition-all`}
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={handleNext} className="p-2 text-zinc-400 hover:text-white transition-colors hover:scale-110 active:scale-95">
            <SkipForward size={32} />
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Volume2 size={12} />
            <span>DYNAMIC AUDIO</span>
          </div>
          <span>NEON VIBE 2.0</span>
        </div>
      </div>

      {/* Queue Overlay */}
      <AnimatePresence>
        {showQueue && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute inset-0 z-20 bg-zinc-950/95 backdrop-blur-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-lg uppercase tracking-widest text-cyan-400">Next Tracks</h4>
              <button onClick={() => setShowQueue(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              {TRACKS.map((track, idx) => (
                <button 
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                    setShowQueue(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between group transition-all ${
                    currentTrackIndex === idx 
                      ? 'bg-zinc-800 border-cyan-500/50' 
                      : 'bg-transparent border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className={`font-bold ${currentTrackIndex === idx ? 'text-cyan-400' : 'text-white'}`}>{track.title}</div>
                    <div className="text-xs text-zinc-500">{track.artist}</div>
                  </div>
                  {currentTrackIndex === idx && isPlaying && (
                    <div className="flex gap-1 h-3 items-end">
                      {[1,2,3].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [4, 12, 6, 12] }}
                          transition={{ repeat: Infinity, duration: 0.5 + i*0.2 }}
                          className="w-1 bg-cyan-400"
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPlayer;
