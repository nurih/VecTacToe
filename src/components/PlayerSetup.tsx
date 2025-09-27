import { useState } from 'react';
import { type Player } from '../VecTacToe';

type PlayerSetupProps = {
  onGameStart: (username: string, playerChoice: Player) => void;
};

export function PlayerSetup({ onGameStart }: PlayerSetupProps) {
  const [username, setUsername] = useState('');
  const [playerChoice, setPlayerChoice] = useState<Player>('X');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onGameStart(username.trim(), playerChoice);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg w-80">
      <h3 className="text-2xl font-bold text-cyan-400">Player Setup</h3>
      <div className="w-full">
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
          Enter your name
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="e.g. Kasparov"
          required
        />
      </div>
      <div className="w-full">
        <span className="block text-sm font-medium text-gray-300 mb-1">Choose your side</span>
        <div className="flex justify-around p-1 bg-gray-700 rounded-md">
          {(['X', 'O'] as const).map((p) => (
            <label key={p} className={`w-1/2 text-center py-1 rounded-md cursor-pointer transition-colors ${playerChoice === p ? 'bg-cyan-600' : 'hover:bg-gray-600'}`}>
              <input
                type="radio"
                name="playerChoice"
                value={p}
                checked={playerChoice === p}
                onChange={() => setPlayerChoice(p)}
                className="sr-only" // Hide the actual radio button
              />
              {p}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-transform transform hover:scale-105">
        Start Game
      </button>
    </form>
  );
}
