import { useState } from "react";

export function Help() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleHelp}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg hover:bg-blue-700 transition-colors duration-300 z-50"
        aria-label="Toggle Help"
      >
        {isOpen ? 'X' : '?'}
      </button>

      <div
        className={`fixed inset-y-0 right-0 w-80 bg-gray-900 text-white p-6 shadow-xl transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <h2 className="text-3xl font-bold mb-6 text-blue-400">How to Play</h2>
        <div className="space-y-4 text-lg">
          <p>
            <em>Vec Tac Toe</em> uses vector search to give you advice on your next move. It works by
            finding similar winning game states from a database of over 250,000
            possible legal games.
          </p>
          <ol className="list-disc pl-5">
            <li>
              Click on any empty cell to place your 'X' or 'O'.
            </li>
            <li>
              Vec Tac Toe will suggest a move among the candidates found.
            </li>
          </ol>
          <p className="text-green-200 text-lg">Suggestions will start appearing after 3 moves have been played.
          </p>
          <p className="text-sm text-gray-400 border-t-1 border-t-solid">
            The AI prioritizes winning moves, then blocking moves, then
            random empty cells if no strategic move is found.)
          </p>
        </div>
      </div>
    </div>
  );
}
