import fs from 'fs';

import { generateAllTicTacToeGames, simulateGame } from './src/VecTacToe';

console.log('Generating all possible game');
const allGames = generateAllTicTacToeGames();

console.log('Generating dataset');

const simulations = allGames.map(moves => simulateGame(moves));

for (const arg of process.argv) {

  if (['-g', '--generate'].includes(arg.toLocaleLowerCase())) {
    saveToFile(simulations);
  }

  if (['-s', '--sample'].includes(arg.toLocaleLowerCase())) {
    console.log('\nExample games:');
    trace(allGames);
  }

  if (['-r', '--report'].includes(arg.toLocaleLowerCase())) {
    printGameStats(allGames);
  }
}

function saveToFile(simulations) {
  try {
    const filePath = './.dataset.json';
    fs.writeFileSync(filePath, JSON.stringify(simulations));
    console.log(`Successfully wrote data to ${filePath}`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

function trace(allGames) {

  for (let i = 0; i < 3; i++) {

    const idx = Math.floor(Math.random() * allGames.length);

    const { board, winner, vector } = simulateGame(allGames[idx]);
    const winnerText = winner ? `${winner}` : 'D';
    console.log(`${board.slice(0, 3)}\t${winnerText}: ${vector} | #${idx + 1}`)
    console.log(`${board.slice(3, 6)}`)
    console.log(`${board.slice(6, 10)}\n`);
  }

}

function printGameStats(allGames) {
  console.log(`${allGames.length} games in consideration`);

  const gameLengths = {};
  for (const game of allGames) {
    const length = game.length;
    gameLengths[length] = (gameLengths[length] || 0) + 1;
  }

  console.log('\nGames by number of moves:');
  Object.keys(gameLengths)
    .map(Number)
    .sort()
    .forEach(length => {
      console.log(`\t${length} moves: ${gameLengths[String(length)]} games`);
    });
}

