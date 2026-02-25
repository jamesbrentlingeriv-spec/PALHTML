---
title: PALHTML
emoji: 👓
colorFrom: blue
colorTo: indigo
sdk: static
app_file: index.html
pinned: false
---

Check out the configuration reference at
https://huggingface.co/docs/hub/spaces-config-reference

# PALHTML

PALHTML is a static web app for PAL Optical workflows (quotes, receipts,
inventory, lens availability, and contact pages).

## Project Structure

- `index.html` - main entry page
- `contact.html`
- `lensavail.html`
- `LABLENS.HTML`
- `TracyFrameInventory.html`
- `PALQUOTE (1).HTML`
- `PAL OPTICAL RECEIPT.HTML`
- `DRITEMIZEDRECPT.HTML`
- `assets/` - loaders and static assets
- `Pal_Optical_Lens_Catalog.json` and `Pal_Optical_Lens_Database.json` - data
  files

## Deploy on Hugging Face Spaces (Static)

This repo is already static HTML/CSS/JS, so the easiest Spaces option is a
**Static Space**.

1. Create a new Space on Hugging Face.
2. Choose `Static` as the SDK.
3. Connect this GitHub repository (or push this repo to the Space repo).
4. Ensure `index.html` is at the repository root (it is).
5. Commit and push to trigger the Space build.

Optional metadata in `README.md` front matter (if you want custom title/color):

```md
---
title: PALHTML
emoji: 👓
colorFrom: blue
colorTo: indigo
sdk: static
pinned: false
---
```

## Local Run (Current Static Version)

You can run locally with any static server:

```powershell
python -m http.server 7860
```

Then open: `http://localhost:7860`

## Svelte Version (Recommended Upgrade Path)

If you want PALHTML in Svelte, use SvelteKit and keep your existing
pages/components as incremental migrations.

### 1) Create a SvelteKit app

```powershell
npm create svelte@latest palhtml-svelte
cd palhtml-svelte
npm install
```

Choose:

- SvelteKit minimal template
- TypeScript optional
- ESLint/Prettier optional

### 2) Add static adapter (for Static Spaces build output)

```powershell
npm install -D @sveltejs/adapter-static
```

Update `svelte.config.js`:

```js
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "index.html",
    }),
  },
};

export default config;
```

### 3) Migrate PALHTML files into routes/components

- Move shared styles/scripts into `src/lib/`
- Create routes like:
  - `/` -> `src/routes/+page.svelte`
  - `/contact` -> `src/routes/contact/+page.svelte`
  - `/lensavail` -> `src/routes/lensavail/+page.svelte`
- Import JSON data from `src/lib/data/`

### 4) Build

```powershell
npm run build
```

Output folder: `build/`

### 5) Deploy Svelte build to Hugging Face Spaces

For static deployment on Spaces:

- Create a `Static` Space.
- Push the generated static site content (from `build/`) to the Space repository
  root, or set up CI to copy `build/*` into deploy root.

## Notes

- Existing `static.yml` is for GitHub Pages deployment and can remain if you
  also publish there.
- If you want, the next step is adding a proper `package.json` + build script in
  this repo to automate Svelte build-and-deploy for Hugging Face Spaces.
