
export function Suggestion({ advice }) {

  return advice ? (
    <div className="text-start font-semibold text-green-400 w-full">
      <div className="m-2">✨ Play cell {advice?.suggestion.move}, thinking "{advice?.suggestion.strategy}"</div>
      <ul className="">
        {advice.possibilities.map((p, i) => (
          <li id={i} className="border-b-1 border-b-gray-600">
            <div className="text-start flex">
              <span className="flex-1 text-sm font-mono p-2">{p.board}</span>
              <span className="flex-1 text-m p-2"> {p.winner ? `🏆 ${p.winner}` : "⚖️"}</span>
              <span className="flex-1 text-m p-2"> {p.playable ? "🗹" : "⮾"}</span>
              <span className="flex-1 text-sm p-2">Rank {p.score}</span>
            </div>
          </li>
        ))}

      </ul>
    </div >
  ) : (<h3>Play at least 3 moves to get advice</h3>)
}