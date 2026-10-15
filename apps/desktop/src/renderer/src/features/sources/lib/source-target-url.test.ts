import { describe, expect, it } from "vitest";
import { sourceTargetUrl } from "./source-target-url";

describe("sourceTargetUrl", () => {
  it.each([
    [
      "instagram",
      "oluwa.rafa",
      undefined,
      "https://www.instagram.com/oluwa.rafa/",
    ],
    ["twitter", "@apostrophi", undefined, "https://x.com/apostrophi"],
    ["threads", "apostrophi", undefined, "https://www.threads.com/@apostrophi"],
    [
      "reddit",
      "apostrophi",
      undefined,
      "https://www.reddit.com/user/apostrophi/",
    ],
    ["tiktok", "apostrophi", undefined, "https://www.tiktok.com/@apostrophi"],
    [
      "pinterest",
      "apostrophi/ideas",
      "board",
      "https://www.pinterest.com/apostrophi/ideas/",
    ],
    [
      "arena",
      "apostrophi/channel",
      "channel",
      "https://www.are.na/apostrophi/channel",
    ],
    [
      "cosmos",
      "apostrophi/ideas",
      "cluster",
      "https://www.cosmos.so/apostrophi/ideas",
    ],
    [
      "youtube",
      "apostrophi/shorts",
      "channel",
      "https://www.youtube.com/@apostrophi",
    ],
    [
      "youtube",
      "PL apostrophi",
      "playlist",
      "https://www.youtube.com/playlist?list=PL%20apostrophi",
    ],
    ["twitter", "12345", "list", "https://x.com/i/lists/12345"],
  ] as const)("builds a %s target URL", (source, handle, kind, expected) => {
    expect(sourceTargetUrl({ source, handle, kind })).toBe(expected);
  });

  it("encodes each path segment without encoding separators", () => {
    expect(
      sourceTargetUrl({
        source: "cosmos",
        handle: "apostrophi user/visual ideas",
        kind: "cluster",
      }),
    ).toBe("https://www.cosmos.so/apostrophi%20user/visual%20ideas");
  });

  it("returns null without a usable handle", () => {
    expect(sourceTargetUrl({ source: "instagram", handle: null })).toBeNull();
    expect(sourceTargetUrl({ source: "instagram", handle: " / " })).toBeNull();
  });
});
