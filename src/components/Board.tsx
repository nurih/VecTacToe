import { Cell } from './Cell';
import { useState } from 'react'
/**
 * TicTacToeBoard Component
 * @param {object} props
 * @param {Array<string|null>} props.sequence - The array representing the board state.
 * @param {string} props.player - The current player ('X' or 'O').
 * @param {'X'|'O'| null} props.winner - The winner - if one is determined.
 * @param {function(number): void} props.onCellClick - Callback function when a cell is clicked.
 */

export function Board({ sequence, player, winner, onCellClick }) {


  return (
    <div className="grid grid-cols-3 gap-3 p-3 bg-gray-800 rounded-xl shadow-2xl">
      {sequence.map((value, index) => (
        <Cell
          gameOver={Boolean(winner)}
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          player={player} />
      ))}
    </div>
  );
}
