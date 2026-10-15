export const MCP_HOST_IDS = [
  "claude-code",
  "cursor",
  "codex",
  "gemini-cli",
  "claude-desktop",
  "vscode",
  "other",
] as const;

export type McpHostId = (typeof MCP_HOST_IDS)[number];

export const MCP_DEEPLINK_HOSTS = ["cursor", "vscode"] as const;

export type McpDeeplinkHost = (typeof MCP_DEEPLINK_HOSTS)[number];

export interface McpHostDefinition {
  id: McpHostId;
  name: string;
  featured: boolean;
  configPath: string;
  hint: string;
  addLabel: string;
}

export const MCP_HOST_CATALOG: readonly McpHostDefinition[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    featured: true,
    configPath: "~/.claude.json",
    hint: "Claude Code lists Apostrophi after this command succeeds.",
    addLabel: "Add to Claude Code",
  },
  {
    id: "cursor",
    name: "Cursor",
    featured: true,
    configPath: "~/.cursor/mcp.json",
    hint: "Cursor Settings, MCP shows a green dot when Apostrophi is connected.",
    addLabel: "Add to Cursor",
  },
  {
    id: "codex",
    name: "OpenAI Codex",
    featured: true,
    configPath: "~/.codex/config.toml",
    hint: "Codex lists Apostrophi after this command succeeds.",
    addLabel: "Add to Codex",
  },
  {
    id: "gemini-cli",
    name: "Gemini CLI",
    featured: true,
    configPath: "~/.gemini/settings.json",
    hint: "Gemini CLI lists Apostrophi after this command succeeds.",
    addLabel: "Add to Gemini CLI",
  },
  {
    id: "claude-desktop",
    name: "Claude Desktop",
    featured: false,
    configPath:
      "~/Library/Application Support/Claude/claude_desktop_config.json",
    hint: "Claude Desktop MCP shows Apostrophi when connected.",
    addLabel: "Add to Claude Desktop",
  },
  {
    id: "vscode",
    name: "VS Code",
    featured: false,
    configPath: "~/Library/Application Support/Code/User/mcp.json",
    hint: "VS Code MCP shows Apostrophi when connected.",
    addLabel: "Add to VS Code",
  },
  {
    id: "other",
    name: "Other",
    featured: false,
    configPath: "your MCP client config",
    hint: "Merge this block into the client that should search this library.",
    addLabel: "Copy Config",
  },
];

export interface McpSetupCommand {
  label: string;
  value: string;
}

function shellToken(value: string): string {
  return /[\s"']/.test(value) ? `"${value.replaceAll('"', '\\"')}"` : value;
}

export function apostrophiLaunchLine(command: string, args: string[]): string {
  return [command, ...args].map(shellToken).join(" ");
}

export function hostSetupCommands(
  id: McpHostId,
  command: string,
  args: string[],
): McpSetupCommand[] {
  const launch = apostrophiLaunchLine(command, args);
  if (id === "claude-code") {
    return [
      {
        label:
          "Run in any terminal. --scope user makes it available in every project:",
        value: `claude mcp add --scope user apostrophi -- ${launch}`,
      },
      { label: "Verify:", value: "claude mcp get apostrophi" },
    ];
  }
  if (id === "codex") {
    return [
      {
        label: "Run in any terminal:",
        value: `codex mcp add apostrophi -- ${launch}`,
      },
      { label: "Verify:", value: "codex mcp get apostrophi" },
    ];
  }
  if (id === "gemini-cli") {
    return [
      {
        label: "Run in any terminal. -s user applies in every project:",
        value: `gemini mcp add -s user apostrophi ${launch}`,
      },
      { label: "Verify:", value: "gemini mcp list" },
    ];
  }
  return [];
}

export function isMcpDeeplinkHost(id: McpHostId): id is McpDeeplinkHost {
  return MCP_DEEPLINK_HOSTS.some((host) => host === id);
}
