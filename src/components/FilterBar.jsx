// Category buttons + "narrow by name" box + sort dropdown.
import { CATEGORIES } from "../utils/categories.js";

export default function FilterBar({ category, onCategory, sort, onSort, nameFilter, onNameFilter, counts }) {
  const options = [["all", { label: "All", icon: "🍄" }], ...Object.entries(CATEGORIES)];

  return (
    <section aria-label="Filters" className="bg-night pixel-box p-4 flex flex-col gap-4">
      {/* category buttons */}
      <div className="flex flex-wrap gap-2">
        {options.map(([id, c]) => {
          const active = category === id;
          return (
            <button key={id} onClick={() => onCategory(id)} aria-pressed={active}
                    className={`pixel-btn text-[10px] px-3 py-2 ${active ? "bg-coin text-ink" : "bg-white text-ink"}`}>
              {c.icon} {c.label} <span className="opacity-60">({counts[id] ?? 0})</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="narrow" className="block font-pixel text-[9px] text-coin mb-2">Narrow by name</label>
          <input id="narrow" value={nameFilter} onChange={(e) => onNameFilter(e.target.value)}
                 placeholder="e.g. temple, park, fort"
                 className="w-full bg-white border-4 border-ink rounded-lg px-3 py-2 font-extrabold" />
        </div>
        <div className="sm:w-56">
          <label htmlFor="sort" className="block font-pixel text-[9px] text-coin mb-2">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => onSort(e.target.value)}
                  className="w-full bg-white border-4 border-ink rounded-lg px-3 py-2 font-extrabold">
            <option value="near">Nearest first</option>
            <option value="az">Name A to Z</option>
            <option value="za">Name Z to A</option>
          </select>
        </div>
      </div>
    </section>
  );
}
