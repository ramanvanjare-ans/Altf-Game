import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Zap, RefreshCw, Layers } from 'lucide-react';

const StackTower = () => {
    const canvasRef = useRef(null);
    const gameAreaRef = useRef(null);
    const requestRef = useRef(null);
    const lastTimeRef = useRef(0);

    // Logic constants (fixed coordinate system)
    const LOGIC_WIDTH = 400;
    const LOGIC_HEIGHT = 600;
    const BASE_BLOCK_WIDTH = 200;
    const BLOCK_HEIGHT = 30;
    const BASE_SPEED = 150;
    const SPEED_INCREMENT = 10;
    const MAX_SPEED = 400;
    const MIN_BLOCK_WIDTH = 20;
    const PERFECT_THRESHOLD = 5;

    // Game state
    const [gameState, setGameState] = useState('ready'); // ready, playing, gameOver
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 });
    const [scale, setScale] = useState(1);

    // Game objects refs
    const stackedBlocksRef = useRef([]);
    const currentBlockRef = useRef(null);
    const fallingPiecesRef = useRef([]);
    const particlesRef = useRef([]);
    const inputLockedRef = useRef(false);
    const cameraOffsetRef = useRef(0);
    const lastActionTimeRef = useRef(0);
    const lastProcessedLevelRef = useRef(-1); // Level-lock guard
    const isTransitioningRef = useRef(false); // Async transition delay

    // Initialize game
    const initGame = useCallback(() => {
        stackedBlocksRef.current = [{
            x: LOGIC_WIDTH / 2 - BASE_BLOCK_WIDTH / 2,
            width: BASE_BLOCK_WIDTH,
            level: 0,
            isPerfect: false
        }];

        currentBlockRef.current = {
            x: 0,
            width: BASE_BLOCK_WIDTH,
            speed: BASE_SPEED,
            direction: 1,
            level: 1
        };

        fallingPiecesRef.current = [];
        particlesRef.current = [];
        inputLockedRef.current = false;
        lastActionTimeRef.current = 0;
        lastProcessedLevelRef.current = -1;
        isTransitioningRef.current = false;

        setScore(0);
        setCombo(0);
        setGameState('playing');
    }, []);

    // Resize Handler - Matching Knife Hit's responsive Logic
    useEffect(() => {
        const updateCanvasSize = () => {
            if (!gameAreaRef.current) return;
            const area = gameAreaRef.current;
            const availWidth = area.clientWidth;
            const availHeight = area.clientHeight;

            // Maintain 2:3 aspect ratio, but max out available space
            const aspect = LOGIC_WIDTH / LOGIC_HEIGHT;
            let newWidth = availWidth;
            let newHeight = availWidth / aspect;

            if (newHeight > availHeight) {
                newHeight = availHeight;
                newWidth = availHeight * aspect;
            }

            // Gap padding
            newWidth *= 0.95;
            newHeight *= 0.95;

            setCanvasSize({ width: newWidth, height: newHeight });
            setScale(newWidth / LOGIC_WIDTH);
        };

        updateCanvasSize();
        const observer = new ResizeObserver(updateCanvasSize);
        if (gameAreaRef.current) observer.observe(gameAreaRef.current);
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            observer.disconnect();
        };
    }, []);

    // --- GAME LOGIC (Operates in LOGIC_WIDTH/HEIGHT coords) ---

    const updateGame = (dt) => {
        if (!currentBlockRef.current) return;

        // Move Current Block
        const block = currentBlockRef.current;
        block.x += block.speed * block.direction * dt;

        if (block.x <= 0) {
            block.x = 0;
            block.direction = 1;
        } else if (block.x + block.width >= LOGIC_WIDTH) {
            block.x = LOGIC_WIDTH - block.width;
            block.direction = -1;
        }

        // Camera
        const currentBlockY = LOGIC_HEIGHT - ((block.level + 1) * BLOCK_HEIGHT);
        const targetOffset = Math.max(0, -currentBlockY + LOGIC_HEIGHT * 0.6);
        cameraOffsetRef.current += (targetOffset - cameraOffsetRef.current) * 0.1;

        // cleanup off-screen blocks (Performance Optimization)
        if (stackedBlocksRef.current.length > 15) {
            const bottomBlock = stackedBlocksRef.current[0];
            const bottomBlockY = LOGIC_HEIGHT - ((bottomBlock.level + 1) * BLOCK_HEIGHT);
            const screenY = bottomBlockY + cameraOffsetRef.current;
            // If block is well below the screen (screenY > LOGIC_HEIGHT), remove it
            if (screenY > LOGIC_HEIGHT + 200) {
                stackedBlocksRef.current.shift();
            }
        }

        // Physics for debris
        fallingPiecesRef.current.forEach(p => {
            p.y += 400 * dt;
            p.rotation += p.rotationSpeed * dt;
        });
        // Strict limit on pieces
        if (fallingPiecesRef.current.length > 20) fallingPiecesRef.current.shift();
        fallingPiecesRef.current = fallingPiecesRef.current.filter(p => p.y < LOGIC_HEIGHT + cameraOffsetRef.current + 100);

        // Physics for particles
        particlesRef.current.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += 800 * dt;
            p.life -= dt * 2.0; // Faster decay for performance
        });
        // Strict limit on particles
        if (particlesRef.current.length > 60) particlesRef.current.splice(0, particlesRef.current.length - 60);
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    };

    const placeBlock = useCallback(() => {
        if (inputLockedRef.current || isTransitioningRef.current || !currentBlockRef.current || gameState !== 'playing') return;

        const curr = currentBlockRef.current;

        // LEVEL LOCK: Prevent double processing of the same level
        if (curr.level <= lastProcessedLevelRef.current) return;
        lastProcessedLevelRef.current = curr.level;

        inputLockedRef.current = true;
        isTransitioningRef.current = true;

        const prev = stackedBlocksRef.current[stackedBlocksRef.current.length - 1];

        const dist = curr.x - prev.x;
        const isPerfect = Math.abs(dist) <= PERFECT_THRESHOLD;

        let newX = curr.x;
        let newWidth = curr.width;

        if (isPerfect) {
            newX = prev.x; // Snap
            setCombo(c => c + 1);
        } else {
            setCombo(0);
            const overlap = prev.width - Math.abs(dist);
            if (overlap <= 0 || overlap < MIN_BLOCK_WIDTH) {
                setGameState('gameOver');
                setHighScore(h => Math.max(h, score));
                return;
            }
            newWidth = overlap;
            newX = Math.max(curr.x, prev.x);

            // Debris
            const debrisX = dist > 0 ? newX + newWidth : curr.x;
            const debrisW = curr.width - newWidth;
            fallingPiecesRef.current.push({
                x: debrisX,
                y: LOGIC_HEIGHT - (curr.level * BLOCK_HEIGHT),
                width: debrisW,
                height: BLOCK_HEIGHT,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 5,
                color: getBlockColor(curr.level)
            });
        }

        // Add block
        stackedBlocksRef.current.push({
            x: newX,
            width: newWidth,
            level: curr.level,
            isPerfect
        });

        setScore(s => s + 1);

        // Next block
        const nextLvl = curr.level + 1;
        currentBlockRef.current = {
            x: Math.random() > 0.5 ? 0 : LOGIC_WIDTH - newWidth,
            width: newWidth,
            speed: Math.min(BASE_SPEED + nextLvl * SPEED_INCREMENT, MAX_SPEED),
            direction: Math.random() > 0.5 ? 1 : -1,
            level: nextLvl
        };

        // Particles
        const cx = newX + newWidth / 2;
        const cy = LOGIC_HEIGHT - (curr.level * BLOCK_HEIGHT);
        spawnParticles(cx, cy, isPerfect ? '#fbbf24' : '#60a5fa');

        inputLockedRef.current = false;

        // Brief delay before allowing NEXT placement to let the new block enter
        setTimeout(() => {
            isTransitioningRef.current = false;
        }, 200);
    }, [gameState, score]);

    const spawnParticles = (x, y, color) => {
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const sped = 50 + Math.random() * 100;
            particlesRef.current.push({
                x, y,
                vx: Math.cos(angle) * sped,
                vy: Math.sin(angle) * sped,
                life: 1.0, color
            });
        }
    };

    const getBlockColor = (level) => {
        const hue = (level * 25) % 360;
        return `hsl(${hue}, 70%, 60%)`;
    };

    // --- RENDER LOOP ---
    const draw = (ctx) => {
        ctx.clearRect(0, 0, LOGIC_WIDTH, LOGIC_HEIGHT);

        // Camera transform
        ctx.save();
        ctx.translate(0, cameraOffsetRef.current);

        // Stacked - Optimize: Only shadow top blocks
        const stackLength = stackedBlocksRef.current.length;

        stackedBlocksRef.current.forEach((b, i) => {
            // Only calculate complex visuals for visible blocks roughly
            const y = LOGIC_HEIGHT - ((b.level + 1) * BLOCK_HEIGHT);

            // Simple visibility check before drawing
            if (y + cameraOffsetRef.current < -50 || y + cameraOffsetRef.current > LOGIC_HEIGHT + 50) return;

            ctx.fillStyle = b.isPerfect && b.level > 0 ? '#fbbf24' : getBlockColor(b.level);
            if (b.level === 0) ctx.fillStyle = '#475569';

            // Shadow only for top 3 blocks for performance
            if (i > stackLength - 4) {
                ctx.shadowColor = 'rgba(0,0,0,0.3)';
                ctx.shadowBlur = 10;
            } else {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }

            ctx.fillRect(b.x, y, b.width, BLOCK_HEIGHT);
            ctx.shadowBlur = 0; // Reset immediately

            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(b.x, y, b.width, 4);

            if (b.isPerfect && b.level > 0) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 1;
                ctx.strokeRect(b.x, y, b.width, BLOCK_HEIGHT);
            }
        });

        // Current
        if (currentBlockRef.current && gameState === 'playing') {
            const b = currentBlockRef.current;
            const y = LOGIC_HEIGHT - ((b.level + 1) * BLOCK_HEIGHT);
            ctx.fillStyle = getBlockColor(b.level);

            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 15;
            ctx.fillRect(b.x, y, b.width, BLOCK_HEIGHT);
            ctx.shadowBlur = 0;

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillRect(b.x, y, b.width, 4);
        }

        // Falling
        fallingPiecesRef.current.forEach(p => {
            ctx.save();
            ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color || '#fff';
            ctx.globalAlpha = 0.6;
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
            ctx.restore();
        });

        // Particles
        particlesRef.current.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); // Smaller radius for speed
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        ctx.restore();
    };

    useEffect(() => {
        const animate = (time) => {
            const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
            lastTimeRef.current = time;

            if (gameState === 'playing') updateGame(dt);

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                // Auto-scaling via transform in draw causes issues with clearing. 
                // Better to scale context once per frame based on current canvas size? 
                // No, we set canvas dimension to actual pixel size.
                // So we must scale context to map LOGIC coords -> ACTUAL coords.
                ctx.resetTransform();
                ctx.scale(scale, scale);
                draw(ctx);
            }
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, scale]);

    // Handle Input
    const handleAction = useCallback((e) => {
        if (e) {
            // Check if this is a redundant event (e.g. click following touch)
            const now = Date.now();
            if (now - lastActionTimeRef.current < 300) {
                return;
            }
            lastActionTimeRef.current = now;

            // Prevent default behavior if possible (helps mobile responsiveness)
            if (typeof e.preventDefault === 'function') {
                try { e.preventDefault(); } catch (err) { }
            }
        }

        if (gameState === 'ready' || gameState === 'gameOver') {
            initGame();
        } else {
            placeBlock();
        }
    }, [gameState, initGame, placeBlock]);

    useEffect(() => {
        const kd = (e) => { if (e.code === 'Space') handleAction(e); };
        window.addEventListener('keydown', kd);
        return () => window.removeEventListener('keydown', kd);
    }, [handleAction]);

    return (
        <div className="h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col overflow-hidden font-sans select-none relative">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@600;700&display=swap');
                body { font-family: 'Rajdhani', sans-serif; margin: 0; padding: 0; overflow: hidden; }
                .orbitron { font-family: 'Orbitron', sans-serif; }
                .glass-panel {
                    background: rgba(30, 41, 59, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }
                .neon-text { text-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }
                .animate-pulse-soft { animation: pulse 2s infinite; }
                @keyframes pulse { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
            `}</style>

            {/* HEADER */}
            <header className="flex-none w-full px-4 py-3 sm:px-8 sm:py-4 flex justify-between items-center z-20 glass-panel border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30 animate-pulse-soft">
                        <Layers className="text-blue-400" size={24} />
                    </div>
                    <div>
                        <h1 className="orbitron text-xl sm:text-2xl font-black text-white neon-text tracking-widest leading-none">
                            STACK TOWER
                        </h1>
                        <div className="text-blue-300/80 text-xs font-bold tracking-wider">
                            ARCADE MODE
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-xs text-blue-300/60 font-bold tracking-wider mb-0.5">SCORE</div>
                        <div className="orbitron text-3xl font-black text-white leading-none">{score}</div>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-green-300/60 font-bold tracking-wider mb-0.5">HIGH</div>
                        <div className="orbitron text-3xl font-black text-green-400 leading-none">{highScore}</div>
                    </div>
                </div>
            </header>

            {/* GAME AREA - Isolated interaction container */}
            <main ref={gameAreaRef}
                className="flex-1 w-full relative flex items-center justify-center overflow-hidden"
                onMouseDown={handleAction}
                onTouchStart={handleAction}>

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="rounded-lg shadow-2xl touch-none"
                    style={{
                        width: canvasSize.width,
                        height: canvasSize.height,
                        boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                    }}
                />
            </main>

            {/* UI OVERLAY LAYER - Outside <main> to prevent bubbling issues */}
            <div className="absolute inset-x-0 top-[60px] bottom-[80px] pointer-events-none z-30 flex items-center justify-center">

                {/* Overlays */}
                {gameState === 'ready' && (
                    <div className="pointer-events-auto flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm">
                        <div className="glass-panel p-8 rounded-2xl text-center animate-bounce border border-blue-500/30">
                            <h2 className="orbitron text-4xl text-white mb-2">READY?</h2>
                            <p className="text-blue-200 text-sm tracking-widest">TAP TO START</p>
                            <button onClick={(e) => { e.stopPropagation(); initGame(); }}
                                className="mt-4 px-6 py-2 bg-blue-600 rounded-lg text-white font-bold orbitron text-sm">
                                GO!
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'gameOver' && (
                    <div className="pointer-events-auto flex items-center justify-center w-full h-full bg-black/80 backdrop-blur-md">
                        <div className="glass-panel p-8 rounded-3xl text-center max-w-sm mx-4 border border-red-500/30 animate-in zoom-in duration-300">
                            <h2 className="orbitron text-5xl font-black text-red-500 mb-2 neon-text">CRASHED</h2>
                            <p className="text-red-200 mb-6 font-bold tracking-wide">FINAL SCORE: {score}</p>

                            <button onClick={(e) => { e.stopPropagation(); initGame(); }}
                                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-black py-4 px-8 rounded-xl text-xl orbitron flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg">
                                <RefreshCw size={22} /> RETRY
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <footer className="flex-none w-full p-4 z-20 glass-panel border-t border-white/5">
                <div className="max-w-4xl mx-auto flex justify-center items-center">
                    <p className="text-white/40 text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2">
                        <span className="hidden sm:inline">TAP OR SPACE TO STACK</span>
                        <span className="sm:hidden">TAP TO STACK</span>
                        <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                        <span className={combo > 0 ? "text-yellow-400 font-bold animate-pulse" : "text-white/40"}>
                            COMBO: {combo}
                        </span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default StackTower;