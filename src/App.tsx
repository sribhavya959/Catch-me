/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Zap, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Structural Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 rotate-3">
            <Zap size={24} className="text-black fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter uppercase italic">Neon Pulse</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest -mt-1">GAME & BEAT ENGINE</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" />
            <span>CORE STATUS: NOMINAL</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span>V 2.0.4 - AI POWERED</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Game Section */}
        <div className="lg:col-span-12 xl:col-span-8 flex flex-col items-center xl:items-start w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex justify-center xl:justify-start"
          >
            <SnakeGame />
          </motion.div>
        </div>

        {/* Right Side: Music Player section */}
        <div className="lg:col-span-12 xl:col-span-4 w-full flex justify-center xl:justify-end sticky top-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <MusicPlayer />
          </motion.div>
        </div>

        {/* Bottom Feature Grid (Desktop Only) */}
        <div className="lg:col-span-12 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Responsive Logic', value: 'ULTRA-LATENCY', color: 'text-cyan-400' },
            { label: 'Neural Beats', value: 'AI SYNTHESIZED', color: 'text-pink-400' },
            { label: 'Retro Grade', value: '88% ACCURACY', color: 'text-purple-400' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm"
            >
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{item.label}</div>
              <div className={`text-lg font-bold tracking-tight ${item.color}`}>{item.value}</div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 border-t border-white/5 py-10 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[11px] font-mono tracking-widest text-zinc-400">
            © 2026 NEON PULSE MULTIMEDIA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[11px] font-mono tracking-widest text-zinc-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">TERMINAL</a>
            <a href="#" className="hover:text-pink-400 transition-colors">NETWORK</a>
            <a href="#" className="hover:text-white transition-colors">SYSTEM</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

