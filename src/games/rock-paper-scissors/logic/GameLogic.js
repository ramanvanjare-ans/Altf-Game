
export const MOVES = {
  ROCK: 'rock',
  PAPER: 'paper',
  SCISSORS: 'scissors'
};

export const OUTCOMES = {
  PLAYER_WINS: 'PLAYER_WINS',
  COMPUTER_WINS: 'COMPUTER_WINS',
  DRAW: 'DRAW'
};

export const getRandomMove = () => {
  const moves = Object.values(MOVES);
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

export const determineWinner = (playerMove, computerMove) => {
  if (playerMove === computerMove) {
    return OUTCOMES.DRAW;
  }

  if (
    (playerMove === MOVES.ROCK && computerMove === MOVES.SCISSORS) ||
    (playerMove === MOVES.PAPER && computerMove === MOVES.ROCK) ||
    (playerMove === MOVES.SCISSORS && computerMove === MOVES.PAPER)
  ) {
    return OUTCOMES.PLAYER_WINS;
  }

  return OUTCOMES.COMPUTER_WINS;
};

export const getOutcomeMessage = (outcome) => {
  switch (outcome) {
    case OUTCOMES.PLAYER_WINS:
      return "You Win! 🎉";
    case OUTCOMES.COMPUTER_WINS:
      return "You Lose 😢";
    case OUTCOMES.DRAW:
      return "It's a Draw 🤝";
    default:
      return "";
  }
};
