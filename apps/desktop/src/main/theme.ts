import type { NormalizedTheme } from "@apostrophi/schema/db";
import { nativeTheme } from "electron";
import { getPrefs } from "./core/prefs";

export async function resolveTheme(): Promise<NormalizedTheme | null> {
  try {
    const { resolveActiveTheme, normalizeTheme } = await import(
      "@apostrophi/schema/db"
    );
    const prefs = await getPrefs();
    return normalizeTheme(
      resolveActiveTheme(prefs, nativeTheme.shouldUseDarkColors),
    );
  } catch {
    return null;
  }
}
