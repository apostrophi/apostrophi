import { useEffect } from "react";
import {
  setQuery,
  setSemanticQuery,
  setVisualProbe,
} from "@/features/library/state/view-store";
import { pool } from "@/features/saves/state/pool";
import { selection } from "@/features/saves/state/selection";

export function AgentLibraryBridge(): null {
  useEffect(() => {
    const stopFilter = window.apostrophi.onAgentFilter(setQuery);
    const stopCite = window.apostrophi.onAgentCite((ids) => {
      selection.set(ids);
    });
    const stopOverlay = window.apostrophi.onAgentOverlay((overlay) => {
      if ("semanticQuery" in overlay)
        setSemanticQuery(overlay.semanticQuery ?? null);
      if ("visualSaveId" in overlay) {
        const id = overlay.visualSaveId;
        if (!id) setVisualProbe(null);
        else {
          const save = pool.get(id);
          setVisualProbe({
            kind: "saveId",
            id,
            label: save?.title?.trim() || "Save",
          });
        }
      }
    });
    return () => {
      stopFilter();
      stopCite();
      stopOverlay();
    };
  }, []);
  return null;
}
