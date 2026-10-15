// "My Trip": a slide-in panel listing everything the user saved.
import { useEffect } from "react";
import { CATEGORIES } from "../utils/categories.js";
import { Coin } from "./Sprites.jsx";
import { EmptyState } from "./StateMessages.jsx";

export default function QuestLog({ items, onRemove, onClear, onOpen, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 bg-ink/70 flex justify-end" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Quest log" onClick={(e) => e.stopPropagation()}
             className="animate-slidein w-full sm:max-w-md h-full bg-night text-white border-l-8 border-coin overflow-y-auto">
        <div className="sticky top-0 bg-night z-10 flex items-center justify-between p-4 border-b-4 border-brick">
          <h2 className="font-pixel text-sm text-coin flex items-center gap-2"><Coin size={4} /> My Trip</h2>
          <button onClick={onClose} aria-label="Close quest log" className="pixel-btn bg-white text-ink text-xs w-9 h-9">X</button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="text-ink">
              <EmptyState title="No quests yet!" message="Your quest log is empty. Add places from the Explore screen to start your itinerary."
                          onReset={onClose} resetLabel="Go exploring" />
            </div>
          ) : (
            <>
              <p className="font-semibold">{items.length} {items.length === 1 ? "stop" : "stops"} on your journey</p>
              <ol className="flex flex-col gap-3">
                {items.map((p, i) => {
                  const cat = CATEGORIES[p.type];
                  return (
                    <li key={p.id} className="bg-parchment text-ink pixel-box flex items-stretch overflow-hidden">
                      <div className="w-12 flex items-center justify-center font-pixel text-xs border-r-4 border-ink"
                           style={{ background: cat.color, color: cat.text }}>{i + 1}</div>
                      <div className="flex-1 p-3 min-w-0">
                        <button onClick={() => onOpen(p)} className="text-left font-black text-lg leading-tight hover:underline">{p.name}</button>
                        <p className="text-xs font-semibold text-ink/70 truncate">{cat.icon} {cat.label} - {p.address}</p>
                      </div>
                      <button onClick={() => onRemove(p.id)} aria-label={`Remove ${p.name}`}
                              className="pixel-btn bg-mario text-white text-[10px] m-2 px-3">Remove</button>
                    </li>
                  );
                })}
              </ol>
              <button onClick={() => window.confirm("Clear your whole quest log?") && onClear()}
                      className="pixel-btn bg-white text-mario text-[10px] py-3">Clear all</button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
