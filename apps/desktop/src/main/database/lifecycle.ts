import { existsSync } from "node:fs";
import type Database from "better-sqlite3";
import log from "electron-log/main.js";
import { recoverBatchJournal } from "../core/batch-journal";
import { backfillFontActivationIndex } from "../core/font-activation";
import { hydrateOrganizationBundle } from "../core/organization-bundle";
import { backfillVecBatch } from "../core/vec-index";
import { readOrCreateLibraryId } from "../lib/library-id";
import { resolvePaths } from "../paths";
import { initializeApostrophiSchema } from "./apostrophi-schema";
import { type Db, openSqlite, wrapSqlite } from "./client";
import { migrateGlobal } from "./migrations";

let cachedApostrophi: Db | null = null;
let cachedGlobal: Db | null = null;
let apostrophiDbInflight: Promise<Db> | null = null;

export async function getGlobalDb(): Promise<Db> {
  if (cachedGlobal) return cachedGlobal;
  const paths = resolvePaths();
  log.info("[apostrophi db] opening global", paths.globalDb);
  const sqlite = openSqlite(paths.globalDb);
  migrateGlobal(sqlite);
  cachedGlobal = wrapSqlite(sqlite);
  return cachedGlobal;
}

export async function getDb(): Promise<Db> {
  if (cachedApostrophi) return cachedApostrophi;
  if (apostrophiDbInflight) return apostrophiDbInflight;

  apostrophiDbInflight = openApostrophiDb().finally(() => {
    apostrophiDbInflight = null;
  });
  return apostrophiDbInflight;
}

async function openApostrophiDb(): Promise<Db> {
  await new Promise<void>((resolve) => setImmediate(resolve));

  const paths = resolvePaths();
  log.info("[apostrophi db] opening apostrophi index", paths.indexDb);

  readOrCreateLibraryId(paths.libraryRoot);
  const sqlite = openSqlite(paths.indexDb);
  let vectorEnabled: boolean;
  let opened: Db;
  try {
    vectorEnabled = initializeApostrophiSchema(sqlite);
    opened = wrapSqlite(sqlite);
    await recoverBatchJournal(
      paths.libraryRoot,
      (batchId) =>
        sqlite
          .prepare("SELECT 1 FROM mutation_commits WHERE batch_id = ?")
          .get(batchId) != null,
    );
    sqlite.exec("DELETE FROM mutation_commits");
    hydrateOrganizationBundle(opened, paths.libraryRoot);
  } catch (error) {
    sqlite.close();
    throw error;
  }
  cachedApostrophi = opened;

  ensureLibraryMetadata();

  scheduleDataMigrations(sqlite, vectorEnabled);

  return cachedApostrophi;
}

function scheduleDataMigrations(
  sqlite: Database.Database,
  vectorEnabled: boolean,
): void {
  setImmediate(() => {
    if (!sqlite.open || cachedApostrophi?.$raw !== sqlite) return;
    try {
      const updated = backfillFontActivationIndex(sqlite);
      if (updated > 0)
        log.info("[apostrophi db] font activation backfill", { updated });
    } catch (err) {
      log.warn("[apostrophi db] font activation backfill failed", err);
    }
  });

  const runVecBatch = (): void => {
    if (!sqlite.open || cachedApostrophi?.$raw !== sqlite) return;
    try {
      const result = backfillVecBatch(sqlite);
      if (result.processed > 0) {
        log.info("[apostrophi db] vec backfill batch", result);
      }
      if (result.hasMore) setImmediate(runVecBatch);
    } catch (err) {
      log.warn("[apostrophi db] vec backfill failed", err);
    }
  };
  if (vectorEnabled) setImmediate(runVecBatch);
}

export function closeDb(): void {
  if (cachedApostrophi) {
    try {
      cachedApostrophi.$raw.close();
    } catch (err) {
      log.warn("[apostrophi db] close failed", err);
    }
    cachedApostrophi = null;
  }
}

function ensureLibraryMetadata(): void {
  const paths = resolvePaths();
  if (!existsSync(paths.libraryRoot)) return;
  if (existsSync(paths.libraryMetadata)) return;
  readOrCreateLibraryId(paths.libraryRoot);
}
