import type { Prefs } from "@apostrophi/schema";
import {
  contextBridge,
  type IpcRendererEvent,
  ipcRenderer,
  webUtils,
} from "electron";
import type {
  CombineImagesWindowLoad,
  CombineImagesZoomAction,
} from "../shared/combine-images-contracts";
import type { QueryClient } from "../shared/query-contracts";

/** Sandboxed preloads can't require sibling chunks, so channels are inlined instead of imported from the shared contract. */
const COMBINE_IMAGES_WINDOW_IPC = {
  load: "apostrophi:combine-images-window-load",
  ready: "apostrophi:combine-images-window-ready",
  close: "apostrophi:combine-images-window-close",
  resolveDrop: "apostrophi:combine-images-window-resolve-drop",
  zoom: "apostrophi:combine-images-window-zoom",
} as const;

const IPC = {
  query: "apostrophi:query",
  libraryId: "apostrophi:library-id",
  prefsChanged: "apostrophi:prefs-changed",
} as const;

const query: QueryClient = (name, ...args) =>
  ipcRenderer.invoke(IPC.query, name, args[0]);

const api = {
  query,
  libraryId(): string {
    return ipcRenderer.sendSync(IPC.libraryId);
  },
  onPrefsChanged(callback: (prefs: Prefs) => void): () => void {
    const listener = (_event: IpcRendererEvent, prefs: Prefs) =>
      callback(prefs);
    ipcRenderer.on(IPC.prefsChanged, listener);
    return () => ipcRenderer.off(IPC.prefsChanged, listener);
  },
};

const combineApi = {
  ready(): Promise<CombineImagesWindowLoad> {
    return ipcRenderer.invoke(COMBINE_IMAGES_WINDOW_IPC.ready);
  },
  close(): Promise<void> {
    return ipcRenderer.invoke(COMBINE_IMAGES_WINDOW_IPC.close);
  },
  onLoad(callback: (load: CombineImagesWindowLoad) => void): () => void {
    const listener = (
      _event: IpcRendererEvent,
      load: CombineImagesWindowLoad,
    ) => callback(load);
    ipcRenderer.on(COMBINE_IMAGES_WINDOW_IPC.load, listener);
    return () => ipcRenderer.off(COMBINE_IMAGES_WINDOW_IPC.load, listener);
  },
  onZoom(callback: (action: CombineImagesZoomAction) => void): () => void {
    const listener = (
      _event: IpcRendererEvent,
      action: CombineImagesZoomAction,
    ) => callback(action);
    ipcRenderer.on(COMBINE_IMAGES_WINDOW_IPC.zoom, listener);
    return () => ipcRenderer.off(COMBINE_IMAGES_WINDOW_IPC.zoom, listener);
  },
  /** Resolves files dropped from the Library window back to Save IDs. */
  resolveDrop(files: readonly File[]): Promise<string[]> {
    const paths = files.map((file) => webUtils.getPathForFile(file));
    return ipcRenderer.invoke(
      COMBINE_IMAGES_WINDOW_IPC.resolveDrop,
      paths.filter(Boolean),
    );
  },
};

contextBridge.exposeInMainWorld("apostrophi", api);
contextBridge.exposeInMainWorld("apostrophiCombine", combineApi);
export type ApostrophiCombineApi = typeof combineApi;
