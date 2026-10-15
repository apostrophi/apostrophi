import { useEffect } from "react";
import { isEditableTarget } from "@/shared/lib/editable-target";

export function UndoRedoBridge() {
  useEffect(() => {
    const offUndo = window.apostrophi.onEditUndoRequested(() => {
      if (isEditableTarget()) return;
      void window.apostrophi.undo();
    });
    const offRedo = window.apostrophi.onEditRedoRequested(() => {
      if (isEditableTarget()) return;
      void window.apostrophi.redo();
    });
    return () => {
      offUndo();
      offRedo();
    };
  }, []);

  return null;
}
