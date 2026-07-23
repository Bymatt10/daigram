# daigram

Editor de diagramas animados de arquitectura. 100% client-side (sin backend,
sin cuenta, sin tracking): Astro sirve una sola página estática y todo vive
en el navegador. Pega tu código Mermaid, genera con IA, o arrastra nodos.

- UI bilingüe (es/en)
- Pieles (mint, cyan, amber, rose, lime) y modos de trazo (limpio / boceto / caótico)
- Importar Mermaid (flowchart, sequenceDiagram, graph)
- Generar con IA (clave local en localStorage, nunca se envía a otro sitio)
- Exportar PNG / JPG / SVG y compartir por enlace (deflate-compress en el hash)
- Autosave local, drag-drop, undo/redo, modo presentación, puntero láser

## Stack

- [Astro](https://astro.build) (sitio estático, una sola página)
- [roughjs](https://roughjs.com) (estilo boceto)
- Vanilla JS — sin React, sin Vue, sin bundlers de UI
- localStorage para proyectos y sesión
- Service Worker para PWA (solo en build de producción)

## Comandos

Requiere `pnpm` (ver `pnpm-lock.yaml`).

```bash
pnpm install
pnpm dev          # dev server en http://localhost:4321
pnpm build        # build de producción a ./dist
pnpm preview      # sirve ./dist en http://localhost:4321
```

Regenerar iconos desde `.excalidrawlib`:

```bash
node scripts/convert-excalidrawlib.mjs            # actualiza src/scripts/gen-icons.js
node scripts/convert-excalidrawlib.mjs --sheet    # además escribe scripts/contact-sheet.html
```

## Docker

```bash
docker build -t daigram .
docker run --rm -p 8080:80 daigram
# abrir http://localhost:8080
```

La imagen sirve los archivos estáticos con nginx. Tamaño final ~25 MB.

## Licencia

[MIT](./LICENSE) — Copyright © 2025 Bymatt

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md). Para bugs y PRs, abrí un issue primero.

## Roadmap y problemas conocidos

- Sin tests automatizados todavía
- Sin linter configurado
- El parser de Mermaid cubre las formas y aristas más comunes de la documentación oficial; algunas sintaxis avanzadas (subgraphs internos, markdown strings, `A@{ img: … }`) todavía no están soportadas