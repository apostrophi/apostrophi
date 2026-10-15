import { type Query, QuerySchema } from "@apostrophi/schema/filters";
import { z } from "zod";

export const FilterQuery = z.custom<Query>(
  (value) => QuerySchema.safeParse(value).success,
);
