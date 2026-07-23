# Daigram

**Editor open source de diagramas animados de arquitectura — gratis, sin cuenta, sin backend, y self-hosteable con un solo contenedor.**

[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-4ad8c7)](./LICENSE)
[![Self-hosted](https://img.shields.io/badge/self--hosted-Docker-2496ed)](#despliegue-self-hosted)
[![Hecho con Astro](https://img.shields.io/badge/Astro-estático-ff5d01)](https://astro.build)
[![PRs bienvenidos](https://img.shields.io/badge/PRs-bienvenidos-7fa66b)](./CONTRIBUTING.md)

Dibuja arquitecturas que **se mueven**: flechas con flujo animado, aparición
por pasos y modo presentación. Pega tu código Mermaid, genera el borrador con
IA o arrastra nodos — y expórtalo como imagen o **video MP4 listo para
compartir**.

## ¿Por qué daigram?

Para estudiantes, docentes, freelancers, equipos y empresas — gratis y sin
letra pequeña:

- **Sin cuenta y sin tracking.** Abres la página y dibujas. No hay registro,
  ni límites de "plan gratuito", ni telemetría.
- **Tus diagramas son tuyos.** No hay backend: todo vive en tu navegador
  (localStorage) o en archivos `.daigram.json` que guardas donde quieras y
  puedes versionar en git.
- **Funciona offline.** Es una PWA: una vez cargada, sigue funcionando sin
  internet — ideal para clases, demos o redes cerradas.
- **Compartir sin servidor.** El botón "Enlace" comprime el diagrama dentro
  del propio URL: lo mandas por chat y ya, el contenido no pasa por ningún
  servicio.
- **Self-hosted en minutos.** Una imagen Docker de ~25 MB con nginx, sin nada
  que respaldar ni escalar. Perfecto si en tu empresa los diagramas de
  arquitectura son información sensible (servicios, flujos de datos,
  topología de red) y no deben salir de tu infraestructura.
- **IA opcional.** El generador usa la API de MiniMax solo si tú quieres:
  pones tu clave en la app (se guarda solo en tu navegador) o se inyecta en
  el build. Sin clave, todo lo demás funciona igual.

## Características

**Editor**
- Nodos (cajas, BD, rombos, círculos, hexágonos, texto, imágenes) e iconos de
  GCP, AWS, Azure, UML, arquitectura, DevOps y librerías de Excalidraw
- Flechas rectas u ortogonales, con codos arrastrables, etiquetas, colores y
  dirección de flujo (normal / inverso / alterno)
- Multi-selección, copiar/pegar/duplicar, undo/redo, snap a cuadrícula,
  multipágina y proyectos
- Temas de lienzo (oscuro / crema / claro), pieles de color y trazo tipo
  boceto (rough.js)

**Animación y presentación**
- Puntos animados recorriendo las flechas, con velocidad global y por flecha
- Aparición escalonada por "orden de build" para narrar la arquitectura
- Modo presentación con puntero láser

**Entrada**
- Import de **Mermaid**: `flowchart`/`graph` con layout automático por capas,
  y `sequenceDiagram` con columnas, lifelines, autonumeración y bloques
  `alt/else/loop`
- Generador con **IA** (describe el sistema y devuelve el diagrama editable)
- Plantillas: CQRS, sagas, Kubernetes, RAG, ETL, OAuth, blue-green y más
- Pegar imágenes, drag-drop de archivos

**Salida**
- PNG / JPG (con escala y transparencia), SVG vectorial
- **Video MP4** con la animación en vivo (H.264, listo para WhatsApp/Slack;
  WebM como respaldo)
- Enlace compartible autocontenido y archivos `.daigram.json` versionables en git

**Plataforma**
- UI bilingüe (español / inglés)
- PWA: funciona offline una vez cargada
- Autosave local con restauración de sesión

## Inicio rápido

```bash
docker run --rm -p 9091:80 $(docker build -q .)
# o con compose:
docker compose up -d --build
# abrir http://localhost:9091
```

## Despliegue self-hosted

Para tu homelab, tu equipo o tu empresa — una instancia propia es un solo
contenedor de estáticos.

### Docker Compose

El [`compose.yml`](./compose.yml) incluido levanta el servicio en el
puerto 9091. Para producción detrás de un reverse proxy (Nginx Proxy Manager,
Traefik, Caddy): quita `ports`, conecta el contenedor a la red del proxy y
apunta el proxy host a `http://daigram:80`. TLS, dominio, gzip y cache los
maneja el proxy.

### Clave de IA (opcional)

```bash
docker build --build-arg PUBLIC_MINIMAX_KEY="tu-clave" -t daigram .
```

> ⚠️ La clave queda incrustada en el JavaScript público del bundle (es una
> variable `PUBLIC_*` de Astro). Hazlo solo si el sitio es interno. La
> alternativa segura es dejarla vacía: cada usuario escribe la suya en el
> modal de IA y se guarda únicamente en su navegador.

### CI/CD con Jenkins

El [`Jenkinsfile`](./Jenkinsfile) incluido hace build de la imagen, un smoke
test contra el contenedor y el deploy en la red del proxy, con la clave de IA
como parámetro opcional (vacío por defecto) y el puerto/red configurables.

## Desarrollo

Requiere Node 20+ y `pnpm`.

```bash
pnpm install
pnpm dev          # dev server en http://localhost:4321
pnpm build        # build de producción a ./dist
pnpm preview      # sirve ./dist
```

Regenerar iconos desde las librerías `.excalidrawlib`:

```bash
node scripts/convert-excalidrawlib.mjs            # actualiza src/scripts/gen-icons.js
node scripts/convert-excalidrawlib.mjs --sheet    # además escribe scripts/contact-sheet.html
```

## Stack

- [Astro](https://astro.build) — sitio estático de una sola página
- [rough.js](https://roughjs.com) — estilo boceto
- Vanilla JS y Canvas 2D — sin frameworks de UI
- `localStorage` para proyectos y sesión; Service Worker para PWA
- nginx (imagen Docker) — solo sirve estáticos

## Formato de archivo

Un proyecto es un JSON plano y legible (`.daigram.json`) con páginas, nodos y
flechas — apto para versionarlo en git junto al código que documenta, hacer
diffs en PRs y generarlo desde scripts.

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md). Para bugs y propuestas, abrí un
issue primero.

## Roadmap y problemas conocidos

- Sin tests automatizados ni linter todavía
- El parser de Mermaid cubre las formas y aristas más comunes; algunas
  sintaxis avanzadas (subgraphs anidados, markdown strings, `A@{ img: … }`)
  aún no están soportadas
- El export SVG es estático (sin animación); para animación usa el export a
  video

## Licencia

[MIT](./LICENSE) — Copyright © 2026 Bymatt
