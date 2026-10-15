import { QuerySchema } from "@apostrophi/schema/filters";
import {
  type LocalApiLibraryQueryRequest,
  LocalApiLibraryQueryRequestSchema,
  type LocalApiQueryPage,
} from "@apostrophi/schema/local-api";

export type LibraryQueryRequest = LocalApiLibraryQueryRequest;
export type LibraryQueryPage = LocalApiQueryPage;

export const LibraryFilterSchema = QuerySchema;
export const LibraryQueryRequestSchema = LocalApiLibraryQueryRequestSchema;
