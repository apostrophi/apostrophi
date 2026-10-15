type ViewPrefKey =
  | "seed"
  | "view"
  | "sort"
  | "dir"
  | "inspector"
  | "sidebar"
  | "filters"
  | "filterFields"
  | "filterOverlays"
  | "subfolders";

const STORAGE_KEYS = {
  seed: "apostrophi.randomSeed",
  view: "apostrophi.view",
  sort: "apostrophi.sort",
  dir: "apostrophi.dir",
  inspector: "apostrophi.inspector",
  sidebar: "apostrophi.sidebar",
  filters: "apostrophi.filters",
  filterFields: "apostrophi.filterFields",
  filterOverlays: "apostrophi.filterOverlays",
  subfolders: "apostrophi.subfolders",
} satisfies Record<ViewPrefKey, string>;

export function readViewPref(key: ViewPrefKey): string | null {
  if (!globalThis.window) return null;
  try {
    return window.localStorage.getItem(STORAGE_KEYS[key]);
  } catch {
    return null;
  }
}

export function writeViewPref(key: ViewPrefKey, value: string): void {
  if (!globalThis.window) return;
  try {
    window.localStorage.setItem(STORAGE_KEYS[key], value);
  } catch {}
}

export type LayoutValue = "waterfall" | "grid" | "justified" | "list";

const LAYOUT_CYCLE: ReadonlyArray<LayoutValue> = [
  "waterfall",
  "grid",
  "justified",
  "list",
];

export function isLayoutValue(value: string): value is LayoutValue {
  return LAYOUT_CYCLE.some((layout) => layout === value);
}

export function nextLayout(current: LayoutValue): LayoutValue {
  const idx = LAYOUT_CYCLE.indexOf(current);
  return LAYOUT_CYCLE[(idx + 1) % LAYOUT_CYCLE.length] ?? "waterfall";
}
