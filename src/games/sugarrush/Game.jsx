// Game.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Candy colors array - using Tailwind color classes
const CANDY_COLORS = [
  { name: 'red', bg: 'bg-red-500', emoji: '🍎' },
  { name: 'yellow', bg: 'bg-yellow-400', emoji: '🍋' },
  { name: 'green', bg: 'bg-green-500', emoji: '🍏' },
  { name: 'blue', bg: 'bg-blue-500', emoji: '🫐' },
  { name: 'purple', bg: 'bg-purple-500', emoji: '🍇' },
  { name: 'orange', bg: 'bg-orange-500', emoji: '🍊' },
];

// Board dimensions
const ROWS = 8;
const COLS = 8;

const Game = () => {
  // Game state
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedCandy, setSelectedCandy] = useState(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [movesLeft, setMovesLeft] = useState(30);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedPositions, setMatchedPositions] = useState([]);

  // Initialize the board
  useEffect(() => {
    initializeBoard();
  }, []);

  // Initialize board with random candies
  const initializeBoard = () => {
    const newBoard = [];
    for (let row = 0; row < ROWS; row++) {
      const newRow = [];
      for (let col = 0; col < COLS; col++) {
        // Generate random candy
        const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
        newRow.push({
          id: `candy-${row}-${col}-${Date.now()}-${Math.random()}`,
          color: randomColor,
          row,
          col,
        });
      }
      newBoard.push(newRow);
    }
    setBoard(newBoard);
    
    // Check for initial matches and clear them
    setTimeout(() => {
      const matches = findAllMatches(newBoard);
      if (matches.length > 0) {
        handleMatches(newBoard, matches);
      }
    }, 100);
  };

  // Find all matches in the board
  const findAllMatches = (boardToCheck) => {
    const matches = [];

    // Check horizontal matches (3+ in a row)
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 2; col++) {
        const candy = boardToCheck[row][col];
        if (!candy) continue;

        let matchLength = 1;
        while (
          col + matchLength < COLS &&
          boardToCheck[row][col + matchLength] &&
          boardToCheck[row][col + matchLength].color.name === candy.color.name
        ) {
          matchLength++;
        }

        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matches.push({ row, col: col + i });
          }
        }
        col += matchLength - 1;
      }
    }

    // Check vertical matches (3+ in a column)
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 2; row++) {
        const candy = boardToCheck[row][col];
        if (!candy) continue;

        let matchLength = 1;
        while (
          row + matchLength < ROWS &&
          boardToCheck[row + matchLength][col] &&
          boardToCheck[row + matchLength][col].color.name === candy.color.name
        ) {
          matchLength++;
        }

        if (matchLength >= 3) {
          for (let i = 0; i < matchLength; i++) {
            matches.push({ row: row + i, col });
          }
        }
        row += matchLength - 1;
      }
    }

    // Remove duplicates (if a candy is part of both horizontal and vertical matches)
    const uniqueMatches = Array.from(
      new Set(matches.map((pos) => `${pos.row},${pos.col}`))
    ).map((str) => {
      const [row, col] = str.split(',').map(Number);
      return { row, col };
    });

    return uniqueMatches;
  };

  // Handle matches - remove matched candies and drop new ones
  const handleMatches = async (currentBoard, matches) => {
    if (matches.length === 0) return false;

    // Show match animation
    setMatchedPositions(matches);
    setShowMatchAnimation(true);

    // Update score
    setScore((prevScore) => prevScore + matches.length * 10);

    // Create a copy of the board
    const newBoard = currentBoard.map((row) => [...row]);

    // Remove matched candies
    matches.forEach(({ row, col }) => {
      newBoard[row][col] = null;
    });

    // Drop candies and fill empty spaces
    await dropCandies(newBoard);

    // Hide match animation
    setShowMatchAnimation(false);
    setMatchedPositions([]);

    return true;
  };

  // Drop candies down and fill empty spaces from top
  const dropCandies = async (boardToUpdate) => {
    return new Promise((resolve) => {
      // Process each column independently
      for (let col = 0; col < COLS; col++) {
        const columnCandies = [];
        
        // Collect existing candies from bottom to top
        for (let row = ROWS - 1; row >= 0; row--) {
          if (boardToUpdate[row][col] !== null) {
            columnCandies.push(boardToUpdate[row][col]);
          }
        }

        // Fill the column from bottom to top with existing candies
        for (let row = ROWS - 1; row >= 0; row--) {
          if (columnCandies.length > 0) {
            const candy = columnCandies.shift();
            candy.row = row;
            candy.col = col;
            boardToUpdate[row][col] = candy;
          } else {
            // Generate new candy for empty spaces
            const randomColor = CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
            boardToUpdate[row][col] = {
              id: `candy-${row}-${col}-${Date.now()}-${Math.random()}`,
              color: randomColor,
              row,
              col,
            };
          }
        }
      }

      // Update board state
      setBoard(boardToUpdate);

      // Check for new matches after dropping
      setTimeout(() => {
        const newMatches = findAllMatches(boardToUpdate);
        if (newMatches.length > 0) {
          handleMatches(boardToUpdate, newMatches);
        }
        resolve();
      }, 300);
    });
  };

  // Handle candy click/selection
  const handleCandyClick = (row, col) => {
    if (isSwapping || gameOver || movesLeft <= 0) return;

    // If no candy is selected, select this candy
    if (!selectedCandy) {
      setSelectedCandy({ row, col });
      return;
    }

    // If same candy is clicked, deselect it
    if (selectedCandy.row === row && selectedCandy.col === col) {
      setSelectedCandy(null);
      return;
    }

    // Check if candies are adjacent
    const isAdjacent =
      (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) ||
      (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row);

    if (isAdjacent) {
      // Attempt swap
      attemptSwap(selectedCandy.row, selectedCandy.col, row, col);
    } else {
      // Select new candy
      setSelectedCandy({ row, col });
    }
  };

  // Attempt to swap two candies
  const attemptSwap = async (row1, col1, row2, col2) => {
    setIsSwapping(true);

    // Create board copy
    const boardCopy = board.map((row) => [...row]);
    
    // Swap candies
    const temp = boardCopy[row1][col1];
    boardCopy[row1][col1] = boardCopy[row2][col2];
    boardCopy[row2][col2] = temp;

    // Update positions
    if (boardCopy[row1][col1]) {
      boardCopy[row1][col1].row = row1;
      boardCopy[row1][col1].col = col1;
    }
    if (boardCopy[row2][col2]) {
      boardCopy[row2][col2].row = row2;
      boardCopy[row2][col2].col = col2;
    }

    // Check for matches after swap
    const matches = findAllMatches(boardCopy);

    if (matches.length > 0) {
      // Valid swap - update board and handle matches
      setBoard(boardCopy);
      setMovesLeft((prev) => prev - 1);
      await handleMatches(boardCopy, matches);
      setSelectedCandy(null);
    } else {
      // Invalid swap - revert
      setSelectedCandy(null);
      // Show error animation (brief highlight)
      setTimeout(() => {
        setIsSwapping(false);
      }, 500);
    }

    setIsSwapping(false);
  };

  // Restart game
  const restartGame = () => {
    setScore(0);
    setMovesLeft(30);
    setSelectedCandy(null);
    setGameOver(false);
    initializeBoard();
  };

  // Check game over condition
  useEffect(() => {
    if (movesLeft <= 0) {
      setGameOver(true);
    }
  }, [movesLeft]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl w-full max-w-2xl">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6 text-white">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Candy Crush
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-sm opacity-75">Score</span>
              <div className="text-2xl font-bold">{score}</div>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-sm opacity-75">Moves</span>
              <div className="text-2xl font-bold">{movesLeft}</div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-8 gap-1 bg-pink-300/30 p-2 rounded-xl">
          {board.map((row, rowIndex) =>
            row.map((candy, colIndex) => (
              <button
                key={candy?.id || `empty-${rowIndex}-${colIndex}`}
                onClick={() => handleCandyClick(rowIndex, colIndex)}
                disabled={isSwapping || gameOver || movesLeft <= 0}
                className={`
                  aspect-square rounded-lg text-2xl sm:text-3xl md:text-4xl
                  flex items-center justify-center
                  transition-all duration-200
                  ${candy?.color.bg || 'bg-gray-300'}
                  ${selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex
                    ? 'ring-4 ring-yellow-300 scale-105 z-10'
                    : ''
                  }
                  ${matchedPositions.some(pos => pos.row === rowIndex && pos.col === colIndex)
                    ? 'animate-pulse scale-110 ring-4 ring-white'
                    : ''
                  }
                  hover:brightness-110 cursor-pointer
                  shadow-lg
                `}
              >
                <span className="drop-shadow-lg">
                  {candy?.color.emoji || '⬜'}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-6">Final Score: {score}</p>
              <button
                onClick={restartGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={restartGame}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Restart Game
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-white/60 text-sm text-center">
          Click on two adjacent candies to swap them. Match 3 or more to score!
        </div>
      </div>
    </div>
  );
};

export default Game;