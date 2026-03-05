import dynamic from "next/dynamic";

// Helper to keep logic clean and repetitive
const loadGame = (importFn) => dynamic(importFn, {
    loading: () => <div className="w-full h-full bg-black/10 animate-pulse" />,
    ssr: false
});

export const GamePreviewRegistry = {
    // Strategy
    "chess": loadGame(() => import("@/games/chess/Game")),
    "connect-four": loadGame(() => import("@/games/connect-four/Game")),

    // Arcade
    "rock-paper-scissors": loadGame(() => import("@/games/rock-paper-scissors/Game")),
    "whack-a-mole": loadGame(() => import("@/games/whack-a-mole/Game")),
    "breakout": loadGame(() => import("@/games/breakout/Game")),
    "bubble-shooter": loadGame(() => import("@/games/bubble-shooter/Game")),
    "samurai-fruit-cutter": loadGame(() => import("@/games/samurai-fruit-cutter/Game")),
    "tic-tac-toe": loadGame(() => import("@/games/tic-tac-toe/Game")),
    "flappy-bird": loadGame(() => import("@/games/flappy-bird/Game")),
    "word-guess": loadGame(() => import("@/games/word-guess/Game")),

    // Racing
    "neon-racer": loadGame(() => import("@/games/neon-racer/Game")),

    // Puzzle
    "snake": loadGame(() => import("@/games/snake/Game")),
    "memory-match": loadGame(() => import("@/games/memory-match/Game")),
    "minesweeper": loadGame(() => import("@/games/minesweeper/Game")),
    "dots-and-boxes": loadGame(() => import("@/games/dots-and-boxes/Game")),
    "hangman": loadGame(() => import("@/games/hangman/Game")),

    "2048": loadGame(() => import("@/games/2048/Game")),
    "sudoku-master": loadGame(() => import("@/games/sudoku-master/Game")),

    // Sports
    "cricket": loadGame(() => import("@/games/cricket/Game")),
    "ludo": loadGame(() => import("@/games/ludo/Game")),

    // Skill
    "aim-trainer-pro": loadGame(() => import("@/games/aim-trainer-pro/Game")),
    "knife-hit": loadGame(() => import("@/games/knife-hit/Game")),
    "stack-tower": loadGame(() => import("@/games/stack-tower/Game")),

    "carrom": loadGame(() => import("@/games/carrom/Game")),
    "hiluxjump": loadGame(() => import("@/games/hiluxjump/Game")),

    "airshot": loadGame(() => import("@/games/airshot/Game")),
    "snakerush": loadGame(() => import("@/games/snakerush/Game")),

    "pacman": loadGame(() => import("@/games/pacman/Game")),
    "trafficroad": loadGame(() => import("@/games/trafficroad/Game")),

    "flippyRace": loadGame(() => import("@/games/flippyRace/Game")),
    "escaperoad": loadGame(() => import("@/games/escapeRoad/Game")),  
    
    "ragdoll": loadGame(() => import("@/games/ragdollGame/Game")),
    "hillclimbracing": loadGame(() => import("@/games/hillClimbRacing/Game")),

    "eightBallPool": loadGame(() => import("@/games/eightBallPool/Game")),
    // Note: Add new games here as they are implemented
};
