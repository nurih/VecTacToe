import { type Player, type Board, type Move, type CellState } from '../VecTacToe'
/**
 * Helper function to determine the winner of the game.
 * @param {Array<string|null>} board - The current board state.
 * @param {number} lastMove - The latest play. Only winning numbers
 *     containing this latest play are checkd.
 * @returns {'X'|'O'|null} Winning player, 'X', 'O', or null.
 */
export function checkWinner(board: Board, lastMove: Move): Player | null {

  const winners: { [key: number]: Move[][] } = {
    0: [[0, 1, 2], [0, 3, 6], [0, 4, 8]],
    1: [[0, 1, 2], [1, 4, 7]],
    2: [[0, 1, 2], [2, 5, 8], [2, 4, 6]],
    3: [[3, 4, 5], [0, 3, 6]],
    4: [[3, 4, 5], [1, 4, 7], [0, 4, 8], [2, 4, 6]],
    5: [[3, 4, 5], [2, 5, 8]],
    6: [[6, 7, 8], [0, 3, 6], [2, 4, 6]],
    7: [[6, 7, 8], [1, 4, 7]],
    8: [[6, 7, 8], [2, 5, 8], [0, 4, 8]],
  }

  for (const line of winners[lastMove!]!) {
    const [a, b, c] = line;

    if (board[a!]
      && board[a!] !== '⬚'
      && board[a!] === board[b!]
      && board[a!] === board[c!]) {

      return board[a!] as Player;
    }
  }
  return null;
}
