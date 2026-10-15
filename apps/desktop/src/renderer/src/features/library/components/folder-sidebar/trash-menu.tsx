import { IconArrowRotateClockwise, IconTrashXmark } from "@apostrophi/icons";
import type { MenuItemSpec } from "@apostrophi/ui";
import { confirmEmptyTrash } from "@/features/saves";

export function buildTrashMenuItems(hasItems: boolean): MenuItemSpec[] {
  return [
    {
      label: "Empty Trash",
      icon: <IconTrashXmark />,
      variant: "destructive",
      disabled: !hasItems,
      onClick: confirmEmptyTrash,
    },
    {
      label: "Restore All Items",
      icon: <IconArrowRotateClockwise />,
      disabled: !hasItems,
      onClick: () => {
        void window.apostrophi.query("saves.restoreAll", {});
      },
    },
  ];
}
