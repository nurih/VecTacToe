export type Move = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Player = 'X' | 'O';
export type CellState = Player | "⬚";
export type Board = CellState[];
export type Strategy = 'win' | 'block' | 'random' | 'hopeless';

export type Possiblity = {
  board: string;
  winner: Player | null;
  playable: boolean;
}

type WinningLine = [number, number, number];

interface GameResult {
  board: string;
  winner: Player | null;
  vector: number[];
}

interface VectorSearchProjection {
  _id: 0;
  board: 1;
  winner: 1;
  score: {
    '$meta': 'vectorSearchScore';
  };
}

interface VectorSearchStage {
  $vectorSearch: {
    index: string;
    path: string;
    queryVector: number[];
    numCandidates: number;
    limit: number;
  };
}

interface ProjectStage {
  $project: VectorSearchProjection;
}

type MongoAggregationPipeline = [VectorSearchStage, ProjectStage];

const WINNING_LINES: WinningLine[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns  
  [0, 4, 8], [2, 4, 6]              // diagonals
];

const EMPTY_CELL_SYMBOL: CellState = "⬚";

/**
 * Creates an embedding
 * 
 * Encodes the moves for this game as a vector.
 * @param moves The list of moves. Each element is the cell the move has set.
 * @returns Encoded array of fixed length
 */
export function createEmbedding(moves: number[]): number[] {
  const paddedMoves: number[] = moves.slice(0, 9);

  while (paddedMoves.length < 9) {
    paddedMoves.push(0);
  }

  const oneHot = (n: number): number[] =>
    Array.from({ length: 9 }, (_, i) => (i === n ? 1 : 0));

  // Generate an array of one-hot vectors and flatten it.
  const embedding: number[] = paddedMoves.flatMap(move => oneHot(move));

  return embedding;
}

/**
 * Generates all possible tic-tac-toe game sequences
 */
export function generateAllTicTacToeGames(): number[][] {
  // Start with empty board, X goes first
  const emptyBoard: Board = Array(9).fill(EMPTY_CELL_SYMBOL);
  const allGames: number[][] = playRecursive(emptyBoard, 'X', []);
  return allGames;
}

/**
 * Helper function to determine the winner of the game.
 * @param board The current board state.
 * @param lastMove The latest play. Only winning lines containing this latest play are checked.
 * @returns Winning player, 'X', 'O', or null.
 */
export function judge(board: Board, lastMove: number = 9): Player | null {
  const winners: Record<number, WinningLine[]> = {
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
  };

  for (const line of winners[lastMove || 9]) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] !== EMPTY_CELL_SYMBOL) {
      return board[a] as Player;
    }
  }
  return null;
}

/**
 * Recursively plays all possible game variations
 * @param board X's and O's
 * @param currentPlayer Current player to move
 * @param movesMade Cell positions played, in order.
 * @returns All possible winning move sequences
 */
function playRecursive(board: Board, currentPlayer: Player, movesMade: number[]): number[][] {
  const games: number[][] = [];

  const winner: Player | null = judge(board, movesMade.at(-1));
  if (winner || movesMade.length === 9) {
    return [[...movesMade]];
  }

  for (let pos = 0; pos < 9; pos++) {
    if (board[pos] === EMPTY_CELL_SYMBOL) {  // Position is empty
      const newBoard: Board = [...board];
      newBoard[pos] = currentPlayer;
      const newMoves: number[] = [...movesMade, pos];

      const nextPlayer: Player = opposingPlayer(currentPlayer);

      games.push(...playRecursive(newBoard, nextPlayer, newMoves));
    }
  }

  return games;
}

export function opposingPlayer(playerSymbol: Player): Player { return playerSymbol === 'X' ? 'O' : 'X'; }

/**
 * Simulates a game given a sequence of moves
 * @param moves The sequence of cells played in order
 * @returns Game result with board state, winner, and vector embedding
 */
export function simulateGame(moves: number[]): GameResult {
  // Simulate a game given a sequence of moves to verify the result.
  const cells: Board = buildBoard(moves);

  const winner: Player | null = judge(cells, moves.at(-1));

  const vector: number[] = createEmbedding(moves);
  const board: string = cells.join('');
  return { board, winner, vector };
}

/**
 * Builds a board state from a sequence of moves
 * @param moves The cell play sequence
 * @returns An array of X's, O's, or "â¬š" characters.
 */
export function buildBoard(moves: number[]): Board {
  const board: Board = Array(9).fill(EMPTY_CELL_SYMBOL);
  let currentPlayer: Player = 'X';

  for (const move of moves) {
    board[move] = currentPlayer;
    currentPlayer = opposingPlayer(currentPlayer);
  }
  return board;
}

/** 
 * Builds a MongoDB vector search query
 * 
 * @param moves The sequence of cells played
 * @returns MongoDB Aggregation pipeline query.
 */
export function buildVectorSearchQuery(moves: number[]): MongoAggregationPipeline {
  const queryVector: number[] = createEmbedding(moves);

  return [
    {
      $vectorSearch: {
        index: "vectactoeIdx",
        path: "vector",
        queryVector: queryVector,
        numCandidates: 120,
        limit: 12
      }
    },
    {
      $project: {
        _id: 0,
        board: 1,
        winner: 1,
        score: {
          $meta: 'vectorSearchScore'
        }
      }
    }
  ];
}

export function canBe(now: Board | string, future: Board | string): boolean {

  for (let i = 0; i < 9; i++) {
    if (now[i] === EMPTY_CELL_SYMBOL || now[i] === future[i]) {
      continue;
    }
    return false;
  }
  return true;

}

/**
 * 
 * @param player The player who's turn it is.
 * @param board The current board state
 * @param possibilities Possible boards that are or could be the future board states
 * @returns A next possible move
 */
export function pickNextMove(player: Player, board: Board, possibilities: Possiblity[]): { move: Move | null, strategy: Strategy, player: Player } {
  const emptyCells = board.map((cell, idx) => cell === EMPTY_CELL_SYMBOL ? idx : -1).filter(idx => idx !== -1).map(i => i as Move);

  // Board full. No move.
  if (emptyCells.length === 0) return { move: null, strategy: 'hopeless', player };

  // No hope
  if (possibilities.length === 0) return { move: null, strategy: 'hopeless', player };

  // Find a winning move
  for (const possibility of possibilities) {
    if (possibility.winner === player) {
      const newBoard = possibility.board.split('');
      for (const cellId of emptyCells) {
        if (newBoard[cellId] === player) {
          return { move: cellId, strategy: 'win', player };
        }
      }
    }

    // Can't win, foil opponent winning possibility
    const opponent = opposingPlayer(player);

    for (const possibility of possibilities) {
      if (possibility.winner === opponent) {
        const newBoard = possibility.board.split('');
        for (const cellId of emptyCells) {
          if (newBoard[cellId] === opponent) {
            return { move: cellId, strategy: 'block', player };
          }
        }
      }
    }

    // Otherwise, pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return { move: emptyCells[randomIndex]!, strategy: 'random', player };
  }

}