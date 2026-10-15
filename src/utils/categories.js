// Our friendly categories + a helper that decides which one a place belongs to.
// Geoapify gives every place a list of technical tags like ["tourism.sights.castle", "building.historic"].

export const CATEGORIES = {
  historic:     { label: "Historic",     icon: "🏰", color: "#b5502c", text: "#ffffff" },
  architecture: { label: "Architecture", icon: "🏛️", color: "#5c94fc", text: "#0d0d1a" },
  nature:       { label: "Nature",       icon: "🌲", color: "#43b02a", text: "#0d0d1a" },
  museum:       { label: "Museums",      icon: "🖼️", color: "#e52521", text: "#ffffff" },
  landmark:     { label: "Landmarks",    icon: "⭐", color: "#fcd116", text: "#0d0d1a" },
};

// Does ANY of the place's tags start with ANY of the given prefixes?
const hasTag = (tags, prefixes) =>
  tags.some((t) => prefixes.some((p) => t.startsWith(p)));

// Order matters: the first rule that matches wins.
export function classify(tags = []) {
  if (hasTag(tags, ["building.historic", "heritage", "tourism.sights.castle", "tourism.sights.fort",
                    "tourism.sights.memorial", "tourism.sights.ruines", "tourism.sights.archaeological",
                    "tourism.sights.monastery", "tourism.sights.battlefield"])) return "historic";
  if (hasTag(tags, ["tourism.sights.tower", "tourism.sights.bridge", "tourism.sights.city_gate",
                    "tourism.sights.place_of_worship", "tourism.sights.city_hall", "religion"])) return "architecture";
  if (hasTag(tags, ["natural", "leisure.park", "national_park"])) return "nature";
  if (hasTag(tags, ["entertainment.museum", "entertainment.culture"])) return "museum";
  return "landmark";
}
