// A "custom hook" that owns the itinerary (Quest Log) and keeps it in localStorage,
// so it survives a page refresh. Any component can call useItinerary().
import { useEffect, useState } from "react";

const STORAGE_KEY = "tripwise-quest-log";

// Read the saved list once when the app starts. If anything goes wrong, start empty.
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function useItinerary() {
  const [items, setItems] = useState(load);

  // Every time the list changes, save it.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked (private mode) - the app still works for this session */
    }
  }, [items]);

  const has = (id) => items.some((p) => p.id === id);
  const add = (place) => setItems((list) => (list.some((p) => p.id === place.id) ? list : [...list, place]));
  const remove = (id) => setItems((list) => list.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  return { items, has, add, remove, clear };
}
