// Pixel art from Capybara's design package (logo §3, working line, 5x7 wordmark face).

/** The capybara logo: 14x10 cells, `X` filled, `O` the eye (left empty). */
export const LOGO: readonly string[] = [
  "..........X...",
  ".........XXX..",
  "...XXXXXXXXXXX",
  "..XXXXXXXXXOXX",
  ".XXXXXXXXXXXXX",
  ".XXXXXXXXXXXXX",
  ".XXXXXXXXXXXX.",
  "..XXXXXXXXXX..",
  "..XX..X..XX...",
  "..XX..X..XX...",
];

/** The walking capybara (design package working-line.tsx): body rows 0-7 and two leg frames. */
export const WALKER = {
  body: LOGO.slice(0, 8),
  legsA: LOGO.slice(8),
  legsB: ["...XX.X.XX....", "...XX.X.XX...."],
} as const;

/** A 5x7 pixel face, only the letters of the wordmark. */
export const FONT: Record<string, readonly string[]> = {
  C: [".XXX.", "X...X", "X....", "X....", "X....", "X...X", ".XXX."],
  A: [".XXX.", "X...X", "X...X", "XXXXX", "X...X", "X...X", "X...X"],
  P: ["XXXX.", "X...X", "X...X", "XXXX.", "X....", "X....", "X...."],
  Y: ["X...X", "X...X", ".X.X.", "..X..", "..X..", "..X..", "..X.."],
  B: ["XXXX.", "X...X", "X...X", "XXXX.", "X...X", "X...X", "XXXX."],
  R: ["XXXX.", "X...X", "X...X", "XXXX.", "X.X..", "X..X.", "X...X"],
};

/** One SVG path of unit squares for every `X` cell, rows offset by `top`. */
export function cells(rows: readonly string[], top = 0): string {
  let d = "";
  rows.forEach((row, y) => {
    [...row].forEach((c, x) => {
      if (c === "X") d += `M${x} ${y + top}h1v1h-1z`;
    });
  });
  return d;
}

/** The wordmark set in the pixel face: letters 5 cells wide with 1 cell between them. */
export function wordmark(word: string): { d: string; viewBox: string } {
  let d = "";
  [...word].forEach((ch, i) => {
    FONT[ch].forEach((row, y) => {
      [...row].forEach((c, x) => {
        if (c === "X") d += `M${i * 6 + x} ${y}h1v1h-1z`;
      });
    });
  });
  return { d, viewBox: `0 0 ${word.length * 6 - 1} 7` };
}

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Ordered (Bayer) dither for a strip `width` px wide: dense on the left, thinning to nothing. */
export function dither(width: number, unit = 4, rows = 6): { d: string; viewBox: string; height: number } {
  const cols = Math.floor(width / unit);
  let d = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const density = Math.pow(1 - x / cols, 1.6) * (1 - y / (rows * 1.4));
      if ((BAYER[y % 4][x % 4] + 0.5) / 16 < density) d += `M${x * unit} ${y * unit}h${unit}v${unit}h-${unit}z`;
    }
  }
  return { d, viewBox: `0 0 ${cols * unit} ${rows * unit}`, height: rows * unit };
}
