import { existsSync } from "node:fs";
import {
  DEFAULT_PREFS,
  type DeepPartial,
  type Prefs,
  type PrefsPatchDeep,
  PrefsSchema,
  type StoredPrefsEnvelope,
} from "@apostrophi/schema/db";
import { z } from "zod";
import { readBundleJson, writeBundleJson } from "../lib/library-config";
import { UNBOUND_LIBRARY_ID } from "../lib/library-id";
import { libraryId, resolvePaths } from "../paths";

const APOSTROPHI_PREF_KEYS = [
  "folderRules",
  "folderViews",
  "savedViewViews",
  "preferences",
  "sourcesView",
  "sync",
  "storage",
  "trash",
  "ai",
  "tagPicker",
  "allTags",
  "saveRecents",
] as const satisfies readonly (keyof Prefs)[];

type ApostrophiPrefKey = (typeof APOSTROPHI_PREF_KEYS)[number];
type AppPrefKey = Exclude<keyof Prefs, ApostrophiPrefKey>;

export type ApostrophiPrefs = Pick<Prefs, ApostrophiPrefKey>;
export type AppPrefs = Pick<Prefs, AppPrefKey>;

export interface StoredPrefs {
  version: 3;
  app: DeepPartial<AppPrefs>;
  pending: DeepPartial<ApostrophiPrefs> | null;
}

const APP_PREF_KEYS = [
  "viewer",
  "shortcuts",
  "window",
  "system",
  "quickCapture",
  "autoImport",
  "sidebar",
  "feedback",
  "api",
  "updates",
  "agent",
  "search",
] as const satisfies readonly AppPrefKey[];

const _DEFAULT_APP_PREFS: AppPrefs = pickPrefs(DEFAULT_PREFS, APP_PREF_KEYS);
const _DEFAULT_APOSTROPHI_PREFS: ApostrophiPrefs = pickPrefs(
  DEFAULT_PREFS,
  APOSTROPHI_PREF_KEYS,
);

export function currentLibraryId(): string {
  return libraryId();
}

export function isUnboundLibraryId(libraryId: string): boolean {
  return libraryId === UNBOUND_LIBRARY_ID;
}

const StoredSliceSchema = z.custom<PrefsPatchDeep>(
  (value) => value instanceof Object && !Array.isArray(value),
);

export type StoredPrefsInput =
  | StoredPrefsEnvelope
  | string
  | number
  | boolean
  | null
  | undefined;

const StoredPrefsV3Schema = z.object({
  version: z.literal(3),
  app: StoredSliceSchema,
  pending: StoredSliceSchema.nullish(),
});

function storedSlice(value: PrefsPatchDeep | null | undefined): PrefsPatchDeep {
  return value ?? {};
}

function isStoredPrefs(
  stored: StoredPrefsInput,
): stored is StoredPrefsInput & StoredPrefs {
  return StoredPrefsV3Schema.safeParse(stored).success;
}

export function normalizeStoredPrefs(stored: StoredPrefsInput): StoredPrefs {
  return isStoredPrefs(stored)
    ? stored
    : { version: 3, app: {}, pending: null };
}

