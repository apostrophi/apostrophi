import type { ExternalSource } from "@apostrophi/schema/sources";
import type { BlankDocumentKind } from "./blank-documents";

export const DEFAULT_INGEST_PORT = 41610;

export const DEFAULT_LIBRARY_NAME = "My Apostrophi";

export const LIBRARY_SCHEMA_VERSION = 1;

export const KEYCHAIN_SERVICE = "so.apostrophi.desktop";

export const KEYCHAIN_INGEST_TOKEN = "ingest-token";

export const KEYCHAIN_AGENT_PREFIX = "agent";

export const APOSTROPHI_PROTOCOL = "apostrophi";

export const IPC = {
  tx: "apostrophi:tx",
  txBatch: "apostrophi:tx-batch",
  undo: "apostrophi:undo",
  redo: "apostrophi:redo",
  query: "apostrophi:query",
  syncAction: "apostrophi:sync-action",
  appInfo: "apostrophi:app-info",
  rendererReady: "apostrophi:renderer-ready",
  nav: "apostrophi:nav",
  prefsChanged: "apostrophi:prefs-changed",
  openExternal: "apostrophi:open-external",
  revealSave: "apostrophi:reveal-save",
  openSaveFile: "apostrophi:open-save-file",
  refreshSave: "apostrophi:refresh-save",
  refreshBackfillStart: "apostrophi:refresh-backfill-start",
  refreshBackfillCancel: "apostrophi:refresh-backfill-cancel",
  pipelinePause: "apostrophi:pipeline-pause",
  pipelineCancelSave: "apostrophi:pipeline-cancel-save",
  pipelineCancelAll: "apostrophi:pipeline-cancel-all",
  sourceConnect: "apostrophi:source-connect",
  sourceStatus: "apostrophi:source-status",
  sessionPendingClear: "apostrophi:session-pending-clear",
  sessionImported: "apostrophi:session-imported",
  eagleImportProgress: "apostrophi:eagle-import-progress",
  syncRunNow: "apostrophi:sync-run-now",
  syncStatus: "apostrophi:sync-status",
  syncRunAll: "apostrophi:sync-run-all",
  syncCancel: "apostrophi:sync-cancel",
  governorSetPaused: "apostrophi:governor-set-paused",
  governorResumeSource: "apostrophi:governor-resume-source",
  storageStatus: "apostrophi:storage-status",
  editUndoRequested: "apostrophi:edit-undo-requested",
  editRedoRequested: "apostrophi:edit-redo-requested",
  shortcutAction: "apostrophi:shortcut-action",
  menuAction: "apostrophi:menu-action",
  libraryId: "apostrophi:library-id",
  menuRecents: "apostrophi:menu-recents",
  menuOpenSave: "apostrophi:menu-open-save",
  archiveNavigate: "apostrophi:archive-navigate",
  archiveBackfillStart: "apostrophi:archive-backfill-start",
  archiveSite: "apostrophi:archive-site",
  agentChunk: "apostrophi:agent-chunk",
  agentStream: "apostrophi:agent-stream",
  agentFilter: "apostrophi:agent-filter",
  agentCite: "apostrophi:agent-cite",
  agentOverlay: "apostrophi:agent-overlay",
  previewOpen: "apostrophi:preview-open",
  previewConfigure: "apostrophi:preview-configure",
  previewNavigate: "apostrophi:preview-navigate",
  previewNeighborRequest: "apostrophi:preview-neighbor-request",
  previewFileAction: "apostrophi:preview-file-action",
  previewClose: "apostrophi:preview-close",
  previewState: "apostrophi:preview-state",
} as const;

export interface RecentMenuEntry {
  id: string;
  title: string;
}

export type BlankDocumentMenuActionId =
  `library.new-blank-${BlankDocumentKind}`;

export type ConnectSourceMenuActionId = `library.connect-${ExternalSource}`;
export type WatchSourceMenuActionId = `library.watch-${ExternalSource}`;

