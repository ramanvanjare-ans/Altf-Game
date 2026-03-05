
// Game constants
export const GAME_CONFIG = {
  GRID_SIZE: 9, // 3x3 grid
  GAME_DURATION: 30, // seconds
  MOLE_STAY_MIN: 400, // ms
  MOLE_STAY_MAX: 1000, // ms
  POPUP_INTERVAL_MIN: 500, // ms
  POPUP_INTERVAL_MAX: 1200, // ms
};

export const DIFFICULTY_LEVELS = {
  EASY: { label: 'Easy', speedMultiplier: 1.2 },
  MEDIUM: { label: 'Medium', speedMultiplier: 1.0 },
  HARD: { label: 'Hard', speedMultiplier: 0.8 },
};

/**
 * Generates a random time between min and max
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export const randomTime = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

/**
 * Picks a random hole index from the grid
 * @param {Array} holes - Array of holes or just the length
 * @param {number} lastHoleIndex - The index of the last hole to avoid repetition
 * @returns {number}
 */
export const randomHole = (totalHoles, lastHoleIndex) => {
  let idx;
  do {
    idx = Math.floor(Math.random() * totalHoles);
  } while (idx === lastHoleIndex);
  
  return idx;
};
