import { sourceIdentity } from "@apostrophi/schema/domain";
import { colorNear } from "@apostrophi/schema/filters/color";
import type Database from "better-sqlite3";
import { z } from "zod";
import { seededOrderKey } from "../../shared/order-key";
import {
  ensureVecDeleteTrigger,
  ensureVecTables,
  loadSqliteVec,
} from "../core/vec-index";
import { manualOrderRank } from "../lib/folder-order";
import { migrateApostrophi } from "./migrations";

export function initializeApostrophiSchema(
  sqlite: Database.Database,
  loadVectorExtension = loadSqliteVec,
): boolean {
  sqlite.function(
    "apostrophi_source_identity",
    { deterministic: true },
    (siteName, source, url) => {
      const text = z.string().nullable();
      return sourceIdentity({
        siteName: text.safeParse(siteName).data ?? null,
        source: text.safeParse(source).data ?? null,
        url: text.safeParse(url).data ?? null,
      });
    },
  );
  sqlite.function(
    "apostrophi_color_near",
    { deterministic: true },
    (palette, hex, tolerance) => {
      const color = z.string().safeParse(hex);
      const distance = z.number().safeParse(tolerance);
      const encoded = z.string().safeParse(palette);
      if (!color.success || !distance.success || !encoded.success) return 0;
      try {
        const colors = z.array(z.string()).parse(JSON.parse(encoded.data));
        return colorNear(color.data, colors, distance.data) ? 1 : 0;
      } catch {
        return 0;
      }
    },
  );
  sqlite.function(
    "apostrophi_order_key",
    { deterministic: true },
    (id, seed) =>
      z.string().safeParse(id).success && z.string().safeParse(seed).success
        ? seededOrderKey(z.string().parse(id), z.string().parse(seed))
        : 0,
  );
  sqlite.function(
    "apostrophi_manual_rank",
    { deterministic: true },
    (key, id) =>
      z.string().safeParse(key).success && z.string().safeParse(id).success
        ? manualOrderRank(z.string().parse(key), z.string().parse(id))
        : null,
  );
  const vectorEnabled = loadVectorExtension(sqlite);
  if (vectorEnabled) ensureVecTables(sqlite);
  migrateApostrophi(sqlite);
  sqlite.exec(
    "CREATE TABLE IF NOT EXISTS mutation_commits (batch_id TEXT PRIMARY KEY)",
  );
  if (vectorEnabled) ensureVecDeleteTrigger(sqlite);
  return vectorEnabled;
}
