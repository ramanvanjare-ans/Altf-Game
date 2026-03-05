"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, Trophy, Maximize, Minimize, Settings, Pause } from "lucide-react";

/**
 * Game Constants & Config
 */
const LOGICAL_WIDTH = 600;  // Internal resolution
const LOGICAL_HEIGHT = 600; // Internal resolution
const GRID_COLS = 20;       // 20 columns
const GRID_ROWS = 20;       // 20 rows
const CELL_SIZE = LOGICAL_WIDTH / GRID_COLS; // 30px per cell

// Colors
const THEME = {
    bg: "#09090b",
    grid: "#18181b",
    snakeHead: "#22c55e", // Bright Green
    snakeBody: "#16a34a", // Darker Green
    food: "#ef4444",      // Red
    text: "#ffffff"
};

const DIFFICULTY_SETTINGS = {
    EASY: { label: "EASY", speed: 180, points: 10, color: "text-blue-400" },
    MEDIUM: { label: "MEDIUM", speed: 120, points: 20, color: "text-yellow-400" },
    HARD: { label: "HARD", speed: 80, points: 30, color: "text-red-500" }
};

export default function SnakeGame() {
    // Refs for Game Engine (Mutable state without re-renders)
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const lastTimeRef = useRef(0);
    const snakeRef = useRef([]);
    const foodRef = useRef({ x: 0, y: 0 });
    const directionRef = useRef({ x: 0, y: 0 }); // Current moving direction
    const nextDirectionRef = useRef({ x: 0, y: 0 }); // Buffered direction (prevent 180 turn in 1 tick)
    const particlesRef = useRef([]); // Explosion particles
    const scoreRef = useRef(0);
    const isGameOverRef = useRef(false);
    const isPausedRef = useRef(false);
    
    // React State for UI
    const [gameState, setGameState] = useState("START"); // START, PLAYING, PAUSED, GAMEOVER
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [difficulty, setDifficulty] = useState("MEDIUM");
    const [isFullscreen, setIsFullscreen] = useState(false);

    // --- Helpers ---

    // Initialize/Reset Game State
    const initGame = useCallback(() => {
        // Start in middle
        const startX = Math.floor(GRID_COLS / 2);
        const startY = Math.floor(GRID_ROWS / 2);
        
        snakeRef.current = [
            { x: startX, y: startY },
            { x: startX, y: startY + 1 },
            { x: startX, y: startY + 2 },
        ];
        
        directionRef.current = { x: 0, y: -1 }; // Moving Up
        nextDirectionRef.current = { x: 0, y: -1 };
        
        spawnFood();
        particlesRef.current = [];
        scoreRef.current = 0;
        setScore(0);
        isGameOverRef.current = false;
        isPausedRef.current = false;
        lastTimeRef.current = 0;
    }, []);

    // --- Safe Zone Logic ---
    // Ensure food doesn't spawn too close to edges on small screens/windows
    // This prevents the "invisible food" issue where UI or borders might clip it.
    const spawnFood = () => {
        let valid = false;
        let pos = { x: 0, y: 0 };
        
        // Safety break to prevent infinite loop
        let attempts = 0;
        
        // Define safe margin (4 cells from edge to prevent clipping)
    // Increased to 4 based on user feedback about visibility on small screens
    const margin = 4;
    
    while (!valid && attempts < 500) {
            attempts++;
            // Random position within safe margins
            pos.x = Math.floor(Math.random() * (GRID_COLS - 2 * margin)) + margin;
            pos.y = Math.floor(Math.random() * (GRID_ROWS - 2 * margin)) + margin;
            
            // Check collision with snake
            const collision = snakeRef.current.some(s => s.x === pos.x && s.y === pos.y);
            if (!collision) valid = true;
        }
        
        // Fallback if full (unlikely)
        if (!valid) {
            // Find first empty spot within safe margin
            for (let r=margin; r<GRID_ROWS-margin; r++) {
                for (let c=margin; c<GRID_COLS-margin; c++) {
                    if (!snakeRef.current.some(s => s.x === c && s.y === r)) {
                        pos = { x: c, y: r };
                        valid = true;
                        break;
                    }
                }
                if (valid) break;
            }
        }
        
        foodRef.current = pos;
    };

    const createParticles = (x, y, color) => {
        for (let i = 0; i < 8; i++) {
            particlesRef.current.push({
                x: x * CELL_SIZE + CELL_SIZE / 2,
                y: y * CELL_SIZE + CELL_SIZE / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color: color
            });
        }
    };

    // --- Game Loop ---

    const update = (timestamp) => {
        if (isGameOverRef.current || isPausedRef.current) return;

        // Speed control
        const speed = DIFFICULTY_SETTINGS[difficulty].speed;
        if (timestamp - lastTimeRef.current < speed) return;
        
        lastTimeRef.current = timestamp;

        // Move Snake
        directionRef.current = nextDirectionRef.current;
        const { x: dx, y: dy } = directionRef.current;
        const head = snakeRef.current[0];
        const newHead = { x: head.x + dx, y: head.y + dy };

        // 1. Wall Collision Check
        if (newHead.x < 0 || newHead.x >= GRID_COLS || newHead.y < 0 || newHead.y >= GRID_ROWS) {
            handleGameOver();
            return;
        }

        // 2. Self Collision Check
        // Note: We don't check the tail because it will move unless we eat
        // But checking all segments is safer, usually index 0 is head, so start from 1? 
        // Actually, if we hit the tail tip which is about to move, it's fine. 
        // But simplified: check all except last if not eating. 
        // Let's just check all existing body parts.
        for (let i = 0; i < snakeRef.current.length - 1; i++) {
             if (newHead.x === snakeRef.current[i].x && newHead.y === snakeRef.current[i].y) {
                 handleGameOver();
                 return;
             }
        }

        // 3. Move Logic
        const newSnake = [newHead, ...snakeRef.current];
        
        // 4. Eat Check
        if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
            // Eaten!
            scoreRef.current += DIFFICULTY_SETTINGS[difficulty].points;
            setScore(scoreRef.current);
            createParticles(newHead.x, newHead.y, THEME.food);
            spawnFood();
            // Don't pop tail -> snake grows
        } else {
            // Normal move -> pop tail
            newSnake.pop();
        }

        snakeRef.current = newSnake;
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        
        // Clear
        ctx.fillStyle = THEME.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Grid (Subtle)
        ctx.strokeStyle = THEME.grid;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= GRID_COLS; i++) {
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, LOGICAL_HEIGHT);
        }
        for (let i = 0; i <= GRID_ROWS; i++) {
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(LOGICAL_WIDTH, i * CELL_SIZE);
        }
        ctx.stroke();

        // Draw Food (Apple)
        const { x: fx, y: fy } = foodRef.current;
        const cx = fx * CELL_SIZE + CELL_SIZE / 2;
        const cy = fy * CELL_SIZE + CELL_SIZE / 2;
        const r = CELL_SIZE / 2 - 4;
        
        // Glow
        ctx.shadowColor = THEME.food;
        ctx.shadowBlur = 15;
        ctx.fillStyle = THEME.food;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Apple Stem (detail)
        ctx.fillStyle = "#4ade80"; // green stem
        ctx.fillRect(cx - 2, cy - r - 2, 4, 4);

        // Draw Snake
        snakeRef.current.forEach((seg, i) => {
            const isHead = i === 0;
            const px = seg.x * CELL_SIZE;
            const py = seg.y * CELL_SIZE;
            
            ctx.fillStyle = isHead ? THEME.snakeHead : THEME.snakeBody;
            
            // Rounded Rect
            ctx.beginPath();
            ctx.roundRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2, isHead ? 8 : 4);
            ctx.fill();

            // Eyes for head
            if (isHead) {
                ctx.fillStyle = "black";
                const eyeOffset = 6;
                const eyeSize = 4;
                
                // Determine eye position based on direction
                const d = directionRef.current;
                let ex1, ey1, ex2, ey2;
                
                if (d.x === 1) { // Right
                    ex1 = px + CELL_SIZE - eyeOffset; ey1 = py + eyeOffset;
                    ex2 = px + CELL_SIZE - eyeOffset; ey2 = py + CELL_SIZE - eyeOffset - eyeSize;
                } else if (d.x === -1) { // Left
                    ex1 = px + eyeOffset; ey1 = py + eyeOffset;
                    ex2 = px + eyeOffset; ey2 = py + CELL_SIZE - eyeOffset - eyeSize;
                } else if (d.y === -1) { // Up
                    ex1 = px + eyeOffset; ey1 = py + eyeOffset;
                    ex2 = px + CELL_SIZE - eyeOffset - eyeSize; ey2 = py + eyeOffset;
                } else { // Down or stationary
                    ex1 = px + eyeOffset; ey1 = py + CELL_SIZE - eyeOffset;
                    ex2 = px + CELL_SIZE - eyeOffset - eyeSize; ey2 = py + CELL_SIZE - eyeOffset;
                }
                
                ctx.fillRect(ex1, ey1, eyeSize, eyeSize);
                ctx.fillRect(ex2, ey2, eyeSize, eyeSize);
            }
        });

        // Draw Particles
        particlesRef.current.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            
            if (p.life > 0) {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            } else {
                particlesRef.current.splice(i, 1);
            }
        });
    };

    const handleGameOver = () => {
        isGameOverRef.current = true;
        setGameState("GAME_OVER");
        if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem("snake_highscore", scoreRef.current);
        }
    };

    const loop = (time) => {
        update(time);
        draw();
        requestRef.current = requestAnimationFrame(loop);
    };

    // --- Effects ---

    // Load Highscore
    useEffect(() => {
        const saved = localStorage.getItem("snake_highscore");
        if (saved) setHighScore(parseInt(saved));
        // Initial Render
        initGame();
        draw();
        // Don't start loop yet
        return () => cancelAnimationFrame(requestRef.current);
    }, []);

    // Game Loop Management
    useEffect(() => {
        if (gameState === "PLAYING") {
            requestRef.current = requestAnimationFrame(loop);
        } else {
            cancelAnimationFrame(requestRef.current);
            draw(); // Draw once to show frozen state
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, difficulty]);

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== "PLAYING") return;
            
            const key = e.key;
            const current = directionRef.current;
            
            // Prevent scrolling
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) {
                e.preventDefault();
            }

            if (key === "ArrowUp" && current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
            if (key === "ArrowDown" && current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
            if (key === "ArrowLeft" && current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
            if (key === "ArrowRight" && current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState]);

    // Touch/Swipe/Click Controls
    const touchStartRef = useRef(null);
    
    const handleTouchStart = (e) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchMove = (e) => {
        if (!touchStartRef.current) return;
        // Prevent scroll while swiping inside game
        e.preventDefault(); 
    };

    const handleTouchEnd = (e) => {
        if (!touchStartRef.current) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = endX - touchStartRef.current.x;
        const diffY = endY - touchStartRef.current.y;
        
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        
        const current = directionRef.current;

        // Min swipe distance
        if (Math.max(absX, absY) > 30) {
            if (absX > absY) {
                // Horizontal
                if (diffX > 0 && current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
                else if (diffX < 0 && current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
            } else {
                // Vertical
                if (diffY > 0 && current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
                else if (diffY < 0 && current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
            }
        }
        
        touchStartRef.current = null;
    };

    // Click to Turn (Desktop/Mouse Fallback)
    const handleCanvasClick = (e) => {
        if (gameState !== "PLAYING") return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const current = directionRef.current;

        // Determine click quadrant relative to center
        // This is a simple 4-way control: Top, Bottom, Left, Right of center
        
        const diffX = x - centerX;
        const diffY = y - centerY;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal Click
            if (diffX > 0 && current.x === 0) nextDirectionRef.current = { x: 1, y: 0 }; // Right
            else if (diffX < 0 && current.x === 0) nextDirectionRef.current = { x: -1, y: 0 }; // Left
        } else {
            // Vertical Click
            if (diffY > 0 && current.y === 0) nextDirectionRef.current = { x: 0, y: 1 }; // Down
            else if (diffY < 0 && current.y === 0) nextDirectionRef.current = { x: 0, y: -1 }; // Up
        }
    };

    // --- Resize Logic ---
    const containerRef = useRef(null);
    const [boardSize, setBoardSize] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                // Calculate max square size
                // On desktop (large screens), we want to maximize size, so we reduce padding
                const isDesktop = window.innerWidth >= 1024;
                const padding = isDesktop ? 8 : 32; // 4px each side on desktop, 16px on mobile
                
                const size = Math.min(width, height) - padding;
                setBoardSize(Math.max(300, size)); // Min 300px
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // --- UI Handlers ---
    const handleStart = () => {
        initGame();
        setGameState("PLAYING");
    };

    const handleTogglePause = () => {
        if (gameState === "PLAYING") {
            setGameState("PAUSED");
            isPausedRef.current = true;
        } else if (gameState === "PAUSED") {
            setGameState("PLAYING");
            isPausedRef.current = false;
        }
    };

    return (
        <div 
            ref={element => {
                if (element && isFullscreen && document.fullscreenElement !== element) {
                    element.requestFullscreen().catch(() => {});
                }
            }}
            className="w-full h-full flex flex-col bg-zinc-950 overflow-hidden select-none"
        >
            {/* Header - Fixed Height */}
            <div className="w-full px-6 py-4 flex justify-between items-center z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <Trophy className="text-yellow-400" size={24} />
                    <div>
                        <div className="text-xs text-zinc-400 font-bold tracking-widest">BEST</div>
                        <div className="text-xl font-black text-white leading-none">{highScore}</div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                        <div className="text-xs text-zinc-400 font-bold tracking-widest">SCORE</div>
                        <div className="text-xl font-black text-white leading-none">{score}</div>
                    </div>
                    
                    {gameState !== "START" && gameState !== "GAME_OVER" && (
                        <button 
                            onClick={handleTogglePause}
                            className="p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition"
                        >
                            {gameState === "PAUSED" ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Flexible Game Area - Auto Resizing */}
            <div ref={containerRef} className="flex-1 w-full min-h-0 flex items-center justify-center p-4 lg:p-1">
                <div 
                    className="relative group rounded-xl shadow-2xl overflow-hidden border border-zinc-800 bg-zinc-900"
                    style={{
                        width: boardSize,
                        height: boardSize,
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        width={LOGICAL_WIDTH}
                        height={LOGICAL_HEIGHT}
                        className="w-full h-full cursor-pointer touch-none block"
                        style={{ 
                            imageRendering: "pixelated",
                            touchAction: "none"
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleCanvasClick}
                    />

                    {/* Overlays */}
                    {gameState === "START" && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300">
                            <h1 className="text-5xl font-black text-white mb-2 tracking-tighter">SNAKE</h1>
                            <p className="text-zinc-400 mb-8">Swipe or use Arrow Keys to eat</p>
                            
                            {/* Difficulty Selector */}
                            <div className="flex gap-2 mb-8">
                                {Object.entries(DIFFICULTY_SETTINGS).map(([key, setting]) => (
                                    <button
                                        key={key}
                                        onClick={() => setDifficulty(key)}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${
                                            difficulty === key 
                                            ? `${setting.color} border-current bg-white/10` 
                                            : "text-zinc-500 border-transparent hover:bg-zinc-800"
                                        }`}
                                    >
                                        {setting.label}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={handleStart}
                                className="group relative px-8 py-3 bg-white text-black font-black text-lg rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                            >
                                <span className="flex items-center gap-2">
                                    <Play size={24} fill="currentColor" />
                                    START GAME
                                </span>
                            </button>
                        </div>
                    )}

                    {gameState === "GAME_OVER" && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95 duration-300">
                            <div className="text-6xl mb-2">💀</div>
                            <h2 className="text-3xl font-black text-red-500 mb-2">GAME OVER</h2>
                            <div className="text-white text-xl font-bold mb-8">
                                Score: <span className="text-yellow-400">{score}</span>
                            </div>
                            
                            <button 
                                onClick={handleStart}
                                className="px-8 py-3 bg-white text-black font-black text-lg rounded-full hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <RotateCcw size={20} />
                                TRY AGAIN
                            </button>
                        </div>
                    )}
                    
                    {gameState === "PAUSED" && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-zinc-900 border border-zinc-700 px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4">
                                <Pause className="text-white animate-pulse" size={32} />
                                <span className="text-xl font-bold text-white tracking-widest">PAUSED</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer / Hints - Fixed Height */}
            <div className="pb-4 text-center shrink-0">
                <div className="text-zinc-500 text-sm font-medium opacity-50 hidden md:block">
                    Use Arrow Keys to Move • Space to Pause
                </div>
                <div className="text-zinc-500 text-sm font-medium opacity-50 md:hidden">
                    Swipe to Change Direction
                </div>
            </div>
        </div>
    );
}
