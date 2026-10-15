import { z } from "zod";
import { SavePatchesSchema } from "../lib/reconcile";
import { readSnapshot, scheduleSnapshotWrite } from "../lib/snapshot";
import { applyActionCoalesced } from "../lib/sync-coalesce";
import { createSaveBootstrap } from "./save-bootstrap";

const Page = z.object({
  rows: SavePatchesSchema.catch([]),
  nextCursor: z
    .object({ savedAt: z.number(), id: z.string() })
    .nullish()
    .catch(null),
  total: z.number().nullish().catch(null),
});

const bootstrap = createSaveBootstrap({
  readSnapshot,
  scheduleSnapshotWrite,
  applyActionCoalesced,
  rendererReady: () => window.apostrophi.rendererReady(),
  onSyncAction: (callback) => window.apostrophi.onSyncAction(callback),
  loadAll: async () =>
    SavePatchesSchema.parse(await window.apostrophi.query("saves.list", {})),
  loadPage: async (params) =>
    Page.parse(await window.apostrophi.query("saves.listPage", params)),
});

export const { bootPool, pagingStore, loadNextPage, hydrateFullPool } =
  bootstrap;
