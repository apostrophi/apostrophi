# @apostrophi/extension

Browser extension that captures saves from supported sites into your local Apostrophi library, and pushes signed-in cookies when you connect a source.

## Install from a release

1. Download `apostrophi-extension-X.Y.Z.zip` from [GitHub Releases](https://github.com/apostrophi/apostrophi/releases).
2. Unzip the archive.
3. Open Chrome → `chrome://extensions`
4. Enable **Developer mode**
5. Click **Load unpacked** and select the unzipped folder (e.g. `chrome-mv3`).

## Install from source

```bash
pnpm install
pnpm --filter @apostrophi/extension zip   # produces .output/*.zip
# or for dev with hot reload:
pnpm --filter @apostrophi/extension dev
```

Load unpacked from `apps/extension/.output/chrome-mv3` while developing.

## Capture

Open Apostrophi once so it can register the native host. Then:

1. Click the Apostrophi icon in the toolbar to save the current tab, or right-click a page, link, or image → **Save to Apostrophi**.
2. On supported sites, the usual save/bookmark control still sends the item into your library.
3. Session connect happens in the background when Apostrophi is waiting and you open that site signed in.

## Supported sources

See [`docs/supported-sources.md`](../../docs/supported-sources.md) for the full list.

## Scripts

| Script | What it does |
|--------|--------------|
| `pnpm dev` | WXT dev server on port 3001 |
| `pnpm build` | Production build to `.output/` |
| `pnpm zip` | Build + zip for distribution |
