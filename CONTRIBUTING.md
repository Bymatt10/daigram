# Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

We have a roadmap which we strongly recommend to go through and check if
something interests you. For new contributors we would recommend to start
with easy tasks.

In case you want to pick up something from the roadmap, comment on that issue
and one of the project maintainers will assign it to you, post which you can
discuss in the issue and start working on it.

## Setup

### Option 1 — Manual

1. Fork and clone the repo
2. Install [pnpm](https://pnpm.io) if you don't have it (`npm i -g pnpm`)
3. Run `pnpm install` to install dependencies
4. Create a branch for your PR: `git checkout -b your-branch-name`
5. To keep your local `main` pointing at the original repo and make pull
   requests from branches on your fork:

   ```bash
   git remote add upstream https://github.com/Bymatt10/daigram.git
   git fetch upstream
   git branch --set-upstream-to=upstream/main main
   ```

### Option 2 — GitHub Codespaces

1. Click the green **Code** button on the repo page
2. Switch to the **Codespaces** tab
3. Create a new codespace — devcontainer will install deps automatically
4. Run `pnpm dev` in the terminal

## Pull Request Guidelines

Don't worry if you get any of the below wrong, or if you don't know how. We'll
gladly help out.

### Title

Make sure the title starts with a semantic prefix:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code (white-space,
  formatting, missing semi-colons, etc)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `build:` Changes that affect the build system or external dependencies
  (example scopes: pnpm, astro, vite)
- `ci:` Changes to our CI configuration files and scripts
- `chore:` Other changes that don't modify `src` or test files
- `revert:` Reverts a previous commit

### Testing

There is no automated test suite yet — manually verify with `pnpm dev` that:

- `pnpm build` completes without errors
- The editor loads at `/` and the toolbar/rail/panel render correctly
- Mermaid import works for the syntax you touched (paste a sample in the
  Mermaid modal)
- Your change doesn't regress undo/redo, autosave, or share links
- For UI changes, check both ES and EN languages, and at least the **dark**
  and **claro** themes

For new features or bug-fixes it's good practice to add a manual test case
to the PR description so we don't regress later.

Finally — always manually test your changes by running `pnpm dev` and trying
the feature. As much as local development attempts to replicate production,
there can still be subtle differences. For larger features consider testing
your change in multiple browsers as well (Chrome, Firefox, Safari).

> Some checks require approval from the maintainers to run. They will appear
> as **Expected — Waiting for status to be reported** in the PR checks when
> they are waiting for approval.

## Where things live

- `src/pages/index.astro` — el DOM completo (toolbar, rail, canvas, panel,
  modales). Los ids se conectan con `app.js` por nombre.
- `src/scripts/app.js` — toda la app (~1.750 líneas): estado, render,
  interacción, persistencia, importadores, export.
- `src/scripts/gen-icons.js` — **generado** desde `.excalidrawlib` por
  `scripts/convert-excalidrawlib.mjs`. No editar a mano.
- `src/styles/global.css` — estilos globales.
- `public/` — assets estáticos, manifest, service worker.
- `scripts/` — utilidades de build (regenerar iconos).
- `src/scripts/ICONS` — un merge entre iconos hechos a mano (vía `defIcon`
  dentro de `app.js`) y los generados.

## Idiomas

Toda cadena de UI vive en el objeto `I18N` (es/en) dentro de `app.js`. Si
agregás una cadena nueva, agregala en **ambos** idiomas. Los textos estáticos
del HTML están etiquetados con `data-i18n` / `data-i18n-title` /
`data-i18n-ph` y los traduce `applyLang()`.