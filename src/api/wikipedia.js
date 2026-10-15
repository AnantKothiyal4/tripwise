// Optional "extra info": a short description + photo from Wikipedia (free, no key needed).
// Returns null if no article is found - the modal then shows a fallback message.

export async function fetchSummary(place) {
  // Geoapify sometimes gives a tag like "en:Eiffel Tower"; otherwise we try the place name.
  let lang = "en";
  let title = place.name;
  if (place.wiki) {
    const m = place.wiki.match(/^([a-z-]+):(.+)$/i);
    if (m) { lang = m[1]; title = m[2]; }
  }
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.type === "disambiguation" || !data.extract) return null;
  return {
    text: data.extract,
    image: data.thumbnail?.source || null,
    link: data.content_urls?.desktop?.page || null,
  };
}
