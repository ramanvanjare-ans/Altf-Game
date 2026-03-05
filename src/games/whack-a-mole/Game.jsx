
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GAME_CONFIG, DIFFICULTY_LEVELS, randomTime, randomHole } from "./logic/GameLogic";
import { Hammer, Trophy, RotateCcw, Volume2, VolumeX, Maximize, Minimize, Play } from "lucide-react";
import confetti from 'canvas-confetti';

export default function WhackAMoleGame({ isPreview = false }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMole, setActiveMole] = useState(null); // The index of the hole with the mole
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const lastHoleRef = useRef(null);
  const isPlayingRef = useRef(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const moleTimerRef = useRef(null);
  
  // Sync isPlaying state with ref for async access
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Load high score from local storage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('whack-a-mole-highscore');
    if (savedHighScore) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!document.fullscreenElement) {
      if (elem?.requestFullscreen) elem.requestFullscreen();
      else if (elem?.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // Game Loop Logic
  const popMoleRef = useRef(null);

  const popMole = useCallback(() => {
    if (!isPlayingRef.current) return;

    const time = randomTime(
      GAME_CONFIG.MOLE_STAY_MIN * DIFFICULTY_LEVELS[difficulty].speedMultiplier, 
      GAME_CONFIG.MOLE_STAY_MAX * DIFFICULTY_LEVELS[difficulty].speedMultiplier
    );
    
    const holeIdx = randomHole(GAME_CONFIG.GRID_SIZE, lastHoleRef.current);
    lastHoleRef.current = holeIdx;
    setActiveMole(holeIdx);

    moleTimerRef.current = setTimeout(() => {
      setActiveMole(null);
      if (isPlayingRef.current) {
        // Schedule next pop
        const nextPopTime = randomTime(200, 800); // Wait a bit before next pop
        setTimeout(() => {
             if (popMoleRef.current) popMoleRef.current();
        }, nextPopTime);
      }
    }, time);
  }, [difficulty]); // Only depend on difficulty

  useEffect(() => {
      popMoleRef.current = popMole;
  }, [popMole]);

  // Start Game
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_CONFIG.GAME_DURATION);
    setIsPlaying(true);
    setActiveMole(null);
    lastHoleRef.current = null;
    
    if (soundEnabled) {
      // Play start sound placeholder
    }
  };

  // End Game
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setActiveMole(null);
    clearTimeout(moleTimerRef.current);
    clearInterval(timerRef.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('whack-a-mole-highscore', score.toString());
      fireConfetti();
    }
  }, [score, highScore]);

  // Timer Effect
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                clearInterval(timerRef.current);
                endGame();
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
      
      // Start popping moles immediately when game starts
      popMole();
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(moleTimerRef.current);
    };
  }, [isPlaying, endGame, popMole]);


  const handleWhack = (index) => {
    if (!isPlaying || index !== activeMole) return;

    setScore(prev => prev + 1);
    setActiveMole(null); // Hide mole immediately
    clearTimeout(moleTimerRef.current); // Stop it from hiding automatically
    
    // Play sound
    if (soundEnabled) {
        // play whack sound
    }

    // Trigger next mole immediately
    const nextPopTime = randomTime(100, 400);
    setTimeout(() => {
         if (popMoleRef.current) popMoleRef.current();
    }, nextPopTime);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-stone-900 rounded-xl font-sans select-none border-4 border-stone-800 shadow-2xl overflow-hidden flex flex-col">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Header / HUD */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-stone-800/90 border-b border-stone-700 backdrop-blur-md shadow-md">
        <div className="flex flex-col">
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Score</span>
            <span className="text-3xl font-black text-amber-400 font-mono">{score}</span>
        </div>

        {/* Timer */}
        <div className={`flex flex-col items-center px-4 py-1 rounded-lg border-2 ${timeLeft <= 5 ? 'bg-red-900/50 border-red-500 animate-pulse' : 'bg-stone-700/50 border-stone-600'}`}>
            <span className="text-xs text-stone-300 font-bold uppercase tracking-wider">Time</span>
            <span className={`text-2xl font-black font-mono ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}s
            </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Best</span>
          <span className="text-2xl font-black text-stone-300 font-mono">{highScore}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
        
        {!isPlaying && timeLeft === 0 ? (
            /* Game Over Screen */
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                <h2 className="text-5xl font-black text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">GAME OVER</h2>
                <div className="text-center mb-8">
                    <p className="text-stone-300 text-lg">Final Score</p>
                    <p className="text-6xl font-black text-amber-400 drop-shadow-lg">{score}</p>
                </div>
                <button 
                    onClick={startGame}
                    className="group relative px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-black tracking-widest uppercase rounded-full transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:-translate-y-1 active:translate-y-0"
                >
                    <span className="flex items-center gap-2">
                        <RotateCcw size={24} />
                        Play Again
                    </span>
                </button>
            </div>
        ) : !isPlaying && timeLeft === GAME_CONFIG.GAME_DURATION ? (
            /* Start Screen */
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="mb-8 p-6 bg-stone-800 rounded-2xl border-4 border-stone-700 shadow-2xl text-center max-w-sm mx-4">
                    <Hammer size={64} className="mx-auto text-amber-400 mb-4 animate-bounce" />
                    <h1 className="text-3xl font-black text-white mb-2 uppercase">Whack-a-Mole</h1>
                    <p className="text-stone-400 mb-6">Hit the moles as fast as you can! Avoid missing them.</p>
                    
                    {/* Difficulty Selector */}
                    <div className="flex gap-2 justify-center mb-6">
                        {Object.keys(DIFFICULTY_LEVELS).map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors border ${
                                    difficulty === level 
                                    ? 'bg-amber-500 border-amber-500 text-white' 
                                    : 'bg-transparent border-stone-600 text-stone-500 hover:border-stone-400'
                                }`}
                            >
                                {DIFFICULTY_LEVELS[level].label}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={startGame}
                    className="group relative px-10 py-5 bg-amber-500 hover:bg-amber-400 text-white font-black tracking-widest uppercase rounded-full transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:-translate-y-1 active:translate-y-0"
                >
                    <span className="flex items-center gap-2 text-xl">
                        <Play size={28} fill="currentColor" />
                        Start Game
                    </span>
                </button>
            </div>
        ) : null}

        {/* Grid */}
        <div className="w-full max-w-[500px] aspect-square grid grid-cols-3 gap-3 sm:gap-4 p-4 bg-stone-800/50 rounded-2xl border-4 border-stone-700 shadow-inner">
            {Array.from({ length: GAME_CONFIG.GRID_SIZE }).map((_, index) => (
                <div key={index} className="relative group">
                    {/* Hole */}
                    <div className="absolute inset-x-2 bottom-2 h-8 bg-black/40 rounded-full blur-sm" />
                    <div className="w-full h-full bg-stone-700 rounded-full shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)] border-b-4 border-stone-600 relative overflow-hidden">
                        
                        {/* Mole */}
                        <div 
                            className={`
                                absolute bottom-0 inset-x-0 mx-auto w-4/5 h-4/5 
                                transition-transform duration-100 ease-out cursor-pointer
                                ${activeMole === index ? 'translate-y-1' : 'translate-y-[120%]'}
                            `}
                            onClick={() => handleWhack(index)}
                        >
                            {/* Mole Body */}
                            <div className="w-full h-full bg-amber-600 rounded-t-full relative border-x-4 border-t-4 border-amber-700 shadow-lg flex justify-center items-center">
                                {/* Face Details */}
                                <div className="absolute top-1/4 flex gap-4 w-full justify-center">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full" /> {/* Eye */}
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full" /> {/* Eye */}
                                </div>
                                <div className="absolute top-1/2 w-4 h-3 sm:w-6 sm:h-4 bg-pink-300 rounded-full opacity-80" /> {/* Nose */}
                                <div className="absolute top-2/3 w-8 h-1 bg-black/20 rounded-full" /> {/* Mouth */}
                            </div>
                        </div>

                        {/* Dirt Overlay (bottom lip of hole to hide mole bottom) */}
                        <div className="absolute bottom-0 w-full h-2 bg-stone-700 z-10" />
                    </div>
                </div>
            ))}
        </div>

      </div>

      {/* Controls */}
      {!isPreview && (
        <div className="absolute top-20 right-4 z-50 flex flex-col gap-2">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-stone-800/80 text-stone-400 hover:text-white rounded-lg transition-colors border border-stone-700">
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button onClick={toggleFullscreen} className="p-2 bg-stone-800/80 text-stone-400 hover:text-white rounded-lg transition-colors border border-stone-700">
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
        </div>
      )}
    </div>
  );
}
