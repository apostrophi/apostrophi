# @apostrophi/cli

Use Apostrophi from scripts, terminals, and local agents. The CLI connects to Apostrophi's
authenticated loopback API. It never opens Library databases or files
directly.

## Install

```bash
npm install --global @apostrophi/cli
```

Open Apostrophi Settings, copy the Local API token, then authorize the CLI:

```bash
apostrophi auth authorize --token <token>
apostrophi doctor
```

## Examples

```bash
apostrophi saves search typography --md
apostrophi saves get <id> --json
apostrophi download https://example.com
printf '%s\n' https://example.com https://example.org | apostrophi download --stdin
apostrophi folders list --table
apostrophi schema --json --compact
```

Run `apostrophi help` or `apostrophi <command> --help` for the full command surface.
Structured output includes a schema version. Stdout contains data, while
progress and diagnostics use stderr.

Destructive commands use Apostrophi's operation previews. Interactive terminals can
confirm a preview. Automation must pass `--yes`.
