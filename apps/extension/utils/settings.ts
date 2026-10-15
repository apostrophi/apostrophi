import { storage } from "wxt/utils/storage";
import type { JsonValue } from "./json";
import {
  type ApostrophiSettings,
  DEFAULT_SETTINGS,
  normalizeStoredSettings,
} from "./types";

const item = storage.defineItem<JsonValue>("local:settings");

export async function getSettings(): Promise<ApostrophiSettings> {
  return normalizeStoredSettings(await item.getValue());
}

export async function ensureSettings(): Promise<void> {
  if ((await item.getValue()) == null) {
    await item.setValue(DEFAULT_SETTINGS);
  }
}
