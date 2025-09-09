import fs from 'fs';
import { MongoClient } from 'mongodb';
import { generateAllTicTacToeGames, simulateGame, createEmbedding, buildVectorSearchQuery, buildBoard } from './src/VecTacToe';

const DATASET_FILE_PATH = './.dataset.json';

// Declare a client variable to be used throughout the script
let client;
let collection;

let simulations;
let allGames;

const getAllGames = () => {
  if (!allGames)
    allGames = generateAllTicTacToeGames();
  return allGames;
}

const getSimulations = () => {
  if (!simulations) {
    simulations = getAllGames().map(moves => simulateGame(moves));
  }
  return simulations;
}

const getCollection = async () => {
  if (collection) return collection;
  if (!process.env.MONGO_URL) {
    console.error('MONGO_URL environment variable is not set.');
    process.exit(1)
  }

  try {
    client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    collection = (client.db()).collection("vec_tac_toe");

    console.log('Connected to MongoDB', collection.namespace);

    return collection;
  }
  catch (err) {
    console.error('Failed connecting', err)
    process.exit(1)
  }
}
async function main() {
  try {

    if (process.argv.some(arg => ['-l', '--load'].includes(arg.toLocaleLowerCase()))) {
      console.log('Loading simulations from file.')
      simulations = JSON.parse(fs.readFileSync(DATASET_FILE_PATH));
    }

    for (const arg of process.argv) {
      if (['-s', '--save'].includes(arg.toLocaleLowerCase())) {
        saveToFile(getSimulations());
      }
      if (['-e', '--example'].includes(arg.toLocaleLowerCase())) {
        console.log('\nExample games:');
        example(getAllGames(), 1);
      }
      if (['-r', '--report'].includes(arg.toLocaleLowerCase())) {
        printGameStats(getAllGames());
      }
      if (['-u', '--upload'].includes(arg.toLocaleLowerCase())) {
        await uploadToMongoDB(getSimulations(), 1024);
      }
      if (['--idx'].includes(arg.toLocaleLowerCase())) {
        await createVectorIndex()
      }
      if (['-q', '--query'].includes(arg.toLocaleLowerCase())) {
        await runQuery();
      }
    }
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB client closed.');
    }
  }
}

async function runQuery() {
  let moves = [];
  const prompt = "Type a sequence of moves, comma delimited. X always starts:\n\t0,1,2\n\t3,4,5\n\t6,7,8\n=> ";
  process.stdout.write(prompt);
  for await (const line of console) {
    console.log(`You typed: ${line}`);
    const numbers = line.split(/[^\d]+/).map(c => Number(c)).filter(d => Number.isInteger(d));
    moves = [...new Set(numbers)];

    console.log('Moves', JSON.stringify(moves));

    printBoard(buildBoard(moves).join(''))

    break;
  }

  const pipeline = buildVectorSearchQuery(moves);
  console.log('Query Vector:', pipeline[0].$vectorSearch.queryVector.join(''));
  await getCollection();
  const queryResult = await collection.aggregate(pipeline).toArray();

  console.log(queryResult);
}

function saveToFile(simulations) {
  try {
    fs.writeFileSync(DATASET_FILE_PATH, JSON.stringify(simulations));
    console.log(`Saved all simulations to ${DATASET_FILE_PATH}`);
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

function example(allGames, count) {
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * allGames.length);
    const { board, winner, vector } = simulateGame(allGames[idx]);
    const winnerText = winner ? `${winner}'s` : 'Tie';
    printBoard(board);
    console.log(`#${idx + 1} ${winnerText}: ${vector.join('')}`);
  }
}

function printBoard(board) {
  console.log(`\t${board.slice(0, 3).split('')}`);
  console.log(`\t${board.slice(3, 6).split('')}`);
  console.log(`\t${board.slice(6, 9).split('')}`);
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

async function uploadToMongoDB(simulations, batchSize) {
  await getCollection();
  for (let i = 0; i < simulations.length; i += batchSize) {
    const batch = simulations.slice(i, i + batchSize)
    try {
      const result = await collection.insertMany(batch, { ordered: false })
      console.log(`${result.insertedCount} (${i + batchSize}) documents inserted`);
    } catch (err) {
      console.error(`Error inserting documents ${i}`, err);
      break;
    }
  }
}

async function createVectorIndex() {
  const name = 'vectactoeIdx';
  const similarity = 'dotProduct';
  await getCollection();
  console.log(`Creating vector index "${name}" with similarity "${similarity}" on ${collection.namespace}`);
  await collection.createSearchIndex({
    name: `${name}`,
    type: "vectorSearch",
    definition: {
      "fields": [
        {
          "numDimensions": 81,
          "path": "vector",
          "quantization": "none",
          "similarity": `${similarity}`,
          "type": "vector"
        },
        {
          "path": "board",
          "type": "filter"
        }
      ]
    }
  })
}

main();
