// All talking to the Geoapify API lives in this one file.
// Step 1: turn a city name into coordinates (geocoding).
// Step 2: ask for tourist places around those coordinates.
import { classify } from "../utils/categories.js";

const KEY = import.meta.env.VITE_GEOAPIFY_KEY; // read from your .env file
const BASE = "https://api.geoapify.com";

// One place to turn every failure into a clear, human-readable error.
async function getJson(url) {
  if (!KEY) {
    const e = new Error("Missing API key. Create a .env file with VITE_GEOAPIFY_KEY=your_key (see README).");
    e.code = "NO_KEY";
    throw e;
  }
  let res;
  try {
    res = await fetch(url);
  } catch {
    const e = new Error("Can't reach the server. Check your internet connection and try again.");
    e.code = "NETWORK";
    throw e;
  }
  if (!res.ok) {
    const e = new Error(
      res.status === 401 || res.status === 403 ? "The API key was rejected. Double-check VITE_GEOAPIFY_KEY."
      : res.status === 429 ? "Too many requests. Wait a moment and try again."
      : `The places service had a problem (error ${res.status}).`
    );
    e.code = "HTTP";
    throw e;
  }
  return res.json();
}

// "Paris" -> { lat, lon, label: "Paris, Île-de-France, France" }
export async function geocodeCity(text) {
  const url = `${BASE}/v1/geocode/search?text=${encodeURIComponent(text)}&limit=1&format=json&apiKey=${KEY}`;
  const data = await getJson(url);
  const hit = data.results?.[0];
  if (!hit) {
    const e = new Error(`We couldn't find "${text}" on the map.`);
    e.code = "NOT_FOUND";
    throw e;
  }
  return { lat: hit.lat, lon: hit.lon, label: hit.formatted };
}

// Fetch up to 60 named tourist places within 15 km of the coordinates.
export async function fetchPlaces({ lat, lon }, radiusMeters = 15000) {
  const categories = "tourism.sights,entertainment.museum,leisure.park,natural,building.historic";
  const url =
    `${BASE}/v2/places?categories=${categories}` +
    `&conditions=named` +
    `&filter=circle:${lon},${lat},${radiusMeters}` +
    `&bias=proximity:${lon},${lat}` +
    `&limit=60&apiKey=${KEY}`;
  const data = await getJson(url);

  // Keep only the fields we need, in a simple shape that the whole app uses.
  const seen = new Set();
  return (data.features || [])
    .map((f) => {
      const p = f.properties;
      return {
        id: p.place_id,
        name: p.name,
        address: p.formatted,
        lat: p.lat,
        lon: p.lon,
        distance: p.distance ?? null, // meters from the city centre
        type: classify(p.categories),
        website: p.website || p.datasource?.raw?.website || null,
        openingHours: p.opening_hours || p.datasource?.raw?.opening_hours || null,
        wiki: p.wiki_and_media?.wikipedia || p.datasource?.raw?.wikipedia || null,
      };
    })
    .filter((p) => p.id && p.name && !seen.has(p.id) && seen.add(p.id)); // remove duplicates
}
