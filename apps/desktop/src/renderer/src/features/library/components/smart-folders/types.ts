import type { Prefs } from "@apostrophi/schema";
import type { SavedView } from "@apostrophi/schema/db";

export type EditorRequest =
  | {
      mode: "create";
      kind: "smart_folder" | "group";
      parentId: string | null;
      onSaved: () => void;
    }
  | { mode: "edit"; view: SavedView };

export type OpenEditor = (request: EditorRequest) => void;

export type SavedViewPresentation = Prefs["savedViewViews"][string];
