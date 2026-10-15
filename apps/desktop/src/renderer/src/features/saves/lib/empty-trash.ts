import { Dialog } from "@apostrophi/ui";

export function confirmEmptyTrash(): void {
  Dialog.confirm({
    title: "Empty Trash",
    description:
      "Every save in Trash is deleted forever. This cannot be undone.",
    confirmLabel: "Empty Trash",
    busyLabel: "Emptying",
    onConfirm: async () => {
      await window.apostrophi.query("saves.emptyTrash", {});
    },
  });
}
