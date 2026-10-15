# Apostrophi CLI

Use the `apostrophi` executable to work with the active local Apostrophi Library. Apostrophi must
be installed. Commands launch the app when its authenticated loopback service
is unavailable.

## Setup

```bash
npm install --global @apostrophi/cli
apostrophi auth authorize --token <token>
apostrophi doctor
```

Copy the Local API token from Apostrophi Settings. The CLI stores it with owner-only
file permissions.

## Agent output

Prefer compact JSON for structured work and Markdown for reading:

```bash
apostrophi saves search design systems --json --compact
apostrophi saves get <id> --md
apostrophi schema --json
```

Stdout contains data. Progress and diagnostics use stderr. Destructive
commands require a preview and confirmation. Pass `--yes` in non-interactive
automation.

## Common commands

```bash
apostrophi libraries current
apostrophi libraries list
apostrophi saves list
apostrophi saves search <terms...>
apostrophi saves get <id...>
apostrophi download <url...>
apostrophi download --stdin --ndjson
apostrophi folders list
apostrophi tags list
apostrophi sources accounts
apostrophi sync history
apostrophi downloads list
apostrophi duplicates list
apostrophi views list
apostrophi stats
apostrophi schema
```

Use `apostrophi operations list` and `apostrophi operations get <name>` to discover exact
operation schemas. Run a discovered operation with:

```bash
apostrophi operations run <name> --args '{"field":"value"}' --dry-run
apostrophi operations run <name> --args '{"field":"value"}' --yes
```
