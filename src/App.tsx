import { useState } from 'react';
import { checkWinner } from './components/VecTacToe';
import { Board } from './components/Board';
import { Transcript } from './components/Transcript';
import { GameStatus } from './components/GameStatus';


export function App() {
  const [moves, setMoves] = useState(Array(9).fill(null));
  const [plays, setPlays] = useState<{ cellId: number, player: string }[]>([]);
  const [player, setPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  const handleCellClick = (cellId: number) => {
    // Prevent move if the cell is already filled or if there's a winner
    if (moves[cellId] || winner) {
      return;
    }

    const newMoves = [...moves];
    newMoves[cellId] = player;
    setMoves(newMoves);
    setPlays([...plays, { cellId, player }])

    const newWinner = checkWinner(newMoves, cellId);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      // Switch to the next player
      setPlayer(player === 'X' ? 'O' : 'X');
    }
  };

  const handleReset = () => {
    setMoves(Array(9).fill(null));
    setPlays([])
    setPlayer('X');
    setWinner(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen 
    flex flex-col items-center justify-center font-sans p-4 relative">

      <div className="absolute top-4 right-4">
        <button
          onClick={handleReset}
          className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Reset Game
        </button>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 text-cyan-400">Tic-Tac-Toe</h1>
        <div className="flex justify-center items-start space-x-8 p-4 w-full">
          <Board
            sequence={moves}
            player={player}
            winner={winner}
            onCellClick={handleCellClick} />

          <Transcript plays={plays}></Transcript>
        </div>
        <GameStatus winner={winner} moves={moves} player={player}></GameStatus>
      </div>
    </div>
  );
}
