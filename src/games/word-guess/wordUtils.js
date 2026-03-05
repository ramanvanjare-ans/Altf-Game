// Constants
export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

// Letter States
export const LETTER_STATE = {
    CORRECT: 'correct', // Green
    PRESENT: 'present', // Yellow
    ABSENT: 'absent',   // Gray
    EMPTY: 'empty',
    TBD: 'tbd'          // To be determined (typing)
};

// Common 5-letter words for the answer (Target words)
export const TARGET_WORDS = [
    'APPLE', 'BEACH', 'BRAIN', 'BREAD', 'BRUSH', 'CHAIR', 'CHEST', 'CHORD', 'CLICK', 'CLOCK',
    'CLOUD', 'DANCE', 'DREAM', 'DRIVE', 'EARTH', 'FEAST', 'FIELD', 'FLAME', 'FRUIT', 'GLASS',
    'GRAPE', 'GREEN', 'GHOST', 'HEART', 'HOUSE', 'JUICE', 'LIGHT', 'LEMON', 'MELON', 'MONEY',
    'MUSIC', 'NIGHT', 'OCEAN', 'PARTY', 'PHONE', 'PIZZA', 'PLANT', 'PLATE', 'POWER', 'RADIO',
    'RIVER', 'ROBOT', 'SHIRT', 'SHOES', 'SMILE', 'SNAKE', 'SPACE', 'SPOON', 'STORM', 'TABLE',
    'TIGER', 'TOAST', 'TOUCH', 'TRAIN', 'TRUCK', 'VOICE', 'WATER', 'WATCH', 'WHALE', 'WORLD',
    'WRITE', 'YOUTH', 'ZEBRA', 'ALARM', 'BACON', 'BASIC', 'BLOCK', 'BREAK', 'BRICK', 'CABLE',
    'CHAIN', 'CLEAN', 'COUNT', 'COVER', 'CRAZY', 'CROSS', 'CURVE', 'CYCLE', 'DAILY', 'DELAY',
    'DEPTH', 'DOUBT', 'DRAFT', 'DRAMA', 'DRESS', 'DRINK', 'DRIVE', 'EARLY', 'ENTRY', 'EQUAL',
    'ERROR', 'EVENT', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FAULT', 'FIBER', 'FIELD', 'FIFTH',
    'FINAL', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FRAME', 'FRANK', 'FRESH',
    'FRONT', 'FRUIT', 'GLASS', 'GRANT', 'GRASS', 'GREAT', 'GROUP', 'GUARD', 'GUESS', 'GUEST',
    'GUIDE', 'HAPPY', 'HEAVY', 'HELLO', 'HORSE', 'HOTEL', 'HUMAN', 'IDEAL', 'IMAGE', 'INDEX',
    'INPUT', 'ISSUE', 'JUDGE', 'KNIFE', 'LABEL', 'LARGE', 'LAUGH', 'LAYER', 'LEARN', 'LEVEL',
    'LIMIT', 'LOCAL', 'LOGIC', 'LOOSE', 'LUNCH', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MATCH',
    'METAL', 'MODEL', 'MOTOR', 'MOUSE', 'MOUTH', 'MOVIE', 'MUSIC', 'NEVER', 'NOISE', 'NORTH',
    'NOVEL', 'NURSE', 'OCCUR', 'OFFER', 'ORDER', 'OTHER', 'OWNER', 'PANEL', 'PAPER', 'PARTY',
    'PAUSE', 'PEACE', 'PHASE', 'PHONE', 'PHOTO', 'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLANE',
    'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIZE', 'PROOF',
    'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO',
    'REACH', 'REPLY', 'RIGHT', 'RIVER', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE',
    'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF',
    'SHELL', 'SHIFT', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SIGHT', 'SINCE', 'SKILL', 'SLEEP',
    'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMOKE', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH',
    'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPITE', 'SPLIT', 'SPORT', 'SQUAD', 'STACK',
    'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL', 'STICK', 'STILL',
    'STOCK', 'STONE', 'STORE', 'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE',
    'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'TABLE', 'TASTE', 'TEACH', 'THANK', 'THEME', 'THICK',
    'THING', 'THINK', 'THIRD', 'THROW', 'TIGHT', 'TITLE', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER',
    'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRUCK', 'TRUST', 'TRUTH', 'UNCLE',
    'UNION', 'UNITY', 'UPPER', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VOICE', 'WASTE', 'WATCH',
    'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WOMAN', 'WORLD', 'WORRY',
    'WORSE', 'WORST', 'WRITE', 'WRONG', 'YIELD', 'YOUNG', 'YOUTH', 'ZEBRA'
];

// In a real app, VALID_GUESSES would be a much larger dictionary to allow obscure words as guesses
// For this standalone version, we'll combine TARGET_WORDS with some extra common words to form a basic dictionary
export const VALID_GUESSES = [...new Set([...TARGET_WORDS])]; 

export const getRandomWord = () => {
    return TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)];
};

export const isValidWord = (word) => {
    // Check if it's in our strict dictionary first
    if (VALID_GUESSES.includes(word.toUpperCase())) return true;
    
    // Fallback: Basic structure check (5 letters, A-Z)
    // This allows users to guess ANY 5-letter word, improving playability
    // even if the word isn't in our limited dictionary.
    return /^[A-Z]{5}$/.test(word.toUpperCase());
};

export const evaluateGuess = (guess, solution) => {
    const result = Array(WORD_LENGTH).fill(LETTER_STATE.ABSENT);
    const solutionChars = solution.split('');
    const guessChars = guess.split('');

    // First pass: Find correct letters (Green)
    guessChars.forEach((char, i) => {
        if (char === solutionChars[i]) {
            result[i] = LETTER_STATE.CORRECT;
            solutionChars[i] = null; // Mark as used
            guessChars[i] = null; // Mark as processed
        }
    });

    // Second pass: Find present letters (Yellow)
    guessChars.forEach((char, i) => {
        if (char !== null) { // If not already processed (Green)
            const indexInSolution = solutionChars.indexOf(char);
            if (indexInSolution !== -1) {
                result[i] = LETTER_STATE.PRESENT;
                solutionChars[indexInSolution] = null; // Mark as used
            }
        }
    });

    return result;
};
