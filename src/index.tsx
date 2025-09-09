import { serve } from "bun";
import { GameServer, type Move } from "./gameServer";
import index from "./index.html";

const gameServer = new GameServer()

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: gameServer.hello(name)
      });
    },

    "/api/game/:moves": async req => {
      const moves = (req.params.moves || "").split("").map(d => Number(d) as Move);
      const candidateData = await gameServer.getCandidatePlays(moves);
      return Response.json({
        moves,
        ...candidateData
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
