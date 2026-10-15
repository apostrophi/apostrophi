import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { app } from "electron";
import log from "electron-log/main.js";
import { DEFAULT_LIBRARY_NAME } from "../../shared/constants";
import { readOrCreateLibraryId } from "../lib/library-id";
import { checkPointerSafety, readLibraryPointer } from "../lib/library-pointer";
import { invalidatePaths, resolvePaths } from "../paths";
import { commitLibraryPointer } from "./recent-libraries";

export type CreateApostrophiResult =
  | { ok: true; path: string }
  | {
      ok: false;
      reason:
        | "no_path"
        | "inside_user_data"
        | "not_writable"
        | "not_a_directory"
        | "unknown_error";
    };

export function createApostrophiBundle(
  parentDir: string,
  name: string = DEFAULT_LIBRARY_NAME,
): CreateApostrophiResult {
  const trimmedParent = parentDir.trim();
  if (!trimmedParent) return { ok: false, reason: "no_path" };

  const safeName = name.trim() || DEFAULT_LIBRARY_NAME;
  const bundlePath = ensureApostrophiSuffix(join(trimmedParent, safeName));
  const safety = checkPointerSafety(bundlePath);
  if (!safety.ok) {
    return { ok: false, reason: safety.reason ?? "unknown_error" };
  }

  mkdirSync(join(bundlePath, "items"), { recursive: true });
  mkdirSync(join(bundlePath, "trash"), { recursive: true });
  readOrCreateLibraryId(bundlePath, safeName);

  commitLibraryPointer(bundlePath);
  invalidatePaths();
  resolvePaths(bundlePath);

  log.info("[apostrophi library-ops] created new apostrophi at", bundlePath);
  return { ok: true, path: bundlePath };
}

export function ensureDefaultLibrary(): void {
  if (readLibraryPointer()) return;

  const parentDir = join(app.getPath("home"), "Apostrophi");
  const defaultRoot = join(parentDir, `${DEFAULT_LIBRARY_NAME}.apostrophi`);

  if (existsSync(defaultRoot)) {
    commitLibraryPointer(defaultRoot);
    invalidatePaths();
    resolvePaths(defaultRoot);
    log.info(
      "[apostrophi library-ops] adopted existing default apostrophi",
      defaultRoot,
    );
    return;
  }

  const result = createApostrophiBundle(parentDir, DEFAULT_LIBRARY_NAME);
  if (!result.ok) {
    log.error(
      "[apostrophi library-ops] failed to create default apostrophi",
      result.reason,
    );
  }
}

function ensureApostrophiSuffix(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed.endsWith(".apostrophi") ? trimmed : `${trimmed}.apostrophi`;
}