export type FindFilterMenuActionId = `find.filter.${string}`;

export type FindReverseImageMenuActionId =
  `find.reverse-image.${"google-lens" | "yandex" | "bing" | "tineye" | "saucenao" | "baidu" | "sogou"}`;

export type MenuActionId =
  | "history.back"
  | "history.forward"
  | "history.clear"
  | "selection.select-all"
  | "selection.clear"
  | "selection.invert"
  | "view.inspector.toggle"
  | "view.layout.cycle"
  | "view.zoom-in"
  | "view.zoom-out"
  | "view.zoom-reset"
  | "library.search"
  | "nav.library"
  | "nav.sources"
  | "nav.downloads"
  | "nav.tags"
  | "nav.agent"
  | "nav.trash"
  | "nav.uncategorized"
  | "nav.untagged"
  | "nav.settings"
  | "view.layout.waterfall"
  | "view.layout.grid"
  | "view.layout.justified"
  | "view.layout.list"
  | "theme.light"
  | "theme.dark"
  | "theme.system"
  | "refresh.all"
  | "refresh.cancel"
  | "save.reveal"
  | "save.open-with-default"
  | "save.open-original"
  | "save.copy-url"
  | "save.copy-media"
  | "save.copy-id"
  | "save.copy-name"
  | "save.copy-file-path"
  | "save.copy-apostrophi-link"
  | "save.copy-tags"
  | "save.paste-tags"
  | "save.rename"
  | "save.add-tag"
  | "save.refresh"
  | "save.trash"
  | "save.untrash"
  | "save.delete-forever"
  | "save.bulk-trash"
  | "save.bulk-refresh"
  | "save.export-files"
  | "save.export-converted"
  | "save.export-eagle-package"
  | "save.export-apostrophi-package"
  | "save.export-csv"
  | "save.remove-current-folder"
  | "trash.empty"
  | "trash.restore-all"
  | "library.move"
  | "library.new"
  | "library.open"
  | "library.backup"
  | "library.restore"
  | "library.merge"
  | "library.connect"
  | "library.new-folder"
  | "library.new-smart-folder"
  | "library.new-smart-folder-group"
  | "library.new-note"
  | "library.new-tag"
  | "library.new-tag-group"
  | "library.import-files"
  | "library.import-folders"
  | "library.import-links"
  | "library.import-clipboard"
  | "library.import-bookmarks"
  | "library.import-page-assets"
  | "library.import-eagle"
  | "library.import-package"
  | "library.watch"
  | ConnectSourceMenuActionId
  | WatchSourceMenuActionId
  | "library.connect-pinterest"
  | BlankDocumentMenuActionId
  | "library.auto-import-folder"
  | "library.find-duplicates-all"
  | "library.find-duplicates-list"
  | "library.find-duplicates-selected"
  | "library.rescan"
  | "library.verify-integrity"
  | "find.search"
  | "find.search-all"
  | "find.go-to-folder"
  | "find.add-to-folders"
  | "find.add-to-last-folder"
  | "find.filters.toggle"
  | "find.filters.reset"
  | "find.visual-search"
  | FindFilterMenuActionId
  | FindReverseImageMenuActionId
  | "organize.rating.0"
  | "organize.rating.1"
  | "organize.rating.2"
  | "organize.rating.3"
  | "organize.rating.4"
  | "organize.rating.5"
  | "organize.add-to-folders"
  | "organize.add-to-last-folder"
  | "organize.add-tag"
  | "organize.clear-tags"
  | "organize.copy-tags"
  | "organize.paste-tags"
  | "view.sidebar.toggle"
  | "view.agent.toggle"
  | "view.grayscale"
  | "view.random"
  | "view.subfolders.toggle"
  | "help.shortcuts"
  | "help.export-debug-report";

export type MenuActionSource = "accelerator" | "menu" | "automation";

export interface MenuActionEvent {
  id: MenuActionId;
  source: MenuActionSource;
}
