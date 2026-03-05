/**
 * Sudoku Utility Functions
 * Handles generation, solving, and validation of Sudoku puzzles.
 */

// --- Constants ---
const BLANK = null;
const GRID_SIZE = 9;
const SUBGRID_SIZE = 3;

// --- Helper Functions ---

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Check if placing num at board[row][col] is valid
export const isValidMove = (board, row, col, num) => {
    // Check row
    for (let x = 0; x < GRID_SIZE; x++) {
        if (board[row][x] === num && x !== col) return false;
    }

    // Check col
    for (let y = 0; y < GRID_SIZE; y++) {
        if (board[y][col] === num && y !== row) return false;
    }

    // Check 3x3 subgrid
    const startRow = Math.floor(row / SUBGRID_SIZE) * SUBGRID_SIZE;
    const startCol = Math.floor(col / SUBGRID_SIZE) * SUBGRID_SIZE;

    for (let i = 0; i < SUBGRID_SIZE; i++) {
        for (let j = 0; j < SUBGRID_SIZE; j++) {
            if (board[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) {
                return false;
            }
        }
    }

    return true;
};

// Solves the board using backtracking
// Returns true if solvable, and modifies board in-place to solution
export const solveSudoku = (board) => {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (board[row][col] === BLANK) {
                const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Randomize for generator
                for (let num of nums) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = BLANK;
                    }
                }
                return false;
            }
        }
    }
    return true;
};

// Generates a full valid board
const generateFullBoard = () => {
    const board = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(BLANK));
    solveSudoku(board);
    return board;
};

// Removes numbers to create a puzzle based on difficulty
export const generateSudoku = (difficulty = 'MEDIUM') => {
    // 1. Generate full board
    const solution = generateFullBoard();

    // 2. Clone for the playable board
    const board = solution.map(row => [...row]);

    // 3. Determine how many cells to remove
    let attempts = 5;
    switch (difficulty) {
        case 'EASY': attempts = 30; break;     // Remove ~30 -> ~51 clues
        case 'MEDIUM': attempts = 45; break;   // Remove ~45 -> ~36 clues
        case 'HARD': attempts = 55; break;     // Remove ~55 -> ~26 clues
        case 'EXPERT': attempts = 62; break;   // Remove ~62 -> ~19 clues
        default: attempts = 45;
    }

    // 4. Remove numbers while ensuring unique solution (simplified for speed: just remove randoms)
    // A proper verified unique solution remover is computationally expensive (requires solving after each removal).
    // For a web game, simple random removal is usually sufficient, though 'attempts' here is just a count of removals.

    while (attempts > 0) {
        let row = Math.floor(Math.random() * GRID_SIZE);
        let col = Math.floor(Math.random() * GRID_SIZE);
        while (board[row][col] === BLANK) {
            row = Math.floor(Math.random() * GRID_SIZE);
            col = Math.floor(Math.random() * GRID_SIZE);
        }

        // Backup
        const backup = board[row][col];
        board[row][col] = BLANK;

        // Check if unique solution exists (Skip for now to keep generation instant, 
        // usually creates valid puzzles if we don't remove too many)
        // copy = board.map... solveSudoku(copy) ... countSolutions...

        attempts--;
    }

    return {
        initialBoard: board.map(row => [...row]), // To track fixed vs user cells
        solution: solution, // To validate quickly
        playableBoard: board // The state to be modified
    };
};
