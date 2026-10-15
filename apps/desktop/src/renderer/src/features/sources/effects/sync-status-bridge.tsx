import { useEffect } from "react";
import { syncMonitor } from "@/features/sources/state/sync-monitor";

export function SyncStatusBridge() {
  useEffect(() => {
    return window.apostrophi.onSyncStatus((update) => {
      syncMonitor.ingest(update);
    });
  }, []);

  return null;
}
