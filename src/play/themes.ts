/* Menu color themes. Index AUTO (-1) picks the theme by month, so THEMES needs
   exactly 12 entries. */

export const THEMES: [name: string, hex: string][] = [
  ["Silver", "#8e98a6"], ["Gold", "#c49a1d"], ["Lime", "#5f9e3f"], ["Rose", "#c9607f"],
  ["Emerald", "#1f9259"], ["Violet", "#8655c4"], ["Teal", "#1a9097"], ["Azure", "#2d6fca"],
  ["Indigo", "#4a3fae"], ["Amber", "#bb741b"], ["Copper", "#a5532e"], ["Crimson", "#ad2433"],
];

export const AUTO = -1;

/** [name, hex] for a theme index, resolving AUTO to the given month's theme. */
export function resolveTheme(idx: number, month = new Date().getMonth()) {
  return THEMES[idx === AUTO ? month : idx];
}

/** Display name, e.g. "Auto (Gold)" or "Teal". */
export function themeLabel(idx: number) {
  const [name] = resolveTheme(idx);
  return idx === AUTO ? `Auto (${name})` : name;
}

/** Cycles through the themes, then back to AUTO. */
export const nextTheme = (idx: number) => (idx + 1 >= THEMES.length ? AUTO : idx + 1);

/** hex → [hue (deg), saturation (%)] */
export function hexToHueSat(hex: string): [number, number] {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100)];
}

/** JSON localStorage under an "xmb." prefix that never throws (private mode, blocked storage, SSR). */
export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem("xmb." + key);
      return v === null ? fallback : (JSON.parse(v) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem("xmb." + key, JSON.stringify(value));
    } catch {
      /* not persisted; the in-memory state still applies */
    }
  },
};
