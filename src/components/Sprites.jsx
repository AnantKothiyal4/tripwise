// Tiny pixel-art sprites drawn from text grids (no image files needed!).
// Each letter in a grid is a colour from the palette; "." means transparent.

function PixelSprite({ grid, palette, size = 4, className = "" }) {
  const rows = grid.length;
  const cols = grid[0].length;
  return (
    <svg width={cols * size} height={rows * size} viewBox={`0 0 ${cols} ${rows}`}
         shapeRendering="crispEdges" className={className} aria-hidden="true">
      {grid.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[c]} />
        )
      )}
    </svg>
  );
}

const MUSHROOM = [
  "...RRRR...",
  "..RRWWRR..",
  ".RWWRRWWR.",
  "RRWWRRWWRR",
  "RRRRRRRRRR",
  "RRRRRRRRRR",
  "..KWWWWK..",
  "..WKWWKW..",
  "..WWWWWW..",
  "...KKKK...",
];
const COIN = [
  "..YYYY..",
  ".YOOOOY.",
  "YOOYYOOY",
  "YOOYYOOY",
  "YOOYYOOY",
  "YOOYYOOY",
  ".YOOOOY.",
  "..YYYY..",
];
const STAR = [
  "....YY....",
  "...YYYY...",
  "YYYYYYYYYY",
  ".YYYKYKYY.",
  "..YYYYYY..",
  "..YYYYYY..",
  ".YYYYYYYY.",
  ".YYY..YYY.",
];
const CLOUD = [
  "....WWWW........",
  "..WWWWWWWW..WW..",
  ".WWWWWWWWWWWWWW.",
  "WWWWWWWWWWWWWWWW",
  "SWWWWWWWWWWWWWWS",
];

export const Mushroom = (p) => <PixelSprite grid={MUSHROOM} palette={{ R: "#e52521", W: "#ffffff", K: "#0d0d1a" }} {...p} />;
export const Coin = (p) => <PixelSprite grid={COIN} palette={{ Y: "#fcd116", O: "#e0a800" }} {...p} />;
export const Star = (p) => <PixelSprite grid={STAR} palette={{ Y: "#fcd116", K: "#0d0d1a" }} {...p} />;
export const Cloud = (p) => <PixelSprite grid={CLOUD} palette={{ W: "#ffffff", S: "#cfe0ff" }} {...p} />;
