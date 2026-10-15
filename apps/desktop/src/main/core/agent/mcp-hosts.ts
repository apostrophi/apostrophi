import type { McpDeeplinkHost, McpHostId } from "../../../shared/mcp-hosts";

export function apostrophiMcpSnippet(
  command = process.execPath,
  args: string[] = ["--mcp"],
) {
  return {
    command,
    args,
    json: JSON.stringify(
      { mcpServers: { apostrophi: { command, args } } },
      null,
      2,
    ),
  };
}

export function mcpInstallUrl(
  id: McpHostId,
  command: string,
  args: string[],
): string | null {
  if (id === "cursor") {
    const config = Buffer.from(JSON.stringify({ command, args })).toString(
      "base64",
    );
    return `cursor://anysphere.cursor-deeplink/mcp/install?name=apostrophi&config=${encodeURIComponent(config)}`;
  }
  if (id === "vscode") {
    return `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: "apostrophi", command, args }))}`;
  }
  return null;
}

export function mcpDeeplinkUrl(id: McpDeeplinkHost): string | null {
  return mcpInstallUrl(id, process.execPath, ["--mcp"]);
}
