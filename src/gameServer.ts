import { MongoClient } from "mongodb";
import { buildBoard, buildVectorSearchQuery, canBe, pickNextMove, type Board, type Move, type Possiblity } from "./VecTacToe";

const client = new MongoClient(process.env.VECTACTOE_MONGO_URL!);

type Moves = Move[]

class GameServer {

  hello(name: string) {
    return `Hello, ${name}!`
  }

  async getCandidatePlays(moves: Moves) {
    await client.connect()
    const collection = client.db().collection("vec_tac_toe");
    console.log(`Connected. Collection is ${collection.namespace}`)

    const player = moves.length % 2 === 1 ? 'O' : 'X';

    const currentBoard = buildBoard(moves)

    console.log(`Next palyer is ${player} Moves played: ${moves} (${moves.length})`)

    const pipeline = buildVectorSearchQuery(moves)

    const queryResult = await collection.aggregate(pipeline).toArray();

    const possibilities = queryResult.map(r => ({ ...r, playable: canBe(currentBoard, r.board) } as Possiblity))

    console.log('Docs', queryResult.length);
    console.log('Possibilities', possibilities?.length);

    const suggestion = pickNextMove(player, currentBoard, possibilities);

    return {
      currentBoard: currentBoard.join(''),
      suggestion,
      possibilities,
      pipeline
    }
  }

  async saveStats(gameStats: any) {
    await client.connect()
    const collection = client.db().collection("vec_tac_toe_stats");
    console.log(`Connected. Collection is ${collection.namespace}`)

    const result = await collection.insertOne(gameStats)

    return result

  }
}

export { GameServer }