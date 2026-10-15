// Top bar: logo on the left, Quest Log button + coin counter on the right.
import { Coin, Mushroom } from "./Sprites.jsx";

export default function Header({ count, onOpenLog }) {
  return (
    <header className="bg-night border-b-8 border-brick">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-3 px-4 py-3">
        <a href="/" className="flex items-center gap-3" aria-label="TripWise home">
          <Mushroom size={4} />
          <span className="font-pixel text-base sm:text-xl text-coin" style={{ textShadow: "3px 3px 0 #e52521" }}>
            TripWise
          </span>
        </a>

        <button onClick={onOpenLog} className="pixel-btn bg-mario text-white text-[10px] sm:text-xs px-3 py-3 flex items-center gap-2"
                aria-label={`Open quest log, ${count} saved`}>
          {/* key={count} restarts the pop animation each time the number changes */}
          <span key={count} className="animate-coinpop flex items-center gap-1 bg-night px-2 py-1 rounded">
            <Coin size={3} /> x{String(count).padStart(2, "0")}
          </span>
          Quest Log
        </button>
      </div>
    </header>
  );
}
