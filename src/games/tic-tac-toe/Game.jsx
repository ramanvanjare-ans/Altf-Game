"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getAIMove, checkWinner, checkDraw, PLAYER_X, PLAYER_O } from "./logic/GameLogic";
import { RotateCcw, Monitor, User, Trophy, Play, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import confetti from 'canvas-confetti';

const COLORS = {
    X: "text-amber-400",
    O: "text-red-500",
    DRAW: "text-zinc-400"
};

const DIFFICULTY_SETTINGS = {
    EASY: { label: "EASY", color: "text-blue-400" },
    MEDIUM: { label: "MEDIUM", color: "text-amber-400" },
    HARD: { label: "HARD", color: "text-red-500" }
};

export default function TicTacToeGame({ isPreview = false }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [player, setPlayer] = useState(PLAYER_X); // X is always human
    const [winner, setWinner] = useState(null); // { winner: 'X' | 'O', line: [] }
    const [isDraw, setIsDraw] = useState(false);
    const [gameMode, setGameMode] = useState("AI"); // 'AI' or 'PVP'
    const [difficulty, setDifficulty] = useState("MEDIUM");
    const [isAiTurn, setIsAiTurn] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [gameState, setGameState] = useState(isPreview ? "PLAYING" : "START"); // START, PLAYING, GAME_OVER

    const containerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Audio Refs (Simulated)
    const playSound = useCallback((type) => {
        if (!soundEnabled) return;
        // Audio implementation placeholder
    }, [soundEnabled]);

    const toggleFullscreen = () => {
        const elem = containerRef.current;
        const isFS = document.fullscreenElement || document.webkitFullscreenElement;

        if (!isFS) {
            if (elem?.requestFullscreen) elem.requestFullscreen().catch(err => console.log(err));
            else if (elem?.webkitRequestFullscreen) elem.webkitRequestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const h = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", h);
        return () => document.removeEventListener("fullscreenchange", h);
    }, []);

    const fireConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#d97706']
        });
    };

    // Check game status removed from useEffect to avoid sync setState
    
    // --- FIX START: makeMove Logic ---
    const makeMove = useCallback((index, isCpuMove = false) => {
        // Validation: Agar ye CPU move nahi hai aur abhi CPU ka turn chal raha hai, to roko.
        if (
            board[index] ||
            winner ||
            isDraw ||
            (gameMode === "AI" && player === PLAYER_O && !isCpuMove) ||
            gameState !== "PLAYING"
        ) return;

        const newBoard = [...board];
        newBoard[index] = player;
        setBoard(newBoard);
        
        // Check Win/Draw immediately
        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
            if (win.winner === PLAYER_X) fireConfetti();
            setTimeout(() => setGameState("GAME_OVER"), 1500);
        } else if (checkDraw(newBoard)) {
            setIsDraw(true);
            setTimeout(() => setGameState("GAME_OVER"), 1500);
        } else {
            // Switch Player only if game continues
            setPlayer(player === PLAYER_X ? PLAYER_O : PLAYER_X);
        }
        
        playSound("move");
    }, [board, winner, isDraw, gameMode, player, gameState, playSound]);
    // --- FIX END ---

    // --- FIX START: AI Turn Logic ---
    useEffect(() => {
        if (gameMode === "AI" && player === PLAYER_O && gameState === "PLAYING" && !winner && !isDraw) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsAiTurn(true);
            const timer = setTimeout(() => {
                // IMPORTANT: Board ki copy pass karein taaki original state mutate na ho
                const move = getAIMove([...board], difficulty);

                if (move !== null) {
                    // IMPORTANT: 'true' pass karein taaki makeMove ko pata chale ye CPU hai
                    makeMove(move, true);
                }
                setIsAiTurn(false);
            }, 600); // Artificial delay
            return () => clearTimeout(timer);
        }
    }, [player, gameState, winner, isDraw, board, gameMode, difficulty, makeMove]);
    // --- FIX END ---
    
    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setPlayer(PLAYER_X);
        setWinner(null);
        setIsDraw(false);
        setGameState("PLAYING");
    };

    const startGame = () => {
        setBoard(Array(9).fill(null));
        setPlayer(PLAYER_X);
        setWinner(null);
        setIsDraw(false);
        setGameState("PLAYING");
        setIsAiTurn(false);
    };

    // Render Tile
    const renderTile = (i) => {
        const isWinningTile = winner?.line?.includes(i);
        const value = board[i];

        return (
            <button
                key={i}
                // Human click pe 'isCpuMove' default false rahega
                onClick={() => makeMove(i)}
                disabled={!!value || !!winner || (gameMode === "AI" && player === PLAYER_O)}
                className={`
                    relative w-full h-full flex items-center justify-center text-5xl md:text-6xl font-black rounded-xl
                    transition-all duration-300
                    ${value ? 'bg-zinc-800/80 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]' : 'bg-zinc-900 hover:bg-zinc-800 cursor-pointer hover:shadow-[0_0_15px_rgba(251,191,36,0.1)]'}
                    ${isWinningTile ? 'bg-amber-900/40 ring-4 ring-amber-500 z-10 scale-105' : ''}
                    border border-zinc-700
                `}
            >
                {value === PLAYER_X && (
                    <span className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-in zoom-in duration-300">X</span>
                )}
                {value === PLAYER_O && (
                    <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-in zoom-in duration-300">O</span>
                )}
            </button>
        );
    };

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[500px] bg-zinc-950 rounded-xl font-mono select-none border-4 border-zinc-800 shadow-[0_0_50px_rgba(39,39,42,0.3)] group/container overflow-y-auto">

            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950 pointer-events-none" />
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />

            {/* MAIN LAYER */}
            <div className="flex flex-col items-center justify-center p-4 min-h-full">

                {/* HUD */}
                <div className={`w-full max-w-md flex justify-between items-center mb-6 transition-all duration-500 ${gameState === "PLAYING" ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${player === PLAYER_X ? 'bg-amber-500/10 border-amber-500 text-amber-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
                        <User size={16} />
                        <span className="font-bold">YOU (X)</span>
                    </div>

                    <div className="font-bold text-zinc-600 text-xs tracking-widest">VS</div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${player === PLAYER_O ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
                        <Monitor size={16} />
                        <span className="font-bold">CPU (O)</span>
                    </div>
                </div>

                {/* GAME BOARD */}
                <div className="relative w-full max-w-[400px] aspect-square grid grid-cols-3 gap-3 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur-sm shadow-2xl">
                    {Array.from({ length: 9 }).map((_, i) => renderTile(i))}

                    {/* Thinking Overlay */}
                    {isAiTurn && gameState === "PLAYING" && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                            <div className="bg-black/80 text-red-400 px-4 py-2 rounded-full text-xs font-bold tracking-widest animate-pulse border border-red-500/30 backdrop-blur-md">
                                CPU THINKING...
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* OVERLAYS (No Changes Needed Here) */}
            {!isPreview && (
                <div className="absolute top-4 right-4 flex gap-2 z-50 opacity-0 group-hover/container:opacity-100 transition-opacity">
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors">
                        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors">
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                </div>
            )}

            {/* START SCREEN */}
            {gameState === "START" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-md z-40 pointer-events-auto">
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-600 mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        TIC TAC TOE
                    </h1>
                    <div className="text-zinc-500 font-mono text-sm tracking-[0.5em] mb-10">NEON EDITION</div>

                    <div className="flex flex-col gap-4 w-64">
                        <div className="flex gap-2 justify-center mb-4">
                            {Object.entries(DIFFICULTY_SETTINGS).map(([key, setting]) => (
                                <button
                                    key={key}
                                    onClick={() => setDifficulty(key)}
                                    className={`flex-1 py-2 text-[10px] font-bold tracking-widest border rounded transition-all
                                        ${difficulty === key
                                            ? `${setting.color} border-current bg-white/5`
                                            : 'text-zinc-600 border-zinc-800 hover:border-zinc-700'
                                        }
                                    `}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>

                        <button onClick={startGame} className="group relative w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] clip-path-polygon">
                            START GAME
                        </button>
                    </div>
                </div>
            )}

            {/* GAME OVER SCREEN */}
            {gameState === "GAME_OVER" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl z-50 pointer-events-auto animate-in fade-in duration-500">
                    <h2 className={`text-4xl md:text-6xl font-black tracking-tighter mb-4 drop-shadow-2xl ${winner?.winner === PLAYER_X ? 'text-amber-400' : (winner?.winner === PLAYER_O ? 'text-red-500' : 'text-zinc-400')}`}>
                        {winner?.winner === PLAYER_X ? 'VICTORY' : (winner?.winner === PLAYER_O ? 'DEFEAT' : 'DRAW')}
                    </h2>

                    <div className="mb-8 px-6 py-2 border rounded border-zinc-800 bg-zinc-900/50 text-zinc-400 font-mono text-xs tracking-[0.3em]">
                        {winner?.winner === PLAYER_X ? 'SYSTEM DEFEATED' : (winner?.winner === PLAYER_O ? 'SYSTEM WINS' : 'NO WINNER')}
                    </div>

                    <button onClick={startGame} className="px-8 py-3 bg-white text-black font-bold tracking-widest hover:scale-105 transition-transform">
                        PLAY AGAIN
                    </button>
                </div>
            )}
        </div>
    );
}
