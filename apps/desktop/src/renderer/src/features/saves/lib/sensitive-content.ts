import { sensitiveContentBand } from "@apostrophi/schema/content-safety";

export function shouldBlurSensitiveThumbnail(
  enabled: boolean,
  score: number | null | undefined,
): boolean {
  return enabled && sensitiveContentBand(score) === "likely-sensitive";
}
