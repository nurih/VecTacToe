
/**
 * Transcript Component
 * Renders the game transcript
 */
export function Transcript({ plays }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md max-w-xs text-white">
      <h2 className="text-xl font-bold mb-3 border-b border-gray-600 pb-2">
        Move History
      </h2>
      <ul className="space-y-2">
        {plays.map((play, index) => (
          <li key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-gray-400">
                Cell:
              </span>
              <span className="font-semibold text-md">
                {play.cellId}
              </span>
            </div>

            <span
              className={`font-bold text-2md ${play.player === 'X' ? 'text-blue-400' : 'text-yellow-400'}`}
            >
              {play.player}
            </span>
          </li>
        ))}
      </ul>
      {plays.length === 0 && (
        <p className="text-gray-500 text-center py-4">No moves yet.</p>
      )}
    </div>

  );
}
