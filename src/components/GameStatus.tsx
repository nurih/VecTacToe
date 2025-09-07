
type GameStatusProps = {
  winner: string | null;
  moves: number[];        // Use lowercase 'number' instead of Number
  player: string;
};

export function GameStatus({ winner, moves, player }: GameStatusProps) {
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (moves.every(Boolean)) {
    status = `Game is a draw`;
  } else {
    status = `${player}'s Move`;
  }

  return (
    <div className="mb-4 text-center text-2xl font-semibold text-gray-300 h-8">
      {status}
    </div>
  )
}