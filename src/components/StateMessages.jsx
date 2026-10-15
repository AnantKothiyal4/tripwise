// Friendly full-width messages for the EMPTY and ERROR states.
import { Mushroom, Star } from "./Sprites.jsx";

function Panel({ icon, title, children, action }) {
  return (
    <div role="alert" className="mx-auto max-w-lg bg-parchment pixel-box p-6 sm:p-8 text-center flex flex-col items-center gap-4">
      {icon}
      <h2 className="font-pixel text-sm leading-6">{title}</h2>
      <p className="text-base font-semibold">{children}</p>
      {action}
    </div>
  );
}

const btn = "pixel-btn bg-coin text-ink text-[11px] px-4 py-3";

export function EmptyState({ title = "Mushroom Kingdom empty!", message, onReset, resetLabel = "Reset filters" }) {
  return (
    <Panel icon={<Mushroom size={8} />} title={title}
           action={onReset && <button onClick={onReset} className={btn}>{resetLabel}</button>}>
      {message}
    </Panel>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Panel icon={<div className="animate-bob"><Star size={8} /></div>} title="Game over... for now!"
           action={onRetry && <button onClick={onRetry} className="pixel-btn bg-mario text-white text-[11px] px-4 py-3">Try again</button>}>
      {message}
    </Panel>
  );
}
