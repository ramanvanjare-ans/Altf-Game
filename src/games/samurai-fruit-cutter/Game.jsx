"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Zap } from "lucide-react";
import Engine from "./logic/Engine";

export default function Game() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [gameState, setGameState] = useState("menu");
    const [score, setScore] = useState(0);
    const engineRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        engineRef.current = new Engine(canvasRef.current, {
            onGameOver: (finalScore) => { setGameState("gameover"); setScore(finalScore); },
            onScoreUpdate: (newScore) => { setScore(newScore); }
        });
        const resize = () => engineRef.current?.resize();
        window.addEventListener("resize", resize);
        resize(); // Initial
        return () => {
            engineRef.current?.cleanup();
            window.removeEventListener("resize", resize);
        };
    }, []);

    const startGame = () => {
        // Mobile Fullscreen Auto-Trigger removed
        /*
        const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
        if (isMobile && !document.fullscreenElement && containerRef.current) {
            containerRef.current.requestFullscreen().catch(err => console.log("Fullscreen request failed:", err));
        }
        */

        setGameState("playing");
        setScore(0);
        engineRef.current?.start();
    };

    return (
        <div ref={containerRef} className="relative w-full h-full bg-black rounded-xl overflow-hidden font-mono select-none border-4 border-[#00e5ff] shadow-[0_0_50px_rgba(0,229,255,0.3)]">
            <canvas ref={canvasRef} className="block w-full h-full touch-none cursor-crosshair" />

            {/* UI Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {gameState === "playing" && (
                    <div className="absolute top-4 left-6">
                        <div className="text-[#00e5ff] text-5xl font-black italic tracking-tighter drop-shadow-[0_0_10px_#00e5ff]">
                            {score}
                        </div>
                        <div className="text-xs text-[#00e5ff] tracking-[0.5em] mt-1 opacity-70">
                            SCORE // REZ
                        </div>
                    </div>
                )}

                {gameState === "menu" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10 pointer-events-auto">
                        <div className="relative z-10 text-center animate-in zoom-in duration-300">
                            {/* Glitch Title */}
                            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00ffcc] to-[#0099ff] mb-4 tracking-tighter filter drop-shadow-[0_0_20px_rgba(0,255,204,0.5)] px-4 leading-tight">
                                SAMURAI FRUIT<br />CUTTER
                            </h1>
                            <p className="text-[#00ffcc] font-mono mb-6 tracking-widest text-[10px] sm:text-xs md:text-sm border-y border-[#00ffcc]/30 py-2 max-w-[90%] mx-auto">
                                [ SYSTEM READY ] :: CUT FRUITS :: DODGE GLITCHES
                            </p>

                            <button onClick={startGame} className="group relative px-16 py-6 bg-black border border-[#00ffcc] hover:bg-[#00ffcc] hover:text-black text-[#00ffcc] text-2xl font-bold uppercase tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(0,255,204,0.2)] hover:shadow-[0_0_50px_rgba(0,255,204,0.8)]">
                                <span className="absolute inset-x-0 h-[2px] top-0 bg-[#00ffcc] group-hover:animate-ping"></span>
                                INITIALIZE
                            </button>

                            <div className="mt-8 text-xs text-gray-500 font-mono">
                                HOLD [ SPACE ] FOR TIME DILATION
                            </div>
                        </div>
                    </div>
                )}

                {gameState === "gameover" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl z-20 pointer-events-auto">
                        <h2 className="text-6xl font-black text-[#ff0055] tracking-widest mb-2 drop-shadow-[0_0_30px_#ff0055]">LOSS THE GAME</h2>

                        <div className="my-10 border border-[#ff0055]/50 p-8 w-64 text-center bg-[#ff0055]/10 backdrop-blur-md">
                            <span className="block text-[#ff0055] text-xs tracking-[0.5em] mb-2">FINAL SCORE</span>
                            <span className="text-6xl text-white font-black">{score}</span>
                        </div>

                        <button onClick={startGame} className="px-12 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold tracking-widest transition-all">
                            RESTART THE GAME
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
