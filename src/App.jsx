// The main screen. It owns the data (places, filters, selected place) and passes it to the components.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { geocodeCity, fetchPlaces } from "./api/geoapify.js";
import useItinerary from "./hooks/useItinerary.js";

import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import PlaceCard from "./components/PlaceCard.jsx";
import PlaceModal from "./components/PlaceModal.jsx";
import QuestLog from "./components/QuestLog.jsx";
import Loader from "./components/Loader.jsx";
import { EmptyState, ErrorState } from "./components/StateMessages.jsx";
import { Cloud, Star } from "./components/Sprites.jsx";

const DEFAULT_CITY = "Chennai";

export default function App() {
  const trip = useItinerary(); // saved places (lives in localStorage)

  // ----- data from the API -----
  const [city, setCity] = useState(DEFAULT_CITY);
  const [cityLabel, setCityLabel] = useState("");
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | notfound | error
  const [error, setError] = useState(null);

  // ----- what the user picked -----
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("near");
  const [nameFilter, setNameFilter] = useState("");
  const [selected, setSelected] = useState(null); // place shown in the modal
  const [logOpen, setLogOpen] = useState(false);

  // If the user searches twice quickly, only the LATEST request may update the screen.
  const requestId = useRef(0);

  const load = useCallback(async (cityName) => {
    const myId = ++requestId.current;
    setStatus("loading");
    setError(null);
    try {
      const where = await geocodeCity(cityName);
      const list = await fetchPlaces(where);
      if (myId !== requestId.current) return;
      setCityLabel(where.label);
      setPlaces(list);
      setCategory("all");
      setNameFilter("");
      setStatus("success");
    } catch (e) {
      if (myId !== requestId.current) return;
      setPlaces([]);
      setError(e);
      setStatus(e.code === "NOT_FOUND" ? "notfound" : "error");
    }
  }, []);

  useEffect(() => { load(DEFAULT_CITY); }, [load]); // run once on first page load

  const handleSearch = (text) => { setCity(text); load(text); };

  // ----- filter + sort (recomputed only when inputs change) -----
  const counts = useMemo(() => {
    const c = { all: places.length };
    places.forEach((p) => { c[p.type] = (c[p.type] || 0) + 1; });
    return c;
  }, [places]);

  const visible = useMemo(() => {
    const q = nameFilter.trim().toLowerCase();
    const list = places.filter((p) =>
      (category === "all" || p.type === category) && (!q || p.name.toLowerCase().includes(q))
    );
    const sorters = {
      near: (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity),
      az: (a, b) => a.name.localeCompare(b.name),
      za: (a, b) => b.name.localeCompare(a.name),
    };
    return [...list].sort(sorters[sort]);
  }, [places, category, nameFilter, sort]);

  const toggle = (place) => (trip.has(place.id) ? trip.remove(place.id) : trip.add(place));
  const resetFilters = () => { setCategory("all"); setNameFilter(""); };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header count={trip.items.length} onOpenLog={() => setLogOpen(true)} />

      {/* ---------- HERO ---------- */}
      <section className="relative px-4 pt-10 pb-12 text-center overflow-hidden">
        <div className="animate-drift absolute top-4 left-0 opacity-90 pointer-events-none"><Cloud size={8} /></div>
        <div className="animate-drift absolute top-24 left-0 opacity-80 pointer-events-none [animation-delay:-35s]"><Cloud size={5} /></div>

        <div className="relative">
          <div className="flex justify-center mb-4 animate-bob"><Star size={7} /></div>
          <h1 className="font-pixel text-xl sm:text-3xl leading-[1.6] text-white mb-3" style={{ textShadow: "4px 4px 0 #0d0d1a" }}>
            Choose your world
          </h1>
          <p className="text-lg sm:text-xl font-extrabold text-ink mb-8 max-w-xl mx-auto">
            Search any city, collect the best places on the map, and build your trip.
          </p>
          <SearchBar initial={city} onSearch={handleSearch} disabled={status === "loading"} />
        </div>
      </section>

      {/* ---------- RESULTS ---------- */}
      <main className="relative flex-1 mx-auto w-full max-w-6xl px-4 pb-16" aria-live="polite">
        {status === "loading" && <Loader label={`Loading ${city}...`} />}

        {status === "error" && <ErrorState message={error?.message} onRetry={() => load(city)} />}

        {status === "notfound" && (
          <EmptyState title="Warp zone not found!" message={`${error?.message} Check the spelling or try a bigger nearby city.`} />
        )}

        {status === "success" && (
          <div className="flex flex-col gap-6">
            <FilterBar category={category} onCategory={setCategory} sort={sort} onSort={setSort}
                       nameFilter={nameFilter} onNameFilter={setNameFilter} counts={counts} />

            <p className="font-pixel text-[10px] leading-5 text-white bg-night inline-block self-start px-3 py-2 pixel-box">
              {visible.length} {visible.length === 1 ? "quest" : "quests"} near {cityLabel}
            </p>

            {visible.length === 0 ? (
              <EmptyState message="No destinations match these filters. Try a different category or clear the name box."
                          onReset={resetFilters} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((p) => (
                  <PlaceCard key={p.id} place={p} inTrip={trip.has(p.id)} onOpen={setSelected} onToggle={toggle} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ---------- FOOTER (required API attribution) ---------- */}
      <footer className="ground pt-8 pb-4 px-4 text-center">
        <p className="bg-night/90 text-white text-xs font-bold inline-block px-3 py-2 rounded-lg">
          Places by Geoapify - Map data (c) OpenStreetMap contributors - Descriptions from Wikipedia
        </p>
      </footer>

      {selected && (
        <PlaceModal place={selected} inTrip={trip.has(selected.id)} onToggle={toggle} onClose={() => setSelected(null)} />
      )}
      {logOpen && (
        <QuestLog items={trip.items} onRemove={trip.remove} onClear={trip.clear}
                  onOpen={(p) => { setLogOpen(false); setSelected(p); }} onClose={() => setLogOpen(false)} />
      )}
    </div>
  );
}
