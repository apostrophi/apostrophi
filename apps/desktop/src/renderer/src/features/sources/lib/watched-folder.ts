import { watchedFolderFlow } from "@/features/sources/state/watched-folder-flow";

export async function pickWatchedFolder(): Promise<void> {
  const result = await window.apostrophi.query("autoImport.pickFolder", {});
  if (result.ok) watchedFolderFlow.added();
}
