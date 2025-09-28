type GameStatusProps = {
  winner: string | null;
  moves: number[];        // Use lowercase 'number' instead of Number
  piece: string;
  username: string;
  userPiece: string;
};

export function GameStatus({ winner, moves, piece, username, userPiece }: GameStatusProps) {
  const playerColor = () => piece === 'X' ? 'text-cyan-400' : 'text-yellow-400'
  return (
    <div className="mb-4 text-center text-2xl font-semibold text-gray-300 h-8">
      {winner && (
        <div className="text-green-400">
          <span className="font-bold">{winner}</span> wins!{' '}
          {winner === userPiece ? username : 'VTT'}
        </div>
      )}
      {!winner && moves.every(Boolean) && (
        <div className="text-yellow-400">
          Game is a draw!
        </div>
      )}
      {!winner && !moves.every(Boolean) && (
        <div className="text-blue-400 font-bold text-green-600 text-2xl">
          <span className={`font-bold ${playerColor()}`}>
            {piece === userPiece ? username : 'VTT'}
          </span>{' '}:${' '}
          <span className="animate-pulse"></span> place an {' '}
          <span className={`font-bold ${playerColor()}`}>{piece}</span>
          <span className="animate-pulse text-4xl">|</span>
        </div>
      )}
    </div>
  )
}