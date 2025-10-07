
import { createEmbedding } from "@/VecTacToe";
import { MiniBoard } from "./MiniBoard";
import { Mql } from "./Mql";
import { useState } from "react";

export function Suggestion({ advice }) {
  const [showMql, setShowMql] = useState(false);

  const embedding = advice?.pipeline[0]?.$vectorSearch?.queryVector?.join('') || ""
  
  function adviceText(advice) {
    const moveText = advice?.suggestion.move ? "Play cell " + advice.suggestion.move : "No suggested move."
    return `✨ ${moveText}, thinking "${advice?.suggestion.strategy}"`
  }

  console.log(JSON.stringify(advice))
  return advice ? (
    <div className="text-start font-semibold text-green-400 w-full">
      <div className="m-2 text-yellow-300">{adviceText(advice)}</div>
      <div className="m-2 text-blue-300">{embedding}</div>
      <div className="m-2">
        <button 
          onClick={() => setShowMql(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-mono"
        >
          View MongoDB Query
        </button>
      </div>
      <ul className="">
        {advice.possibilities.map((p, i) => (
          <li id={i} className="border-b-1 border-b-gray-600">
            <div className={`text-start flex ${rowPaint(p, advice.suggestion)}`}>
              <MiniBoard board={p.board}></MiniBoard>
              <span className="flex-1 text-m p-2"> {p.winner ? `🏆 ${p.winner}` : "⚖️"}</span>
              <span className="flex-1 text-m p-2"> {p.playable ? "🗹" : "⮾"}</span>
              <span className="flex-1 text-sm p-2">Rank {p.score}</span>
            </div>
          </li>
        ))}

      </ul>
      
      {/* MQL Popup Modal */}
      {showMql && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">MongoDB Query Pipeline</h3>
              <button 
                onClick={() => setShowMql(false)}
                className="text-gray-400 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <Mql pipeline={advice.pipeline} />
          </div>
        </div>
      )}
    </div >
  ) : (<h3>Play at least 3 moves to get advice</h3>)

  function rowPaint(possibility, suggestion) {
    let paint = []
    if (possibility.winner == suggestion?.player) {
      paint.push("border-l-4 border-l-solid border-l-green-400")
      if (possibility.playable) { paint.push("border-r-4 border-r-solid border-r-green-400") }
      if (!possibility.playable) { paint.push("border-r-4 border-r-solid border-r-red-400") }
    }

    return paint.join(" ");
  }
}