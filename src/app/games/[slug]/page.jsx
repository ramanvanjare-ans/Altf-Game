"use client";

import { use, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { notFound, useRouter } from "next/navigation";
import { gameMap } from "@/platform/registry/gameMap";
import { ArrowLeft, Maximize2, RotateCcw, Trophy, Play, X } from "lucide-react";
import Link from "next/link";

export default function GamePage({ params }) {
    // Unwrap params using React 'use' for Next.js 15+ compatibility
    // Fallback to direct access if use is not available or params is already an object in older versions
    const unwrappedParams = params instanceof Promise ? use(params) : params;
    const { slug } = unwrappedParams;

    const game = gameMap[slug];
    const [isClient, setIsClient] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileOverlay, setShowMobileOverlay] = useState(false);
    
    const gameContainerRef = useRef(null);
    const prevFullscreenRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        // Check initial state
        const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        setIsFullscreen(isFS);
        prevFullscreenRef.current = isFS;

        const handleFullscreenChange = () => {
            const isFS = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            setIsFullscreen(isFS);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
            document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
        };
    }, []);

    // Handle redirection when exiting fullscreen on mobile
    useEffect(() => {
        if (prevFullscreenRef.current === true && isFullscreen === false) {
            if (isMobile) {
                router.push('/games');
            }
        }
        prevFullscreenRef.current = isFullscreen;
        
        // Manage overlay visibility
        if (isMobile && !isFullscreen) {
            setShowMobileOverlay(true);
        } else {
            setShowMobileOverlay(false);
        }
    }, [isFullscreen, isMobile, router]);

    if (!game) {
        notFound();
    }

    const toggleFullscreen = async () => {
        const elem = gameContainerRef.current;
        
        if (!isFullscreen) {
            try {
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    await elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    await elem.msRequestFullscreen();
                } else {
                    // Fallback for iOS/unsupported browsers
                    setIsFullscreen(true);
                }
            } catch (err) {
                console.log("Fullscreen API failed, using CSS fallback", err);
                setIsFullscreen(true);
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                if (document.fullscreenElement) await document.exitFullscreen().catch(() => setIsFullscreen(false));
                else setIsFullscreen(false);
            } else if (document.webkitExitFullscreen) {
                if (document.webkitFullscreenElement) await document.webkitExitFullscreen().catch(() => setIsFullscreen(false));
                else setIsFullscreen(false);
            } else if (document.msExitFullscreen) {
                 if (document.msFullscreenElement) await document.msExitFullscreen().catch(() => setIsFullscreen(false));
                 else setIsFullscreen(false);
            } else {
                setIsFullscreen(false);
            }
        }
    };

    const handleMobileStart = () => {
        toggleFullscreen();
    };

    // Dynamically import the game component with explicit error handling
    const GameComponent = dynamic(() => 
        import(`@/games/${slug}/Game`)
        .then(mod => mod)
        .catch(err => {
            console.error("Failed to load game module:", err);
            return () => (
                <div className="flex flex-col items-center justify-center w-full h-full text-center p-6 text-[var(--destructive)] bg-[var(--destructive)]/10">
                    <h3 className="text-xl font-bold mb-2">Failed to Load Game</h3>
                    <p className="mb-4">Please check your internet connection and try again.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md hover:bg-[var(--accent)]"
                    >
                        Retry
                    </button>
                </div>
            );
        }), 
    {
        loading: () => (
            <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[var(--card)] rounded-xl text-[var(--muted-foreground)] gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse">Loading Game Assets...</p>
            </div>
        ),
        ssr: false
    });

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-4">
            <div className="container mx-auto max-w-[1200px]">

                {/* Navigation & Header */}
                <div className="mb-8">
                    <Link href="/games" className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors mb-6 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Arcade
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{game.name}</h1>
                            <p className="text-[var(--muted-foreground)] max-w-2xl">{game.description}</p>
                        </div>

                        <div className="flex gap-3">
                            <button className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors" title="Restart" onClick={() => window.location.reload()}>
                                <RotateCcw size={20} />
                            </button>
                            <button
                                onClick={toggleFullscreen}
                                className="p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--accent)] text-[var(--foreground)] transition-colors"
                                title="Fullscreen"
                            >
                                <Maximize2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={gameContainerRef}
                    className={`bg-[var(--card)] shadow-2xl overflow-hidden transition-all ${isFullscreen
                        ? "fixed inset-0 z-[9999] w-screen h-screen rounded-none border-none p-0 bg-black"
                        : "w-full rounded-2xl border border-[var(--border)] p-1 relative"
                        }`}
                >
                    {/* Mobile Start Overlay */}
                    {isClient && showMobileOverlay && (
                        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                            <button 
                                onClick={handleMobileStart}
                                className="flex flex-col items-center gap-4 text-white hover:scale-105 transition-transform duration-300"
                            >
                                <div className="p-6 rounded-full bg-blue-600/20 border-2 border-blue-500 animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                                    <Play size={48} fill="currentColor" />
                                </div>
                                <span className="text-xl font-bold tracking-wide">Tap to Play Fullscreen</span>
                            </button>
                        </div>
                    )}

                    {/* Exit Fullscreen Button (Visible only in Fullscreen) */}
                    {isFullscreen && (
                        <button 
                            onClick={toggleFullscreen}
                            className="absolute top-6 right-6 z-[100] p-3 bg-black/50 text-white rounded-full hover:bg-black/80 backdrop-blur-sm border border-white/10 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    )}

                    <div
                        className={`relative w-full overflow-hidden bg-black flex items-center justify-center [&_canvas]:max-w-full [&_canvas]:h-auto [&_canvas]:object-contain ${isFullscreen
                            ? "w-full h-full rounded-none touch-none"
                            : "rounded-xl aspect-video md:aspect-auto md:h-[600px]"
                            }`}
                        style={{
                            height: isFullscreen && isMobile ? '100dvh' : undefined
                        }}
                    >
                        {isClient && <GameComponent />}
                    </div>
                </div>

                {/* Instructions / Controls */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <h2 className="text-xl font-bold mb-4">How to Play</h2>
                        <div className="prose prose-invert max-w-none text-[var(--muted-foreground)]">
                            <p>
                                Welcome to {game.name}! Use your keyboard or touch controls to navigate.
                                The goal is simple: survive as long as possible and beat your high score.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>Use <strong>Arrow Keys</strong> to move.</li>
                                <li>Press <strong>Space</strong> to jump or boost.</li>
                                <li>Collect items for bonus points.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-500" />
                            Leaderboard
                        </h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="text-[var(--muted-foreground)]">{i}. Player{i}</span>
                                    <span className="font-mono font-medium">12,50{i}0</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-[var(--border)] text-center">
                            <span className="text-xs text-[var(--muted-foreground)]">Local High Scores Only</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}