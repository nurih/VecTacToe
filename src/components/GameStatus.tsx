
type GameStatusProps = {
  winner: string | null;
  moves: number[];        // Use lowercase 'number' instead of Number
  player: string;
  username: string;
  userPlayer: string;
};

export function GameStatus({ winner, moves, player, username, userPlayer }: GameStatusProps) {
  let status;
  if (winner) {
    status = `${winner == userPlayer ? username : 'VTT'} (${winner}) is the winner!`;
  } else if (moves.every(Boolean)) {
    status = `Game is a draw`;
  } else {
    status = `It's your play ${player == userPlayer? username:'VTT'}: Place an ${player}`;
  }

  return (
    <div className="mb-4 text-center text-2xl font-semibold text-gray-300 h-8">
      {status}
    </div>
  )
}