// The big "pick your world" search: type a city, press START.
import { useState } from "react";

const QUICK_PICKS = ["Chennai", "Goa", "Tokyo", "Paris", "Rome"];

export default function SearchBar({ initial, onSearch, disabled }) {
  const [text, setText] = useState(initial);

  const submit = (e) => {
    e.preventDefault(); // stop the browser from reloading the page
    if (text.trim()) onSearch(text.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={submit} className="flex gap-2 sm:gap-3">
        <label htmlFor="city" className="sr-only">City to explore</label>
        <input id="city" value={text} onChange={(e) => setText(e.target.value)}
               placeholder="Type a city, e.g. Rome"
               className="flex-1 min-w-0 bg-white pixel-box px-4 py-3 text-lg font-extrabold placeholder:text-ink/40" />
        <button type="submit" disabled={disabled}
                className="pixel-btn bg-pipe text-white text-xs sm:text-sm px-4 sm:px-6">START</button>
      </form>

      <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Quick picks">
        {QUICK_PICKS.map((c) => (
          <button key={c} disabled={disabled} onClick={() => { setText(c); onSearch(c); }}
                  className="pixel-btn bg-white text-ink text-[10px] px-3 py-2">{c}</button>
        ))}
      </div>
    </div>
  );
}
