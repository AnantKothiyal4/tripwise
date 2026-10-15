// One destination, drawn like a quest card with a coloured "level" banner.
import { CATEGORIES } from "../utils/categories.js";
import { formatDistance } from "../utils/format.js";

export default function PlaceCard({ place, inTrip, onOpen, onToggle }) {
  const cat = CATEGORIES[place.type];
  const dist = formatDistance(place.distance);

  return (
    <article className="bg-parchment pixel-box flex flex-col overflow-hidden transition-transform hover:-translate-y-1">
      {/* banner */}
      <div className="flex items-center justify-between px-3 py-2 border-b-4 border-ink"
           style={{ background: cat.color, color: cat.text }}>
        <span className="font-pixel text-[9px]">{cat.icon} {cat.label}</span>
        {dist && <span className="font-pixel text-[9px]">{dist}</span>}
      </div>

      {/* body */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3>
          <button onClick={() => onOpen(place)} className="text-left text-xl font-black leading-tight hover:underline">
            {place.name}
          </button>
        </h3>
        <p className="text-sm font-semibold text-ink/70 line-clamp-2">{place.address}</p>
      </div>

      {/* actions */}
      <div className="grid grid-cols-2 gap-2 p-3 pt-0">
        <button onClick={() => onOpen(place)} className="pixel-btn bg-sky text-ink text-[10px] py-3">Details</button>
        <button onClick={() => onToggle(place)} aria-pressed={inTrip}
                className={`pixel-btn text-[10px] py-3 ${inTrip ? "bg-white text-mario" : "bg-pipe text-white"}`}>
          {inTrip ? "Remove" : "+ Add"}
        </button>
      </div>
    </article>
  );
}
