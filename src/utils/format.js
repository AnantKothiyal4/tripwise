// Turns meters into friendly text: 850 -> "850 m", 3200 -> "3.2 km"
export function formatDistance(meters) {
  if (meters == null) return null;
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
}
