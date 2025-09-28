import { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { Transcript } from './components/Transcript';
import { GameStatus } from './components/GameStatus';
import { Suggestion } from './components/Suggestion';
import { Help } from './components/Help';
import { Links } from './components/Links';
import { PlayerSetup } from './components/PlayerSetup';
import restartIcon from './game-restart.svg'
import { type Player, type Move, opposingPlayer, judge } from './VecTacToe';


export function App() {
  type Play = {
    cellId: Move;
    player: Player;
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [userPiece, setUserPiece] = useState<Player>('X');
  const [moves, setMoves] = useState<Array<Player>>(Array(9).fill(null));
  const [plays, setPlays] = useState<Play[]>([]);
  const [player, setPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | null>(null);
  const [advice, setAdvice] = useState<any>(null);

  useEffect(() => {
    const isGameOver = winner || plays.length === 9;
    if (isGameOver && username) {
      sendGameStats();
    }
  }, [winner, plays.length]);

  const handleGameStart = (name: string, choice: Player) => {
    setUsername(name);
    setUserPiece(choice);
    setGameStarted(true);
    setPlayer('X'); // Game always starts with X
  };

  const handleCellClick = async (cellId: Move) => {

    if (plays.length && plays.at(-1)?.cellId === cellId) {
      undoLastMove(cellId);
      return;
    }
    // Prevent move if the cell is already filled or if there's a winner
    if (moves[cellId] || winner) {
      return;
    }

    const newMoves = [...moves];
    newMoves[cellId] = player;
    setMoves(newMoves);
    const newPlays = [...plays, { cellId, player }];
    setPlays(newPlays)

    const newWinner = judge(newMoves, cellId);
    if (newWinner) {
      // game won, over.
      setWinner(newWinner);
    } else {
      // Switch to the next player
      console.log('No winner. Switching players.')
      setPlayer(opposingPlayer(player));
      await getSuggestions(newPlays)
    }
  };

  const handleReset = () => {
    setMoves(Array(9).fill(null));
    setPlays([]);
    setPlayer('X');
    setWinner(null);
    setAdvice(null);
    setGameStarted(false);
    setUsername('');
  };

  const sendGameStats = async () => {
    await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, plays, winner, userPiece }),
    });
  };

  function undoLastMove(cellId: number) {

    moves[cellId] = null;
    setPlays(plays.slice(0, -1));
    setMoves(moves);
    setPlayer(opposingPlayer(player));
    setWinner(null); // In case we undo a winning move
  }

  async function getSuggestions(plays: Play[]) {

    if (plays?.length < 3) return;

    const response = await fetch(`/api/game/${plays.map(p => String(p.cellId)).join('')}`)
    if (response.ok) {
      const data = await response.json();
      setAdvice(data)
    }
  }

  const playBill = () => `VTT plays "${userPiece === 'X' ? 'O' : 'X'}" | ${username} plays "${userPiece}"`


  return (
    <div className="bg-gray-900 text-white min-h-screen 
    flex flex-col items-center justify-center font-sans p-4 relative"
    >

      <div className="absolute top-4 right-4 flex flex-row space-x-2">
        <Links></Links>
        <button
          onClick={handleReset}
          className="bg-green-800 hover:bg-red-800 text-gray-900 font-bold p-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
        ><img src={restartIcon} className='scale-160' alt="Restart Game" aria-label='Restart Game' />
        </button>
      </div>

      <div className='flex flex-col m-8 w-full items-start'>
        <h2 className="text-6xl font-bold text-cyan-400">Vector Tac Toe</h2>
        {gameStarted && (
          <h3 className="text-2xl font-bold text-green-200 mt-2">{playBill()}</h3>
        )}
      </div>

      {!gameStarted ? (
        <PlayerSetup onGameStart={handleGameStart} />
      ) : (
        <div className="flex flex-row items-start space-x-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-center items-start space-x-8">
              <Board
                sequence={moves}
                player={player}
                winner={winner}
                onCellClick={handleCellClick} />
              <Transcript plays={plays}></Transcript>
            </div>
            <GameStatus winner={winner} moves={moves} piece={player} username={username} userPiece={userPiece}></GameStatus>
            <Suggestion advice={advice}></Suggestion>
          </div>
        </div>
      )}
      <Help></Help>
    </div>
  );
}
