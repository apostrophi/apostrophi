import { contextBridge, type IpcRendererEvent, ipcRenderer } from "electron";
import type {
  PreviewFileAction,
  PreviewFileActionResult,
  PreviewNeighborRequest,
  PreviewWindowConfigure,
  PreviewWindowState,
} from "../shared/preview-window-contracts";

const IPC = {
  previewConfigure: "apostrophi:preview-configure",
  previewNeighborRequest: "apostrophi:preview-neighbor-request",
  previewFileAction: "apostrophi:preview-file-action",
  previewClose: "apostrophi:preview-close",
  previewState: "apostrophi:preview-state",
} as const;

const api = {
  configure(input: PreviewWindowConfigure): Promise<void> {
    return ipcRenderer.invoke(IPC.previewConfigure, input);
  },
  close(windowId: number): Promise<void> {
    return ipcRenderer.invoke(IPC.previewClose, windowId);
  },
  requestNeighbor(input: PreviewNeighborRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.previewNeighborRequest, input);
  },
  fileAction(input: PreviewFileAction): Promise<PreviewFileActionResult> {
    return ipcRenderer.invoke(IPC.previewFileAction, input);
  },
  onState(callback: (state: PreviewWindowState) => void): () => void {
    const listener = (_event: IpcRendererEvent, state: PreviewWindowState) =>
      callback(state);
    ipcRenderer.on(IPC.previewState, listener);
    return () => ipcRenderer.off(IPC.previewState, listener);
  },
};

contextBridge.exposeInMainWorld("apostrophiPreview", api);

export type ApostrophiPreviewApi = typeof api;
