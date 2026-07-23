# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**daigram** — editor de diagramas animados de arquitectura. 100% client-side (sin backend, sin cuenta): Astro sirve una sola página estática y todo vive en el navegador. UI en español/inglés; los comentarios del código están en español.

## Commands

Uses **pnpm** (see pnpm-lock.yaml).

- `pnpm dev` — dev server
- `pnpm build` — production build to `dist/`
- `pnpm preview` — serve the build
- `node scripts/convert-excalidrawlib.mjs [--sheet]` — regenerate `src/scripts/gen-icons.js` from the `src/*.excalidrawlib` files. `--sheet` also writes `scripts/contact-sheet.html` to visually review/name icons.

No tests and no linter are configured.

## Architecture

The DOM lives in Astro components and all behavior in one JS file:

- `src/pages/index.astro` composes the static DOM from `src/components/` (Toolbar, ToolRail, Stage with canvas `#cv` inside `#wrap`, SidePanel, PagesBar, and `components/modals/` for templates/Mermaid/AI/export/autosave). Styles are split by purpose in `src/styles/` (entry: `index.css`). Elements are wired by **id**; `app.js` grabs them with the `$(id)` helper, so ids in the components and `app.js` must stay in sync.
- `src/scripts/app.js` (~1,750 lines) — the whole application: state, rendering, interaction, persistence, importers, export. Only dependency is `roughjs` (sketch skin).

### Data model (app.js)

- `doc = { theme, skin, pages[], cur }`; each page is `{ name, nodes[], edges[], nextId }`. `P()` returns the current page.
- Nodes and edges are plain objects sharing one numeric id sequence per page (`nextId`). Nodes: `{id, shape, x, y, w, h, label, color, pulse, order, fs?, icon?, img?}` — x/y is the **center**. Edges: `{id, from, to, fromSide, toSide, route, waypoints[], label, animated, dashed, startArrow, endArrow, flowDir, speedFactor, dotCount}`.
- `settings` (speed, dots, build, stagger, grid) is global, saved alongside `doc`.

### Rendering

One `requestAnimationFrame` loop calls `render(ctx, now())` forever. `render()` draws background/grid, then all edges, then all nodes, plus interaction overlays (selection, marquee, side arrows). World coordinates are transformed by `viewX/viewY/viewZoom`; `getWorld(ev)` converts pointer events to world space. The **same** `render()` with `{export:true}` drives PNG/JPG export; SVG export is a separate serializer (`nodeToSVG`/`edgeToSVG`).

### Interaction

Pointer handlers on `#wrap` implement everything via mode + drag-state globals: `mode` ("select"/"connect"), `pendingShape`/`pendingIcon` (next click creates), and one of `drag`/`resizing`/`wpDrag`/`connectDrag`/`marquee`/`panDrag`. `hitTest()` does shape-aware picking (top node first, then edges). Selection lives in `selN`/`selE` Sets; `refreshPanel()` shows/hides the right-panel rows by selection type.

### Persistence & sharing

- Autosave: debounced to localStorage (`daigram.autosave.v1`). Any mutation should call `pushUndo()` first (undo/redo snapshots current page only) and `scheduleAutosave()` after. `runWithoutAutosave()` suppresses it during bulk loads.
- Files: `.daigram.json` = `{version, app:"daigram", doc, settings}`; validated by `app==="daigram"`. Also loadable by drag-drop and paste.
- Share links: project deflate-compressed into the URL hash (`#d=c.<base64url>`).
- PWA: `public/sw.js` + manifest, registered only in prod builds.

### Diagram generators (all create/replace a page)

- **Templates**: `TEMPLATES` array built with the `tpl()`/`tplNode()` mini-DSL; labels use `"es|en"` strings split by `tplTxt()`.
- **Mermaid import**: hand-rolled parser (`mermaidToPage`) supporting flowchart/graph and sequenceDiagram.
- **AI**: calls MiniMax chat completions directly from the browser (`generateAI`). Key comes from `PUBLIC_MINIMAX_KEY` in `.env` (client-exposed, local use only) or localStorage override. The model returns a JSON graph parsed leniently by `parseAIGraph`, then `aiGraphToPage()` sanitizes shapes/positions and appends a new page.

### Icons

Two sources merged into `ICONS`: hand-drawn ones defined inline with `defIcon()` in app.js, plus `GEN_ICONS` from `src/scripts/gen-icons.js` — **generated, do not hand-edit**. To change generated icons, edit the `.excalidrawlib` files or `scripts/excalidraw-names.json` (name overrides; `false` discards an item) and re-run the convert script.

### i18n

All UI strings live in the `I18N` object (es/en) in app.js; static DOM text is tagged with `data-i18n`/`data-i18n-title`/`data-i18n-ph` attributes and translated by `applyLang()`. New UI strings must be added to **both** languages.
