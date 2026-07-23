// Convierte .excalidrawlib → iconos SVG de daigram.
// Uso: node scripts/convert-excalidrawlib.mjs [--sheet]
//   --sheet  además genera una hoja de contactos HTML para revisar/nombrar.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");

// Trazos casi negros de Excalidraw → gris medio visible en tema claro y oscuro.
const DARK = new Set(["#1e1e1e", "#000000", "#343a40", "#212529", "#495057"]);
const mapStroke = c => (!c || DARK.has(c.toLowerCase()) ? "#98a0ab" : c);

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const N = v => +(+v).toFixed(1);

function elBounds(el) {
  if (el.points) {
    const xs = el.points.map(p => el.x + p[0]), ys = el.points.map(p => el.y + p[1]);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  }
  return [el.x, el.y, el.x + (el.width || 0), el.y + (el.height || 0)];
}

function strokeAttrs(el) {
  const sw = el.strokeWidth || 1;
  let a = ` stroke="${mapStroke(el.strokeColor)}" stroke-width="${sw * 1.5}" stroke-linecap="round" stroke-linejoin="round"`;
  if (el.strokeStyle === "dashed") a += ` stroke-dasharray="${sw * 6},${sw * 5}"`;
  if (el.strokeStyle === "dotted") a += ` stroke-dasharray="${sw * 1.5},${sw * 4}"`;
  if (el.opacity != null && el.opacity < 100) a += ` opacity="${el.opacity / 100}"`;
  return a;
}
function fillAttr(el) {
  const bg = el.backgroundColor;
  if (!bg || bg === "transparent") return ' fill="none"';
  return ` fill="${bg}" fill-opacity="0.3"`;
}
function rotWrap(el, inner) {
  if (!el.angle) return inner;
  const cx = N(el.x + (el.width || 0) / 2), cy = N(el.y + (el.height || 0) / 2);
  return `<g transform="rotate(${N(el.angle * 180 / Math.PI)} ${cx} ${cy})">${inner}</g>`;
}

function arrowHead(el) {
  const pts = el.points;
  if (!pts || pts.length < 2 || !el.endArrowhead) return "";
  const [ax, ay] = pts[pts.length - 1], [bx, by] = pts[pts.length - 2];
  const ang = Math.atan2(ay - by, ax - bx);
  const L = 10, x = el.x + ax, y = el.y + ay;
  const p1 = [x - L * Math.cos(ang - 0.45), y - L * Math.sin(ang - 0.45)];
  const p2 = [x - L * Math.cos(ang + 0.45), y - L * Math.sin(ang + 0.45)];
  return `<path d="M${N(p1[0])} ${N(p1[1])} L${N(x)} ${N(y)} L${N(p2[0])} ${N(p2[1])}" fill="none"${strokeAttrs(el)}/>`;
}

function elToSVG(el) {
  switch (el.type) {
    case "rectangle": {
      const rx = el.roundness ? Math.min(el.width, el.height) * 0.2 : 0;
      return rotWrap(el, `<rect x="${N(el.x)}" y="${N(el.y)}" width="${N(el.width)}" height="${N(el.height)}" rx="${N(rx)}"${fillAttr(el)}${strokeAttrs(el)}/>`);
    }
    case "ellipse":
      return rotWrap(el, `<ellipse cx="${N(el.x + el.width / 2)}" cy="${N(el.y + el.height / 2)}" rx="${N(el.width / 2)}" ry="${N(el.height / 2)}"${fillAttr(el)}${strokeAttrs(el)}/>`);
    case "diamond": {
      const { x, y, width: w, height: h } = el;
      return rotWrap(el, `<polygon points="${N(x + w / 2)},${N(y)} ${N(x + w)},${N(y + h / 2)} ${N(x + w / 2)},${N(y + h)} ${N(x)},${N(y + h / 2)}"${fillAttr(el)}${strokeAttrs(el)}/>`);
    }
    case "line":
    case "arrow":
    case "draw":
    case "freedraw": {
      if (!el.points || el.points.length < 2) return "";
      const d = el.points.map((p, i) => (i ? "L" : "M") + N(el.x + p[0]) + " " + N(el.y + p[1])).join("");
      const closed = el.polygon || (el.backgroundColor && el.backgroundColor !== "transparent");
      return rotWrap(el, `<path d="${d}${closed ? "Z" : ""}"${closed ? fillAttr(el) : ' fill="none"'}${strokeAttrs(el)}/>` + arrowHead(el));
    }
    case "text": {
      const fs = el.fontSize || 16;
      return rotWrap(el, `<text x="${N(el.x)}" y="${N(el.y + fs)}" font-size="${N(fs)}" font-family="Comic Sans MS, Segoe Print, cursive" fill="${mapStroke(el.strokeColor)}">${esc(el.text || "")}</text>`);
    }
    default:
      return "";
  }
}