function mergeAll(base: Prefs, patch: DeepPartial<Prefs>): Prefs {
  return PrefsSchema.parse({
    shortcuts: { ...base.shortcuts, ...patch.shortcuts },
    viewer: { ...base.viewer, ...patch.viewer },
    folderViews: { ...base.folderViews, ...patch.folderViews },
    savedViewViews: { ...base.savedViewViews, ...patch.savedViewViews },
    folderRules: { ...base.folderRules, ...patch.folderRules },
    preferences: { ...base.preferences, ...patch.preferences },
    trash: { ...base.trash, ...patch.trash },
    window: { ...base.window, ...patch.window },
    system: { ...base.system, ...patch.system },
    quickCapture: { ...base.quickCapture, ...patch.quickCapture },
    autoImport: { ...base.autoImport, ...patch.autoImport },
    sidebar: {
      ...base.sidebar,
      ...patch.sidebar,
      destinations: {
        ...base.sidebar.destinations,
        ...patch.sidebar?.destinations,
      },
    },
    feedback: {
      ...base.feedback,
      ...patch.feedback,
      sounds: { ...base.feedback.sounds, ...patch.feedback?.sounds },
      notifications: {
        ...base.feedback.notifications,
        ...patch.feedback?.notifications,
      },
    },
    tagPicker: { ...base.tagPicker, ...patch.tagPicker },
    search: {
      ...base.search,
      ...patch.search,
      scopes: { ...base.search.scopes, ...patch.search?.scopes },
    },
    allTags: { ...base.allTags, ...patch.allTags },
    sourcesView: { ...base.sourcesView, ...patch.sourcesView },
    api: { ...base.api, ...patch.api },
    updates: { ...base.updates, ...patch.updates },
    sync: { ...base.sync, ...patch.sync },
    storage: { ...base.storage, ...patch.storage },
    ai: { ...base.ai, ...patch.ai },
    agent: { ...base.agent, ...patch.agent },
    saveRecents: { ...base.saveRecents, ...patch.saveRecents },
  });
}

export function mergePrefs(
  app: DeepPartial<AppPrefs>,
  apostrophi: DeepPartial<ApostrophiPrefs>,
): Prefs {
  return mergeAll(mergeAll(DEFAULT_PREFS, app), apostrophi);
}

export function mergeApostrophiSlice(
  base: DeepPartial<ApostrophiPrefs>,
  patch: DeepPartial<ApostrophiPrefs> = {},
): ApostrophiPrefs {
  return pickPrefs(
    mergeAll(mergeAll(DEFAULT_PREFS, base), patch),
    APOSTROPHI_PREF_KEYS,
  );
}

export function mergeAppSlice(
  base: DeepPartial<AppPrefs>,
  patch: DeepPartial<AppPrefs> = {},
): AppPrefs {
  return pickPrefs(
    mergeAll(mergeAll(DEFAULT_PREFS, base), patch),
    APP_PREF_KEYS,
  );
}

export function readBundleApostrophiPrefs(): DeepPartial<ApostrophiPrefs> | null {
  const paths = resolvePaths();
  if (!existsSync(paths.settingsFile)) return null;
  const read = readBundleJson<Partial<ApostrophiPrefs>>(
    paths.settingsFile,
    paths.backupDir,
  );
  const slice = StoredSliceSchema.safeParse(read?.data);
  return slice.success ? storedSlice(slice.data) : null;
}

export function writeBundleApostrophiPrefs(
  slice: DeepPartial<ApostrophiPrefs>,
): void {
  writeBundleJson(resolvePaths().settingsFile, slice);
}

export interface SplitPrefsPatch {
  app: DeepPartial<AppPrefs>;
  apostrophi: DeepPartial<ApostrophiPrefs>;
}

export function splitPrefsPatch(patch: DeepPartial<Prefs>): SplitPrefsPatch {
  const apostrophi: DeepPartial<ApostrophiPrefs> = {};
  const app: DeepPartial<AppPrefs> = {};
  for (const key of APOSTROPHI_PREF_KEYS) {
    if (patch[key] !== undefined) assignSlice(apostrophi, key, patch[key]);
  }
  for (const key of APP_PREF_KEYS) {
    if (patch[key] !== undefined) assignSlice(app, key, patch[key]);
  }
  return { app, apostrophi };
}

function assignSlice<T extends object, K extends keyof Prefs>(
  target: T,
  key: K,
  value: DeepPartial<Prefs>[K],
): void {
  /** SAFETY: `key` indexes both objects with the same `Prefs` key, so the value type matches. */
  (target as Record<K, DeepPartial<Prefs>[K]>)[key] = value;
}

function pickPrefs<K extends keyof Prefs>(
  prefs: Prefs,
  keys: readonly K[],
): Pick<Prefs, K> {
  /** SAFETY: filled from `keys` on the line below, which is exactly the picked key set. */
  const out = {} as Pick<Prefs, K>;
  for (const key of keys) out[key] = prefs[key];
  return out;
}
