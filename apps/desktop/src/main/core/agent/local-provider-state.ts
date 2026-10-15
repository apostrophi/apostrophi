import type { Prefs } from "@apostrophi/schema";

export function isLocalProviderConnected(
  provider: string,
  agent: Pick<Prefs["agent"], "enabledKeys" | "connectedLocalProviders">,
): boolean {
  return (
    (provider === "ollama" || provider === "lmstudio") &&
    (agent.connectedLocalProviders?.[provider] ??
      agent.enabledKeys[provider] === true)
  );
}
