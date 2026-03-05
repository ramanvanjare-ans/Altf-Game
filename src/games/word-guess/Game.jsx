"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    WORD_LENGTH, 
    MAX_ATTEMPTS, 
    LETTER_STATE, 
    getRandomWord, 
    isValidWord, 
    evaluateGuess 
} from './wordUtils';

/**
 * WordGuessGame Component
 * A fully responsive, embeddable Wordle-style game.
 */
const WordGuessGame = () => {
    // Game State
    const [solution, setSolution] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
    const [invalidShake, setInvalidShake] = useState(false);
    const [currentRowShake, setCurrentRowShake] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    
    // Stats / UI State
    const [showHint, setShowHint] = useState(false);
    
    // Refs for focus management (if needed)
    const gameContainerRef = useRef(null);

    // Initialize Game
    const initGame = useCallback(() => {
        const newWord = getRandomWord();
        console.log("Target Word (Debug):", newWord); // Keep for debug/demo purposes
        setSolution(newWord);
        setGuesses([]);
        setCurrentGuess('');
        setGameStatus('playing');
        setInvalidShake(false);
        setShowHint(false);
        setToastMessage(null);
        // Focus on restart
        setTimeout(() => gameContainerRef.current?.focus(), 100);
    }, []);

    // Initial Mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        initGame();
    }, [initGame]);

    // Helper Functions
    const showToast = useCallback((msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2000);
    }, []);

    const triggerShake = useCallback((msg) => {
        setInvalidShake(true);
        if (msg) showToast(msg);
        setTimeout(() => setInvalidShake(false), 600);
    }, [showToast]);

    // Submit Logic
    const submitGuess = useCallback(() => {
        if (currentGuess.length !== WORD_LENGTH) {
            triggerShake("Not enough letters");
            return;
        }

        if (!isValidWord(currentGuess)) {
            triggerShake("Not in word list");
            return;
        }

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        // Check Win/Loss
        if (currentGuess === solution) {
            setGameStatus('won');
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
            setGameStatus('lost');
        }
    }, [currentGuess, guesses, solution, triggerShake]);

    // Handle Letter Input
    const onKey = useCallback((key) => {
        if (gameStatus !== 'playing') return;

        if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'BACKSPACE' || key === 'DELETE') {
            setCurrentGuess(prev => prev.slice(0, -1));
        } else {
            // Add letter if max length not reached
            if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
                setCurrentGuess(prev => prev + key);
            }
        }
    }, [currentGuess, gameStatus, submitGuess]);

    // Physical Keyboard Listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameStatus !== 'playing') return;
            
            const key = e.key.toUpperCase();
            
            if (key === 'ENTER') {
                e.preventDefault(); // Prevent default scroll/submit
                onKey('ENTER');
            } else if (key === 'BACKSPACE') {
                e.preventDefault();
                onKey('BACKSPACE');
            } else if (/^[A-Z]$/.test(key) && key.length === 1 && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                onKey(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onKey, gameStatus]);

    // Compute Key States for Keyboard Visualization
    const getKeyStates = () => {
        const keyStates = {};
        
        guesses.forEach(guess => {
            const evaluation = evaluateGuess(guess, solution);
            guess.split('').forEach((letter, i) => {
                const currentState = keyStates[letter];
                const newState = evaluation[i];
                
                // Priority: CORRECT > PRESENT > ABSENT
                if (currentState === LETTER_STATE.CORRECT) return;
                if (newState === LETTER_STATE.CORRECT) {
                    keyStates[letter] = LETTER_STATE.CORRECT;
                    return;
                }
                if (currentState === LETTER_STATE.PRESENT) return;
                if (newState === LETTER_STATE.PRESENT) {
                    keyStates[letter] = LETTER_STATE.PRESENT;
                    return;
                }
                if (!currentState) {
                    keyStates[letter] = newState;
                }
            });
        });
        return keyStates;
    };

    const keyStates = getKeyStates();

    return (
        <div 
            ref={gameContainerRef}
            tabIndex={0} // Make focusable
            className="w-full h-full flex flex-col items-center bg-gray-900 text-white p-2 md:p-6 select-none overflow-hidden font-sans outline-none focus:ring-2 focus:ring-green-500/20"
            onClick={() => gameContainerRef.current?.focus()} // Auto-focus on click
            onKeyDown={(e) => {
                 // Backup handler
            }}
        >
            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-4px); }
                    40% { transform: translateX(4px); }
                    60% { transform: translateX(-2px); }
                    80% { transform: translateX(2px); }
                }
                .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes pop {
                    0% { transform: scale(0.8); opacity: 0; }
                    40% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pop {
                    animation: pop 0.1s ease-in-out forwards;
                }
            `}</style>

            {/* Header - Always Top */}
            <header className="flex items-center justify-between w-full max-w-4xl mb-2 shrink-0 border-b border-gray-800 pb-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-br from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        WORD GUESS
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setShowHint(!showHint)}
                        className={`text-xs px-2 py-1 rounded border ${showHint ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'border-gray-700 text-gray-500'}`}
                    >
                        {showHint ? 'HINT ON' : 'HINT'}
                    </button>
                    <button 
                        onClick={initGame}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Restart Game"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 5v7h7" /></svg>
                    </button>
                </div>
            </header>

            {/* Toast Message */}
            {toastMessage && (
                <div className="absolute top-16 z-50 bg-white text-black font-bold px-4 py-2 rounded shadow-lg animate-in fade-in zoom-in duration-200">
                    {toastMessage}
                </div>
            )}

            {/* Main Content Area: Vertical on Mobile, Horizontal on Desktop */}
            <div className="flex-1 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 min-h-0">
                
                {/* Left Column: Game Grid */}
                <div className="flex-1 flex flex-col items-center justify-center w-full h-full min-h-0">
                     {/* Hint Display */}
                    {showHint && gameStatus === 'playing' && (
                        <div className="mb-2 text-xs text-yellow-500 font-mono animate-pulse">
                            Hint: Starts with {solution[0]}...
                        </div>
                    )}
                    
                    <div className="flex-1 flex items-center justify-center w-full max-w-xs md:max-w-sm aspect-[5/6] max-h-full">
                        <div className="grid grid-rows-6 gap-1.5 w-full h-full">
                            {/* Past Guesses */}
                            {guesses.map((guess, i) => (
                                <CompletedRow key={i} guess={guess} solution={solution} />
                            ))}
                            
                            {/* Current Row */}
                            {gameStatus === 'playing' && (
                                <CurrentRow 
                                    currentGuess={currentGuess} 
                                    shake={invalidShake} 
                                />
                            )}

                            {/* Empty Rows */}
                            {Array.from({ length: MAX_ATTEMPTS - 1 - guesses.length - (gameStatus === 'playing' ? 0 : -1) }).map((_, i) => (
                                <EmptyRow key={`empty-${i}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Keyboard (Desktop) / Bottom (Mobile) */}
                <div className="shrink-0 w-full max-w-lg md:max-w-md">
                     <Keyboard onKey={onKey} keyStates={keyStates} />
                </div>
            </div>

            {/* Game Over Modal */}
            {gameStatus !== 'playing' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 w-full max-w-sm text-center shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200">
                        <div className="text-5xl mb-4">
                            {gameStatus === 'won' ? '🎉' : '💔'}
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">
                            {gameStatus === 'won' ? 'YOU WON!' : 'GAME OVER'}
                        </h2>
                        <div className="text-gray-400 mb-6 text-lg">
                            The word was <span className="text-white font-bold tracking-widest bg-gray-700 px-2 py-1 rounded ml-1">{solution}</span>
                        </div>
                        
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={initGame}
                                className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-Components ---

const CompletedRow = ({ guess, solution }) => {
    const evaluation = evaluateGuess(guess, solution);

    return (
        <div className="grid grid-cols-5 gap-1.5 w-full h-full">
            {guess.split('').map((letter, i) => (
                <Tile 
                    key={i} 
                    letter={letter} 
                    state={evaluation[i]} 
                    delay={i * 100} // Staggered reveal
                />
            ))}
        </div>
    );
};

const CurrentRow = ({ currentGuess, shake }) => {
    const splitGuess = currentGuess.split('');
    const emptyCells = Array.from({ length: WORD_LENGTH - splitGuess.length });

    return (
        <div className={`grid grid-cols-5 gap-1.5 w-full h-full ${shake ? 'animate-shake' : ''}`}>
            {splitGuess.map((letter, i) => (
                <Tile key={i} letter={letter} state={LETTER_STATE.TBD} />
            ))}
            {emptyCells.map((_, i) => (
                <Tile key={`empty-${i}`} state={LETTER_STATE.EMPTY} />
            ))}
        </div>
    );
};

const EmptyRow = () => {
    return (
        <div className="grid grid-cols-5 gap-1.5 w-full h-full">
            {Array.from({ length: WORD_LENGTH }).map((_, i) => (
                <Tile key={i} state={LETTER_STATE.EMPTY} />
            ))}
        </div>
    );
};

const Tile = ({ letter, state, delay = 0 }) => {
    // Styles for different states
    const baseStyle = "w-full h-full flex items-center justify-center text-2xl md:text-3xl font-bold uppercase border-2 rounded transition-all duration-500";
    
    let stateStyle = "";
    let animationStyle = {};

    switch (state) {
        case LETTER_STATE.CORRECT:
            stateStyle = "bg-green-600 border-green-600 text-white [transform:rotateX(360deg)]";
            animationStyle = { transitionDelay: `${delay}ms` };
            break;
        case LETTER_STATE.PRESENT:
            stateStyle = "bg-yellow-600 border-yellow-600 text-white [transform:rotateX(360deg)]";
            animationStyle = { transitionDelay: `${delay}ms` };
            break;
        case LETTER_STATE.ABSENT:
            stateStyle = "bg-gray-700 border-gray-700 text-white [transform:rotateX(360deg)]";
            animationStyle = { transitionDelay: `${delay}ms` };
            break;
        case LETTER_STATE.TBD:
            stateStyle = "bg-gray-800 border-gray-600 text-white animate-pop";
            break;
        case LETTER_STATE.EMPTY:
        default:
            stateStyle = "bg-transparent border-gray-800 text-transparent";
            break;
    }

    return (
        <div className={`${baseStyle} ${stateStyle}`} style={animationStyle}>
            {letter}
        </div>
    );
};

const Keyboard = ({ onKey, keyStates }) => {
    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    return (
        <div className="flex flex-col gap-2 w-full px-1 mb-2">
            {rows.map((row, i) => (
                <div key={i} className="flex justify-center gap-1.5 w-full">
                    {row.map((key) => {
                        const state = keyStates[key];
                        let bgClass = "bg-gray-600 text-white hover:bg-gray-500"; // Default
                        
                        if (state === LETTER_STATE.CORRECT) bgClass = "bg-green-600 hover:bg-green-500";
                        if (state === LETTER_STATE.PRESENT) bgClass = "bg-yellow-600 hover:bg-yellow-500";
                        if (state === LETTER_STATE.ABSENT) bgClass = "bg-gray-800 text-gray-500 hover:bg-gray-800 opacity-50";

                        const isWide = key === 'ENTER' || key === 'BACKSPACE';

                        return (
                            <button
                                key={key}
                                onClick={() => onKey(key)}
                                className={`
                                    ${isWide ? 'px-2 sm:px-4 text-xs sm:text-sm font-bold' : 'flex-1 text-sm sm:text-lg font-bold'}
                                    h-12 sm:h-14 rounded transition-colors active:scale-95 flex items-center justify-center
                                    ${bgClass}
                                `}
                            >
                                {key === 'BACKSPACE' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                                    </svg>
                                ) : key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// --- Tailwind Custom Utilities (Injected via style for standalone) ---
// Note: In a real project, add these to tailwind.config.js
// shake animation: 0%, 100% { transform: translateX(0) } 25% { transform: translateX(-5px) } 75% { transform: translateX(5px) }
// pop animation: 0% { transform: scale(0.8) } 40% { transform: scale(1.1) } 100% { transform: scale(1) }

export default WordGuessGame;
