
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns  
  [0, 4, 8], [2, 4, 6]              // diagonals
];

const EMPTY_CELL_SYMBOL = "⬚";
const UNPLAYED_CELL_ID = 100

function winnerSymbol(winner) {
  return { 'X': 1, 'O': 2, null: 0 }[winner]
}

function encodeAsVector(arr, winner) {
  const fillers = Array(Math.max(0, (9 - arr.length))).fill(UNPLAYED_CELL_ID);
  return [...arr, ...fillers, winnerSymbol(winner)];
};


/**
 * @returns {number[][]}
 */
export function generateAllTicTacToeGames() {
  // Start with empty board, X goes first
  const emptyBoard = Array(9).fill(EMPTY_CELL_SYMBOL);
  const allGames = playRecursive(emptyBoard, 'X', []);
  return allGames;
}

/**
 * Helper function to determine the winner of the game.
 * @param {Array<string|null>} board - The current board state.
 * @param {number} lastMove - The latest play. Only winning numbers
 *     containing this latest play are checkd.
 * @returns {'X'|'O'|null} Winning player, 'X', 'O', or null.
 */
export function judge(board, lastMove = 9) {

  const winners = {
    0: [[0, 1, 2], [0, 3, 6], [0, 4, 8]],
    1: [[0, 1, 2], [1, 4, 7]],
    2: [[0, 1, 2], [2, 5, 8], [2, 4, 6]],
    3: [[3, 4, 5], [0, 3, 6]],
    4: [[3, 4, 5], [1, 4, 7], [0, 4, 8], [2, 4, 6]],
    5: [[3, 4, 5], [2, 5, 8]],
    6: [[6, 7, 8], [0, 3, 6], [2, 4, 6]],
    7: [[6, 7, 8], [1, 4, 7]],
    8: [[6, 7, 8], [2, 5, 8], [0, 4, 8]],
    9: WINNING_LINES
  }


  for (const line of winners[lastMove || 9]) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] !== EMPTY_CELL_SYMBOL) {
      return board[a];
    }
  }
  return null;
}


/**
 * @param {string[]} board X's and O's
 * @param {'X'|'O'} currentPlayer 
 * @param {number[]} movesMade Cell positions played, in order.
 * @returns {number[][]} All possible winning move sequences
 */
function playRecursive(board, currentPlayer, movesMade) {
  const games = [];

  const winner = judge(board, movesMade.at(-1));
  if (winner || movesMade.length == 9) {
    return [[...movesMade]];
  }

  for (let pos = 0; pos < 9; pos++) {
    if (board[pos] === EMPTY_CELL_SYMBOL) {  // Position is empty

      const newBoard = [...board];
      newBoard[pos] = currentPlayer;
      const newMoves = [...movesMade, pos];

      const nextPlayer = switchPlayer(currentPlayer);

      games.push(...playRecursive(newBoard, nextPlayer, newMoves));
    }
  }

  return games;
}

const switchPlayer = (playerSymbol) => playerSymbol === 'X' ? 'O' : 'X';



/**
 * @param {number[]} moves The sequence of cells played in order
 * @returns {{ board: string[], winner: string|null }}
 */
export function simulateGame(moves) {
  // Simulate a game given a sequence of moves to verify the result.
  const board = Array(9).fill(EMPTY_CELL_SYMBOL);
  let currentPlayer = 'X';

  for (const move of moves) {
    board[move] = currentPlayer;
    currentPlayer = switchPlayer(currentPlayer);
  }

  const winner = judge(board, moves.at(-1));

  const vector = encodeAsVector(moves, winner)
  return { board, winner, vector };
}




