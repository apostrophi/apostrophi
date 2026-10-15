import {
  ApostrophiLocalApi,
  ApostrophiLocalApiError,
  type LocalApiCursor,
  type LocalApiLibrary,
  type LocalApiSave,
} from "@apostrophi/local-api";
import { getPreferenceValues } from "@raycast/api";
import { z } from "zod";

interface ApostrophiPreferences {
  baseUrl: string;
  token: string;
}

export type ApostrophiSave = LocalApiSave;
export type ApostrophiLibrary = LocalApiLibrary;
export type ApostrophiCursor = LocalApiCursor;

export class ApostrophiApiError extends Error {}

function api(): ApostrophiLocalApi {
  const preferences = getPreferenceValues<ApostrophiPreferences>();
  return new ApostrophiLocalApi({
    baseUrl: preferences.baseUrl,
    token: preferences.token,
  });
}

async function request<Result>(operation: () => Promise<Result>) {
  try {
    return await operation();
  } catch (error) {
    if (
      error instanceof ApostrophiLocalApiError &&
      error.kind === "authentication"
    ) {
      throw new ApostrophiApiError(
        "Copy a fresh Local API Token from Apostrophi Settings.",
      );
    }
    if (
      error instanceof ApostrophiLocalApiError &&
      error.kind === "connection"
    ) {
      throw new ApostrophiApiError(
        "Open Apostrophi and check the Local API URL.",
      );
    }
    throw new ApostrophiApiError(
      error instanceof Error ? error.message : "Apostrophi returned an error.",
    );
  }
}

export async function searchLibrary(
  keywords: string,
  cursor: ApostrophiCursor | null,
  source: string | null,
): Promise<{
  saves: ApostrophiSave[];
  total: number;
  nextCursor: ApostrophiCursor | null;
  libraryId: string;
}> {
  const page = await request(() =>
    api().query({
      query: { combinator: "and", rules: [] },
      keywords: keywords.trim() || undefined,
      scope: source ? { source } : undefined,
      cursor,
      limit: 50,
      sortKey: "savedAt",
      sortDir: "desc",
    }),
  );
  if (page.ids.length === 0) {
    return {
      saves: [],
      total: page.total,
      nextCursor: page.nextCursor,
      libraryId: page.libraryId,
    };
  }

  const rows = await request(() => api().saves({ ids: page.ids }));
  const byId = new Map(rows.map((save) => [save.id, save]));
  return {
    saves: page.ids.flatMap((id) => {
      const save = byId.get(id);
      return save ? [save] : [];
    }),
    total: page.total,
    nextCursor: page.nextCursor,
    libraryId: page.libraryId,
  };
}

const CopyFileResultSchema = z.object({
  ok: z.boolean(),
  reason: z.string().optional(),
});

const COPY_FILE_FAILURES = new Map([
  ["no_files", "This Save has no file to copy."],
  ["missing", "The file is missing from your Library."],
  ["not_found", "This Save is no longer in your Library."],
]);

export async function copySaveFile(id: string): Promise<void> {
  const args = { id, fileIndex: 0 };
  const result = await request(async () => {
    const preview = await api().previewOperation("saves.copyFile", args);
    return api().runOperation("saves.copyFile", args, preview.token);
  });
  const parsed = CopyFileResultSchema.safeParse(result);
  if (!parsed.success)
    throw new ApostrophiApiError("Apostrophi returned an unexpected response.");
  if (!parsed.data.ok)
    throw new ApostrophiApiError(
      COPY_FILE_FAILURES.get(parsed.data.reason ?? "") ??
        "Couldn't copy the file. Try again.",
    );
}

export function fetchThumbnail(id: string) {
  return request(() => api().thumbnail(id));
}

export function enqueueUrl(url: string) {
  return request(() => api().enqueue({ url, trigger: "raycast" }));
}

export function listRecentLibraries() {
  return request(() => api().libraries());
}

export function switchLibrary(path: string) {
  return request(() => api().switchLibrary(path));
}

export function itemLink(libraryId: string, saveId: string): string {
  const url = new URL(`apostrophi://item/${encodeURIComponent(saveId)}`);
  url.searchParams.set("library", libraryId);
  return url.toString();
}

export function validatedUrl(value: string): string {
  const parsed = z.string().trim().url().safeParse(value);
  if (!parsed.success || !/^https?:/.test(parsed.data)) {
    throw new ApostrophiApiError("Enter an http or https URL.");
  }
  return parsed.data;
}
