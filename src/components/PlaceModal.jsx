// Pop-up with the full details of one place. Closes with the X, Esc key, or a click outside.
import { useEffect, useState } from "react";
import { CATEGORIES } from "../utils/categories.js";
import { formatDistance } from "../utils/format.js";
import { fetchSummary } from "../api/wikipedia.js";
import { Mushroom } from "./Sprites.jsx";

export default function PlaceModal({ place, inTrip, onToggle, onClose }) {
  const cat = CATEGORIES[place.type];
  const [info, setInfo] = useState({ status: "loading" });

  // Load the Wikipedia description whenever a different place is opened.
  useEffect(() => {
    let active = true; // ignore the answer if the modal was closed meanwhile
    setInfo({ status: "loading" });
    fetchSummary(place)
      .then((data) => active && setInfo(data ? { status: "ok", data } : { status: "none" }))
      .catch(() => active && setInfo({ status: "none" }));
    return () => { active = false; };
  }, [place.id]);

  // Close on Esc, and stop the page behind from scrolling.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const mapLink = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=17/${place.lat}/${place.lon}`;
  const dist = formatDistance(place.distance);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/70 p-0 sm:p-4"
         onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={place.name} onClick={(e) => e.stopPropagation()}
           className="animate-popin bg-parchment pixel-box w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-b-none sm:rounded-b-lg">
        {/* banner */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 border-b-4 border-ink"
             style={{ background: cat.color, color: cat.text }}>
          <span className="font-pixel text-[10px]">{cat.icon} {cat.label}</span>
          <button onClick={onClose} aria-label="Close details"
                  className="pixel-btn bg-white text-ink text-xs w-9 h-9">X</button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <h2 className="text-3xl font-black leading-tight">{place.name}</h2>

          {info.status === "loading" && (
            <div className="flex items-center gap-3 font-semibold"><div className="animate-bob"><Mushroom size={4} /></div> Reading the scrolls...</div>
          )}
          {info.status === "ok" && (
            <div className="flex flex-col sm:flex-row gap-4">
              {info.data.image && <img src={info.data.image} alt={place.name} className="w-full sm:w-48 object-cover border-4 border-ink rounded-lg self-start" />}
              <p className="text-base leading-relaxed font-semibold">
                {info.data.text}{" "}
                {info.data.link && <a href={info.data.link} target="_blank" rel="noreferrer" className="underline text-mario">Read more on Wikipedia</a>}
              </p>
            </div>
          )}
          {info.status === "none" && (
            <p className="font-semibold text-ink/70">No written guide found for this place yet, but the map details are below.</p>
          )}

          {/* facts */}
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <Fact label="Address">{place.address}</Fact>
            {dist && <Fact label="Distance from city centre">{dist}</Fact>}
            {place.openingHours && <Fact label="Opening hours">{place.openingHours}</Fact>}
            {place.website && <Fact label="Website"><a href={place.website} target="_blank" rel="noreferrer" className="underline text-mario break-all">{place.website}</a></Fact>}
          </dl>

          {/* actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => onToggle(place)}
                    className={`pixel-btn text-[11px] py-4 flex-1 ${inTrip ? "bg-white text-mario" : "bg-pipe text-white"}`}>
              {inTrip ? "Remove from Quest Log" : "+ Add to Quest Log"}
            </button>
            <a href={mapLink} target="_blank" rel="noreferrer"
               className="pixel-btn bg-sky text-ink text-[11px] py-4 flex-1 text-center">Open map</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, children }) {
  return (
    <div className="bg-white border-4 border-ink rounded-lg p-3">
      <dt className="font-pixel text-[8px] text-ink/60 mb-1">{label}</dt>
      <dd className="font-bold">{children}</dd>
    </div>
  );
}
