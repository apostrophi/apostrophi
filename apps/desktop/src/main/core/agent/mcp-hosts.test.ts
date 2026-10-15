import { describe, expect, it } from "vitest";
import {
  apostrophiLaunchLine,
  hostSetupCommands,
} from "../../../shared/mcp-hosts";
import { apostrophiMcpSnippet, mcpInstallUrl } from "./mcp-hosts";

describe("mcp hosts", () => {
  it("builds Claude Code setup commands from the Apostrophi launch", () => {
    const commands = hostSetupCommands(
      "claude-code",
      "/Applications/Apostrophi.app/Contents/MacOS/Apostrophi",
      ["--mcp"],
    );
    expect(commands[0]?.value).toBe(
      "claude mcp add --scope user apostrophi -- /Applications/Apostrophi.app/Contents/MacOS/Apostrophi --mcp",
    );
    expect(commands[1]?.value).toBe("claude mcp get apostrophi");
  });

  it("quotes launch paths that contain spaces", () => {
    expect(
      apostrophiLaunchLine(
        "/Users/Raphael Salaja/Apostrophi.app/Contents/MacOS/Apostrophi",
        ["--mcp"],
      ),
    ).toBe(
      '"/Users/Raphael Salaja/Apostrophi.app/Contents/MacOS/Apostrophi" --mcp',
    );
  });

  it("builds a Cursor install URL from the Apostrophi command", () => {
    const url = mcpInstallUrl("cursor", "/bin/apostrophi", ["--mcp"]);
    expect(url).toContain("name=apostrophi");
    expect(
      mcpInstallUrl("claude-code", "/bin/apostrophi", ["--mcp"]),
    ).toBeNull();
  });

  it("serializes the Apostrophi stdio snippet", () => {
    expect(apostrophiMcpSnippet("/bin/apostrophi", ["--mcp"]).json).toContain(
      "--mcp",
    );
  });
});
