/** Keep in sync with apps/desktop and apps/extension package versions on each release. */
const APOSTROPHI_VERSION = "1.0.1";

const RELEASES_BASE =
  "https://github.com/apostrophi/apostrophi/releases/latest/download";

export function dmgUrl(arch: "arm64" | "x64"): string {
  return `${RELEASES_BASE}/Apostrophi-${APOSTROPHI_VERSION}-${arch}.dmg`;
}

export function extensionZipUrl(): string {
  return `${RELEASES_BASE}/apostrophi-extension-${APOSTROPHI_VERSION}.zip`;
}
