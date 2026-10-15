import { IconGear3, IconRefresh, IconWindowDownload } from "@apostrophi/icons";
import { IconGithub } from "@apostrophi/icons/social-media";
import type { MenuItemSpec } from "@apostrophi/ui";
import { openSettings } from "@/shared/lib/open-settings";
import { shortcutGlyphs } from "@/shared/lib/shortcuts";

const GITHUB = "https://github.com/apostrophi/apostrophi";

export function buildWorkspaceMenuItems({
  onBrowserExtension,
}: {
  onBrowserExtension: () => void;
}): MenuItemSpec[] {
  return [
    {
      label: "Settings",
      icon: <IconGear3 />,
      shortcut: shortcutGlyphs("app.settings"),
      onClick: () => openSettings(),
    },
    { type: "separator" },
    {
      label: "Check for Updates",
      icon: <IconRefresh />,
      onClick: () => openSettings("general"),
    },
    {
      label: "Browser Extension",
      icon: <IconWindowDownload />,
      onClick: onBrowserExtension,
    },
    { type: "separator" },
    {
      label: "GitHub",
      icon: <IconGithub />,
      onClick: () => void window.apostrophi.openExternal(GITHUB),
    },
  ];
}
