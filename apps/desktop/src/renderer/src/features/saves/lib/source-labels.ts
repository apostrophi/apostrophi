import { resolveSourceId, sourceLabel } from "@apostrophi/schema/sources";

export function getSourceLabel(source: string): string {
  const normalized = resolveSourceId(source);
  if (normalized) return sourceLabel(normalized);
  return source.charAt(0).toUpperCase() + source.slice(1);
}
