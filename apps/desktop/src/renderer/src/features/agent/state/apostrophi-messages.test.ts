import { expect, it } from "vitest";
import {
  type ApostrophiUIMessage,
  fromUIMessage,
  partData,
  toUIMessage,
} from "./apostrophi-messages";

it("preserves work timing for streamed and reopened replies without tools", () => {
  const live: ApostrophiUIMessage = {
    id: "reply",
    role: "assistant",
    parts: [{ type: "text", text: "Hello" }],
    metadata: { elapsedMs: 90000 },
  };
  const saved = fromUIMessage(live, "chat");
  expect(saved.metadata?.elapsedMs).toBe(90000);
  expect(fromUIMessage(toUIMessage(saved), "chat").metadata?.elapsedMs).toBe(
    90000,
  );
});

it("uses the latest streamed tool snapshot instead of the first running state", () => {
  const message: ApostrophiUIMessage = {
    id: "reply",
    role: "assistant",
    parts: [
      {
        type: "data-apostrophi-steps",
        data: [{ id: "1", label: "Search library", status: "running" }],
      },
      {
        type: "data-apostrophi-steps",
        data: [
          { id: "1", label: "Search library", status: "complete" },
          { id: "2", label: "Read Save", status: "running" },
        ],
      },
      { type: "data-apostrophi-activity", data: { activity: "searching" } },
      { type: "data-apostrophi-activity", data: { activity: "reading" } },
    ],
  };
  expect(partData(message, "apostrophi-activity")).toEqual({
    activity: "reading",
  });
  expect(fromUIMessage(message, "chat").metadata?.steps).toEqual([
    { id: "1", label: "Search library", status: "complete" },
    { id: "2", label: "Read Save", status: "running" },
  ]);
});
