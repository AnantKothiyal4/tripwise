// Loading state: a bouncing mushroom above a stepped "level progress" bar that ends in a goal flag.
import { Mushroom } from "./Sprites.jsx";

export default function Loader({ label = "Loading world..." }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-6 py-16">
      <div className="animate-hop"><Mushroom size={7} /></div>

      <div className="flex items-end w-full max-w-md">
        {/* progress track */}
        <div className="flex-1 h-8 bg-night pixel-box overflow-hidden !shadow-none">
          <div className="animate-fill h-full bg-[repeating-linear-gradient(90deg,#fcd116_0_14px,#e0a800_14px_18px)]" />
        </div>
        {/* goal flagpole */}
        <div className="relative w-10 h-16 -ml-1">
          <div className="absolute left-4 bottom-0 w-2 h-16 bg-white border-2 border-ink" />
          <div className="absolute left-6 top-1 w-8 h-6 bg-pipe border-2 border-ink [clip-path:polygon(0_0,100%_50%,0_100%)]" />
          <div className="absolute left-3 -top-1 w-4 h-4 rounded-full bg-coin border-2 border-ink" />
        </div>
      </div>

      <p className="font-pixel text-[11px] leading-5 text-center bg-night text-white px-3 py-2 pixel-box">{label}</p>
    </div>
  );
}
