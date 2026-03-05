
"use client";

import React, { useState, useEffect, useRef } from "react";
import { MOVES, OUTCOMES, getRandomMove, determineWinner, getOutcomeMessage } from "./logic/GameLogic";
import { Hand, Scissors, Scroll, Trophy, RotateCcw, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import confetti from 'canvas-confetti';

const ICONS = {
  [MOVES.ROCK]: Hand, // Hand usually looks like rock/fist
  [MOVES.PAPER]: Scroll, // Scroll or FileText for paper
  [MOVES.SCISSORS]: Scissors
};

const COLORS = {
  [MOVES.ROCK]: "bg-rose-500 text-white border-rose-600",
  [MOVES.PAPER]: "bg-blue-500 text-white border-blue-600",
  [MOVES.SCISSORS]: "bg-amber-500 text-white border-amber-600"
};

export default function RockPaperScissorsGame({ isPreview = false }) {
  const [playerMove, setPlayerMove] = useState(null);
  const [computerMove, setComputerMove] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sound Effect Placeholder
  const playSound = (type) => {
    if (!soundEnabled) return;
    // Implement sound logic here if needed
  };

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

  const handleMoveSelection = (move) => {
    if (isAnimating || playerMove) return;

    setIsAnimating(true);
    playSound("select");
    
    // Initial selection visual
    setPlayerMove(move);
    
    // Simulate thinking/animation time
    setTimeout(() => {
      const cpuMove = getRandomMove();
      setComputerMove(cpuMove);
      
      const result = determineWinner(move, cpuMove);
      setOutcome(result);
      
      if (result === OUTCOMES.PLAYER_WINS) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        fireConfetti();
        playSound("win");
      } else if (result === OUTCOMES.COMPUTER_WINS) {
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
        playSound("lose");
      } else {
        playSound("draw");
      }
      
      setIsAnimating(false);
    }, 1000);
  };

  const resetRound = () => {
    setPlayerMove(null);
    setComputerMove(null);
    setOutcome(null);
    playSound("click");
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b']
    });
  };

  const renderChoiceButton = (move) => {
    const Icon = ICONS[move];
    const isSelected = playerMove === move;
    const isDisabled = !!playerMove; // Disable all if a move is chosen

    return (
      <button
        key={move}
        onClick={() => handleMoveSelection(move)}
        disabled={isDisabled}
        className={`
          relative group flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl transition-all duration-300 transform
          ${isDisabled && !isSelected ? 'opacity-50 scale-90 blur-[1px]' : 'hover:scale-105 active:scale-95'}
          ${isSelected ? 'ring-4 ring-white shadow-[0_0_30px_rgba(255,255,255,0.3)] scale-110 z-10' : 'shadow-xl'}
          ${COLORS[move]}
          border-b-8
        `}
      >
        <Icon size={48} className={`mb-2 ${isAnimating && isSelected ? 'animate-bounce' : ''}`} />
        <span className="font-bold uppercase tracking-widest text-sm sm:text-base">{move}</span>
      </button>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-zinc-950 rounded-xl font-sans select-none border-4 border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-zinc-950 pointer-events-none" />

      {/* Header / Scoreboard */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-md">
        <div className="flex flex-col items-center">
          <span className="text-xs text-zinc-500 font-bold tracking-widest uppercase mb-1">You</span>
          <span className="text-2xl font-black text-green-400">{score.player}</span>
        </div>

        <div className="flex flex-col items-center px-4">
            <span className="text-xs font-bold bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full">VS</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-zinc-500 font-bold tracking-widest uppercase mb-1">CPU</span>
          <span className="text-2xl font-black text-red-400">{score.computer}</span>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto">
        
        {/* Result Display */}
        {outcome ? (
            <div className="text-center mb-8 animate-in fade-in zoom-in duration-300">
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-2 drop-shadow-lg">
                    {getOutcomeMessage(outcome)}
                </h2>
                <p className="text-zinc-400 font-medium">
                    {outcome === OUTCOMES.PLAYER_WINS ? 'Great pick!' : outcome === OUTCOMES.COMPUTER_WINS ? 'Better luck next time.' : 'Great minds think alike.'}
                </p>
            </div>
        ) : (
            <div className="text-center mb-12 animate-pulse">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-300">
                    {playerMove ? (isAnimating ? "Computer is thinking..." : "Result") : "Choose your weapon"}
                </h2>
            </div>
        )}

        {/* Choices Area */}
        <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            
            {/* Player Choice (or Selection Buttons) */}
            {!playerMove ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-2xl">
                    {Object.values(MOVES).map(move => renderChoiceButton(move))}
                </div>
            ) : (
                <>
                    {/* Player Selected */}
                    <div className="flex flex-col items-center gap-4 animate-in slide-in-from-left duration-500">
                        <div className={`p-8 rounded-full border-4 border-white/20 shadow-2xl ${COLORS[playerMove].split(' ')[0]}`}>
                            {React.createElement(ICONS[playerMove], { size: 64, className: "text-white" })}
                        </div>
                        <span className="font-bold text-zinc-400 uppercase tracking-widest">You</span>
                    </div>

                    {/* VS Divider (Hidden on small screens in result mode if desired, but good for clarity) */}
                    <div className="text-4xl font-black text-zinc-700">VS</div>

                    {/* Computer Choice */}
                    <div className="flex flex-col items-center gap-4 animate-in slide-in-from-right duration-500">
                        <div className={`
                            p-8 rounded-full border-4 shadow-2xl transition-all duration-300
                            ${computerMove ? COLORS[computerMove].split(' ')[0] + ' border-white/20' : 'bg-zinc-800 border-zinc-700 animate-pulse'}
                        `}>
                            {computerMove ? (
                                React.createElement(ICONS[computerMove], { size: 64, className: "text-white" })
                            ) : (
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <span className="text-4xl">?</span>
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-zinc-400 uppercase tracking-widest">CPU</span>
                    </div>
                </>
            )}

        </div>

        {/* Play Again Button */}
        {outcome && (
            <button 
                onClick={resetRound}
                className="mt-12 group relative px-8 py-4 bg-white text-black font-black tracking-widest uppercase rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:translate-y-0"
            >
                <span className="flex items-center gap-2">
                    <RotateCcw size={20} />
                    Play Again
                </span>
            </button>
        )}

      </div>

      {/* Controls */}
      {!isPreview && (
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-zinc-800/80 text-zinc-400 hover:text-white rounded-lg transition-colors">
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button onClick={toggleFullscreen} className="p-2 bg-zinc-800/80 text-zinc-400 hover:text-white rounded-lg transition-colors">
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
        </div>
      )}
    </div>
  );
}
