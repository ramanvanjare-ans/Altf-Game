"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    RotateCcw, Trophy, Maximize, Minimize,
    Eraser, Undo2, Lightbulb, Pencil, Play, Pause, Settings
} from "lucide-react";
import { generateSudoku, isValidMove, solveSudoku as helperSolve } from "./sudokuUtils";

/**
 * Sudoku Master Game Component
 */

const DIFFICULTY_SETTINGS = {
    EASY: { label: "EASY", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/50" },
    MEDIUM: { label: "MEDIUM", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/50" },
    HARD: { label: "HARD", color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/50" },
    EXPERT: { label: "EXPERT", color: "text-violet-400", bg: "bg-violet-500/20", border: "border-violet-500/50" }
};

const MAX_MISTAKES = 3;

export default function SudokuGame({ isPreview = false }) {
    // --- State ---
    const [difficulty, setDifficulty] = useState("MEDIUM");
    const [board, setBoard] = useState([]);         // Current values
    const [initialBoard, setInitialBoard] = useState([]); // Fixed values
    const [solution, setSolution] = useState([]);   // Solution for validation
    const [notes, setNotes] = useState([]);         // 9x9 array of Sets
    const [selectedCell, setSelectedCell] = useState(null); // {r, c}

    const [mistakes, setMistakes] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isNoteMode, setIsNoteMode] = useState(false);
    const [history, setHistory] = useState([]);

    const [gameState, setGameState] = useState("LOADING"); // LOADING, PLAYING, WON, GAME_OVER
    const [highScore, setHighScore] = useState(0); // Best time (lower is better)?? Or points? Let's do completed games count or just 'best time' for diff.
    const [isFullscreen, setIsFullscreen] = useState(false);

    const containerRef = useRef(null);
    const timerRef = useRef(null);

    // --- Initialization ---

    const startNewGame = useCallback((diff = difficulty) => {
        // Mobile Fullscreen Auto-Trigger - ONLY if not preview
        /*
        const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
        if (isMobile && !document.fullscreenElement && containerRef.current && !isPreview) {
            containerRef.current.requestFullscreen().catch(err => console.log("Fullscreen request failed:", err));
        }
        */

        const { initialBoard: init, playableBoard: play, solution: sol } = generateSudoku(diff);

        setInitialBoard(init);
        setBoard(play);
        setSolution(sol);
        setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set())));
        setMistakes(0);
        setTimer(0);
        setHistory([]);
        setIsPaused(false);
        setGameState("PLAYING");
        setSelectedCell(null);
    }, [difficulty]);

    useEffect(() => {
        if (isPreview) {
            // Visualize a static board or simple demo
            // eslint-disable-next-line react-hooks/set-state-in-effect
            startNewGame("MEDIUM"); // Or maybe just generate one
            setIsPaused(true); // Don't run timer in preview
        } else {
            startNewGame();
        }
    }, [isPreview, startNewGame]); // Run once on mount (or when preview changes to real?)

    // --- Timer ---
    useEffect(() => {
        if (gameState === "PLAYING" && !isPaused && !isPreview) {
            timerRef.current = setInterval(() => {
                setTimer(t => t + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [gameState, isPaused, isPreview]);

    // --- Helpers ---
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const isFixed = useCallback((r, c) => initialBoard[r] && initialBoard[r][c] !== null, [initialBoard]);

    const checkWin = useCallback((currentBoard) => {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (currentBoard[r][c] === null || currentBoard[r][c] !== solution[r][c]) return false;
            }
        }
        return true;
    }, [solution]);

    // --- Interaction ---

    const handleCellClick = (r, c) => {
        if (gameState !== "PLAYING" || isPaused) return;
        setSelectedCell({ r, c });
    };

    const handleNumberInput = useCallback((num) => {
        if (gameState !== "PLAYING" || isPaused || !selectedCell) return;
        const { r, c } = selectedCell;

        if (isFixed(r, c)) return;

        // Note Mode
        if (isNoteMode) {
            const newNotes = [...notes]; // Shallow copy grid
            newNotes[r] = [...newNotes[r]]; // Copy row
            const cellNotes = new Set(newNotes[r][c]); // Copy set

            if (cellNotes.has(num)) cellNotes.delete(num);
            else cellNotes.add(num);

            newNotes[r][c] = cellNotes;
            setNotes(newNotes);
            return;
        }

        // Normal Move
        if (board[r][c] === num) return; // No change

        // Validation
        const isCorrect = solution[r][c] === num;

        if (!isCorrect) {
            setMistakes(m => {
                const newM = m + 1;
                if (newM >= MAX_MISTAKES) setGameState("GAME_OVER");
                return newM;
            });
            // Don't fill it in if wrong? Or fill in red? 
            // Standard is: fill in red, or just flash error. 
            // Let's Flash error logic by not updating board, just mistakes.
            // OR update board and show red. Let's update board to show User input.
        }

        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = num;

        // Save history first
        setHistory(prev => [...prev.slice(-20), { board, notes, mistakes }]); // Limit history
        setBoard(newBoard);

        if (isCorrect && checkWin(newBoard)) {
            setGameState("WON");
        }
    }, [gameState, isPaused, selectedCell, board, isFixed, isNoteMode, notes, solution, checkWin, mistakes]);

    const handleErase = useCallback(() => {
        if (gameState !== "PLAYING" || isPaused || !selectedCell) return;
        const { r, c } = selectedCell;
        if (isFixed(r, c)) return;

        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = null;
        setBoard(newBoard);
    }, [gameState, isPaused, selectedCell, board, isFixed]);

    const handleUndo = () => {
        if (history.length === 0) return;
        const last = history[history.length - 1];
        setBoard(last.board);
        setNotes(last.notes);
        // setMistakes(last.mistakes); // Maybe undo mistakes too?
        setHistory(prev => prev.slice(0, -1));
    };

    const handleHint = () => {
        if (gameState !== "PLAYING" || isPaused || !selectedCell) return;
        const { r, c } = selectedCell;
        if (board[r][c] !== null) return; // Already filled

        const correctNum = solution[r][c];
        handleNumberInput(correctNum); // Will process as correct input
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== "PLAYING" || isPaused) return;

            // Numbers
            if (e.key >= '1' && e.key <= '9') {
                handleNumberInput(parseInt(e.key));
                return;
            }
            if (e.key === 'Backspace' || e.key === 'Delete') {
                handleErase();
                return;
            }

            // Arrow Navigation
            if (selectedCell) {
                const { r, c } = selectedCell;
                if (e.key === 'ArrowUp') setSelectedCell({ r: Math.max(0, r - 1), c });
                if (e.key === 'ArrowDown') setSelectedCell({ r: Math.min(8, r + 1), c });
                if (e.key === 'ArrowLeft') setSelectedCell({ r, c: Math.max(0, c - 1) });
                if (e.key === 'ArrowRight') setSelectedCell({ r, c: Math.min(8, c + 1) });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, isPaused, selectedCell, isNoteMode, board, handleNumberInput, handleErase]); // Add deps


    // --- Render Helpers ---

    const getCellColor = (r, c, val) => {
        const isSelected = selectedCell?.r === r && selectedCell?.c === c;
        const isSameNumber = val !== null && selectedCell && board[selectedCell.r][selectedCell.c] === val;
        const isRelated = selectedCell && (selectedCell.r === r || selectedCell.c === c ||
            (Math.floor(selectedCell.r / 3) === Math.floor(r / 3) && Math.floor(selectedCell.c / 3) === Math.floor(c / 3)));

        let classes = "bg-zinc-900"; // default

        if (isSelected) classes = "bg-blue-600/80 text-white";
        else if (isSameNumber) classes = "bg-blue-600/40 text-blue-100";
        else if (isRelated) classes = "bg-zinc-800";

        if (val !== null && isFixed(r, c)) classes += " font-bold";
        else if (val !== null) classes += " text-blue-400 font-medium"; // User filled

        // Error check (if user filled wrong)
        if (val !== null && !isFixed(r, c) && val !== solution[r][c]) {
            if (isSelected) classes = "bg-red-500 text-white"; // Highlight selected error
            else classes += " text-red-500 bg-red-500/10";
        }

        return classes;
    };

    return (
        <div ref={containerRef} className="relative w-full h-full bg-zinc-950 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden font-sans select-none text-zinc-100 p-2 md:p-4 gap-4 md:gap-8 justify-center items-center">

            {/* BACKGROUND DECORATION */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />

            {/* LEFT PANEL: BOARD */}
            <div className="relative z-10 flex flex-col items-center gap-4 animate-in slide-in-from-left-5 duration-700">
                {/* Header Info (Mobile friendly) */}
                <div className="w-full flex justify-between items-center text-sm md:text-base w-full max-w-[400px]">
                    <div className="flex gap-4">
                        <span className={`font-bold ${DIFFICULTY_SETTINGS[difficulty].color}`}>{difficulty}</span>
                        <span className="text-zinc-400">Mistakes: <span className={`${mistakes > 0 ? 'text-red-400' : 'text-zinc-200'}`}>{mistakes}/{MAX_MISTAKES}</span></span>
                    </div>
                    <div className="font-mono text-xl text-zinc-300">{formatTime(timer)}</div>
                </div>

                {/* SUDOKU GRID */}
                <div className="relative bg-zinc-900 p-1 rounded-lg border-2 border-zinc-800 shadow-2xl">
                    {/* Check win/gameover overlay */}
                    {(gameState === "WON" || gameState === "GAME_OVER") && !isPreview && (
                        <div className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-300">
                            <h2 className={`text-5xl font-black mb-2 ${gameState === "WON" ? "text-emerald-400" : "text-red-500"}`}>
                                {gameState === "WON" ? "SOLVED!" : "FAILED"}
                            </h2>
                            <p className="text-zinc-400 mb-6 font-mono">{formatTime(timer)} | {difficulty}</p>
                            <button onClick={() => startNewGame()} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-all">
                                New Game
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-9 gap-[1px] bg-zinc-700 border border-zinc-700">
                        {board.map((row, r) => (
                            row.map((val, c) => (
                                <div
                                    key={`${r}-${c}`}
                                    onClick={() => handleCellClick(r, c)}
                                    className={`
                                        w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 
                                        flex items-center justify-center text-lg sm:text-xl lg:text-2xl cursor-pointer transition-colors duration-75
                                        ${getCellColor(r, c, val)}
                                        ${(c + 1) % 3 === 0 && c !== 8 ? "border-r-2 border-r-zinc-500" : ""}
                                        ${(r + 1) % 3 === 0 && r !== 8 ? "border-b-2 border-b-zinc-500" : ""}
                                    `}
                                >
                                    {val !== null ? val : (
                                        // Notes
                                        <div className="grid grid-cols-3 gap-[1px] w-full h-full p-[2px]">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                                                <div key={n} className="flex items-center justify-center text-[8px] sm:text-[10px] leading-none text-zinc-500">
                                                    {notes[r][c].has(n) ? n : ""}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: CONTROLS */}
            {!isPreview && (
                <div className="relative z-10 flex flex-col gap-6 w-full max-w-[400px] md:w-auto animate-in slide-in-from-right-5 duration-700 delay-100">

                    {/* Game Title */}
                    <div className="hidden md:block">
                        <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">SUDOKU</h1>
                        <p className="text-xs font-bold tracking-[0.5em] text-zinc-500">MASTER EDITION</p>
                    </div>

                    {/* Action Tools */}
                    <div className="flex justify-between gap-2">
                        <button onClick={handleUndo} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                            <Undo2 size={24} /> <span className="text-[10px] font-bold tracking-wider">UNDO</span>
                        </button>
                        <button onClick={handleErase} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                            <Eraser size={24} /> <span className="text-[10px] font-bold tracking-wider">ERASE</span>
                        </button>
                        <button onClick={() => setIsNoteMode(!isNoteMode)} className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${isNoteMode ? 'bg-blue-600 text-white' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                            <Pencil size={24} /> <span className="text-[10px] font-bold tracking-wider">NOTES</span>
                        </button>
                        <button onClick={handleHint} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                            <Lightbulb size={24} /> <span className="text-[10px] font-bold tracking-wider">HINT</span>
                        </button>
                    </div>

                    {/* Numpad */}
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => handleNumberInput(num)}
                                className="h-14 bg-zinc-800 rounded-xl text-3xl font-medium text-blue-400 hover:bg-blue-600 hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all active:scale-95"
                            >
                                {num}
                            </button>
                        ))}
                    </div>

                    {/* Difficulty & New Game */}
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex bg-zinc-900 p-1 rounded-xl">
                            {Object.keys(DIFFICULTY_SETTINGS).map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => { setDifficulty(diff); startNewGame(diff); }}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${difficulty === diff ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    {diff[0]}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => startNewGame()}
                            className="w-full py-4 bg-zinc-100 hover:bg-white text-zinc-900 font-bold rounded-xl tracking-widest transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            NEW GAME
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
