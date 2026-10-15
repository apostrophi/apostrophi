import type { Source } from "@apostrophi/schema/db";
import { hostToSource } from "@apostrophi/schema/sources";

export function downloadBrandSource(source: Source, url: string): Source {
  return hostToSource(url) ?? source;
}
