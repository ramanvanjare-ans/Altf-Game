export const PLAYER_X = "X";
export const PLAYER_O = "O";

export const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function checkWinner(board) {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], line: combo };
        }
    }
    return null;
}

export function checkDraw(board) {
    return board.every((cell) => cell !== null);
}

// Helper: Get random available move
export function getRandomMove(board) {
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
    if (availableMoves.length === 0) return null;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Scores for Minimax
const scores = {
    X: -10, // Human Win (Bad for AI)
    O: 10,  // AI Win (Good for AI)
    TIE: 0
};

// Minimax Algorithm (Recursive)
export function minimax(board, depth, isMaximizing) {
    const win = checkWinner(board);
    if (win) {
        // Depth subtract karte hain taaki AI jaldi jeetne wala move choose kare
        return win.winner === PLAYER_O ? (scores.O - depth) : (scores.X + depth);
    }
    if (checkDraw(board)) {
        return scores.TIE;
    }

    if (isMaximizing) { // AI's turn (Maximizing)
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = PLAYER_O;
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else { // Human's turn (Minimizing)
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = PLAYER_X;
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Main AI Move Function
export function getAIMove(board, difficulty = "HARD") {
    // 1. EASY: Pure Random
    if (difficulty === "EASY") {
        return getRandomMove(board);
    }

    // 2. MEDIUM: 50% Random, 50% Best Move
    if (difficulty === "MEDIUM") {
        // 40% chance to make a mistake (random move)
        if (Math.random() > 0.6) return getRandomMove(board);
        // Baaki time niche wala Hard logic chalega (Smart move)
    }

    // 3. HARD: Full Minimax (Unbeatable)
    let bestScore = -Infinity;
    let move = null;

    // AI ('O') ke liye har available spot check karo
    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = PLAYER_O; // Move karke dekho
            let score = minimax(board, 0, false); // Check karo result kya hoga
            board[i] = null; // Undo move

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    // Fallback: Agar kisi wajah se move null raha (rare edge case), random lelo
    return move !== null ? move : getRandomMove(board);
}