function itemToSVG(els) {
  let mx = 1e9, my = 1e9, Mx = -1e9, My = -1e9;
  for (const el of els) {
    if (el.isDeleted) continue;
    const [a, b, c, d] = elBounds(el);
    mx = Math.min(mx, a); my = Math.min(my, b); Mx = Math.max(Mx, c); My = Math.max(My, d);
  }
  const pad = 6, w = Mx - mx + pad * 2, h = My - my + pad * 2;
  const body = els.filter(e => !e.isDeleted).map(elToSVG).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${N(mx - pad)} ${N(my - pad)} ${N(w)} ${N(h)}">${body}</svg>`;
}

// nombre visible por librería+índice; null ⇒ usar texto interno o "lib i"
let NAMES = {};
try { NAMES = JSON.parse(readFileSync(join(ROOT, "scripts", "excalidraw-names.json"), "utf8")); } catch {}

const LIBS = [
  { file: "software-architecture.excalidrawlib", prefix: "xsa", group: "Sketch arch" },
  { file: "architecture-diagram-components.excalidrawlib", prefix: "xad", group: "Infra" },
  { file: "drwnio.excalidrawlib", prefix: "xdr", group: "Red/Infra" },
  { file: "UML-ER-library.excalidrawlib", prefix: "xum", group: "UML/ER" },
  { file: "data-viz.excalidrawlib", prefix: "xdv", group: "Data viz" },
];

const out = {}; let sheet = "";
for (const lib of LIBS) {
  const data = JSON.parse(readFileSync(join(SRC, lib.file), "utf8"));
  const items = (data.libraryItems || data.library || []).map(it => Array.isArray(it) ? { elements: it } : it);
  items.forEach((it, i) => {
    const els = it.elements || [];
    if (!els.length) return;
    const key = `${lib.prefix}_${i}`;
    const override = NAMES[key];
    if (override === false) return; // descartado
    const textName = els.find(e => e.type === "text" && e.text && e.text.length < 28)?.text?.split("\n")[0];
    const name = override || it.name || textName || `${lib.prefix} ${i}`;
    out[key] = { g: lib.group, n: name, svg: itemToSVG(els) };
    sheet += `<div class="c"><img src="data:image/svg+xml;utf8,${encodeURIComponent(out[key].svg)}"><span>${esc(key)}<br>${esc(name)}</span></div>`;
  });
}

const js = "// GENERADO por scripts/convert-excalidrawlib.mjs — no editar a mano.\nexport const GEN_ICONS = " + JSON.stringify(out) + ";\n";
writeFileSync(join(SRC, "scripts", "gen-icons.js"), js);
console.log("gen-icons.js:", Object.keys(out).length, "iconos,", (js.length / 1024).toFixed(0) + "KB");

if (process.argv.includes("--sheet")) {
  const html = `<!doctype html><meta charset="utf8"><style>body{background:#14171c;color:#ccc;font:12px sans-serif;display:flex;flex-wrap:wrap;gap:8px;padding:16px}.c{width:110px;text-align:center}.c img{width:96px;height:72px;object-fit:contain;background:#1e232b;border-radius:8px;padding:4px}</style>${sheet}`;
  const sheetPath = join(ROOT, "scripts", "contact-sheet.html");
  writeFileSync(sheetPath, html);
  console.log("sheet:", sheetPath);
}
