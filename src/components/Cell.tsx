/**
 * Cell Component - a single cell in the tic-tac-toe grid.
 */

export function Cell({ value, onClick, player, gameOver }) {
  const isX = value === 'X';
  const isO = value === 'O';
  const isEmpty = !value;

  // Dynamic classes for styling
  const cellClasses = `
    w-24 h-24 md:w-32 md:h-32 bg-gray-900 rounded-lg 
    flex items-center justify-center 
    text-6xl font-bold cursor-pointer 
    transition-all duration-200 ease-in-out
    shadow-inner
    ${isX ? 'text-cyan-400' : 'text-yellow-400'}
    ${isEmpty ? 'hover:bg-gray-700' : ''}
    ${gameOver && isX ? "border-4 border-double border-cyan-600" : ""}
    ${gameOver && isO ? "border-4 border-dashed border-yellow-600" : ""}
  `;


  return (
    <div onClick={onClick} className={cellClasses}>
      {value}
    </div>
  );
}
