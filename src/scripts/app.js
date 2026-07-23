import rough from "roughjs";
import { GEN_ICONS } from "./gen-icons.js";

const APP="daigram", VER=1, AUTOSAVE_KEY="daigram.autosave.v1", AUTOSAVE_DELAY=500;
const W=2560, H=1440, GRID=20, ARROW_OFF=24, HANDLE=7;
const DIR={n:{x:0,y:-1}, s:{x:0,y:1}, e:{x:1,y:0}, w:{x:-1,y:0}};
const SIDES=["n","e","s","w"];

const SKINS={
  mint:{name:"Mint",accent:"#4ad8c7",accent2:"#7aa2ff"},
  cyan:{name:"Cyan",accent:"#22d3ee",accent2:"#818cf8"},
  amber:{name:"Ámbar",accent:"#f59e0b",accent2:"#fb923c"},
  rose:{name:"Rosa",accent:"#f43f5e",accent2:"#a78bfa"},
  lime:{name:"Lima",accent:"#84cc16",accent2:"#22d3ee"},
  sketch:{name:"Sketch",accent:"#495057",accent2:"#343a40",sketch:true},
};

const PALETTE=[
  {c:"#6a9fb5", n:"Servicio"},
  {c:"#d08b5b", n:"Eventos"},
  {c:"#7fa66b", n:"Datos"},
  {c:"#9b7fb5", n:"IA"},
  {c:"#c16a6a", n:"Alerta"},
  {c:"#8f8f8f", n:"Externo"},
  {c:"#c9b458", n:"Config"},
];

const THEMES={
  dark : {bg:"#0a0c10", grid:"rgba(255,255,255,.045)", text:"#ededed", edge:"#777", edgeLbl:"#bdbdbd", lblBg:"#0a0c10"},
  crema: {bg:"#f4eee1", grid:"rgba(0,0,0,.06)",        text:"#2b2620", edge:"#8a8275", edgeLbl:"#6b6457", lblBg:"#f4eee1"},
  claro: {bg:"#ffffff", grid:"rgba(0,0,0,.05)",        text:"#111111", edge:"#888888", edgeLbl:"#444444", lblBg:"#ffffff"},
};

const $=id=>document.getElementById(id);
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const smooth=t=>{t=clamp(t,0,1); return t*t*(3-2*t);};
const snap=v=>Math.round(v/GRID)*GRID;
const deep=o=>JSON.parse(JSON.stringify(o));
function hexA(col,a){ const v=parseInt(col.slice(1),16); return `rgba(${(v>>16)&255},${(v>>8)&255},${v&255},${a})`; }

const ICONS={};
function defIcon(k,g,n,svg){ ICONS[k]={g,n,svg}; }
function badge(bg,inner){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="14" fill="${bg}"/>${inner}</svg>`;}
function wheel(c){let s="";for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/2,x=32+Math.cos(a)*15,y=32+Math.sin(a)*15;s+=`<line x1="32" y1="32" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c}" stroke-width="3.4"/>`;}return s+`<circle cx="32" cy="32" r="16" fill="none" stroke="${c}" stroke-width="3.6"/><circle cx="32" cy="32" r="5" fill="${c}"/>`;}
function cylin(c){return `<path d="M18 22 v20 c0 4 6 7 14 7 s14 -3 14 -7 V22" fill="none" stroke="${c}" stroke-width="3.6"/><ellipse cx="32" cy="22" rx="14" ry="6.5" fill="none" stroke="${c}" stroke-width="3.6"/>`;}
function txtG(t,c,fs=30){return `<text x="32" y="33" font-size="${fs}" font-family="Georgia,serif" fill="${c}" text-anchor="middle" dominant-baseline="central">${t}</text>`;}

const GCP="#4285f4", AWS_BG="#232f3e", AWS_OR="#ff9900", AZ="#0078d4";

defIcon("kafka","General","Kafka",badge("#1b1b1b",`<circle cx="32" cy="14" r="6" fill="#fff"/><circle cx="32" cy="50" r="6" fill="#fff"/><circle cx="46" cy="23" r="6" fill="#fff"/><circle cx="46" cy="41" r="6" fill="#fff"/><circle cx="28" cy="32" r="7" fill="#fff"/><line x1="32" y1="18" x2="42" y2="24" stroke="#fff" stroke-width="3"/><line x1="42" y1="40" x2="32" y2="46" stroke="#fff" stroke-width="3"/><line x1="30" y1="20" x2="29" y2="26" stroke="#fff" stroke-width="3"/><line x1="29" y1="38" x2="30" y2="44" stroke="#fff" stroke-width="3"/>`));
defIcon("k8s","General","K8s",badge("#326ce5",wheel("#fff")));
defIcon("db","General","BD",badge("#3b4252",cylin("#fff")));
defIcon("queue","General","Cola",badge("#5b4a72",`<rect x="14" y="18" width="24" height="8" rx="3" fill="#fff"/><rect x="14" y="29" width="24" height="8" rx="3" fill="#fff"/><rect x="14" y="40" width="24" height="8" rx="3" fill="#fff"/><path d="M42 28 l10 5 -10 5z" fill="#fff"/>`));
defIcon("user","General","Usuario",badge("#6b7b8c",`<circle cx="32" cy="24" r="9" fill="#fff"/><path d="M15 50 c2-11 8-15 17-15 s15 4 17 15z" fill="#fff"/>`));
defIcon("web","General","Web",badge("#3c6e71",`<circle cx="32" cy="32" r="17" fill="none" stroke="#fff" stroke-width="3.2"/><ellipse cx="32" cy="32" rx="8" ry="17" fill="none" stroke="#fff" stroke-width="3"/><line x1="15" y1="32" x2="49" y2="32" stroke="#fff" stroke-width="3"/>`));
defIcon("api","General","API",badge("#2f4858",txtG("&lt;/&gt;","#fff",22)));
defIcon("lock","General","Seguridad",badge("#7a3b3b",`<rect x="19" y="29" width="26" height="21" rx="4" fill="#fff"/><path d="M24 29 v-5 a8 8 0 0 1 16 0 v5" fill="none" stroke="#fff" stroke-width="3.6"/>`));
defIcon("ai","General","IA",badge("#6d5a96",`<path d="M32 12 l4.5 13 13 4.5 -13 4.5 -4.5 13 -4.5 -13 -13 -4.5 13 -4.5z" fill="#fff"/><circle cx="48" cy="16" r="3.4" fill="#fff"/>`));
defIcon("gke","GCP","GKE",badge(GCP,wheel("#fff")));
defIcon("cloudsql","GCP","Cloud SQL",badge(GCP,cylin("#fff")));
defIcon("pubsub","GCP","Pub/Sub",badge(GCP,`<circle cx="32" cy="16" r="6" fill="#fff"/><circle cx="18" cy="44" r="6" fill="#fff"/><circle cx="46" cy="44" r="6" fill="#fff"/><circle cx="32" cy="33" r="4.4" fill="#fff"/><line x1="32" y1="21" x2="32" y2="29" stroke="#fff" stroke-width="3"/><line x1="28" y1="36" x2="22" y2="40" stroke="#fff" stroke-width="3"/><line x1="36" y1="36" x2="42" y2="40" stroke="#fff" stroke-width="3"/>`));
defIcon("bigquery","GCP","BigQuery",badge(GCP,`<circle cx="29" cy="29" r="13" fill="none" stroke="#fff" stroke-width="3.6"/><line x1="38" y1="38" x2="49" y2="49" stroke="#fff" stroke-width="5" stroke-linecap="round"/><line x1="24" y1="31" x2="24" y2="34" stroke="#fff" stroke-width="3"/><line x1="29" y1="26" x2="29" y2="34" stroke="#fff" stroke-width="3"/><line x1="34" y1="29" x2="34" y2="34" stroke="#fff" stroke-width="3"/>`));
defIcon("run","GCP","Cloud Run",badge(GCP,`<circle cx="32" cy="32" r="17" fill="none" stroke="#fff" stroke-width="3.4"/><path d="M27 24 l13 8 -13 8z" fill="#fff"/>`));
defIcon("gcs","GCP","Storage",badge(GCP,`<rect x="16" y="20" width="32" height="10" rx="3" fill="#fff"/><rect x="16" y="34" width="32" height="10" rx="3" fill="#fff"/><circle cx="42" cy="25" r="2.2" fill="${GCP}"/><circle cx="42" cy="39" r="2.2" fill="${GCP}"/>`));
defIcon("lambda","AWS","Lambda",badge(AWS_BG,txtG("λ",AWS_OR,34)));
defIcon("s3","AWS","S3",badge(AWS_BG,`<path d="M18 18 h28 l-4 30 q-10 5 -20 0z" fill="none" stroke="${AWS_OR}" stroke-width="3.4"/><ellipse cx="32" cy="18" rx="14" ry="5.4" fill="none" stroke="${AWS_OR}" stroke-width="3.4"/>`));
defIcon("ec2","AWS","EC2",badge(AWS_BG,`<rect x="20" y="20" width="24" height="24" rx="3" fill="none" stroke="${AWS_OR}" stroke-width="3.4"/>`+["26","32","38"].map(p=>`<line x1="${p}" y1="13" x2="${p}" y2="20" stroke="${AWS_OR}" stroke-width="3"/><line x1="${p}" y1="44" x2="${p}" y2="51" stroke="${AWS_OR}" stroke-width="3"/><line x1="13" y1="${p}" x2="20" y2="${p}" stroke="${AWS_OR}" stroke-width="3"/><line x1="44" y1="${p}" x2="51" y2="${p}" stroke="${AWS_OR}" stroke-width="3"/>`).join("")));
defIcon("dynamo","AWS","DynamoDB",badge(AWS_BG,cylin(AWS_OR)));
defIcon("sqs","AWS","SQS",badge(AWS_BG,`<path d="M14 24 h26 m0 0 l-7 -6 m7 6 l-7 6" fill="none" stroke="${AWS_OR}" stroke-width="3.4"/><path d="M50 42 h-26 m0 0 l7 -6 m-7 6 l7 6" fill="none" stroke="${AWS_OR}" stroke-width="3.4"/>`));
defIcon("apigw","AWS","API GW",badge(AWS_BG,txtG("&lt;/&gt;",AWS_OR,21)));
defIcon("azvm","Azure","VM",badge(AZ,`<rect x="16" y="17" width="32" height="22" rx="3" fill="none" stroke="#fff" stroke-width="3.4"/><line x1="24" y1="48" x2="40" y2="48" stroke="#fff" stroke-width="3.4"/><line x1="32" y1="39" x2="32" y2="48" stroke="#fff" stroke-width="3.4"/>`));
defIcon("azfun","Azure","Functions",badge(AZ,`<path d="M36 12 L22 35 h9 l-4 17 16 -25 h-9z" fill="#ffd400"/>`));
defIcon("cosmos","Azure","Cosmos DB",badge(AZ,`<circle cx="32" cy="32" r="12" fill="none" stroke="#fff" stroke-width="3.4"/><ellipse cx="32" cy="32" rx="22" ry="8" fill="none" stroke="#fff" stroke-width="2.6" transform="rotate(-20 32 32)"/>`));
defIcon("aks","Azure","AKS",badge(AZ,`<path d="M32 12 l17 10 v20 l-17 10 -17 -10 V22z" fill="none" stroke="#fff" stroke-width="3.4"/><circle cx="32" cy="32" r="6" fill="#fff"/>`));

const UMLC="#4f5382";
defIcon("uml_actor","UML","Actor",badge(UMLC,`<circle cx="32" cy="15" r="6" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="32" y1="21" x2="32" y2="38" stroke="#fff" stroke-width="3.2"/><line x1="20" y1="28" x2="44" y2="28" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><line x1="32" y1="38" x2="22" y2="51" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><line x1="32" y1="38" x2="42" y2="51" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>`));
defIcon("uml_class","UML","Clase",badge(UMLC,`<rect x="14" y="13" width="36" height="38" rx="2" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="14" y1="25" x2="50" y2="25" stroke="#fff" stroke-width="3"/><line x1="14" y1="37" x2="50" y2="37" stroke="#fff" stroke-width="3"/><line x1="19" y1="31" x2="35" y2="31" stroke="#fff" stroke-width="2.4"/><line x1="19" y1="44" x2="39" y2="44" stroke="#fff" stroke-width="2.4"/>`));
defIcon("uml_interface","UML","Interfaz",badge(UMLC,`<circle cx="32" cy="22" r="9" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="32" y1="31" x2="32" y2="52" stroke="#fff" stroke-width="3.2"/>`));
defIcon("uml_package","UML","Paquete",badge(UMLC,`<path d="M14 25 v-6 a2 2 0 0 1 2 -2 h13 l3 4" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="14" y="23" width="36" height="24" rx="2" fill="none" stroke="#fff" stroke-width="3.2"/>`));
defIcon("uml_component","UML","Componente",badge(UMLC,`<rect x="22" y="14" width="28" height="36" rx="2" fill="none" stroke="#fff" stroke-width="3.2"/><rect x="13" y="22" width="14" height="7" fill="${UMLC}" stroke="#fff" stroke-width="3"/><rect x="13" y="35" width="14" height="7" fill="${UMLC}" stroke="#fff" stroke-width="3"/>`));
defIcon("uml_usecase","UML","Caso de uso",badge(UMLC,`<ellipse cx="32" cy="32" rx="19" ry="12" fill="none" stroke="#fff" stroke-width="3.2"/>`));
defIcon("uml_node","UML","Nodo",badge(UMLC,`<path d="M15 23 h26 v26 h-26 z" fill="none" stroke="#fff" stroke-width="3"/><path d="M15 23 l9 -9 h26 l-9 9" fill="none" stroke="#fff" stroke-width="3"/><path d="M41 23 l9 -9 v26 l-9 9" fill="none" stroke="#fff" stroke-width="3"/>`));
defIcon("uml_state","UML","Estado",badge(UMLC,`<rect x="13" y="19" width="38" height="26" rx="10" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="20" y1="32" x2="44" y2="32" stroke="#fff" stroke-width="2.6"/>`));
defIcon("uml_start","UML","Inicio",badge(UMLC,`<circle cx="32" cy="32" r="9" fill="#fff"/>`));
defIcon("uml_end","UML","Fin",badge(UMLC,`<circle cx="32" cy="32" r="13" fill="none" stroke="#fff" stroke-width="3.2"/><circle cx="32" cy="32" r="6" fill="#fff"/>`));
defIcon("uml_note","UML","Nota",badge(UMLC,`<path d="M17 13 h21 l9 9 v29 h-30 z" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/><path d="M38 13 v9 h9" fill="none" stroke="#fff" stroke-width="3"/>`));
defIcon("uml_lifeline","UML","Lifeline",badge(UMLC,`<rect x="21" y="11" width="22" height="11" fill="none" stroke="#fff" stroke-width="3"/><line x1="32" y1="22" x2="32" y2="53" stroke="#fff" stroke-width="2.6" stroke-dasharray="4 4"/><rect x="28" y="30" width="8" height="14" fill="#fff"/>`));

defIcon("lb","Arquitectura","Balanceador",badge("#3c6e71",`<circle cx="20" cy="32" r="6" fill="#fff"/><circle cx="46" cy="16" r="5" fill="#fff"/><circle cx="46" cy="32" r="5" fill="#fff"/><circle cx="46" cy="48" r="5" fill="#fff"/><line x1="25" y1="29" x2="41" y2="18" stroke="#fff" stroke-width="3"/><line x1="26" y1="32" x2="41" y2="32" stroke="#fff" stroke-width="3"/><line x1="25" y1="35" x2="41" y2="46" stroke="#fff" stroke-width="3"/>`));
defIcon("cache","Arquitectura","Cache",badge("#8a4f4f",cylin("#fff")+`<path d="M35 24 l-9 13 h6 l-3 11 10 -14 h-6 z" fill="#ffd400" stroke="#8a4f4f" stroke-width="1.5"/>`));
defIcon("cdn","Arquitectura","CDN",badge("#4a6f8a",`<circle cx="32" cy="32" r="16" fill="none" stroke="#fff" stroke-width="3"/><circle cx="32" cy="16" r="4.5" fill="#fff"/><circle cx="18" cy="40" r="4.5" fill="#fff"/><circle cx="46" cy="40" r="4.5" fill="#fff"/>`));
defIcon("firewall","Arquitectura","Firewall",badge("#8a5a3c",`<rect x="14" y="30" width="36" height="20" fill="none" stroke="#fff" stroke-width="3"/><line x1="14" y1="40" x2="50" y2="40" stroke="#fff" stroke-width="2.6"/><line x1="26" y1="30" x2="26" y2="40" stroke="#fff" stroke-width="2.6"/><line x1="38" y1="30" x2="38" y2="40" stroke="#fff" stroke-width="2.6"/><line x1="20" y1="40" x2="20" y2="50" stroke="#fff" stroke-width="2.6"/><line x1="32" y1="40" x2="32" y2="50" stroke="#fff" stroke-width="2.6"/><line x1="44" y1="40" x2="44" y2="50" stroke="#fff" stroke-width="2.6"/><path d="M32 25 c-6 -4 -3 -9 0 -12 c0 4 6 4 6 9 a6 6 0 0 1 -6 3z" fill="#ffb020"/>`));
defIcon("gateway","Arquitectura","Gateway",badge("#5b6d5b",`<path d="M17 51 v-19 a15 15 0 0 1 30 0 v19" fill="none" stroke="#fff" stroke-width="3.4"/><line x1="12" y1="51" x2="52" y2="51" stroke="#fff" stroke-width="3.4"/>`));
defIcon("micro","Arquitectura","Microservicios",badge("#4a7a6a",`<rect x="14" y="14" width="15" height="15" rx="3" fill="none" stroke="#fff" stroke-width="3"/><rect x="35" y="14" width="15" height="15" rx="3" fill="none" stroke="#fff" stroke-width="3"/><rect x="14" y="35" width="15" height="15" rx="3" fill="none" stroke="#fff" stroke-width="3"/><rect x="35" y="35" width="15" height="15" rx="3" fill="none" stroke="#fff" stroke-width="3"/>`));
defIcon("mono","Arquitectura","Monolito",badge("#6a6a72",`<rect x="18" y="14" width="28" height="36" rx="3" fill="#fff"/>`));
defIcon("container","Arquitectura","Contenedor",badge("#2496ed",`<rect x="13" y="22" width="38" height="21" rx="2" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="22" y1="22" x2="22" y2="43" stroke="#fff" stroke-width="2.6"/><line x1="32" y1="22" x2="32" y2="43" stroke="#fff" stroke-width="2.6"/><line x1="42" y1="22" x2="42" y2="43" stroke="#fff" stroke-width="2.6"/>`));
defIcon("server","Arquitectura","Servidor",badge("#3b4252",`<rect x="17" y="12" width="30" height="40" rx="3" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="17" y1="25" x2="47" y2="25" stroke="#fff" stroke-width="2.6"/><line x1="17" y1="38" x2="47" y2="38" stroke="#fff" stroke-width="2.6"/><circle cx="24" cy="19" r="2.4" fill="#fff"/><circle cx="24" cy="32" r="2.4" fill="#fff"/><circle cx="24" cy="45" r="2.4" fill="#fff"/>`));
defIcon("etl","Arquitectura","ETL",badge("#7a5f96",`<path d="M14 14 h36 l-13 16 v14 l-10 6 v-20 z" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/>`));

defIcon("git","DevOps","Git",badge("#f05033",`<circle cx="21" cy="16" r="5.5" fill="#fff"/><circle cx="21" cy="48" r="5.5" fill="#fff"/><circle cx="45" cy="30" r="5.5" fill="#fff"/><line x1="21" y1="22" x2="21" y2="42" stroke="#fff" stroke-width="3.2"/><path d="M21 26 c0 8 24 -4 24 6" fill="none" stroke="#fff" stroke-width="3.2"/>`));
defIcon("cicd","DevOps","CI/CD",badge("#4a5568",`<path d="M46 24 a16 16 0 0 0 -28 4" fill="none" stroke="#fff" stroke-width="3.4"/><path d="M18 40 a16 16 0 0 0 28 -4" fill="none" stroke="#fff" stroke-width="3.4"/><path d="M18 20 v9 h9" fill="none" stroke="#fff" stroke-width="3.4"/><path d="M46 44 v-9 h-9" fill="none" stroke="#fff" stroke-width="3.4"/>`));
defIcon("terminal","DevOps","Terminal",badge("#1b1b1b",`<rect x="11" y="15" width="42" height="34" rx="4" fill="none" stroke="#4ad8c7" stroke-width="3.2"/><path d="M19 26 l8 6 -8 6" fill="none" stroke="#4ad8c7" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><line x1="31" y1="40" x2="43" y2="40" stroke="#4ad8c7" stroke-width="3.2" stroke-linecap="round"/>`));
defIcon("logs","DevOps","Logs",badge("#5b5b6d",`<rect x="17" y="12" width="30" height="40" rx="3" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="23" y1="22" x2="41" y2="22" stroke="#fff" stroke-width="2.6"/><line x1="23" y1="30" x2="41" y2="30" stroke="#fff" stroke-width="2.6"/><line x1="23" y1="38" x2="41" y2="38" stroke="#fff" stroke-width="2.6"/><line x1="23" y1="46" x2="34" y2="46" stroke="#fff" stroke-width="2.6"/>`));
defIcon("metrics","DevOps","Métricas",badge("#3c6255",`<line x1="14" y1="50" x2="50" y2="50" stroke="#fff" stroke-width="3"/><rect x="18" y="34" width="7" height="16" fill="#fff"/><rect x="29" y="26" width="7" height="24" fill="#fff"/><rect x="40" y="16" width="7" height="34" fill="#fff"/>`));
defIcon("cron","DevOps","Cron",badge("#6d5a44",`<circle cx="32" cy="34" r="16" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="32" y1="34" x2="32" y2="23" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><line x1="32" y1="34" x2="41" y2="38" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><line x1="24" y1="12" x2="40" y2="12" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>`));
defIcon("mail","DevOps","Email",badge("#5a6d8c",`<rect x="13" y="19" width="38" height="26" rx="3" fill="none" stroke="#fff" stroke-width="3.2"/><path d="M13 22 l19 14 19 -14" fill="none" stroke="#fff" stroke-width="3"/>`));
defIcon("bell","DevOps","Alerta",badge("#8a6d3c",`<path d="M32 12 a12 12 0 0 1 12 12 v10 l5 8 h-34 l5 -8 v-10 a12 12 0 0 1 12 -12z" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/><path d="M27 46 a5 5 0 0 0 10 0" fill="none" stroke="#fff" stroke-width="3.2"/>`));
defIcon("mobile","DevOps","Móvil",badge("#4a5a6a",`<rect x="21" y="11" width="22" height="42" rx="5" fill="none" stroke="#fff" stroke-width="3.2"/><circle cx="32" cy="46" r="2.4" fill="#fff"/>`));
defIcon("desktop","DevOps","Escritorio",badge("#4a5a6a",`<rect x="12" y="15" width="40" height="26" rx="2" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="26" y1="49" x2="38" y2="49" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><line x1="32" y1="41" x2="32" y2="49" stroke="#fff" stroke-width="3.2"/>`));
defIcon("shield","DevOps","Escudo",badge("#3c5a4a",`<path d="M32 11 l16 6 v13 c0 11 -7 17 -16 22 c-9 -5 -16 -11 -16 -22 v-13 z" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/><path d="M25 31 l5 5 9 -10" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`));
defIcon("key","DevOps","Llave",badge("#6d6244",`<circle cx="23" cy="26" r="9" fill="none" stroke="#fff" stroke-width="3.2"/><line x1="29" y1="33" x2="48" y2="52" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><line x1="41" y1="45" x2="47" y2="39" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>`));

Object.assign(ICONS, GEN_ICONS);
const iconURL={}, imgCache={};
for(const k in ICONS) iconURL[k]="data:image/svg+xml;utf8,"+encodeURIComponent(ICONS[k].svg);
function getImg(src){
  if(!imgCache[src]){ const im=new Image(); im.src=src; imgCache[src]=im; }
  return imgCache[src];
}

const LANG_KEY="daigram.lang";
let lang = localStorage.getItem(LANG_KEY) || ((navigator.language||"es").startsWith("es") ? "es" : "en");
const I18N={
es:{
  demo:"Ejemplo", clear:"Limpiar página", templates:"Plantillas",
  themeTitle:"Tema del lienzo", themeDark:"Fondo oscuro", themeCrema:"Fondo crema", themeClaro:"Fondo claro",
  skinTitle:"Estilo visual", skinAmber:"Ámbar", skinRose:"Rosa", skinLime:"Lima",
  gridLbl:"Cuadrícula", pause:"Pausa", play:"Play",
  save:"Guardar", saveTitle:"Guardar archivo .daigram.json (Ctrl+S)",
  open:"Abrir", openTitle:"Abrir archivo guardado",
  share:"Enlace", shareTitle:"Copiar enlace con el diagrama", linkCopied:"¡Copiado!",
  export:"Exportar",
  move:"Mover", arrow:"Flecha", laser:"Láser", box:"Caja", db:"BD", diamond:"Rombo", circle:"Círculo", hexagon:"Hexágono", text:"Texto", icons:"Iconos", image:"Imagen",
  tMove:"Seleccionar / mover (V o 1)", tConnect:"Conectar con clics (C o 2)", tLaser:"Puntero láser: señala y se desvanece (L o 3)", tBox:"Caja (4) — arrastra para elegir tamaño", tDb:"Base de datos (5) — arrastra para elegir tamaño", tDiamond:"Decisión (6) — arrastra para elegir tamaño", tCircle:"Círculo (7) — arrastra para elegir tamaño", tHex:"Hexágono (8) — arrastra para elegir tamaño", tText:"Solo texto (9)", tIcons:"Iconos cloud, UML, arquitectura… (0)", tImg:"Insertar imagen (o pega con Ctrl+V)",
  dropHere:"Suelta el archivo aquí",
  selection:"Selección",
  hintMain:`Nada seleccionado.<br><br>
    • Forma del menú izquierdo → clic en el lienzo, o <b>arrastra</b> para darle el tamaño que quieras.<br>
    • Teclas <kbd>1</kbd>-<kbd>9</kbd>/<kbd>0</kbd> activan cada herramienta. <kbd>L</kbd> = puntero láser (se desvanece solo).<br>
    • <kbd>Rueda ratón</kbd> mover · <kbd>Ctrl+Rueda</kbd> zoom.<br>
    • <kbd>Clic derecho</kbd>, <kbd>Clic central</kbd> o <kbd>Alt+Arrastrar</kbd> para pan.<br>
    • Pasa el mouse sobre un nodo y <b>arrastra una flecha azul</b> para conectar.<br>
    • <b>Arrastra en el vacío</b> para seleccionar varios; <kbd>Shift</kbd>+clic suma o quita.<br>
    • <kbd>Ctrl+C</kbd> copiar · <kbd>Ctrl+X</kbd> cortar · <kbd>Ctrl+V</kbd> pegar · <kbd>Ctrl+D</kbd> duplicar · <kbd>Ctrl+A</kbd> todo.<br>
    • <kbd>Ctrl+Z</kbd> deshacer · <kbd>Ctrl+Y</kbd> rehacer.<br>
    • Doble clic = editar texto. <kbd>Supr</kbd> borra. <kbd>Esc</kbd> cancela.<br>
    • Con una flecha seleccionada, arrastra los <b>puntos huecos</b> para doblarla; doble clic en un codo lo elimina.<br>
    • Pega imágenes con <kbd>Ctrl+V</kbd>.<br>
    • Arrastra un archivo .daigram.json al lienzo para abrirlo.`,
  copy:"Copiar", cut:"Cortar", dup:"Duplicar", del:"Eliminar",
  multiCount:"{n} nodo(s) y {e} flecha(s) seleccionados.",
  textLbl:"Texto (Enter = nueva línea)", fontSize:"Tamaño de texto", semColor:"Color semántico", shape:"Forma",
  pulse:"Pulso (resaltar)", order:"Orden de aparición", route:"Ruta", straight:"Recta", ortho:"Ortogonal",
  exitFrom:"Sale por", enterAt:"Entra por", top:"Arriba", right:"Derecha", bottom:"Abajo", left:"Izquierda",
  animDots:"Puntos animados", speedFac:"Velocidad (× global)", dotsGlobal:"Puntos globales", dotsEdge:"Puntos (esta flecha)",
  lineColor:"Color de línea", dotColor:"Color de puntos", dashed:"Línea punteada",
  arrStart:"Punta al inicio", arrEnd:"Punta al final", dotFlow:"Flujo de puntos",
  flowNormal:"Normal →", flowReverse:"Inverso ←", flowAlt:"Alterno ⇄",
  removeBends:"Quitar codos", deleteKey:"Eliminar (Supr)",
  present:"Presentar", tPresent:"Modo presentación (P): solo lienzo y láser",
  presentHint:"Modo presentación — <kbd>Esc</kbd> salir · <kbd>L</kbd> láser · <kbd>Espacio</kbd> pausa",
  erase:"Borrar", tErase:"Borrador (E): clic o arrastra sobre lo que quieras eliminar",
  bgLbl:"Fondo de la figura", transparent:"Transparente",
  strokeStyleLbl:"Estilo de borde", ssSolid:"Sólido", ssDashed:"Discontinuo", ssDotted:"Punteado",
  slopLbl:"Trazo", slopAuto:"Auto (tema)", slopClean:"Limpio", slopSketch:"Boceto", slopWild:"Caótico",
  cornersLbl:"Esquinas", cornerRound:"Redondeadas", cornerSharp:"Rectas",
  opacityLbl:"Opacidad", front:"Al frente", back:"Atrás",
  zoomFit:"Ajustar vista", undoT:"Deshacer (⌘Z)", redoT:"Rehacer (⌘⇧Z)",
  projects:"Proyectos", tProjects:"Proyectos guardados en este navegador",
  projTitle:"Proyectos", projHint:"Guardados en este navegador (localStorage). Para respaldos reales usa 💾 Guardar.",
  projNamePh:"Nombre del proyecto…", projSave:"Guardar actual",
  projEmpty:"No hay proyectos guardados todavía.", projDelete:"¿Eliminar este proyecto?",
  projFull:"Sin espacio en el navegador: borra algún proyecto o quita imágenes pesadas.",
  pagesN:"página(s)", nodesN:"nodo(s)",
  hidePanel:"Ocultar panel", showPanel:"Mostrar panel",
  boilLbl:"Trazo vivo (boiling)",
  animation:"Animación", flowSpeed:"Velocidad de flujo", dotsPerArrow:"Puntos por flecha",
  animBuild:"Animar aparición", buildInterval:"Intervalo aparición",
  buildHint:"La aparición usa el «orden» de cada nodo. Las flechas aparecen cuando ambos nodos son visibles.",
  exportTitle:"Exportar página actual", format:"Formato", scale:"Escala", transparentBg:"Fondo transparente",
  exportHint:"PNG soporta transparencia. JPG no. SVG es vectorial puro (no animado). Video graba la animación en MP4 (listo para WhatsApp; WebM si el navegador no soporta MP4).",
  videoDur:"Duración (segundos)", recording:"Grabando video…",
  videoUnsupported:"Este navegador no puede grabar video.",
  cancel:"Cancelar", close:"Cerrar", import:"Importar",
  tplHint:"Empieza con un diagrama prediseñado.", tplSearchPh:"Buscar plantilla… (ej. CQRS, kafka, UML)", tplEmpty:"Sin resultados.",
  merTitle:"Importar Mermaid", merHint:"Pega tu código <code>flowchart</code>, <code>sequenceDiagram</code> o <code>graph</code>.",
  mermaidFirst:"Pega código primero.", mermaidFail:"No se pudo parsear. Soporta: flowchart, graph, sequenceDiagram.", errorPrefix:"Error: ",
  sessionTitle:"Sesión guardada", sessionHint:"Se encontró una sesión guardada localmente. ¿Quieres restaurarla?",
  discard:"Descartar", restore:"Restaurar",
  page:"Página", renamePage:"Nombre de la página", confirmClear:"¿Vaciar esta página?",
  notDaigram:"Archivo no es de daigram", badJson:"JSON inválido",
  auto:"Automático", customColor:"Color personalizado",
  ai:"IA", aiTitle:"Generar diagrama con IA",
  aiHint:"Describe el diagrama que quieres y la IA lo dibuja en una página nueva.",
  aiPromptPh:"Ej: arquitectura de un e-commerce con carrito, pagos con Stripe, cola de pedidos y base de datos",
  aiKeyLbl:"API key (MiniMax)",
  aiKeyHint:"Se toma de PUBLIC_MINIMAX_KEY en tu .env. Si escribes otra aquí, se guarda en tu navegador y tiene prioridad. Nunca sale salvo hacia la API de MiniMax.",
  aiGo:"Generar", aiWorking:"Generando… puede tardar unos segundos.",
  aiKeyMissing:"Falta la API key.", aiPromptMissing:"Escribe qué diagrama quieres.",
  aiBadResp:"la IA no devolvió un diagrama válido",
},
en:{
  demo:"Example", clear:"Clear page", templates:"Templates",
  themeTitle:"Canvas theme", themeDark:"Dark background", themeCrema:"Cream background", themeClaro:"Light background",
  skinTitle:"Visual style", skinAmber:"Amber", skinRose:"Rose", skinLime:"Lime",
  gridLbl:"Grid", pause:"Pause", play:"Play",
  save:"Save", saveTitle:"Save .daigram.json file (Ctrl+S)",
  open:"Open", openTitle:"Open saved file",
  share:"Link", shareTitle:"Copy a link containing the diagram", linkCopied:"Copied!",
  export:"Export",
  move:"Move", arrow:"Arrow", laser:"Laser", box:"Box", db:"DB", diamond:"Diamond", circle:"Circle", hexagon:"Hexagon", text:"Text", icons:"Icons", image:"Image",
  tMove:"Select / move (V or 1)", tConnect:"Connect with clicks (C or 2)", tLaser:"Laser pointer: point and it fades (L or 3)", tBox:"Box (4) — drag to size", tDb:"Database (5) — drag to size", tDiamond:"Decision (6) — drag to size", tCircle:"Circle (7) — drag to size", tHex:"Hexagon (8) — drag to size", tText:"Text only (9)", tIcons:"Cloud, UML, architecture icons… (0)", tImg:"Insert image (or paste with Ctrl+V)",
  dropHere:"Drop the file here",
  selection:"Selection",
  hintMain:`Nothing selected.<br><br>
    • Pick a shape on the left → click the canvas, or <b>drag</b> to size it as you like.<br>
    • Keys <kbd>1</kbd>-<kbd>9</kbd>/<kbd>0</kbd> activate each tool. <kbd>L</kbd> = laser pointer (fades on its own).<br>
    • <kbd>Mouse wheel</kbd> pan · <kbd>Ctrl+Wheel</kbd> zoom.<br>
    • <kbd>Right click</kbd>, <kbd>Middle click</kbd> or <kbd>Alt+Drag</kbd> to pan.<br>
    • Hover a node and <b>drag a blue arrow</b> to connect.<br>
    • <b>Drag on empty space</b> to select several; <kbd>Shift</kbd>+click adds or removes.<br>
    • <kbd>Ctrl+C</kbd> copy · <kbd>Ctrl+X</kbd> cut · <kbd>Ctrl+V</kbd> paste · <kbd>Ctrl+D</kbd> duplicate · <kbd>Ctrl+A</kbd> all.<br>
    • <kbd>Ctrl+Z</kbd> undo · <kbd>Ctrl+Y</kbd> redo.<br>
    • Double click = edit text. <kbd>Del</kbd> deletes. <kbd>Esc</kbd> cancels.<br>
    • With an arrow selected, drag the <b>hollow dots</b> to bend it; double click a bend to remove it.<br>
    • Paste images with <kbd>Ctrl+V</kbd>.<br>
    • Drag a .daigram.json file onto the canvas to open it.`,
  copy:"Copy", cut:"Cut", dup:"Duplicate", del:"Delete",
  multiCount:"{n} node(s) and {e} arrow(s) selected.",
  textLbl:"Text (Enter = new line)", fontSize:"Font size", semColor:"Semantic color", shape:"Shape",
  pulse:"Pulse (highlight)", order:"Build order", route:"Route", straight:"Straight", ortho:"Orthogonal",
  exitFrom:"Exits from", enterAt:"Enters at", top:"Top", right:"Right", bottom:"Bottom", left:"Left",
  animDots:"Animated dots", speedFac:"Speed (× global)", dotsGlobal:"Global dots", dotsEdge:"Dots (this arrow)",
  lineColor:"Line color", dotColor:"Dot color", dashed:"Dashed line",
  arrStart:"Arrowhead at start", arrEnd:"Arrowhead at end", dotFlow:"Dot flow",
  flowNormal:"Normal →", flowReverse:"Reverse ←", flowAlt:"Alternate ⇄",
  removeBends:"Remove bends", deleteKey:"Delete (Del)",
  present:"Present", tPresent:"Presentation mode (P): canvas and laser only",
  presentHint:"Presentation mode — <kbd>Esc</kbd> exit · <kbd>L</kbd> laser · <kbd>Space</kbd> pause",
  erase:"Erase", tErase:"Eraser (E): click or drag over anything to delete it",
  bgLbl:"Shape background", transparent:"Transparent",
  strokeStyleLbl:"Stroke style", ssSolid:"Solid", ssDashed:"Dashed", ssDotted:"Dotted",
  slopLbl:"Sloppiness", slopAuto:"Auto (theme)", slopClean:"Clean", slopSketch:"Sketchy", slopWild:"Wild",
  cornersLbl:"Corners", cornerRound:"Rounded", cornerSharp:"Sharp",
  opacityLbl:"Opacity", front:"To front", back:"To back",
  zoomFit:"Fit view", undoT:"Undo (⌘Z)", redoT:"Redo (⌘⇧Z)",
  projects:"Projects", tProjects:"Projects saved in this browser",
  projTitle:"Projects", projHint:"Stored in this browser (localStorage). For real backups use 💾 Save.",
  projNamePh:"Project name…", projSave:"Save current",
  projEmpty:"No saved projects yet.", projDelete:"Delete this project?",
  projFull:"Browser storage full: delete a project or remove heavy images.",
  pagesN:"page(s)", nodesN:"node(s)",
  hidePanel:"Hide panel", showPanel:"Show panel",
  boilLbl:"Lively stroke (boiling)",
  animation:"Animation", flowSpeed:"Flow speed", dotsPerArrow:"Dots per arrow",
  animBuild:"Animate build", buildInterval:"Build interval",
  buildHint:"Build-in uses each node's “order”. Arrows appear once both nodes are visible.",
  exportTitle:"Export current page", format:"Format", scale:"Scale", transparentBg:"Transparent background",
  exportHint:"PNG supports transparency. JPG doesn't. SVG is pure vector (not animated). Video records the animation as MP4 (WhatsApp-ready; WebM if the browser can't record MP4).",
  videoDur:"Duration (seconds)", recording:"Recording video…",
  videoUnsupported:"This browser can't record video.",
  cancel:"Cancel", close:"Close", import:"Import",
  tplHint:"Start from a pre-built diagram.", tplSearchPh:"Search templates… (e.g. CQRS, kafka, UML)", tplEmpty:"No results.",
  merTitle:"Import Mermaid", merHint:"Paste your <code>flowchart</code>, <code>sequenceDiagram</code> or <code>graph</code> code.",
  mermaidFirst:"Paste some code first.", mermaidFail:"Couldn't parse. Supports: flowchart, graph, sequenceDiagram.", errorPrefix:"Error: ",
  sessionTitle:"Saved session", sessionHint:"A locally saved session was found. Restore it?",
  discard:"Discard", restore:"Restore",
  page:"Page", renamePage:"Page name", confirmClear:"Empty this page?",
  notDaigram:"Not a daigram file", badJson:"Invalid JSON",
  auto:"Automatic", customColor:"Custom color",
  ai:"AI", aiTitle:"Generate diagram with AI",
  aiHint:"Describe the diagram you want and the AI draws it on a new page.",
  aiPromptPh:"E.g.: e-commerce architecture with cart, Stripe payments, order queue and database",
  aiKeyLbl:"API key (MiniMax)",
  aiKeyHint:"Read from PUBLIC_MINIMAX_KEY in your .env. Typing one here overrides it (stored in your browser). It never leaves except to the MiniMax API.",
  aiGo:"Generate", aiWorking:"Generating… may take a few seconds.",
  aiKeyMissing:"API key missing.", aiPromptMissing:"Describe the diagram you want.",
  aiBadResp:"the AI didn't return a valid diagram",
},
};
const t=k=>(I18N[lang]&&I18N[lang][k]) ?? I18N.es[k] ?? k;
function applyLang(){
  document.documentElement.lang=lang;
  localStorage.setItem(LANG_KEY, lang);
  document.querySelectorAll("[data-i18n]").forEach(el=>{ el.innerHTML=t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-title]").forEach(el=>{ el.title=t(el.dataset.i18nTitle); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{ el.placeholder=t(el.dataset.i18nPh); });
  $("langSel").value=lang;
  updatePlayBtn(); refreshPanel(); applyAside();
}

function blankPage(name){ return {name, nodes:[], edges:[], nextId:1}; }
let doc={ theme:"crema", skin:"mint", pages:[blankPage(t("page")+" 1")], cur:0 };
let settings={ speed:.5, dots:3, build:false, stagger:.45, grid:true, boil:false };
const P=()=>doc.pages[doc.cur];

let mode="select", pendingShape=null, pendingIcon=null, connecting=null;
let selN=new Set(), selE=new Set();
let drag=null, resizing=null, wpDrag=null, connectDrag=null, marquee=null, hoverNode=null, arrowDraft=null;
let placing=null, laserStrokes=[], laserDrawing=null, erasing=false;
const LASER_LIFE=1100, DEFAULT_SIZES={rect:[180,70], cylinder:[150,90], diamond:[160,100], circle:[110,110], hex:[170,80], text:[200,40]};
let hi=-1, wpi=-1;
let clip=null, pasteTimer=null;
let t0=performance.now(), playing=true, pausedAt=0;
const mouse={x:0,y:0};
let viewX=0, viewY=0, viewZoom=0.8;
let panDrag=null, wasRightDrag=false;

function getBounds(){
  if(P().nodes.length===0) return {x:0, y:0, w:1280, h:720};
  let mx=Infinity, my=Infinity, Mx=-Infinity, My=-Infinity;
  const addP=(x,y)=>{ if(x<mx)mx=x; if(x>Mx)Mx=x; if(y<my)my=y; if(y>My)My=y; };
  P().nodes.forEach(n=>{ addP(n.x-n.w/2, n.y-n.h/2); addP(n.x+n.w/2, n.y+n.h/2); });
  P().edges.forEach(e=>edgePoints(e).forEach(p=>addP(p.x,p.y)));
  mx-=40; my-=40; Mx+=40; My+=40;
  return {x:mx, y:my, w:Mx-mx, h:My-my};
}
function centerView(){
  const r=$("wrap").getBoundingClientRect();
  if(r.width===0){ setTimeout(centerView,50); return; }
  const b=getBounds();
  viewX=(r.width-b.w*viewZoom)/2 - b.x*viewZoom;
  viewY=(r.height-b.h*viewZoom)/2 - b.y*viewZoom;
}

function nodeById(id){return P().nodes.find(n=>n.id===id);}
function edgeById(id){return P().edges.find(e=>e.id===id);}

function sidePoint(n,s){
  switch(s){ case "n": return {x:n.x, y:n.y-n.h/2};
    case "s": return {x:n.x, y:n.y+n.h/2};
    case "e": return {x:n.x+n.w/2, y:n.y};
    case "w": return {x:n.x-n.w/2, y:n.y}; }
}
function autoAnchor(n,tx,ty){
  const dx=tx-n.x, dy=ty-n.y;
  if(dx===0&&dy===0) return {x:n.x,y:n.y};
  if(n.shape==="circle"){ const r=n.w/2, L=Math.hypot(dx,dy); return {x:n.x+dx/L*r, y:n.y+dy/L*r}; }
  if(n.shape==="diamond"){ const k=1/((Math.abs(dx)/(n.w/2))+(Math.abs(dy)/(n.h/2))); return {x:n.x+dx*k, y:n.y+dy*k}; }
  const sx=(n.w/2)/Math.abs(dx||1e-9), sy=(n.h/2)/Math.abs(dy||1e-9), s=Math.min(sx,sy);
  return {x:n.x+dx*s, y:n.y+dy*s};
}
function anchorPt(n,side,tx,ty){ return side? sidePoint(n,side) : autoAnchor(n,tx,ty); }
function inferSide(n,p){
  const dx=(p.x-n.x)/(n.w/2||1), dy=(p.y-n.y)/(n.h/2||1);
  return Math.abs(dx)>Math.abs(dy)? (dx>0?"e":"w") : (dy>0?"s":"n");
}
function nearestAnchorSide(n,p,maxDist){
  let best=null, bd=maxDist;
  for(const s of SIDES){ const q=sidePoint(n,s), d=Math.hypot(p.x-q.x,p.y-q.y); if(d<bd){bd=d;best=s;} }
  return best;
}
function sideOfPoint(n,p){
  const t=3;
  if(Math.abs(p.y-(n.y-n.h/2))<t) return "n";
  if(Math.abs(p.y-(n.y+n.h/2))<t) return "s";
  if(Math.abs(p.x-(n.x-n.w/2))<t) return "w";
  if(Math.abs(p.x-(n.x+n.w/2))<t) return "e";
  return inferSide(n,p);
}
function orthoRoute(p1,d1,p2,d2){
  const pad=28;
  const s={x:p1.x+d1.x*pad, y:p1.y+d1.y*pad};
  const t={x:p2.x+d2.x*pad, y:p2.y+d2.y*pad};
  let mids;
  if(d1.x!==0 && d2.x!==0){ const mx=(s.x+t.x)/2; mids=[{x:mx,y:s.y},{x:mx,y:t.y}]; }
  else if(d1.y!==0 && d2.y!==0){ const my=(s.y+t.y)/2; mids=[{x:s.x,y:my},{x:t.x,y:my}]; }
  else if(d1.x!==0){ mids=[{x:t.x,y:s.y}]; }
  else { mids=[{x:s.x,y:t.y}]; }
  const raw=[p1,s,...mids,t,p2], out=[raw[0]];
  for(let i=1;i<raw.length;i++){ const a=out[out.length-1],b=raw[i]; if(Math.hypot(a.x-b.x,a.y-b.y)>1) out.push(b); }
  return out;
}
function edgePoints(e){
  const A=nodeById(e.from), B=nodeById(e.to); if(!A||!B) return [];
  const wps=e.waypoints||[];
  const tA=wps[0]||{x:B.x,y:B.y}, tB=wps[wps.length-1]||{x:A.x,y:A.y};
  const p1=anchorPt(A,e.fromSide,tA.x,tA.y);
  const p2=anchorPt(B,e.toSide,tB.x,tB.y);
  if(e.route==="ortho" && wps.length===0){
    const d1=DIR[e.fromSide||inferSide(A,p1)];
    const d2=DIR[e.toSide||inferSide(B,p2)];
    return orthoRoute(p1,d1,p2,d2);
  }
  return [p1,...wps,p2];
}
function polyLen(pts){ let L=0; for(let i=1;i<pts.length;i++) L+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y); return L; }
function pointAt(pts,f){
  const L=polyLen(pts); if(L===0) return {x:pts[0].x,y:pts[0].y,ang:0};
  let target=clamp(f,0,1)*L;
  for(let i=1;i<pts.length;i++){
    const seg=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);
    if(target<=seg || i===pts.length-1){
      const u=seg? target/seg:0;
      return { x:lerp(pts[i-1].x,pts[i].x,u), y:lerp(pts[i-1].y,pts[i].y,u), ang:Math.atan2(pts[i].y-pts[i-1].y,pts[i].x-pts[i-1].x) };
    }
    target-=seg;
  }
  return {x:pts[pts.length-1].x,y:pts[pts.length-1].y,ang:0};
}

function nodeAlpha(n,t){ if(!settings.build) return 1; return smooth((t - n.order*settings.stagger)/0.5); }
function isSketch(){ return SKINS[doc.skin||"mint"]?.sketch===true; }
function sketchFont(){ return isSketch()?'24px "Caveat", "Kalam", cursive':'15px Georgia, serif'; }
let _sketchSeed=1;
function _jitter(s){ return Math.sin(s*13.37+0.7)*2.2; }
function drawSketchPath(c, pathFn, stroke, fill, closed, amp=2.2, seed){
  const jit=s=>Math.sin(s*13.37+0.7)*amp;
  const S = seed!=null ? seed : _sketchSeed++;
  c.save();
  c.lineWidth=2.2; c.lineJoin="round"; c.lineCap="round";
  c.strokeStyle=stroke; c.fillStyle=fill||"transparent";
  for(let i=0;i<2;i++){
    const ox=jit(S+i*7);
    const oy=jit(S+i*13+1);
    c.beginPath();
    c.translate(ox,oy);
    pathFn();
    c.translate(-ox,-oy);
    c.globalAlpha=i===0?0.55:0.65;
    c.stroke();
  }
  c.globalAlpha=1;
  if(fill){
    c.fillStyle=fill;
    c.beginPath(); pathFn(); c.fill();
  }
  c.restore();
}
function buildDuration(){
  if(!settings.build || !P().nodes.length) return 0;
  const maxO=P().nodes.reduce((m,n)=>Math.max(m,n.order),0);
  return maxO*settings.stagger + 0.8;
}
function roundRect(c,x,y,w,h,r){
  c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r);
  c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath();
}
function shapePath(c,n){
  const {x,y,w,h}=n;
  c.beginPath();
  switch(n.shape){
    case "circle": c.arc(x,y,w/2,0,Math.PI*2); break;
    case "doublecircle":{
      c.arc(x,y,w/2,0,Math.PI*2);
      c.moveTo(x+w/2-3,y);
      c.arc(x,y,w/2-4,0,Math.PI*2);
      break;
    }
    case "stadium":{
      const r=Math.min(h/2,w/2);
      roundRect(c,x-w/2,y-h/2,w,h,r);
      break;
    }
    case "diamond": c.moveTo(x,y-h/2); c.lineTo(x+w/2,y); c.lineTo(x,y+h/2); c.lineTo(x-w/2,y); c.closePath(); break;
    case "hex":{ const i=Math.min(24,w*.18);
      c.moveTo(x-w/2+i,y-h/2); c.lineTo(x+w/2-i,y-h/2); c.lineTo(x+w/2,y);
      c.lineTo(x+w/2-i,y+h/2); c.lineTo(x-w/2+i,y+h/2); c.lineTo(x-w/2,y); c.closePath(); break;}
    case "asym":{ const k=Math.min(18,w*.15);
      c.moveTo(x-w/2+k, y-h/2);
      c.lineTo(x+w/2, y-h/2);
      c.lineTo(x+w/2, y+h/2);
      c.lineTo(x-w/2+k, y+h/2);
      c.lineTo(x-w/2, y);
      c.closePath(); break;}
    case "parallelogram":{ const k=w*.18;
      c.moveTo(x-w/2+k, y-h/2); c.lineTo(x+w/2, y-h/2);
      c.lineTo(x+w/2-k, y+h/2); c.lineTo(x-w/2, y+h/2);
      c.closePath(); break;}
    case "parallelogram_alt":{ const k=w*.18;
      c.moveTo(x-w/2, y-h/2); c.lineTo(x+w/2-k, y-h/2);
      c.lineTo(x+w/2, y+h/2); c.lineTo(x-w/2+k, y+h/2);
      c.closePath(); break;}
    case "trapezoid":{ const k=w*.18;
      c.moveTo(x-w/2+k, y-h/2); c.lineTo(x+w/2-k, y-h/2);
      c.lineTo(x+w/2, y+h/2); c.lineTo(x-w/2, y+h/2);
      c.closePath(); break;}
    case "trapezoid_alt":{ const k=w*.18;
      c.moveTo(x-w/2, y-h/2); c.lineTo(x+w/2, y-h/2);
      c.lineTo(x+w/2-k, y+h/2); c.lineTo(x-w/2+k, y+h/2);
      c.closePath(); break;}
    default: roundRect(c,x-w/2,y-h/2,w,h, n.shape==="round"?16 : (n.sharp?2:10));
  }
}
function nodeDash(n){
  if(n.strokeStyle==="dashed") return [9,7];
  if(n.strokeStyle==="dotted") return [2.5,5.5];
  return null;
}
function nodeFill(n, theme){
  if(n.bg==="none") return null;
  if(n.bg) return hexA(n.bg, theme==="crema"?.4:.35);
  return hexA(n.color, theme==="crema"?.16:.18);
}
function nodeSlop(n){ return n.slop!=null ? +n.slop : (isSketch()?1:0); }
function drawLabelLines(c,n,theme,baseFs,cy){
  const T=THEMES[theme];
  c.fillStyle = n.shape==="text"? n.color : T.text;
  c.textAlign="center"; c.textBaseline="middle";
  const lines=String(n.label).split("\n");
  let fs=n.fs||baseFs;
  const sk=isSketch();
  if(sk){ c.font=`${fs}px "Caveat", "Kalam", cursive`; }
  else { c.font=`${fs}px Georgia, serif`; }
  if(!n.fs){
    c.font=`${fs}px ${sk?'"Caveat","Kalam",cursive':'Georgia, serif'}`;
    const maxW=Math.max(...lines.map(l=>c.measureText(l).width),1);
    const avail=n.w-18;
    if(maxW>avail){ fs=Math.max(10, fs*avail/maxW); c.font=`${fs}px ${sk?'"Caveat","Kalam",cursive':'Georgia, serif'}`; }
  }
  const lh=fs*(sk?1.1:1.25), oy=cy-(lines.length-1)*lh/2;
  lines.forEach((l,i)=>c.fillText(l,n.x,oy+i*lh));
}
function nodeCorners(n){
  return [[n.x-n.w/2-6,n.y-n.h/2-6],[n.x+n.w/2+6,n.y-n.h/2-6],
          [n.x+n.w/2+6,n.y+n.h/2+6],[n.x-n.w/2-6,n.y+n.h/2+6]];
}
function drawNode(c,n,t,theme,isExport){
  let a=nodeAlpha(n,t); a*=(n.op??100)/100; if(a<=0) return;
  c.save(); c.globalAlpha=a;
  const grow=settings.build? lerp(.85,1,a):1;
  c.translate(n.x,n.y); c.scale(grow,grow); c.translate(-n.x,-n.y);
  let glow=0;
  if(n.pulse) glow=(Math.sin(t*2*Math.PI*Math.max(.3,settings.speed)*2)+1)/2;
  const T=THEMES[theme];
  const slopLvl=nodeSlop(n);
  const sk=slopLvl>0;
  const slopAmp=slopLvl>=2? 4.6 : 2.2;
  const boilOff=settings.boil? Math.floor(t*8)*17.3 : 0;
  const dash=nodeDash(n);
  const fillCol=nodeFill(n, theme);
  if(n.shape==="image" && n.img){
    const im=getImg(n.img);
    if(im.complete && im.naturalWidth){
      if(glow>0){c.shadowColor="#7aa2ff"; c.shadowBlur=20*glow;}
      c.drawImage(im, n.x-n.w/2, n.y-n.h/2, n.w, n.h); c.shadowBlur=0;
    }
    if(n.label) drawLabelLines(c,n,theme,14,n.y+n.h/2+14);
  } else if(n.shape==="icon"){
    const im=getImg(iconURL[n.icon]||"");
    const s=Math.min(n.w,n.h-26)*.78;
    if(glow>0){c.shadowColor=n.color; c.shadowBlur=18*glow;}
    if(im.complete && im.naturalWidth) c.drawImage(im, n.x-s/2, n.y-n.h/2+4, s, s);
    c.shadowBlur=0;
    if(n.label) drawLabelLines(c,n,theme,14,n.y+n.h/2-10);
  } else if(n.shape==="cylinder"){
    const {x,y,w,h}=n, ry=Math.min(16,h*.18), top=y-h/2, bot=y+h/2;
    if(dash) c.setLineDash(dash);
    if(sk){
      drawSketchPath(c, ()=>{
        c.moveTo(x-w/2,top+ry); c.lineTo(x-w/2,bot-ry);
        c.bezierCurveTo(x-w/2,bot+ry*.8, x+w/2,bot+ry*.8, x+w/2,bot-ry);
        c.lineTo(x+w/2,top+ry);
        c.bezierCurveTo(x+w/2,top-ry*.8, x-w/2,top-ry*.8, x-w/2,top+ry);
      }, n.color, fillCol, true, slopAmp, n.id*3.7+boilOff);
      drawSketchPath(c, ()=>c.ellipse(x,top+ry,w/2,ry,0,0,Math.PI*2), n.color, null, false, slopAmp, n.id*3.7+29+boilOff);
    } else {
      c.strokeStyle=n.color; c.lineWidth=2.5+glow*1.5;
      if(glow>0){c.shadowColor=n.color; c.shadowBlur=18*glow;}
      c.beginPath();
      c.moveTo(x-w/2,top+ry); c.lineTo(x-w/2,bot-ry);
      c.bezierCurveTo(x-w/2,bot+ry*.8, x+w/2,bot+ry*.8, x+w/2,bot-ry);
      c.lineTo(x+w/2,top+ry);
      c.bezierCurveTo(x+w/2,top-ry*.8, x-w/2,top-ry*.8, x-w/2,top+ry);
      if(fillCol){ c.fillStyle=fillCol; c.fill(); }
      c.stroke();
      c.beginPath(); c.ellipse(x,top+ry,w/2,ry,0,0,Math.PI*2); c.stroke();
      c.shadowBlur=0;
    }
    c.setLineDash([]);
    drawLabelLines(c,n,theme,17,n.y+6);
  } else if(n.shape==="text"){
    drawLabelLines(c,n,theme,sk?28:22,n.y);
  } else {
    if(dash) c.setLineDash(dash);
    if(sk){
      drawSketchPath(c, ()=>shapePath(c,n), n.color, fillCol, true, slopAmp, n.id*3.7+boilOff);
    } else {
      c.strokeStyle=n.color; c.lineWidth=2.5+glow*1.5;
      if(glow>0){c.shadowColor=n.color; c.shadowBlur=18*glow;}
      shapePath(c,n);
      if(fillCol){ c.fillStyle=fillCol; c.fill(); }
      c.stroke();
      c.shadowBlur=0;
    }
    c.setLineDash([]);
    drawLabelLines(c,n,theme,17,n.y);
  }
  c.restore();
  if(!isExport && selN.has(n.id)){
    c.save();
    c.setLineDash([6,5]); c.strokeStyle="#7aa2ff"; c.lineWidth=1.5;
    c.strokeRect(n.x-n.w/2-6,n.y-n.h/2-6,n.w+12,n.h+12); c.setLineDash([]);
    const s=singleSel();
    if(s && s.type==="node" && s.obj.id===n.id){
      c.fillStyle="#fff"; c.strokeStyle="#7aa2ff"; c.lineWidth=1.5;
      for(const [cx,cy] of nodeCorners(n)){
        c.beginPath(); c.rect(cx-HANDLE/2,cy-HANDLE/2,HANDLE,HANDLE); c.fill(); c.stroke();
      }
    }
    c.restore();
  }
}
function arrowHead(c,x,y,ang,col){
  c.save(); c.translate(x,y); c.rotate(ang);
  c.fillStyle=col; c.beginPath();
  c.moveTo(1,0); c.lineTo(-11,-6); c.lineTo(-11,6); c.closePath(); c.fill();
  c.restore();
}
function drawEdge(c,e,t,theme,isExport){
  const A=nodeById(e.from), B=nodeById(e.to); if(!A||!B) return;
  const a=Math.min(nodeAlpha(A,t),nodeAlpha(B,t)); if(a<=0) return;
  const pts=edgePoints(e); if(pts.length<2) return;
  const T=THEMES[theme];
  const seld=!isExport && selE.has(e.id);
  const single=!isExport && (()=>{ const s=singleSel(); return s && s.type==="edge" && s.obj.id===e.id; })();
  c.save(); c.globalAlpha=a;
  const lineCol=e.lineColor||T.edge;
  const sk=isSketch();
  c.strokeStyle=seld? "#7aa2ff":lineCol; c.lineWidth=seld?2.6:(sk?2.4:2);
  c.lineJoin="round"; c.lineCap="round";
  if(e.dashed) c.setLineDash([8,7]);
  if(sk){
    const eSeed=e.id*5.1+(settings.boil? Math.floor(t*8)*17.3 : 0);
    for(let i=0;i<2;i++){
      const ox=_jitter(eSeed+i*5);
      const oy=_jitter(eSeed+i*11+3);
      c.beginPath();
      c.translate(ox,oy);
      c.moveTo(pts[0].x,pts[0].y);
      for(let j=1;j<pts.length;j++) c.lineTo(pts[j].x,pts[j].y);
      c.translate(-ox,-oy);
      c.globalAlpha=a*(i===0?0.5:0.6);
      c.stroke();
    }
    c.globalAlpha=a;
  } else {
    c.beginPath(); c.moveTo(pts[0].x,pts[0].y);
    for(let i=1;i<pts.length;i++) c.lineTo(pts[i].x,pts[i].y);
    c.stroke();
  }
  c.setLineDash([]);
  const last=pts[pts.length-1], prev=pts[pts.length-2];
  if(e.endArrow!==false) arrowHead(c,last.x,last.y,Math.atan2(last.y-prev.y,last.x-prev.x), seld?"#7aa2ff":lineCol);
  if(e.startArrow){ const f0=pts[0], f1=pts[1]; arrowHead(c,f0.x,f0.y,Math.atan2(f0.y-f1.y,f0.x-f1.x), seld?"#7aa2ff":lineCol); }
  if(e.animated){
    c.fillStyle=e.dotColor||A.color;
    const n = e.dotCount ?? settings.dots;
    for(let i=0;i<n;i++){
      let base=(t*settings.speed*(e.speedFactor||1) + i/n)%1; if(base<0)base+=1;
      let f=base;
      if(e.flowDir==="reverse") f=1-base;
      else if(e.flowDir==="alternate") f=1-Math.abs(1-2*base);
      const p=pointAt(pts,f);
      const fade=Math.min(1,Math.min(f,1-f)*8);
      c.globalAlpha=a*fade;
      c.beginPath(); c.arc(p.x,p.y,5,0,Math.PI*2); c.fill();
      c.globalAlpha=a*fade*.3;
      c.beginPath(); c.arc(p.x,p.y,9,0,Math.PI*2); c.fill();
      c.globalAlpha=a;
    }
  }
  if(e.label){
    const m=pointAt(pts,.5);
    const efs=e.fs||13;
    c.font=efs+"px Georgia, serif"; c.textAlign="center"; c.textBaseline="middle";
    const w=c.measureText(e.label).width;
    c.fillStyle=T.lblBg; c.fillRect(m.x-w/2-6,m.y-efs*.85,w+12,efs*1.7);
    c.fillStyle=T.edgeLbl; c.fillText(e.label,m.x,m.y);
  }
  if(single){
    c.lineWidth=1.6;
    (e.waypoints||[]).forEach(wp=>{
      c.fillStyle="#7aa2ff"; c.beginPath(); c.arc(wp.x,wp.y,6,0,Math.PI*2); c.fill();
      c.strokeStyle="#fff"; c.stroke();
    });
    for(let i=1;i<pts.length;i++){
      const mx=(pts[i-1].x+pts[i].x)/2, my=(pts[i-1].y+pts[i].y)/2;
      c.fillStyle=theme==="crema"?"#f4eee1":"#0a0c10";
      c.strokeStyle="#7aa2ff";
      c.beginPath(); c.arc(mx,my,5,0,Math.PI*2); c.fill(); c.stroke();
    }
  }
  c.restore();
}
function drawSideArrows(c,n){
  c.save();
  for(const s of SIDES){
    const p=sidePoint(n,s), d=DIR[s];
    const bx=p.x+d.x*ARROW_OFF, by=p.y+d.y*ARROW_OFF;
    const ang=Math.atan2(d.y,d.x);
    c.translate(bx,by); c.rotate(ang);
    c.fillStyle="rgba(122,162,255,.9)";
    c.beginPath();
    c.moveTo(10,0); c.lineTo(-4,-9); c.lineTo(-4,-3.5); c.lineTo(-12,-3.5);
    c.lineTo(-12,3.5); c.lineTo(-4,3.5); c.lineTo(-4,9); c.closePath(); c.fill();
    c.rotate(-ang); c.translate(-bx,-by);
  }
  c.restore();
}
function resizeCanvas(){
  const r=$("wrap").getBoundingClientRect();
  if(cv.width!==Math.round(r.width) || cv.height!==Math.round(r.height)){
    cv.width=Math.round(r.width); cv.height=Math.round(r.height);
  }
}

function render(c,t,opts={}){
  const theme=doc.theme, T=THEMES[theme];
  const isExport=!!opts.export;
  if(isExport){
    const b=opts.bounds||getBounds();
    c.clearRect(b.x,b.y,b.w,b.h);
    if(opts.bg){c.fillStyle=opts.bg; c.fillRect(b.x,b.y,b.w,b.h);}
    else if(!opts.transparent){c.fillStyle=T.bg; c.fillRect(b.x,b.y,b.w,b.h);}
    if(settings.grid){
      c.strokeStyle=T.grid; c.lineWidth=1; c.beginPath();
      const sx=Math.floor(b.x/GRID)*GRID, sy=Math.floor(b.y/GRID)*GRID;
      for(let x=sx; x<b.x+b.w; x+=GRID){c.moveTo(x,b.y);c.lineTo(x,b.y+b.h);}
      for(let y=sy; y<b.y+b.h; y+=GRID){c.moveTo(b.x,y);c.lineTo(b.x+b.w,y);}
      c.stroke();
    }
    for(const e of P().edges) drawEdge(c,e,t,theme,isExport);
    for(const n of P().nodes) drawNode(c,n,t,theme,isExport);
    return;
  }
  resizeCanvas();
  c.clearRect(0,0,cv.width,cv.height);
  c.save();
  c.translate(viewX,viewY); c.scale(viewZoom,viewZoom);
  const wx=-viewX/viewZoom, wy=-viewY/viewZoom, ww=cv.width/viewZoom, wh=cv.height/viewZoom;
  c.fillStyle=T.bg; c.fillRect(wx,wy,ww,wh);
  if(settings.grid){
    c.strokeStyle=T.grid; c.lineWidth=1/viewZoom; c.beginPath();
    const sx=Math.floor(wx/GRID)*GRID, sy=Math.floor(wy/GRID)*GRID;
    for(let x=sx; x<wx+ww+GRID; x+=GRID){c.moveTo(x,wy); c.lineTo(x,wy+wh);}
    for(let y=sy; y<wy+wh+GRID; y+=GRID){c.moveTo(wx,y); c.lineTo(wx+ww,y);}
    c.stroke();
  }
  for(const e of P().edges) drawEdge(c,e,t,theme,isExport);
  for(const n of P().nodes) drawNode(c,n,t,theme,isExport);
  if(mode==="select" && !drag && !resizing && !wpDrag && !connectDrag && !marquee && !pendingShape && !pendingIcon){
    if(hoverNode) drawSideArrows(c,hoverNode);
  }
  if(connectDrag){
    const A=nodeById(connectDrag.fromId);
    if(A){
      const p=sidePoint(A,connectDrag.fromSide);
      const m={x:(mouse.x-viewX)/viewZoom, y:(mouse.y-viewY)/viewZoom};
      const ap=anchorPt(A,connectDrag.fromSide,m.x,m.y);
      c.strokeStyle="#7aa2ff"; c.lineWidth=2; c.setLineDash([6,5]);
      c.beginPath(); c.moveTo(p.x,p.y); c.lineTo(ap.x,ap.y); c.stroke(); c.setLineDash([]);
    }
  }
  if(marquee){
    c.fillStyle="rgba(122,162,255,.08)";
    c.strokeStyle="#7aa2ff"; c.lineWidth=1; c.setLineDash([4,4]);
    c.fillRect(marquee.x0,marquee.y0,marquee.x1-marquee.x0,marquee.y1-marquee.y0);
    c.strokeRect(marquee.x0,marquee.y0,marquee.x1-marquee.x0,marquee.y1-marquee.y0);
    c.setLineDash([]);
  }
  if(arrowDraft){
    // Preview de la flecha en construcción. Línea sólida con glow, sale del
    // borde del círculo origen y termina en el cursor (donde aparecerá el
    // endpoint destino, así el preview coincide con el resultado final).
    const a=Math.atan2(arrowDraft.y1-arrowDraft.y0, arrowDraft.x1-arrowDraft.x0);
    const L=Math.hypot(arrowDraft.x1-arrowDraft.x0, arrowDraft.y1-arrowDraft.y0);
    const start=nodeById(arrowDraft.startId);
    const sr=start? start.w/2 : 0;
    const sx=arrowDraft.x0 + Math.cos(a)*sr;
    const sy=arrowDraft.y0 + Math.sin(a)*sr;
    if(L>sr){
      // Cuerpo de la línea
      c.save();
      c.strokeStyle="#4ad8c7"; c.lineWidth=3; c.lineCap="round";
      c.shadowColor="#4ad8c7"; c.shadowBlur=10;
      c.beginPath(); c.moveTo(sx,sy); c.lineTo(arrowDraft.x1, arrowDraft.y1); c.stroke();
      c.restore();
      // Punta
      c.save();
      c.fillStyle="#4ad8c7"; c.shadowColor="#4ad8c7"; c.shadowBlur=10;
      const ah=12, aw=7;
      c.beginPath();
      c.moveTo(arrowDraft.x1, arrowDraft.y1);
      c.lineTo(arrowDraft.x1-ah*Math.cos(a)+aw*Math.sin(a), arrowDraft.y1-ah*Math.sin(a)-aw*Math.cos(a));
      c.lineTo(arrowDraft.x1-ah*Math.cos(a)-aw*Math.sin(a), arrowDraft.y1-ah*Math.sin(a)+aw*Math.cos(a));
      c.closePath(); c.fill();
      c.restore();
    }
  }
  if(placing){
    const dx=Math.abs(placing.x1-placing.x0), dy=Math.abs(placing.y1-placing.y0);
    let gx=(placing.x0+placing.x1)/2, gy=(placing.y0+placing.y1)/2;
    let gw=Math.max(50,dx), gh=Math.max(40,dy);
    if(dx<12 && dy<12){
      const s=DEFAULT_SIZES[placing.shape]||[160,70];
      gw=s[0]; gh=s[1]; gx=placing.x0; gy=placing.y0;
    }
    if(placing.shape==="circle") gw=gh=Math.max(gw,gh);
    c.save();
    c.setLineDash([6,5]); c.strokeStyle=SKINS[doc.skin||"mint"].accent; c.lineWidth=1.5/viewZoom;
    shapePath(c,{shape:placing.shape, x:gx, y:gy, w:gw, h:gh}); c.stroke();
    c.setLineDash([]);
    c.font=`${12/viewZoom}px system-ui, sans-serif`;
    c.fillStyle=T.text; c.textAlign="left"; c.textBaseline="top";
    c.fillText(`${Math.round(gw)} × ${Math.round(gh)}`, placing.x1+10/viewZoom, placing.y1+10/viewZoom);
    c.restore();
  }
  if(laserStrokes.length){
    const nowMs=performance.now();
    laserStrokes.forEach(s=>{ if(s!==laserDrawing) s.pts=s.pts.filter(p=>nowMs-p.t<LASER_LIFE); });
    laserStrokes=laserStrokes.filter(s=>s===laserDrawing || s.pts.length>1);
    c.save();
    c.lineCap="round"; c.lineJoin="round";
    for(const s of laserStrokes){
      for(let i=1;i<s.pts.length;i++){
        const a=s.pts[i-1], b=s.pts[i];
        const al=s===laserDrawing? 1 : Math.max(0, 1-(nowMs-b.t)/LASER_LIFE);
        if(al<=0) continue;
        c.strokeStyle=`rgba(255,59,48,${(al*.9).toFixed(3)})`;
        c.lineWidth=(3.5/viewZoom)*(.5+al*.8);
        c.shadowColor="rgba(255,59,48,.75)"; c.shadowBlur=9*al;
        c.beginPath(); c.moveTo(a.x,a.y); c.lineTo(b.x,b.y); c.stroke();
      }
    }
    c.restore();
  }
  c.restore();
}

const cv=document.getElementById("cv"), ctx=cv.getContext("2d");
function now(){ return playing? (performance.now()-t0)/1000 : pausedAt; }
(function loop(){ render(ctx, now(), {}); requestAnimationFrame(loop); })();
setTimeout(centerView, 100);

function newNode(shape,x,y,extra={}){
  const sizes={rect:[180,70], cylinder:[150,90], diamond:[160,100], circle:[110,110], hex:[170,80], text:[200,40], icon:[120,92], image:[220,160]};
  const [w,h]=sizes[shape]||[160,70];
  const n=Object.assign({ id:P().nextId++, shape, x:snap(x), y:snap(y), w, h,
    label: shape==="text"?"Texto":(shape==="icon"||shape==="image")?"":"Nodo",
    color:PALETTE[0].c, pulse:false, order:P().nodes.length }, extra);
  P().nodes.push(n); return n;
}
function newEdge(a,b,opts={}){
  if(a===b) return null;
  const e=Object.assign({ id:P().nextId++, from:a, to:b, fromSide:null, toSide:null,
    route:"straight", waypoints:[], label:"", animated:true, dashed:false, startArrow:false, endArrow:true, flowDir:"normal",
    speedFactor:1, dotCount:null }, opts);
  P().edges.push(e); return e;
}

function clearSel(){ selN.clear(); selE.clear(); refreshPanel(); }
function selectOnly(type,id){ selN.clear(); selE.clear(); (type==="node"?selN:selE).add(id); refreshPanel(); }
function toggleSel(type,id){ const s=type==="node"?selN:selE; s.has(id)?s.delete(id):s.add(id); refreshPanel(); }
function singleSel(){
  if(selN.size===1 && selE.size===0) return {type:"node", obj:nodeById([...selN][0])};
  if(selE.size===1 && selN.size===0) return {type:"edge", obj:edgeById([...selE][0])};
  return null;
}
function selectAll(){
  selN=new Set(P().nodes.map(n=>n.id));
  selE=new Set(P().edges.map(e=>e.id));
  refreshPanel();
}

function copySel(){
  if(!selN.size && !selE.size) return;
  const ns=P().nodes.filter(n=>selN.has(n.id)).map(deep);
  const ids=new Set(ns.map(n=>n.id));
  const es=P().edges.filter(e=>ids.has(e.from)&&ids.has(e.to)).map(deep);
  clip={nodes:ns, edges:es};
  try{ navigator.clipboard.writeText("daigram::"+JSON.stringify(clip)).catch(()=>{}); }catch(e){}
}
function cutSel(){ copySel(); deleteSel(); }
function pasteClip(){
  if(!clip || !clip.nodes.length) return;
  pushUndo();
  const map={};
  selN.clear(); selE.clear();
  clip.nodes.forEach(n=>{
    const c=deep(n); map[n.id]=c.id=P().nextId++;
    c.x+=GRID; c.y+=GRID; c.order=P().nodes.length;
    P().nodes.push(c); selN.add(c.id);
  });
  clip.edges.forEach(e=>{
    const c=deep(e); c.id=P().nextId++;
    c.from=map[e.from]; c.to=map[e.to];
    (c.waypoints||[]).forEach(w=>{w.x+=GRID; w.y+=GRID;});
    P().edges.push(c); selE.add(c.id);
  });
  clip.nodes.forEach(n=>{n.x+=GRID; n.y+=GRID;});
  clip.edges.forEach(e=>(e.waypoints||[]).forEach(w=>{w.x+=GRID; w.y+=GRID;}));
  refreshPanel();
}
function dupSel(){ const keep=clip; copySel(); pasteClip(); clip=keep; }
function deleteSel(){
  if(!selN.size && !selE.size) return;
  pushUndo();
  P().edges=P().edges.filter(e=>!selE.has(e.id) && !selN.has(e.from) && !selN.has(e.to));
  P().nodes=P().nodes.filter(n=>!selN.has(n.id));
  clearSel();
}

let undoStack=[], redoStack=[];
function snapPage(){ return {pi:doc.cur, data:deep({nodes:P().nodes, edges:P().edges, nextId:P().nextId})}; }
function pushUndo(){ undoStack.push(snapPage()); if(undoStack.length>60) undoStack.shift(); redoStack.length=0; scheduleAutosave(); }
function applySnap(s){
  doc.cur=clamp(s.pi,0,doc.pages.length-1);
  const pg=P(); pg.nodes=deep(s.data.nodes); pg.edges=deep(s.data.edges); pg.nextId=s.data.nextId;
  clearSel(); renderTabs();
}
function undo(){ if(!undoStack.length) return; redoStack.push(snapPage()); applySnap(undoStack.pop()); scheduleAutosave(); }
function redo(){ if(!redoStack.length) return; undoStack.push(snapPage()); applySnap(redoStack.pop()); scheduleAutosave(); }

let autosaveTimer=null, autosavePaused=false, autosaveReady=true, autosaveSuppressed=0;
function serializeProject(){ return {version:VER,app:APP,doc,settings}; }
function canAutosave(){ return autosaveReady && !autosavePaused && autosaveSuppressed===0; }
function suppressAutosave(){ autosaveSuppressed++; clearTimeout(autosaveTimer); }
function releaseAutosave(){ autosaveSuppressed=Math.max(0, autosaveSuppressed-1); }
function runWithoutAutosave(fn){ suppressAutosave(); try{ return fn(); } finally{ releaseAutosave(); } }
function saveAutosave(force=false){
  if(!force && !canAutosave()) return;
  try{
    const next=JSON.stringify(serializeProject());
    const cur=localStorage.getItem(AUTOSAVE_KEY);
    if(cur && cur!==next) localStorage.setItem(AUTOSAVE_KEY+".prev", cur);
    localStorage.setItem(AUTOSAVE_KEY, next);
  }
  catch(e){ console.error("Autosave failed:", e); }
}
function scheduleAutosave(){
  if(!canAutosave()) return;
  clearTimeout(autosaveTimer);
  autosaveTimer=setTimeout(saveAutosave, AUTOSAVE_DELAY);
}
function clearAutosave(){ try{ localStorage.removeItem(AUTOSAVE_KEY); }catch(e){} }
function hasAutosave(){ try{ return localStorage.getItem(AUTOSAVE_KEY)!==null; }catch(e){ return false; } }
if(hasAutosave()){ autosavePaused=true; autosaveReady=false; }
function loadAutosaveData(){ try{ const raw=localStorage.getItem(AUTOSAVE_KEY); return raw? JSON.parse(raw) : null; }catch(e){ return null; } }
function applyProjectData(d){
  runWithoutAutosave(()=>{
    if(d.doc && Array.isArray(d.doc.pages)) doc=d.doc;
    doc.pages.forEach(pg=>pg.edges.forEach(e=>{
      if(e.endArrow===undefined){ e.endArrow=true; e.startArrow=!!e.bidir; }
      if(!e.flowDir) e.flowDir="normal";
      if(!e.waypoints) e.waypoints=[];
      if(!e.route) e.route="straight";
    }));
    undoStack.length=0; redoStack.length=0;
    if(d.settings) Object.assign(settings,d.settings);
    doc.cur=clamp(doc.cur||0,0,doc.pages.length-1);
    syncProjectControls();
    clearSel(); renderTabs();
  });
}
function syncProjectControls(){
  $("themeSel").value=doc.theme;
  $("skinSel").value=doc.skin||"mint";
  document.documentElement.setAttribute("data-theme", doc.theme);
  applySkin();
  $("speedIn").value=settings.speed;
  $("dotsIn").value=settings.dots;
  $("buildChk").checked=settings.build;
  $("staggerIn").value=settings.stagger;
  $("chkGrid").checked=settings.grid;
  $("boilChk").checked=!!settings.boil;
}
function applySkin(){
  const sk=SKINS[doc.skin||"mint"];
  document.documentElement.style.setProperty("--accent", sk.accent);
  document.documentElement.style.setProperty("--accent2", sk.accent2);
}
function showAutosaveRestorePrompt(){ autosavePaused=true; autosaveReady=false; clearTimeout(autosaveTimer); $("autosaveModal").classList.add("show"); }
function hideAutosaveRestorePrompt(){ $("autosaveModal").classList.remove("show"); }
function enableAutosave(){ clearTimeout(autosaveTimer); autosavePaused=false; autosaveReady=true; }
function closeRestorePrompt(){ hideAutosaveRestorePrompt(); enableAutosave(); }

function renderTabs(){
  const bar=$("pagesBar");
  bar.innerHTML="";
  doc.pages.forEach((pg,i)=>{
    const tab=document.createElement("div");
    tab.className="tab"+(i===doc.cur?" active":"");
    tab.innerHTML=`<span>${escapeHtml(pg.name)}</span><span class="x" title="${t("close")}">✕</span>`;
    tab.onclick=(e)=>{ if(!e.target.classList.contains("x")){ doc.cur=i; clearSel(); syncProjectControls(); centerView(); scheduleAutosave(); }};
    tab.querySelector(".x").onclick=(e)=>{ e.stopPropagation(); if(doc.pages.length>1){ doc.pages.splice(i,1); doc.cur=Math.min(doc.cur,doc.pages.length-1); renderTabs(); syncProjectControls(); scheduleAutosave(); }};
    tab.ondblclick=()=>{ const n=prompt(t("renamePage"), pg.name); if(n!==null){ pg.name=n||(t("page")+" "+(i+1)); renderTabs(); scheduleAutosave(); }};
    bar.appendChild(tab);
  });
  const add=document.createElement("div");
  add.className="addTab"; add.textContent="+";
  add.onclick=()=>{ doc.pages.push(blankPage(t("page")+" "+(doc.pages.length+1))); doc.cur=doc.pages.length-1; renderTabs(); syncProjectControls(); centerView(); scheduleAutosave(); };
  bar.appendChild(add);
}
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

function refreshPanel(){
  const noSel=$("noSel"), ms=$("multiSel"), sb=$("selBody");
  const total=selN.size+selE.size;
  noSel.style.display=total?"none":"block";
  ms.style.display=(selN.size+selE.size>1)?"block":"none";
  sb.style.display=(selN.size+selE.size===1)?"block":"none";
  if(selN.size+selE.size>1){
    $("multiCount").textContent=t("multiCount").replace("{n}",selN.size).replace("{e}",selE.size);
    return;
  }
  const s=singleSel();
  if(!s) return;
  const o=s.obj;
  if(s.type==="node"){
    $("rowShape").style.display=""; $("rowPulse").style.display=""; $("rowOrder").style.display="";
    $("rowBg").style.display=""; $("rowStrokeStyle").style.display=""; $("rowSlop").style.display="";
    $("rowCorners").style.display=""; $("rowOpacity").style.display=""; $("rowZ").style.display="";
    $("rowFs").style.display=""; $("rowColor").style.display=""; $("rowRoute").style.display="none";
    $("rowFrom").style.display="none"; $("rowTo").style.display="none"; $("rowAnim").style.display="none";
    $("rowSpeedF").style.display="none"; $("rowDotsGlobal").style.display="none"; $("rowDots").style.display="none";
    $("rowLineC").style.display="none"; $("rowDotC").style.display="none"; $("rowDash").style.display="none";
    $("rowArrS").style.display="none"; $("rowArrE").style.display="none"; $("rowFlow").style.display="none";
    $("btnWps").style.display="none";
    $("lblEdit").value=o.label||"";
    $("fsIn").value=o.fs||"";
    $("shapeSel").value=o.shape;
    $("pulseChk").checked=!!o.pulse;
    $("orderIn").value=o.order??0;
    $("strokeStyleSel").value=o.strokeStyle||"solid";
    $("slopSel").value=o.slop!=null? String(o.slop) : "";
    $("cornerSel").value=o.sharp? "sharp":"round";
    $("opIn").value=o.op??100;
    buildSwatches("swatches", o.color, c=>{ selN.forEach(id=>{const n=nodeById(id); if(n) n.color=c;}); refreshPanel(); scheduleAutosave(); });
    buildBgSwatches("bgSw", o.bg||"", v=>{ o.bg=v||undefined; refreshPanel(); scheduleAutosave(); });
  } else {
    $("rowShape").style.display="none"; $("rowPulse").style.display="none"; $("rowOrder").style.display="none";
    $("rowBg").style.display="none"; $("rowStrokeStyle").style.display="none"; $("rowSlop").style.display="none";
    $("rowCorners").style.display="none"; $("rowOpacity").style.display="none"; $("rowZ").style.display="none";
    $("rowFs").style.display="none"; $("rowColor").style.display="none"; $("rowRoute").style.display="";
    $("rowFrom").style.display=""; $("rowTo").style.display=""; $("rowAnim").style.display="";
    $("rowSpeedF").style.display=""; $("rowDotsGlobal").style.display=""; $("rowDots").style.display="";
    $("rowLineC").style.display=""; $("rowDotC").style.display=""; $("rowDash").style.display="";
    $("rowArrS").style.display=""; $("rowArrE").style.display=""; $("rowFlow").style.display="";
    $("btnWps").style.display=(o.waypoints&&o.waypoints.length)?"":"none";
    $("lblEdit").value=o.label||"";
    $("routeSel").value=o.route||"straight";
    $("fromSel").value=o.fromSide||""; $("toSel").value=o.toSide||"";
    $("animChk").checked=o.animated!==false;
    $("speedFacSel").value=String(o.speedFactor||1);
    $("dotsGlobalChk").checked=o.dotCount==null;
    $("edgeDotsIn").value=o.dotCount??"";
    $("dashChk").checked=!!o.dashed; $("arrSChk").checked=!!o.startArrow; $("arrEChk").checked=o.endArrow!==false;
    $("flowSel").value=o.flowDir||"normal";
    buildSwatches("lineSw", o.lineColor||"", c=>{ o.lineColor=c||undefined; scheduleAutosave(); }, true);
    buildSwatches("dotSw", o.dotColor||"", c=>{ o.dotColor=c||undefined; scheduleAutosave(); }, true);
  }
}
function buildSwatches(id, cur, onpick, allowNone=false){
  const el=$(id); if(!el){ console.warn("buildSwatches: no element #"+id); return; }
  el.innerHTML="";
  const make=(cls, bg, title, cb)=>{
    const d=document.createElement("div"); d.className=cls; d.style.background=bg; d.title=title;
    d.addEventListener("click", e=>{ e.stopPropagation(); cb(); });
    el.appendChild(d);
  };
  if(allowNone){
    make("swatch"+(cur?"":" sel"), "linear-gradient(135deg,#888,#444)", t("auto"), ()=>onpick(""));
  }
  PALETTE.forEach(p=>{
    make("swatch"+(cur===p.c?" sel":""), p.c, p.n, ()=>onpick(p.c));
  });
  if(!allowNone){
    const cp=document.createElement("input");
    cp.type="color"; cp.className="swatchPicker";
    cp.value=(cur&&/^#[0-9a-f]{6}$/i.test(cur))?cur:"#888888";
    cp.title=t("customColor");
    cp.addEventListener("input", e=>{ e.stopPropagation(); onpick(e.target.value); });
    el.appendChild(cp);
  }
}

function buildBgSwatches(id, cur, onpick){
  const el=$(id); if(!el) return;
  el.innerHTML="";
  const make=(sel, bg, title, cb)=>{
    const d=document.createElement("div");
    d.className="swatch"+(sel?" sel":""); d.style.background=bg; d.title=title;
    d.addEventListener("click", e=>{ e.stopPropagation(); cb(); });
    el.appendChild(d);
  };
  make(!cur, "linear-gradient(135deg,#888,#444)", t("auto"), ()=>onpick(""));
  make(cur==="none", "repeating-conic-gradient(#9a9a9a 0% 25%, #d9d9d9 0% 50%) 0 0 / 12px 12px", t("transparent"), ()=>onpick("none"));
  PALETTE.forEach(p=> make(cur===p.c, p.c, p.n, ()=>onpick(p.c)));
  const cp=document.createElement("input");
  cp.type="color"; cp.className="swatchPicker";
  cp.value=(cur&&/^#[0-9a-f]{6}$/i.test(cur))?cur:"#888888";
  cp.title=t("customColor");
  cp.addEventListener("input", e=>{ e.stopPropagation(); onpick(e.target.value); });
  el.appendChild(cp);
}

function hitTest(wx,wy){
  for(let i=P().nodes.length-1;i>=0;i--){
    const n=P().nodes[i];
    if(n.shape==="circle"){ if(Math.hypot(wx-n.x,wy-n.y)<=n.w/2) return {type:"node",obj:n}; }
    else if(n.shape==="diamond"){ const k=Math.abs(wx-n.x)/(n.w/2)+Math.abs(wy-n.y)/(n.h/2); if(k<=1) return {type:"node",obj:n}; }
    else if(n.shape==="hex"){ const dx=Math.abs(wx-n.x), dy=Math.abs(wy-n.y); if(dx<=n.w/2 && dy<=n.h/2){ const i2=Math.min(24,n.w*.18); if(!(wx<n.x-n.w/2+i2 && wy<n.y) && !(wx>n.x+n.w/2-i2 && wy<n.y) && !(wx<n.x-n.w/2+i2 && wy>n.y) && !(wx>n.x+n.w/2-i2 && wy>n.y)) return {type:"node",obj:n}; } }
    else if(Math.abs(wx-n.x)<=n.w/2 && Math.abs(wy-n.y)<=n.h/2) return {type:"node",obj:n};
  }
  for(let i=P().edges.length-1;i>=0;i--){
    const e=P().edges[i], pts=edgePoints(e);
    for(let j=1;j<pts.length;j++){
      const a=pts[j-1], b=pts[j], dx=b.x-a.x, dy=b.y-a.y, L2=dx*dx+dy*dy;
      let t=L2? ((wx-a.x)*dx+(wy-a.y)*dy)/L2 : 0; t=clamp(t,0,1);
      const px=a.x+t*dx, py=a.y+t*dy;
      if(Math.hypot(wx-px,wy-py)<6) return {type:"edge",obj:e};
    }
  }
  return null;
}
function hitHandle(wx,wy,n){
  const c=nodeCorners(n);
  for(let i=0;i<4;i++) if(Math.abs(wx-c[i][0])<HANDLE && Math.abs(wy-c[i][1])<HANDLE) return i;
  return -1;
}
function hitWaypoint(wx,wy,e){
  for(let i=0;i<(e.waypoints||[]).length;i++) if(Math.hypot(wx-e.waypoints[i].x,wy-e.waypoints[i].y)<7) return i;
  return -1;
}
function hitSideAnchor(wx,wy,n){
  let best=null, bd=14;
  for(const s of SIDES){
    const p=sidePoint(n,s), d=Math.hypot(wx-p.x,wy-p.y);
    if(d<bd){ bd=d; best=s; }
  }
  return best;
}

const wrap=$("wrap");
function getWorld(ev){
  const r=wrap.getBoundingClientRect();
  mouse.x=ev.clientX-r.left; mouse.y=ev.clientY-r.top;
  return { x:(mouse.x-viewX)/viewZoom, y:(mouse.y-viewY)/viewZoom };
}

function makeEndpoint(x,y){
  return newNode("circle", x, y, {w:14, h:14, bg:"none", color:"#4ad8c7", label:""});
}
wrap.addEventListener("pointerdown", ev=>{
  wrap.setPointerCapture(ev.pointerId);
  const w=getWorld(ev);
  if(ev.button===1 || ev.button===2 || (ev.button===0 && ev.altKey)){
    wasRightDrag=(ev.button===2); panDrag={x:ev.clientX,y:ev.clientY,vx:viewX,vy:viewY}; ev.preventDefault(); return;
  }
  if(ev.button!==0) return;
  if(mode==="laser"){
    laserDrawing={pts:[{x:w.x, y:w.y, t:performance.now()}]};
    laserStrokes.push(laserDrawing);
    ev.preventDefault(); return;
  }
  if(mode==="erase"){
    pushUndo(); erasing=true; eraseAt(w.x, w.y);
    ev.preventDefault(); return;
  }
  const handleN=(selN.size===1 && singleSel()?.type==="node")?nodeById([...selN][0]):null;
  if(handleN && (hi=hitHandle(w.x,w.y,handleN))>=0){
    pushUndo(); resizing={id:handleN.id, fx:hi%2, fy:hi<2?0:1, aspect:handleN.w/handleN.h};
    ev.preventDefault(); return;
  }
  const singleE=(selE.size===1 && singleSel()?.type==="edge")?edgeById([...selE][0]):null;
  if(singleE && (wpi=hitWaypoint(w.x,w.y,singleE))>=0){
    pushUndo(); wpDrag={edgeId:singleE.id, idx:wpi}; ev.preventDefault(); return;
  }
  if(connecting){
    const hitT=hitTest(w.x,w.y);
    if(hitT && hitT.type==="node" && hitT.obj.id!==connecting){
      // Segundo click sobre un nodo: cierra la flecha
      pushUndo();
      const e=newEdge(connecting, hitT.obj.id);
      if(e){ selectOnly("edge", e.id); setMode("select"); }
    } else if(!hitT){
      // Segundo click sobre área vacía: crea endpoint + flecha desde el primero
      pushUndo();
      const ep=makeEndpoint(w.x, w.y);
      const e=newEdge(connecting, ep);
      if(e){ selectOnly("edge", e.id); setMode("select"); }
    }
    connecting=null; return;
  }
  const hit=hitTest(w.x,w.y);
  if(hit){
    if(hit.type==="node"){
      const sa=hitSideAnchor(w.x,w.y,hit.obj);
      if(sa && (selN.size===1 && selN.has(hit.obj.id)) && !ev.shiftKey){
        pushUndo(); connectDrag={fromId:hit.obj.id, fromSide:sa}; ev.preventDefault(); return;
      }
      if(mode==="select"){
        if(ev.shiftKey) toggleSel("node",hit.obj.id);
        else if(!selN.has(hit.obj.id)) selectOnly("node",hit.obj.id);
        pushUndo();
        const offs={}; selN.forEach(id=>{const n=nodeById(id); offs[id]={dx:n.x-w.x, dy:n.y-w.y};});
        drag={offs}; ev.preventDefault();
      } else if(mode==="connect"){
        if(selN.size===0){ selectOnly("node",hit.obj.id); connecting=[...selN][0]; }
        else if(!selN.has(hit.obj.id)){
          pushUndo();
          const e=newEdge([...selN][0], hit.obj.id);
          if(e){ selectOnly("edge", e.id); setMode("select"); }
          connecting=null;
        } else { connecting=[...selN][0]; }
      }
    } else {
      if(ev.shiftKey) toggleSel("edge",hit.obj.id);
      else selectOnly("edge",hit.obj.id);
    }
    return;
  }
  if(mode==="connect"){
    // Click sobre área vacía en modo Flecha: inicia arrowDraft (drag-to-draw).
    // pointerup con drag > 20px crea endpoint destino + flecha desde el origen.
    // Sin drag, deja el endpoint origen libre (puede encadenarse con más clicks).
    pushUndo();
    const ep=makeEndpoint(w.x, w.y);
    arrowDraft={startId:ep, x0:w.x, y0:w.y, x1:w.x, y1:w.y};
    connecting=ep;
    return;
  }
  if(pendingShape){
    placing={shape:pendingShape, x0:w.x, y0:w.y, x1:w.x, y1:w.y};
    ev.preventDefault(); return;
  }
  if(pendingIcon){
    pushUndo(); const n=newNode("icon",w.x,w.y,{icon:pendingIcon, label:ICONS[pendingIcon]?.n||"Icon"}); selectOnly("node",n.id); pendingIcon=null;
    $("iconDrawer").style.display="none"; return;
  }
  if(!ev.shiftKey) clearSel();
  marquee={x0:w.x,y0:w.y,x1:w.x,y1:w.y,add:!!ev.shiftKey};
});
wrap.addEventListener("pointermove", ev=>{
  const w=getWorld(ev);
  if(panDrag){ viewX=panDrag.vx+(ev.clientX-panDrag.x); viewY=panDrag.vy+(ev.clientY-panDrag.y); return; }
  if(laserDrawing){ laserDrawing.pts.push({x:w.x, y:w.y, t:performance.now()}); return; }
  if(erasing){ eraseAt(w.x, w.y); return; }
  if(placing){ placing.x1=w.x; placing.y1=w.y; return; }
  if(arrowDraft){ arrowDraft.x1=w.x; arrowDraft.y1=w.y; return; }
  if(drag){
    for(const id in drag.offs){ const n=nodeById(+id); if(n){ n.x=w.x+drag.offs[id].dx; n.y=w.y+drag.offs[id].dy; } }
    refreshPanel(); return;
  }
  if(resizing){
    const n=nodeById(resizing.id);
    if(n){
      let dx=w.x-n.x, dy=w.y-n.y;
      if(resizing.fx===0) dx=-dx;
      if(resizing.fy===1) dy=-dy;
      let nw=Math.max(50, Math.abs(dx)*2);
      let nh=Math.max(40, Math.abs(dy)*2);
      if(ev.shiftKey){ const s=Math.min(nw/n.w, nh/n.h); nw/=s; nh/=s; }
      n.w=nw; n.h=nh;
      refreshPanel();
    }
    return;
  }
  if(wpDrag){
    const e=edgeById(wpDrag.edgeId);
    if(e){ e.waypoints[wpDrag.idx]={x:w.x, y:w.y}; scheduleAutosave(); }
    return;
  }
  if(connectDrag){ return; }
  if(marquee){
    marquee.x1=w.x; marquee.y1=w.y;
    const x0=Math.min(marquee.x0,marquee.x1), x1=Math.max(marquee.x0,marquee.x1);
    const y0=Math.min(marquee.y0,marquee.y1), y1=Math.max(marquee.y0,marquee.y1);
    const inM=n=>Math.abs(n.x-(x0+x1)/2)<=(x1-x0)/2+n.w/2 && Math.abs(n.y-(y0+y1)/2)<=(y1-y0)/2+n.h/2;
    selN=new Set(P().nodes.filter(n=>inM(n)).map(n=>n.id));
    selE=new Set();
    refreshPanel();
    return;
  }
  const hit=hitTest(w.x,w.y);
  hoverNode=(hit && hit.type==="node")?hit.obj:null;
});
wrap.addEventListener("pointerup", ev=>{
  wrap.releasePointerCapture(ev.pointerId);
  if(panDrag){ panDrag=null; if(wasRightDrag){ wasRightDrag=false; ev.preventDefault(); } return; }
  if(laserDrawing){ laserDrawing=null; return; }
  if(erasing){ erasing=false; scheduleAutosave(); return; }
  if(placing){
    const dx=Math.abs(placing.x1-placing.x0), dy=Math.abs(placing.y1-placing.y0);
    pushUndo();
    let n;
    if(dx<12 && dy<12){
      n=newNode(placing.shape, placing.x0, placing.y0);
    } else {
      const cx=(placing.x0+placing.x1)/2, cy=(placing.y0+placing.y1)/2;
      let nw=Math.max(50,dx), nh=Math.max(40,dy);
      if(placing.shape==="circle") nw=nh=Math.max(nw,nh);
      n=newNode(placing.shape, cx, cy, {w:snap(nw), h:snap(nh)});
    }
    selectOnly("node",n.id);
    pendingShape=null; placing=null;
    document.querySelectorAll(".rail button[data-shape]").forEach(b=>b.classList.remove("toggled"));
    return;
  }
  if(arrowDraft){
    const dx=arrowDraft.x1-arrowDraft.x0, dy=arrowDraft.y1-arrowDraft.y0;
    if(Math.hypot(dx,dy)>22){
      pushUndo();
      const ep=makeEndpoint(arrowDraft.x1, arrowDraft.y1);
      const e=newEdge(arrowDraft.startId, ep);
      if(e){ selectOnly("edge", e.id); setMode("select"); }
    }
    arrowDraft=null; connecting=null;
    return;
  }
  if(drag){
    selN.forEach(id=>{ const n=nodeById(id); if(n){ n.x=snap(n.x); n.y=snap(n.y); } });
    drag=null; refreshPanel(); scheduleAutosave(); return;
  }
  if(resizing){
    const n=nodeById(resizing.id);
    if(n){ n.w=Math.max(40, snap(n.w)); n.h=Math.max(40, snap(n.h)); }
    resizing=null; refreshPanel(); scheduleAutosave(); return;
  }
  if(wpDrag){
    const e=edgeById(wpDrag.edgeId);
    if(e && e.waypoints[wpDrag.idx]){ const wp=e.waypoints[wpDrag.idx]; wp.x=snap(wp.x); wp.y=snap(wp.y); }
    wpDrag=null; scheduleAutosave(); return;
  }
  if(connectDrag){ connectDrag=null; scheduleAutosave(); return; }
  if(marquee){ marquee=null; refreshPanel(); return; }
});
wrap.addEventListener("contextmenu", ev=>{ if(wasRightDrag){ ev.preventDefault(); wasRightDrag=false; } });
wrap.addEventListener("wheel", ev=>{
  ev.preventDefault();
  const r=wrap.getBoundingClientRect();
  if(ev.ctrlKey||ev.metaKey){
    const factor=ev.deltaY>0? 1/1.1 : 1.1;
    const newZ=clamp(viewZoom*factor, 0.1, 5);
    const wx=(ev.clientX-r.left-viewX)/viewZoom, wy=(ev.clientY-r.top-viewY)/viewZoom;
    viewZoom=newZ;
    viewX=ev.clientX-r.left-wx*viewZoom;
    viewY=ev.clientY-r.top-wy*viewZoom;
    updateZoomLbl();
  } else {
    viewX-=ev.deltaX; viewY-=ev.deltaY;
  }
}, {passive:false});

wrap.addEventListener("dblclick", ev=>{
  const w=getWorld(ev);
  const e=(selE.size===1 && singleSel()?.type==="edge")?edgeById([...selE][0]):null;
  if(e && e.waypoints && e.waypoints.length){ pushUndo(); e.waypoints.splice(hitWaypoint(w.x,w.y,e),1); scheduleAutosave(); return; }
  const hit=hitTest(w.x,w.y);
  if(hit && hit.type==="node"){ startEdit(hit.obj); }
});
function startEdit(n){
  const r=wrap.getBoundingClientRect();
  const eb=$("editBox");
  eb.style.display="block";
  eb.style.left=(n.x*viewZoom+viewX-n.w*viewZoom/2+4)+"px";
  eb.style.top=(n.y*viewZoom+viewY-n.h*viewZoom/2+4)+"px";
  eb.style.width=(n.w*viewZoom-8)+"px";
  eb.style.height=(n.h*viewZoom-8)+"px";
  eb.style.fontSize=(Math.max(10,(n.fs||17)*viewZoom))+"px";
  eb.value=n.label||""; eb.focus(); eb.select();
  eb._target=n;
}
const eb=$("editBox");
eb.addEventListener("keydown", ev=>{
  if(ev.key==="Enter" && !ev.shiftKey){ ev.preventDefault(); commitEdit(); }
  else if(ev.key==="Escape"){ eb.style.display="none"; eb._target=null; ev.stopPropagation(); }
  else if(ev.key===" "){ ev.stopPropagation(); }
  ev.stopPropagation();
});
function commitEdit(){
  if(!eb._target){ eb.style.display="none"; return; }
  pushUndo(); eb._target.label=eb.value; eb.style.display="none"; eb._target=null;
  refreshPanel(); scheduleAutosave();
}
eb.addEventListener("blur", commitEdit);

function setMode(m){
  mode=m;
  if(m!=="select"){
    pendingShape=null; pendingIcon=null; placing=null;
    document.querySelectorAll(".rail button[data-shape]").forEach(x=>x.classList.remove("toggled"));
  }
  document.querySelectorAll(".rail button[data-mode]").forEach(x=>x.classList.toggle("toggled", x.dataset.mode===m));
  document.body.dataset.mode=m;
  $("wrap").style.cursor = m==="laser" ? "crosshair" : m==="erase" ? "cell" : m==="connect" ? "crosshair" : "";
}
function eraseAt(x,y){
  const hit=hitTest(x,y);
  if(!hit) return;
  if(hit.type==="node"){
    P().edges=P().edges.filter(e=>e.from!==hit.obj.id && e.to!==hit.obj.id);
    P().nodes=P().nodes.filter(n=>n.id!==hit.obj.id);
  } else {
    P().edges=P().edges.filter(e=>e.id!==hit.obj.id);
  }
  clearSel();
}
function armShape(shape){
  setMode("select");
  pendingShape=shape;
  document.querySelectorAll(".rail button[data-shape]").forEach(x=>x.classList.toggle("toggled", x.dataset.shape===shape));
}
document.querySelectorAll(".rail button[data-mode]").forEach(b=>{
  b.onclick=()=>setMode(b.dataset.mode);
});
document.querySelectorAll(".rail button[data-shape]").forEach(b=>{
  b.onclick=()=>armShape(b.dataset.shape);
});

function buildIconDrawer(){
  const d=$("iconDrawer"); d.innerHTML="";
  const groups={};
  for(const k in ICONS){ const g=ICONS[k].g; (groups[g]=groups[g]||[]).push(k); }
  for(const g of Object.keys(groups)){
    const h=document.createElement("h4"); h.textContent=g; d.appendChild(h);
    const grid=document.createElement("div"); grid.className="iconGrid";
    groups[g].forEach(k=>{
      const b=document.createElement("button");
      b.innerHTML=`<img src="${iconURL[k]}" alt=""><span>${ICONS[k].n}</span>`;
      b.onclick=()=>{ pendingIcon=k; };
      grid.appendChild(b);
    });
    d.appendChild(grid);
  }
}
$("btnIcons").onclick=()=>{
  const d=$("iconDrawer");
  d.style.display=(d.style.display==="block")?"none":"block";
};
$("btnImg").onclick=()=>$("imgIn").click();
$("imgIn").onchange=ev=>{
  const f=ev.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ const img=new Image(); img.onload=()=>{ const w=Math.min(320,img.naturalWidth), h=w*img.naturalHeight/img.naturalWidth; pushUndo(); newNode("image", 0, 0, {w, h, img:r.result, label:f.name}); }; img.src=r.result; };
  r.readAsDataURL(f); ev.target.value="";
};

document.addEventListener("paste", ev=>{
  const items=ev.clipboardData?.items; if(!items) return;
  for(const it of items){
    if(it.kind==="file"){
      const f=it.getAsFile(); if(!f.type.startsWith("image/")) continue;
      const r=new FileReader();
      r.onload=()=>{ const img=new Image(); img.onload=()=>{ pushUndo(); newNode("image", 0, 0, {w:Math.min(320,img.naturalWidth), h:Math.min(320,img.naturalHeight)*img.naturalHeight/img.naturalWidth, img:r.result, label:f.name}); }; img.src=r.result; };
      r.readAsDataURL(f); ev.preventDefault(); return;
    }
    if(it.kind==="text"){
      const t=it.getAsData("text/plain")||"";
      if(t.startsWith("daigram::")){
        try{ const c=JSON.parse(t.slice(9)); clip=c; pendingShape=null; }catch(e){}
      } else if(t.startsWith("{")){
        try{ const d=JSON.parse(t); if(d.app===APP && d.doc){ applyProjectData(d); return; } }catch(e){}
      }
    }
  }
});

document.addEventListener("keydown", ev=>{
  const ae=document.activeElement;
  if(ae && (ae.tagName==="TEXTAREA" || ae.tagName==="INPUT")) return;
  const mod=ev.ctrlKey||ev.metaKey;
  if(ev.key==="Delete" || ev.key==="Backspace"){ if(selN.size||selE.size){ deleteSel(); ev.preventDefault(); } }
  else if(mod && ev.key.toLowerCase()==="z"){ if(ev.shiftKey) redo(); else undo(); ev.preventDefault(); }
  else if(mod && ev.key.toLowerCase()==="y"){ redo(); ev.preventDefault(); }
  else if(mod && ev.key.toLowerCase()==="c"){ copySel(); ev.preventDefault(); }
  else if(mod && ev.key.toLowerCase()==="x"){ cutSel(); ev.preventDefault(); }
  else if(mod && ev.key.toLowerCase()==="v"){ pasteClip(); ev.preventDefault(); }
  else if(mod && ev.key.toLowerCase()==="d"){ dupSel(); ev.preventDefault(); }
  else if(mod && ev.key.toLowerCase()==="a"){ selectAll(); ev.preventDefault(); }
  else if(mod && ev.key.toLowerCase()==="s"){ saveJSON(); ev.preventDefault(); }
  else if(!mod && ev.key.toLowerCase()==="v"){ setMode("select"); }
  else if(!mod && ev.key.toLowerCase()==="c"){ setMode("connect"); }
  else if(!mod && ev.key.toLowerCase()==="l"){ setMode("laser"); }
  else if(!mod && ev.key.toLowerCase()==="e"){ setMode("erase"); }
  else if(!mod && ev.key.toLowerCase()==="p"){ togglePresent(); }
  else if(!mod && KEY_TOOLS[ev.key]){ KEY_TOOLS[ev.key](); }
  else if(ev.key===" "){ togglePlay(); ev.preventDefault(); }
  else if(ev.key==="Escape"){
    if(present){ togglePresent(); }
    else { clearSel(); connecting=null; arrowDraft=null; setMode("select"); }
  }
});
const KEY_TOOLS={
  "1":()=>setMode("select"), "2":()=>setMode("connect"), "3":()=>setMode("laser"),
  "4":()=>armShape("rect"), "5":()=>armShape("cylinder"), "6":()=>armShape("diamond"),
  "7":()=>armShape("circle"), "8":()=>armShape("hex"), "9":()=>armShape("text"),
  "0":()=>$("btnIcons").click(),
};

let present=false, presentHintTimer=null;
function togglePresent(){
  present=!present;
  document.body.classList.toggle("present", present);
  if(present){
    clearSel(); setMode("laser");
    const h=$("presentHint");
    h.classList.add("show"); h.classList.remove("fade");
    clearTimeout(presentHintTimer);
    presentHintTimer=setTimeout(()=>{ h.classList.add("fade"); setTimeout(()=>h.classList.remove("show","fade"), 450); }, 2600);
  } else {
    setMode("select");
    $("presentHint").classList.remove("show","fade");
  }
  setTimeout(centerView, 60);
}
$("btnPresent").onclick=togglePresent;

function updateZoomLbl(){ $("zoomLbl").textContent=Math.round(viewZoom*100)+"%"; }
function zoomBy(f){
  const r=wrap.getBoundingClientRect();
  const cx=r.width/2, cy=r.height/2;
  const wx=(cx-viewX)/viewZoom, wy=(cy-viewY)/viewZoom;
  viewZoom=clamp(viewZoom*f, 0.1, 5);
  viewX=cx-wx*viewZoom; viewY=cy-wy*viewZoom;
  updateZoomLbl();
}
$("zoomIn").onclick=()=>zoomBy(1.2);
$("zoomOut").onclick=()=>zoomBy(1/1.2);
$("zoomLbl").onclick=()=>{ centerView(); updateZoomLbl(); };
$("undoBtn").onclick=undo;
$("redoBtn").onclick=redo;
updateZoomLbl();

const PROJ_KEY="daigram.projects.v1";
function loadProjects(){ try{ return JSON.parse(localStorage.getItem(PROJ_KEY))||{}; }catch(e){ return {}; } }
function saveProjects(m){
  try{ localStorage.setItem(PROJ_KEY, JSON.stringify(m)); return true; }
  catch(e){ alert(t("projFull")); return false; }
}
function renderProjList(){
  const m=loadProjects(), list=$("projList");
  list.innerHTML="";
  const ids=Object.keys(m).sort((a,b)=>m[b].updated-m[a].updated);
  if(!ids.length){ list.innerHTML=`<p class="hint">${t("projEmpty")}</p>`; return; }
  ids.forEach(id=>{
    const p=m[id];
    const row=document.createElement("div"); row.className="projRow";
    const pages=p.data?.doc?.pages||[];
    const nodes=pages.reduce((s,pg)=>s+(pg.nodes?.length||0),0);
    const info=document.createElement("div"); info.className="pInfo";
    info.innerHTML=`<b>${escapeHtml(p.name)}</b><span class="hint">${pages.length} ${t("pagesN")} · ${nodes} ${t("nodesN")} · ${new Date(p.updated).toLocaleString()}</span>`;
    const open=document.createElement("button"); open.textContent=t("open");
    open.onclick=()=>{
      applyProjectData(deep(p.data));
      enableAutosave(); saveAutosave(true);
      hideAutosaveRestorePrompt();
      $("projModal").classList.remove("show");
      setTimeout(centerView, 60); updateZoomLbl();
    };
    const share=document.createElement("button"); share.textContent=t("share"); share.title=t("shareTitle");
    share.onclick=async()=>{
      const url=await buildShareURL(p.data);
      try{ await navigator.clipboard.writeText(url); }catch(e){ prompt("URL:", url); }
      share.textContent=t("linkCopied");
      setTimeout(()=>{ share.textContent=t("share"); }, 1400);
    };
    const del=document.createElement("button"); del.className="danger"; del.textContent="✕"; del.title=t("del");
    del.onclick=()=>{ if(confirm(t("projDelete"))){ delete m[id]; saveProjects(m); renderProjList(); } };
    row.append(info, open, share, del);
    list.appendChild(row);
  });
}
$("btnProjects").onclick=()=>{ $("projName").value=""; renderProjList(); $("projModal").classList.add("show"); setTimeout(()=>$("projName").focus(),50); };

const ASIDE_KEY="daigram.hideAside";
function applyAside(){
  const hide=localStorage.getItem(ASIDE_KEY)==="1";
  document.body.classList.toggle("noAside", hide);
  $("asideToggle").textContent=hide? "«" : "»";
  $("asideToggle").title=t(hide? "showPanel" : "hidePanel");
}
$("asideToggle").onclick=()=>{
  localStorage.setItem(ASIDE_KEY, document.body.classList.contains("noAside")? "0" : "1");
  applyAside();
  setTimeout(centerView, 60);
};
$("projClose").onclick=()=>$("projModal").classList.remove("show");
$("projSave").onclick=()=>{
  const name=$("projName").value.trim()||("daigram "+new Date().toLocaleDateString());
  const m=loadProjects();
  const existing=Object.keys(m).find(id=>m[id].name===name);
  const id=existing||("p"+Date.now());
  m[id]={name, updated:Date.now(), data:serializeProject()};
  if(saveProjects(m)){ $("projName").value=""; renderProjList(); }
};

function updatePlayBtn(){
  $("playIco").innerHTML = playing
    ? '<rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect>'
    : '<path d="M7 4l13 8-13 8z"></path>';
  $("playLbl").textContent = playing? t("pause") : t("play");
  $("btnPlay").classList.toggle("toggled", playing);
}
function togglePlay(){
  if(playing){ pausedAt=now(); playing=false; }
  else { t0=performance.now()-pausedAt*1000; playing=true; }
  updatePlayBtn();
}
$("btnPlay").onclick=togglePlay;

$("lblEdit").oninput=()=>{ const s=singleSel(); if(s){ s.obj.label=$("lblEdit").value; scheduleAutosave(); } };
$("fsIn").oninput=()=>{ const s=singleSel(); if(s && s.type==="node"){ const v=parseInt($("fsIn").value); s.obj.fs=v||undefined; scheduleAutosave(); } };
$("shapeSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="node"){ pushUndo(); s.obj.shape=$("shapeSel").value; refreshPanel(); scheduleAutosave(); } };
$("pulseChk").onchange=()=>{ const s=singleSel(); if(s && s.type==="node"){ s.obj.pulse=$("pulseChk").checked; scheduleAutosave(); } };
$("strokeStyleSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="node"){ const v=$("strokeStyleSel").value; s.obj.strokeStyle=v==="solid"?undefined:v; scheduleAutosave(); } };
$("slopSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="node"){ const v=$("slopSel").value; s.obj.slop=v===""?undefined:+v; scheduleAutosave(); } };
$("cornerSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="node"){ s.obj.sharp=$("cornerSel").value==="sharp"?true:undefined; scheduleAutosave(); } };
$("opIn").oninput=()=>{ const s=singleSel(); if(s && s.type==="node"){ const v=+$("opIn").value; s.obj.op=v===100?undefined:v; scheduleAutosave(); } };
$("btnFront").onclick=()=>{ const s=singleSel(); if(s && s.type==="node"){ pushUndo(); const arr=P().nodes, i=arr.indexOf(s.obj); if(i>=0){ arr.splice(i,1); arr.push(s.obj); } scheduleAutosave(); } };
$("btnBack").onclick=()=>{ const s=singleSel(); if(s && s.type==="node"){ pushUndo(); const arr=P().nodes, i=arr.indexOf(s.obj); if(i>=0){ arr.splice(i,1); arr.unshift(s.obj); } scheduleAutosave(); } };
$("orderIn").oninput=()=>{ const s=singleSel(); if(s && s.type==="node"){ s.obj.order=parseInt($("orderIn").value)||0; scheduleAutosave(); } };
$("routeSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ pushUndo(); s.obj.route=$("routeSel").value; refreshPanel(); scheduleAutosave(); } };
$("fromSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ pushUndo(); s.obj.fromSide=$("fromSel").value||null; refreshPanel(); scheduleAutosave(); } };
$("toSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ pushUndo(); s.obj.toSide=$("toSel").value||null; refreshPanel(); scheduleAutosave(); } };
$("animChk").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ s.obj.animated=$("animChk").checked; scheduleAutosave(); } };
$("speedFacSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ s.obj.speedFactor=parseFloat($("speedFacSel").value); scheduleAutosave(); } };
$("dotsGlobalChk").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ s.obj.dotCount=$("dotsGlobalChk").checked? null : settings.dots; refreshPanel(); scheduleAutosave(); } };
$("edgeDotsIn").oninput=()=>{ const s=singleSel(); if(s && s.type==="edge"){ s.obj.dotCount=parseInt($("edgeDotsIn").value)||null; scheduleAutosave(); } };
$("dashChk").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ s.obj.dashed=$("dashChk").checked; scheduleAutosave(); } };
$("arrSChk").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ s.obj.startArrow=$("arrSChk").checked; scheduleAutosave(); } };
$("arrEChk").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ s.obj.endArrow=$("arrEChk").checked; scheduleAutosave(); } };
$("flowSel").onchange=()=>{ const s=singleSel(); if(s && s.type==="edge"){ s.obj.flowDir=$("flowSel").value; scheduleAutosave(); } };
$("btnWps").onclick=()=>{ const s=singleSel(); if(s && s.type==="edge"){ pushUndo(); s.obj.waypoints=[]; refreshPanel(); scheduleAutosave(); } };
$("btnDel").onclick=deleteSel;
$("mCopy").onclick=copySel; $("mCut").onclick=cutSel; $("mDup").onclick=dupSel; $("mDel").onclick=deleteSel;

$("btnClear").onclick=()=>{ if(confirm(t("confirmClear"))){ pushUndo(); P().nodes=[]; P().edges=[]; P().nextId=1; clearSel(); scheduleAutosave(); } };
$("btnDemo").onclick=()=>{ loadDemo(); };

$("themeSel").onchange=()=>{ doc.theme=$("themeSel").value; document.documentElement.setAttribute("data-theme", doc.theme); scheduleAutosave(); };
$("skinSel").onchange=()=>{ doc.skin=$("skinSel").value; applySkin(); scheduleAutosave(); };
$("chkGrid").onchange=()=>{ settings.grid=$("chkGrid").checked; scheduleAutosave(); };
$("speedIn").oninput=()=>{ settings.speed=parseFloat($("speedIn").value); scheduleAutosave(); };
$("dotsIn").oninput=()=>{ settings.dots=parseInt($("dotsIn").value); scheduleAutosave(); };
$("buildChk").onchange=()=>{ settings.build=$("buildChk").checked; scheduleAutosave(); };
$("boilChk").onchange=()=>{ settings.boil=$("boilChk").checked; scheduleAutosave(); };
$("staggerIn").oninput=()=>{ settings.stagger=parseFloat($("staggerIn").value); scheduleAutosave(); };

function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"diagrama"; }
function download(blob, name){ const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),5000); }
function downloadText(t, name, mime){ download(new Blob([t],{type:mime+";charset=utf-8"}), name); }

function saveJSON(){
  const data=serializeProject();
  downloadText(JSON.stringify(data, null, 2), slug(P().name)+".daigram.json", "application/json");
}
function openJSON(){
  $("fileIn").click();
}
$("btnJsonOut").onclick=saveJSON;
$("btnJsonIn").onclick=openJSON;

function b64url(buf){ let s=""; new Uint8Array(buf).forEach(b=>s+=String.fromCharCode(b)); return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); }
function unb64url(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); while(s.length%4) s+="="; return Uint8Array.from(atob(s), c=>c.charCodeAt(0)); }
async function buildShareURL(data){
  const json=JSON.stringify(data);
  let payload;
  try{
    const cs=new CompressionStream("deflate-raw");
    const buf=await new Response(new Blob([json]).stream().pipeThrough(cs)).arrayBuffer();
    payload="c."+b64url(buf);
  }catch(e){
    payload="j."+b64url(new TextEncoder().encode(json));
  }
  return location.origin+location.pathname+"#d="+payload;
}
async function shareLink(){
  const url=await buildShareURL(serializeProject());
  try{ await navigator.clipboard.writeText(url); }catch(e){ prompt("URL:", url); }
  const lbl=$("shareLbl");
  lbl.textContent=t("linkCopied");
  setTimeout(()=>{ lbl.textContent=t("share"); }, 1500);
}
$("btnShare").onclick=shareLink;
async function loadFromHash(){
  const m=location.hash.match(/^#d=([cj])\.(.+)$/);
  if(!m) return false;
  try{
    const bin=unb64url(m[2]);
    let json;
    if(m[1]==="c"){
      const ds=new DecompressionStream("deflate-raw");
      json=await new Response(new Blob([bin]).stream().pipeThrough(ds)).text();
    } else {
      json=new TextDecoder().decode(bin);
    }
    const d=JSON.parse(json);
    if(d.app!==APP) return false;
    applyProjectData(d);
    enableAutosave();
    history.replaceState(null, "", location.pathname);
    return true;
  }catch(e){ console.warn("daigram: invalid share link", e); return false; }
}
$("fileIn").onchange=ev=>{
  const f=ev.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ try{ const d=JSON.parse(r.result); if(d.app===APP){ applyProjectData(d); } else { alert(t("notDaigram")); } }catch(e){ alert(t("badJson")); } ev.target.value=""; };
  r.readAsText(f);
};

$("btnTemplates").onclick=()=>{ $("tplSearch").value=""; renderTplGrid(); $("tplModal").classList.add("show"); setTimeout(()=>$("tplSearch").focus(),50); };
$("tplSearch").oninput=()=>renderTplGrid();
$("tplCancel").onclick=()=>$("tplModal").classList.remove("show");

$("btnMermaid").onclick=()=>{ $("merInput").value="flowchart LR\n  A[Cliente] --> B[API]\n  B --> C[(BD)]"; $("merStatus").textContent=""; $("merModal").classList.add("show"); };
$("merCancel").onclick=()=>$("merModal").classList.remove("show");
$("merGo").onclick=()=>{
  const code=$("merInput").value.trim();
  if(!code){ $("merStatus").textContent=t("mermaidFirst"); return; }
  try{
    const page=mermaidToPage(code);
    if(!page){ $("merStatus").textContent=t("mermaidFail"); return; }
    pushUndo();
    doc.pages.push(page); doc.cur=doc.pages.length-1; renderTabs(); syncProjectControls(); centerView();
    $("merModal").classList.remove("show"); $("merStatus").textContent="";
    scheduleAutosave();
  }catch(e){ $("merStatus").textContent=t("errorPrefix")+e.message; }
};

function mermaidToPage(code){
  const lines=code.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  if(/^flowchart|^graph/.test(lines[0])) return mermaidFlowchart(lines);
  if(/^sequenceDiagram/.test(lines[0])) return mermaidSequence(lines);
  return null;
}
function decodeEntities(s){
  return String(s)
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(+n))
    .replace(/&#x([0-9a-fA-F]+);/g,(_,n)=>String.fromCharCode(parseInt(n,16)))
    .replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&");
}
function cleanNodeLabel(s){
  return decodeEntities(s).replace(/<br\s*\/?>/gi,"\n");
}
function cleanEdgeLabel(s){
  return decodeEntities(s).replace(/<br\s*\/?>/gi," · ");
}
function tokenizeChain(line){
  const tokens=["~~~","x--x","o--o","x--o","o--x","x-->","o-->","<--x","<--o","<-->","<--","-.->","-->","==>","---","-.-","==="];
  const esc=tokens.slice().sort((a,b)=>b.length-a.length)
    .map(t=>t.replace(/[.+*?^${}()|[\]\\]/g,"\\$&")).join("|");
  const parts=line.split(new RegExp("("+esc+")"));
  if(parts.length<3) return null;
  const segs=[];
  for(let i=0;i<parts.length;i++){
    const v=parts[i].trim();
    if(!v) continue;
    segs.push(i%2===0?{kind:"node",value:v}:{kind:"arrow",value:v});
  }
  if(segs.length<3) return null;
  if(segs[0].kind!=="node"||segs[segs.length-1].kind!=="node") return null;
  for(let i=1;i<segs.length;i+=2) if(segs[i].kind!=="arrow") return null;
  return segs;
}
function parseMidLink(line){
  const patterns=[
    // A -- text --> B (arrow with mid-link label)
    {re:/^(.+?)\s*--\s+(.+?)\s*--+>\s*(.+)$/, arrow:"-->"},
    // A --- text --- B (line with mid-link label, line on both sides)
    {re:/^(.+?)\s*---\s+(.+?)\s*--+\s*(.+)$/, arrow:"---"},
    // A == text == B (thick line with mid-link label)
    {re:/^(.+?)\s*==\s+(.+?)\s*=+\s*(.+)$/, arrow:"==="},
    // A -.- text -.- B (dotted line with mid-link label)
    {re:/^(.+?)\s*-\.+\-*\s+(.+?)\s*-\.+\-*\s*(.+)$/, arrow:"-.-"},
    // A -. text .-> B (dotted arrow with mid-link label)
    {re:/^(.+?)\s*-\.\s+(.+?)\s*\.\s*-+>\s*(.+)$/, arrow:"-."},
  ];
  for(const p of patterns){
    const m=line.match(p.re);
    if(m){
      if(p.arrow==="-->" && (m[1].includes("-->") || m[3].includes("-->"))) continue;
      if(p.arrow==="---" && (m[1].includes("---") || m[3].includes("---"))) continue;
      if(p.arrow==="===" && (m[1].includes("===") || m[3].includes("==="))) continue;
      return {a:m[1].trim(), arrow:p.arrow, label:cleanEdgeLabel(m[2]), b:m[3].trim()};
    }
  }
  return null;
}
function arrowInfo(tok){
  if(tok==="~~~") return {invisible:true,dashed:false,thick:false,hasRight:false,hasLeft:false};
  return {
    invisible:false,
    dashed:tok.includes("-.")||tok.includes(".-"),
    thick:tok.includes("="),
    hasRight:tok.includes(">"),
    hasLeft:tok.includes("<"),
  };
}
function parseNodeDecl(s){
  s=String(s).trim();
  const em=s.match(/^(\w+)@\s*\{\s*(.+?)\s*\}\s*$/);
  if(em){
    const id=em[1], propsStr=em[2], props={};
    const re=/(\w+)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|([^,\s}]+))/g;
    let m;
    while((m=re.exec(propsStr))!==null) props[m[1]]=m[2]!==undefined?m[2]:m[3];
    let label=props.label!=null?cleanNodeLabel(props.label):id;
    let shape=props.shape||"rect";
    const aliases={
      cyl:"cylinder",database:"cylinder",db:"cylinder",
      "horizontal-cylinder":"cylinder",hcyl:"cylinder",h_cyl:"cylinder",das:"cylinder",
      "lined-cylinder":"cylinder",lincyl:"cylinder",lin_cyl:"cylinder",disk:"cylinder",
      diam:"diamond",decision:"diamond",question:"diamond",
      circ:"circle","filled-circle":"circle",junction:"circle","sm-circ":"circle","small-circle":"circle",start:"circle","f-circ":"circle",
      "dbl-circ":"doublecircle","double-circle":"doublecircle",stop:"doublecircle","cross-circ":"doublecircle",summary:"doublecircle","fr-circ":"doublecircle","framed-circle":"doublecircle",
      proc:"rect",process:"rect",rectangle:"rect",
      stadium:"stadium",pill:"stadium",terminal:"stadium","terminal-point":"stadium",
      rounded:"round",event:"round",
      hexagon:"hex",prepare:"hex",
    };
    if(aliases[shape]) shape=aliases[shape];
    return {id,label,shape};
  }
  const idMatch=s.match(/^(\w+)/);
  if(!idMatch) return null;
  const id=idMatch[1];
  const rest=s.slice(id.length);
  if(!rest.trim()) return {id,label:id,shape:"rect"};
  const pairs=[
    ["(((",")))","doublecircle"],
    ["((","))","circle"],
    ["{{","}}","hex"],
    ["([","])","stadium"],
    ["[(",")]","cylinder"],
    ["[/","\\]","trapezoid"],
    ["[/","/]","parallelogram"],
    ["[\\","/]","trapezoid_alt"],
    ["[\\","\\]","parallelogram_alt"],
    [">","]","asym"],
    ["[","]","rect"],
    ["(",")","round"],
    ["{","}","diamond"],
  ];
  for(const[open,close,shape] of pairs){
    if(rest.startsWith(open)&&rest.endsWith(close)){
      const label=cleanNodeLabel(rest.slice(open.length,rest.length-close.length).trim());
      return {id,label,shape};
    }
  }
  return null;
}
function parseProps(str){
  const props={};
  str.split(/,(?![^()]*\))/).forEach(p=>{
    const idx=p.indexOf(":");
    if(idx<0) return;
    let k=p.slice(0,idx).trim();
    let v=p.slice(idx+1).trim();
    if(v.startsWith('"')&&v.endsWith('"')) v=v.slice(1,-1);
    if(k) props[k]=v;
  });
  return props;
}
function mermaidFlowchart(lines){
  const header=lines[0].split(/\s+/);
  const dir=(header[1]||"LR").toUpperCase();
  const horizontal=dir==="LR"||dir==="RL";
  const page={name:"Mermaid import",nodes:[],edges:[],nextId:1};
  const positions={};
  const classDefs={};
  let i=0;
  function place(){ return horizontal? {x:80+i*220, y:100+Math.floor(i/2)*140} : {x:80+(i%5)*180, y:80+i*120}; }
  function ensure(id,label,shape){
    if(!positions[id]){
      const p=place();
      positions[id]=nextNode(page,label,p.x,p.y,shape);
      i++;
    } else {
      const n=page.nodes.find(n=>n.id===positions[id]);
      if(n&&n.label===id&&label!==id){ n.label=label; n.shape=shape; }
    }
    return positions[id];
  }
  function paint(id,color){
    if(!positions[id]){
      const p=place();
      positions[id]=nextNode(page,id,p.x,p.y,"rect");
      i++;
    }
    const n=page.nodes.find(n=>n.id===positions[id]);
    if(n) n.color=color;
  }
  function processSegments(segs, midLabel){
    for(let s=0;s<segs.length-2;s+=2){
      let src=segs[s].value;
      // Strip edge ID prefix: "e1@" → "e1"
      if(s===0 && /^(\w+)@$/.test(src)) src=src.slice(0,-1);
      const tok=segs[s+1].value, tgt=segs[s+2].value;
      let pipeLabel="", tgtClean=tgt;
      const lp=tgt.match(/^\|([^|]*)\|\s*(.*)$/);
      if(lp){ pipeLabel=cleanEdgeLabel(lp[1]); tgtClean=lp[2].trim(); }
      const sources=src.split(/\s*&\s*/);
      const targets=tgtClean.split(/\s*&\s*/);
      const info=arrowInfo(tok);
      const reverse=info.hasLeft&&!info.hasRight;
      for(const sId of sources){
        for(const tId of targets){
          const aInfo=parseNodeDecl(sId)||{id:sId.trim(),label:sId.trim(),shape:"rect"};
          const bInfo=parseNodeDecl(tId)||{id:tId.trim(),label:tId.trim(),shape:"rect"};
          const aId=ensure(aInfo.id,aInfo.label,aInfo.shape);
          const bId=ensure(bInfo.id,bInfo.label,bInfo.shape);
          page.edges.push({
            id:page.nextId++,
            from:reverse?bId:aId, to:reverse?aId:bId,
            fromSide:null, toSide:null,
            route:"straight", waypoints:[],
            label:pipeLabel||midLabel||"",
            animated:!info.invisible,
            dashed:info.dashed,
            endArrow:info.hasRight||reverse,
            startArrow:info.hasLeft&&info.hasRight,
            flowDir:"normal", speedFactor:1, dotCount:null
          });
        }
      }
    }
  }
  for(let li=1;li<lines.length;li++){
    let l=lines[li];
    // Strip inline % comments (only outside brackets/quotes)
    l=l.replace(/%%.*$/, "").trim();
    if(!l) continue;
    if(/^%%/.test(l)) continue;
    const cd=l.match(/^classDef\s+(\w+)\s+(.+)$/);
    if(cd){
      const props=parseProps(cd[2]);
      if(props.fill) classDefs[cd[1]]=props.fill;
      continue;
    }
    const cl=l.match(/^class\s+([\w,\s]+?)\s+(\w+)\s*$/);
    if(cl){
      const color=classDefs[cl[2]];
      if(color) cl[1].split(/,\s*/).forEach(id=>paint(id.trim(),color));
      continue;
    }
    const st=l.match(/^style\s+([\w,\s]+?)\s+(.+)$/);
    if(st){
      const props=parseProps(st[2]);
      if(props.fill) st[1].split(/,\s*/).forEach(id=>paint(id.trim(),props.fill));
      continue;
    }
    if(/^subgraph\b|^end\s*$/.test(l)) continue;
    // Mid-link label pre-check
    const ml = parseMidLink(l);
    if(ml){
      const segs = [{kind:"node",value:ml.a},{kind:"arrow",value:ml.arrow},{kind:"node",value:ml.b}];
      processSegments(segs, ml.label);
      continue;
    }
    let segs=tokenizeChain(l);
    if(segs){ processSegments(segs); continue; }
    const parts=l.split(/,\s*/);
    let handled=false;
    for(const p of parts){
      segs=tokenizeChain(p);
      if(segs){ processSegments(segs); handled=true; }
    }
    if(handled) continue;
    const decl=parseNodeDecl(l);
    if(decl) ensure(decl.id,decl.label,decl.shape);
  }
  if(!page.nodes.length) return null;
  layoutFlow(page, horizontal, dir);
  return page;
}
// Layout por capas (Sugiyama simplificado): rango = camino más largo desde las
// fuentes, orden dentro de la capa por baricentro de los predecesores.
function layoutFlow(page, horizontal, dir){
  const nodes=page.nodes; if(!nodes.length) return;
  const idx={}; nodes.forEach((n,i)=>idx[n.id]=i);
  const edges=page.edges.map(e=>({a:idx[e.from], b:idx[e.to]}))
    .filter(e=>e.a!=null && e.b!=null && e.a!==e.b);
  const rank=new Array(nodes.length).fill(0);
  for(let it=0, changed=true; changed && it<nodes.length+2; it++){
    changed=false;
    for(const e of edges){
      if(rank[e.b]<rank[e.a]+1 && rank[e.a]+1<=nodes.length){ rank[e.b]=rank[e.a]+1; changed=true; }
    }
  }
  const maxR=Math.max(...rank);
  const cols=Array.from({length:maxR+1},()=>[]);
  nodes.forEach((n,i)=>cols[rank[i]].push(i));
  const preds=nodes.map(()=>[]);
  edges.forEach(e=>preds[e.b].push(e.a));
  const pos=new Array(nodes.length).fill(0);
  cols[0].forEach((i,k)=>pos[i]=k);
  for(let r=1;r<=maxR;r++){
    cols[r].sort((a,b)=>{
      const ba=preds[a].length? preds[a].reduce((s,p)=>s+pos[p],0)/preds[a].length : 1e9;
      const bb=preds[b].length? preds[b].reduce((s,p)=>s+pos[p],0)/preds[b].length : 1e9;
      return ba-bb;
    });
    cols[r].forEach((i,k)=>pos[i]=k);
  }
  const GAP_MAIN=120, GAP_CROSS=70;
  const colSize=cols.map(col=>Math.max(...col.map(i=>horizontal? nodes[i].w : nodes[i].h)));
  const colSpan=cols.map(col=>col.reduce((s,i)=>s+(horizontal? nodes[i].h : nodes[i].w),0)+GAP_CROSS*(col.length-1));
  const maxSpan=Math.max(...colSpan);
  let main=80;
  cols.forEach((col,r)=>{
    let cross=80+(maxSpan-colSpan[r])/2;
    for(const i of col){
      const n=nodes[i];
      if(horizontal){ n.x=snap(main+colSize[r]/2); n.y=snap(cross+n.h/2); cross+=n.h+GAP_CROSS; }
      else          { n.y=snap(main+colSize[r]/2); n.x=snap(cross+n.w/2); cross+=n.w+GAP_CROSS; }
    }
    main+=colSize[r]+GAP_MAIN;
  });
  if(dir==="RL"||dir==="BT"){
    const vals=nodes.map(n=>horizontal? n.x : n.y);
    const mn=Math.min(...vals), mx=Math.max(...vals);
    nodes.forEach(n=>{ if(horizontal) n.x=mn+mx-n.x; else n.y=mn+mx-n.y; });
  }
}
function nextNode(page, label, x, y, shape){
  const n={id:page.nextId++, shape, x, y, w:Math.max(120, label.length*9+30), h:60, label, color:PALETTE[0].c, pulse:false, order:page.nodes.length};
  page.nodes.push(n); return n.id;
}
// Diagrama de secuencia: participantes como columnas con lifeline punteada y
// cada mensaje en su propia fila (waypoints a altura creciente → forma ∏, las
// verticales solapadas dibujan la lifeline). Soporta autonumber, actor,
// "as" alias, alt/else/opt/loop/par/critical/break, Note over y automensajes.
function mermaidSequence(lines){
  const parts=[], byId={};
  const events=[];
  let autonum=false, depth=0;
  const ensureP=(id,label,actor)=>{
    if(!byId[id]){ byId[id]={id, label:label||id, actor:!!actor, idx:parts.length}; parts.push(byId[id]); }
    else if(label) byId[id].label=label;
    return byId[id];
  };
  for(let i=1;i<lines.length;i++){
    const l=lines[i].replace(/%%.*$/,"").trim();
    if(!l) continue;
    if(/^autonumber\b/i.test(l)){ autonum=true; continue; }
    if(/^(activate|deactivate)\b/i.test(l)) continue;
    let m=l.match(/^(participant|actor)\s+(\w+)(?:\s+as\s+(.+))?$/i);
    if(m){ ensureP(m[2], m[3]? cleanNodeLabel(m[3]):null, /^actor$/i.test(m[1])); continue; }
    if(/^box\b/i.test(l)){ depth++; continue; }
    m=l.match(/^(alt|else|opt|loop|par|and|critical|option|break|rect)\b\s*(.*)$/i);
    if(m){
      const kw=m[1].toLowerCase();
      const alt=(kw==="else"||kw==="and"||kw==="option");
      events.push({type:"block", kw, text:cleanNodeLabel(m[2]||""), depth:alt? Math.max(0,depth-1):depth});
      if(!alt) depth++;
      continue;
    }
    if(/^end\b/i.test(l)){ depth=Math.max(0,depth-1); events.push({type:"end"}); continue; }
    m=l.match(/^note\s+(?:over|left of|right of)\s+([\w,\s]+?)\s*:\s*(.+)$/i);
    if(m){
      const ids=m[1].split(/\s*,\s*/).map(s=>s.trim()).filter(Boolean);
      ids.forEach(id=>ensureP(id));
      events.push({type:"note", ids, text:cleanNodeLabel(m[2])});
      continue;
    }
    m=l.match(/^(\w+)\s*(--|-)(>>|>|[x)])\s*(?:[+-]\s*)?(\w+)\s*(?::\s*(.*))?$/);
    if(m){
      const a=ensureP(m[1]).id, b=ensureP(m[4]).id;
      const ev={a, b, text:cleanEdgeLabel(m[5]||""), dashed:m[2]==="--"};
      events.push(Object.assign(ev,{type:a===b?"self":"msg"}));
      continue;
    }
  }
  if(!parts.length) return null;

  const page={name:"Sequence", nodes:[], edges:[], nextId:1};
  const GAPX=80, ROWH=78, HEADY=90;
  // Carril izquierdo para las etiquetas de bloques (alt/loop/…)
  const blockW=b=>((b.kw+(b.text?" · "+b.text:"")).length*8+26+b.depth*24);
  const lane=Math.min(360, Math.max(0, ...events.filter(e=>e.type==="block").map(blockW)));
  // Columnas: ancho según etiqueta, espaciadas de sobra
  let cx=60+lane+(lane?60:20);
  parts.forEach(p=>{
    const ls=p.label.split("\n");
    p.w=p.actor? 120 : Math.max(150, Math.max(...ls.map(s=>s.length))*9+36);
    p.h=p.actor? 92 : 64;
    p.x=cx+p.w/2; cx=p.x+p.w/2+GAPX;
  });
  parts.forEach(p=>{
    const n=p.actor
      ? {id:page.nextId++, shape:"icon", icon:"uml_actor", x:p.x, y:HEADY, w:120, h:92, label:p.label, color:PALETTE[5].c, pulse:false, order:page.nodes.length}
      : {id:page.nextId++, shape:"rect", x:p.x, y:HEADY, w:p.w, h:p.h, label:p.label, color:PALETTE[p.idx%PALETTE.length].c, pulse:false, order:page.nodes.length};
    page.nodes.push(n); p.nid=n.id;
  });

  const TOP=HEADY+150, rowY=k=>TOP+k*ROWH;
  const msgEdges=[];
  let lvl=0, num=0;
  for(const ev of events){
    if(ev.type==="msg"){
      const A=byId[ev.a], B=byId[ev.b], y=rowY(lvl);
      msgEdges.push({from:A.nid, to:B.nid, fromSide:"s", toSide:"s", route:"straight",
        waypoints:[{x:A.x,y},{x:B.x,y}],
        label:(autonum? (++num)+". ":"")+ev.text,
        animated:true, dashed:ev.dashed, startArrow:false, endArrow:true,
        flowDir:"normal", speedFactor:1, dotCount:null});
      lvl++;
    } else if(ev.type==="self"){
      const A=byId[ev.a], y=rowY(lvl);
      const label="↩ "+(autonum? (++num)+". ":"")+ev.text;
      const w=label.length*8+24;
      page.nodes.push({id:page.nextId++, shape:"text", x:A.x+24+w/2, y, w, h:32, label, fs:14,
        color:PALETTE[5].c, pulse:false, order:page.nodes.length});
      lvl++;
    } else if(ev.type==="block"){
      const label=ev.kw+(ev.text? " · "+ev.text:"");
      const w=label.length*8+26;
      page.nodes.push({id:page.nextId++, shape:"text", x:40+ev.depth*24+w/2, y:rowY(lvl), w, h:32,
        label, fs:15, color:PALETTE[6].c, pulse:false, order:page.nodes.length});
      lvl++;
    } else if(ev.type==="note"){
      const xs=ev.ids.map(id=>byId[id].x), x=(Math.min(...xs)+Math.max(...xs))/2;
      const w=Math.max(140, ev.text.length*8+30);
      page.nodes.push({id:page.nextId++, shape:"rect", x, y:rowY(lvl), w, h:44, label:ev.text, fs:14,
        color:PALETTE[6].c, pulse:false, order:page.nodes.length});
      lvl++;
    } else if(ev.type==="end"){
      lvl+=0.4;
    }
  }

  // Lifelines: línea punteada de cada cabecera a un punto al fondo
  const bottom=rowY(lvl)+30;
  parts.forEach(p=>{
    const cap={id:page.nextId++, shape:"circle", x:p.x, y:bottom, w:18, h:18, label:"",
      color:PALETTE[5].c, pulse:false, order:page.nodes.length};
    page.nodes.push(cap);
    page.edges.push({id:page.nextId++, from:p.nid, to:cap.id, fromSide:"s", toSide:"n",
      route:"straight", waypoints:[], label:"", animated:false, dashed:true,
      startArrow:false, endArrow:false, flowDir:"normal", speedFactor:1, dotCount:null});
  });
  msgEdges.forEach(e=>{ e.id=page.nextId++; page.edges.push(e); });
  return page;
}

function tpl(nEs,nEn,dEs,dEn,nodes,edges){ return {n:{es:nEs,en:nEn}, d:{es:dEs,en:dEn}, nodes, edges:edges||[]}; }
function tplTxt(s){ return String(s).includes("|")? String(s).split("|")[lang==="en"?1:0] : String(s); }
function tplNode(p,label,x,y,shape="rect",ci=0){
  const lbl=tplTxt(label);
  if(ICONS[shape]){
    const n={id:p.nextId++, shape:"icon", icon:shape, x, y, w:120, h:92, label:lbl, color:PALETTE[ci].c, pulse:false, order:p.nodes.length};
    p.nodes.push(n); return n.id;
  }
  const heights={rect:60, cylinder:90, diamond:90, circle:110, hex:70, text:40};
  const w=shape==="circle"?110:Math.max(140, Math.max(...lbl.split("\n").map(s=>s.length),1)*9+30);
  const n={id:p.nextId++, shape, x, y, w, h:heights[shape]||60, label:lbl, color:PALETTE[ci].c, pulse:false, order:p.nodes.length};
  p.nodes.push(n); return n.id;
}
function buildTemplate(tp){
  const p=blankPage(tp.n[lang]||tp.n.es);
  const ids=tp.nodes.map(nd=>tplNode(p,nd[0],nd[1],nd[2],nd[3],nd[4]));
  tp.edges.forEach(ed=>{
    const [a,b,label="",opts={}]=ed;
    p.edges.push(Object.assign({id:p.nextId++, from:ids[a], to:ids[b], fromSide:null, toSide:null,
      route:"straight", waypoints:[], label:tplTxt(label), animated:true, dashed:false,
      startArrow:false, endArrow:true, flowDir:"normal", speedFactor:1, dotCount:null}, opts));
  });
  return p;
}
const TEMPLATES=[
tpl("Vacía","Empty","Página en blanco","Blank page",[],[]),
tpl("Web 3 capas","3-tier web","Cliente → API → BD","Client → API → DB",
  [["Cliente|Client",80,140,"user"],["API REST",320,140],["BD|DB",580,140,"cylinder",2]],
  [[0,1,"HTTPS"],[1,2,"SQL"]]),
tpl("Cola + workers","Queue + workers","Productor → cola → 3 consumidores","Producer → queue → 3 consumers",
  [["Productor|Producer",80,200],["Cola|Queue",320,200,"hex",1],["Worker 1",580,80],["Worker 2",580,200],["Worker 3",580,320]],
  [[0,1],[1,2],[1,3],[1,4]]),
tpl("Pipeline IA","AI pipeline","Datos → modelo → inferencia","Data → model → inference",
  [["Datos|Data",80,200,"cylinder",2],["Modelo|Model",320,200,"rect",3],["Inferencia|Inference",560,200,"rect",3],["Cliente|Client",800,200,"user"]],
  [[0,1,"entrena|trains"],[1,2],[2,3]]),
tpl("Serverless AWS","AWS serverless","API GW → Lambda → DynamoDB + S3","API GW → Lambda → DynamoDB + S3",
  [["Usuario|User",80,160,"user"],["API GW",300,160,"apigw"],["Lambda",520,160,"lambda"],["DynamoDB",740,160,"dynamo"],["S3",520,340,"s3"]],
  [[0,1,"HTTPS"],[1,2],[2,3],[2,4,"assets",{dashed:true}]]),
tpl("Microservicios","Microservices","Gateway → 3 servicios con sus BDs","Gateway → 3 services with their DBs",
  [["Cliente|Client",80,220,"user"],["Gateway",300,220,"gateway"],["Pedidos|Orders",560,80],["Pagos|Payments",560,220],["Usuarios|Users",560,360],["BD|DB",820,80,"cylinder",2],["BD|DB",820,220,"cylinder",2],["BD|DB",820,360,"cylinder",2]],
  [[0,1],[1,2],[1,3],[1,4],[2,5],[3,6],[4,7]]),
tpl("Pub/Sub fan-out","Pub/Sub fan-out","Un evento, varios suscriptores","One event, many subscribers",
  [["Productor|Producer",80,200],["Broker",320,200,"queue",1],["Email",580,80,"mail",1],["Push",580,200,"bell",1],["Analytics",580,320,"metrics",2]],
  [[0,1,"publica|publishes"],[1,2],[1,3],[1,4]]),
tpl("CQRS","CQRS","Separar escritura y lectura","Split writes and reads",
  [["UI",80,190,"user"],["Command API",320,80],["Write DB",580,80,"cylinder",2],["Bus de eventos|Event bus",580,300,"hex",1],["Proyector|Projector",820,300,"rect",3],["Read DB",1060,190,"cylinder",2],["Query API",320,300]],
  [[0,1,"comandos|commands"],[1,2],[2,3,"eventos|events",{dashed:true}],[3,4],[4,5],[0,6,"consultas|queries"],[6,5,"lee|reads",{dashed:true}]]),
tpl("Saga","Saga","Transacción distribuida orquestada","Orchestrated distributed transaction",
  [["Orquestador|Orchestrator",320,220,"rect",6],["Pago|Payment",80,80],["Inventario|Inventory",560,80],["Envío|Shipping",320,400]],
  [[0,1,"",{startArrow:true}],[0,2,"",{startArrow:true}],[0,3,"",{startArrow:true}]]),
tpl("Cache-aside","Cache-aside","App consulta cache antes que BD","App checks cache before DB",
  [["App",80,200],["Cache",340,80,"cache",4],["BD|DB",340,320,"cylinder",2]],
  [[0,1,"get / set"],[0,2,"si falla el cache|on cache miss",{dashed:true}]]),
tpl("Balanceador de carga","Load balancer","LB reparte entre 3 instancias","LB spreads across 3 instances",
  [["Usuarios|Users",80,200,"user"],["LB",300,200,"lb"],["Instancia 1|Instance 1",540,80],["Instancia 2|Instance 2",540,200],["Instancia 3|Instance 3",540,320],["BD|DB",820,200,"cylinder",2]],
  [[0,1],[1,2],[1,3],[1,4],[2,5],[3,5],[4,5]]),
tpl("CDN estático","Static CDN","CDN delante del bucket de origen","CDN in front of the origin bucket",
  [["Usuario|User",80,160,"user"],["CDN",320,160,"cdn"],["Bucket estático|Static bucket",580,160,"gcs"]],
  [[0,1,"cache hit"],[1,2,"miss",{dashed:true}]]),
tpl("OAuth 2.0","OAuth 2.0","Login delegado con tokens","Delegated login with tokens",
  [["Usuario|User",80,80,"user"],["App",320,80],["Auth Server",320,300,"lock",4],["API",580,80]],
  [[0,1,"1· login"],[1,2,"2· redirect"],[2,1,"3· token",{dashed:true}],[1,3,"4· Bearer"]]),
tpl("JWT","JWT","Emisión y verificación de tokens","Token issuing and verification",
  [["Cliente|Client",80,160,"user"],["Auth API",340,160],["JWT",580,60,"key",6],["API protegida|Protected API",580,300]],
  [[0,1,"credenciales|credentials"],[1,2,"firma|signs"],[0,3,"Bearer token"],[3,2,"verifica|verifies",{dashed:true}]]),
tpl("Streaming Kafka","Kafka streaming","Eventos en tiempo real","Real-time events",
  [["Ventas|Sales",80,80],["Clicks",80,300],["Kafka",320,190,"kafka"],["Stream proc",560,190,"rect",3],["DWH",820,80,"cylinder",2],["Dashboard",820,300,"metrics",2]],
  [[0,2],[1,2],[2,3],[3,4],[3,5]]),
tpl("ETL","ETL","Extract → Transform → Load","Extract → Transform → Load",
  [["CRM",80,80,"rect",5],["ERP",80,200,"rect",5],["Logs",80,320,"rect",5],["Extract",320,200,"rect",1],["Transform",560,200,"rect",3],["Load",800,200,"rect",1],["DWH",1040,200,"cylinder",2]],
  [[0,3],[1,3],[2,3],[3,4],[4,5],[5,6]]),
tpl("Data lake","Data lake","Ingesta → lake → procesamiento → BI","Ingest → lake → processing → BI",
  [["Fuentes|Sources",80,200,"rect",5],["Ingesta|Ingestion",320,200,"rect",1],["Lake",560,200,"s3"],["Spark",820,100,"rect",3],["BI",820,300,"metrics",2]],
  [[0,1],[1,2],[2,3],[2,4]]),
tpl("RAG","RAG","Recuperación aumentada para LLMs","Retrieval-augmented generation",
  [["Docs",80,80,"logs",5],["Embeddings",320,80,"rect",3],["Vector DB",580,80,"cylinder",2],["Usuario|User",80,320,"user"],["App",320,320],["LLM",580,320,"ai",3],["Respuesta|Answer",820,320]],
  [[0,1],[1,2],[3,4,"pregunta|question"],[4,2,"búsqueda|search"],[2,4,"contexto|context",{dashed:true}],[4,5],[5,6]]),
tpl("Entrenamiento ML","ML training","De los datos al modelo servido","From data to served model",
  [["Datos|Data",80,200,"cylinder",2],["Features",320,200,"rect",3],["Entrenamiento|Training",560,200,"rect",3],["Registro|Registry",800,200,"rect",6],["Serving",1040,200]],
  [[0,1],[1,2],[2,3],[3,4]]),
tpl("CI/CD","CI/CD","Del commit a producción","From commit to production",
  [["Dev",80,200,"user"],["Git",300,200,"git"],["CI: tests",520,200,"cicd"],["Build",740,100],["Deploy",740,300],["Prod",960,200,"server"]],
  [[0,1,"push"],[1,2],[2,3],[3,4],[4,5]]),
tpl("Blue-Green","Blue-Green","Despliegue con dos entornos","Two-environment deployment",
  [["LB",80,200,"lb"],["Blue (activo)|Blue (active)",340,100,"rect",0],["Green (nuevo)|Green (new)",340,300,"rect",2]],
  [[0,1,"100%"],[0,2,"switch",{dashed:true}]]),
tpl("Canary","Canary","Tráfico gradual a la versión nueva","Gradual traffic to the new version",
  [["LB",80,200,"lb"],["v1",340,100],["v2 canary",340,300,"rect",4]],
  [[0,1,"90%"],[0,2,"10%"]]),
tpl("Kubernetes","Kubernetes","Ingress → Service → Pods","Ingress → Service → Pods",
  [["Ingress",80,200,"gateway"],["Service",300,200,"k8s"],["Pod 1",540,80,"container"],["Pod 2",540,200,"container"],["Pod 3",540,320,"container"],["BD|DB",800,200,"cylinder",2]],
  [[0,1],[1,2],[1,3],[1,4],[2,5],[3,5],[4,5]]),
tpl("Observabilidad","Observability","Logs, métricas y trazas","Logs, metrics and traces",
  [["Servicio A|Service A",80,80],["Servicio B|Service B",80,200],["Servicio C|Service C",80,320],["Collector",320,200,"rect",1],["Logs",560,80,"logs",5],["Métricas|Metrics",560,200,"metrics",2],["Trazas|Traces",560,320,"rect",3],["Alertas|Alerts",820,200,"bell",4]],
  [[0,3],[1,3],[2,3],[3,4],[3,5],[3,6],[5,7]]),
tpl("Retry + DLQ","Retry + DLQ","Reintentos y cola de mensajes muertos","Retries and dead-letter queue",
  [["Productor|Producer",80,160],["Cola|Queue",320,160,"queue",1],["Consumidor|Consumer",580,160],["DLQ",320,360,"queue",4]],
  [[0,1],[1,2],[2,1,"retry",{dashed:true}],[1,3,"tras N fallos|after N failures",{dashed:true}]]),
tpl("Webhooks","Webhooks","Recepción segura y proceso asíncrono","Safe intake and async processing",
  [["Proveedor|Provider",80,160,"web",5],["/webhook",320,160],["¿Firma válida?|Valid signature?",580,160,"diamond",6],["Cola|Queue",840,60,"queue",1],["Worker",1080,60],["400",840,320,"rect",4]],
  [[0,1,"POST"],[1,2],[2,3,"sí|yes"],[3,4],[2,5,"no",{dashed:true}]]),
tpl("Hexagonal","Hexagonal","Puertos y adaptadores","Ports and adapters",
  [["HTTP",80,100,"rect",5],["CLI",80,300,"rect",5],["Puerto in|In port",320,200,"hex",6],["Dominio|Domain",560,200,"circle",3],["Puerto out|Out port",800,200,"hex",6],["BD|DB",1040,100,"cylinder",2],["Email",1040,300,"mail",1]],
  [[0,2],[1,2],[2,3],[3,4],[4,5],[4,6]]),
tpl("Event sourcing","Event sourcing","El estado se deriva de eventos","State derived from events",
  [["Comando|Command",80,200],["Agregado|Aggregate",320,200,"rect",3],["Event store",580,200,"cylinder",2],["Proyecciones|Projections",840,200,"rect",3],["Read model",1080,200,"cylinder",2]],
  [[0,1],[1,2,"append"],[2,3,"eventos|events"],[3,4]]),
tpl("Multi-región","Multi-region","GeoDNS con réplica entre regiones","GeoDNS with cross-region replica",
  [["Usuarios|Users",80,200,"user"],["GeoDNS",320,200,"web",6],["Región A|Region A",580,100,"server",0],["Región B|Region B",580,300,"server",0]],
  [[0,1],[1,2],[1,3],[2,3,"réplica|replica",{dashed:true,startArrow:true}]]),
tpl("UML: casos de uso","UML: use cases","Actores y casos de uso","Actors and use cases",
  [["Cliente|Customer",80,200,"uml_actor"],["Comprar|Buy",360,80,"circle",0],["Pagar|Pay",360,200,"circle",0],["Devolver|Return",360,320,"circle",0],["Admin",640,320,"uml_actor",5]],
  [[0,1],[0,2],[0,3],[4,3]]),
tpl("UML: máquina de estados","UML: state machine","Flujo de estados de un artículo","States of an article",
  [["",80,200,"uml_start"],["Borrador|Draft",300,200,"rect",6],["Revisión|Review",540,200,"rect",1],["Publicado|Published",790,200,"rect",2],["",1010,200,"uml_end"]],
  [[0,1],[1,2,"enviar|submit"],[2,1,"rechazar|reject",{dashed:true}],[2,3,"aprobar|approve"],[3,4]]),
];
function renderTplGrid(){
  const q=($("tplSearch").value||"").trim().toLowerCase();
  const g=$("tplGrid"); g.innerHTML="";
  const hits=TEMPLATES.filter(tp=>!q || (tp.n.es+" "+tp.n.en+" "+tp.d.es+" "+tp.d.en).toLowerCase().includes(q));
  if(!hits.length){ g.innerHTML=`<p class="hint">${t("tplEmpty")}</p>`; return; }
  hits.forEach(tp=>{
    const b=document.createElement("button");
    b.innerHTML=`<span class="t">${escapeHtml(tp.n[lang]||tp.n.es)}</span><span class="d">${escapeHtml(tp.d[lang]||tp.d.es)}</span>`;
    b.onclick=()=>{ applyTemplate(tp); $("tplModal").classList.remove("show"); };
    g.appendChild(b);
  });
}
function applyTemplate(tp){
  const np=buildTemplate(tp);
  pushUndo();
  doc.pages[doc.cur]=np; clearSel(); centerView(); renderTabs(); syncProjectControls(); scheduleAutosave();
}

function syncExportRows(){
  const video=$("exFmt").value==="video";
  $("exRowDur").style.display=video? "":"none";
  $("exRowTr").style.display=video? "none":"";
}
$("btnExport").onclick=()=>{ $("exFmt").value="png"; syncExportRows(); $("exStatus").textContent=""; $("exModal").classList.add("show"); };
$("exFmt").onchange=syncExportRows;
$("exCancel").onclick=()=>$("exModal").classList.remove("show");
$("exGo").onclick=()=>{
  const fmt=$("exFmt").value, scale=parseFloat($("exRes").value), tr=$("exTr").checked;
  if(fmt==="video"){ exportVideo(scale, parseInt($("exDur").value)||6); return; }
  $("exModal").classList.remove("show");
  if(fmt==="svg") exportSVG(scale); else exportRaster(fmt, scale, tr);
};
// Graba la animación en tiempo real desde t=0 (incluye la aparición si está
// activada) sobre un canvas offscreen. MP4/H.264 primero: es lo que aceptan
// WhatsApp y demás mensajerías; WebM solo como respaldo.
let recBusy=false;
function exportVideo(scale, dur){
  if(recBusy) return;
  const mime=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"]
    .find(m=>window.MediaRecorder && MediaRecorder.isTypeSupported(m));
  if(!mime){ $("exStatus").textContent=t("videoUnsupported"); return; }
  const b=getBounds();
  // H.264 exige dimensiones pares
  const w=Math.max(320, Math.round(b.w*scale+80))&~1;
  const h=Math.max(180, Math.round(b.h*scale+80))&~1;
  const off=document.createElement("canvas"); off.width=w; off.height=h;
  const oc=off.getContext("2d");
  const T=THEMES[doc.theme];
  const rec=new MediaRecorder(off.captureStream(30), {mimeType:mime, videoBitsPerSecond:8_000_000});
  const chunks=[];
  recBusy=true; $("exGo").disabled=true; $("exCancel").disabled=true;
  rec.ondataavailable=e=>{ if(e.data.size) chunks.push(e.data); };
  rec.onstop=()=>{
    const ext=mime.startsWith("video/mp4")? "mp4":"webm";
    download(new Blob(chunks,{type:mime.split(";")[0]}), slug(P().name)+"."+ext);
    recBusy=false; $("exGo").disabled=false; $("exCancel").disabled=false;
    $("exStatus").textContent="";
    $("exModal").classList.remove("show");
  };
  const t0v=performance.now();
  function frame(){
    const el=(performance.now()-t0v)/1000;
    oc.setTransform(1,0,0,1,0,0);
    oc.fillStyle=T.bg; oc.fillRect(0,0,w,h);
    oc.translate(-b.x*scale+40, -b.y*scale+40); oc.scale(scale,scale);
    render(oc, el, {export:true, bg:T.bg, bounds:b});
    if(el<dur){
      $("exStatus").textContent=t("recording")+" "+el.toFixed(1)+" / "+dur+" s";
      requestAnimationFrame(frame);
    } else rec.stop();
  }
  rec.start(250);
  frame();
}
function exportRaster(fmt, scale, transparent){
  const b=getBounds();
  const w=Math.max(320, Math.round(b.w*scale+80));
  const h=Math.max(180, Math.round(b.h*scale+80));
  const off=document.createElement("canvas"); off.width=w; off.height=h;
  const oc=off.getContext("2d");
  oc.translate(-b.x*scale+40, -b.y*scale+40);
  oc.scale(scale,scale);
  render(oc, now(), {export:true, transparent:fmt==="png"&&transparent, bounds:{x:b.x,y:b.y,w:b.w,h:b.h}});
  off.toBlob(blob=>{ download(blob, slug(P().name)+"."+fmt, fmt==="jpg"?"image/jpeg":"image/png"); }, fmt==="jpg"?"image/jpeg":"image/png", 0.92);
}
function exportSVG(scale){
  const b=getBounds();
  const w=Math.max(320, b.w*scale+80), h=Math.max(180, b.h*scale+80);
  const T=THEMES[doc.theme];
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.x-40} ${b.y-40} ${w} ${h}" width="${w}" height="${h}">`;
  svg+=`<rect x="${b.x-40}" y="${b.y-40}" width="${w}" height="${h}" fill="${T.bg}"/>`;
  for(const e of P().edges) svg+=edgeToSVG(e);
  for(const n of P().nodes) svg+=nodeToSVG(n);
  svg+=`</svg>`;
  downloadText(svg, slug(P().name)+".svg", "image/svg+xml");
}
function nodeToSVG(n){
  let body="";
  const T=THEMES[doc.theme];
  const fill=hexA(n.color, doc.theme==="crema"?.16:.18);
  if(n.shape==="cylinder"){
    body=`<path d="M${n.x-n.w/2},${n.y-n.h/2+12} v${n.h-24} c0,4 6,7 14,7 s14,-3 14,-7 V${n.y-n.h/2+12}" fill="${fill}" stroke="${n.color}" stroke-width="2.5"/><ellipse cx="${n.x}" cy="${n.y-n.h/2+12}" rx="${n.w/2}" ry="12" fill="none" stroke="${n.color}" stroke-width="2.5"/>`;
  } else if(n.shape==="diamond"){
    body=`<polygon points="${n.x},${n.y-n.h/2} ${n.x+n.w/2},${n.y} ${n.x},${n.y+n.h/2} ${n.x-n.w/2},${n.y}" fill="${fill}" stroke="${n.color}" stroke-width="2.5"/>`;
  } else if(n.shape==="circle"){
    body=`<circle cx="${n.x}" cy="${n.y}" r="${n.w/2}" fill="${fill}" stroke="${n.color}" stroke-width="2.5"/>`;
  } else {
    body=`<rect x="${n.x-n.w/2}" y="${n.y-n.h/2}" width="${n.w}" height="${n.h}" rx="10" fill="${fill}" stroke="${n.color}" stroke-width="2.5"/>`;
  }
  const fs=n.fs||17;
  const lines=String(n.label||"").split("\n");
  const lh=fs*1.25, oy=n.y-(lines.length-1)*lh/2;
  const text=lines.map((l,i)=>`<text x="${n.x}" y="${oy+i*lh}" font-size="${fs}" font-family="Georgia,serif" fill="${T.text}" text-anchor="middle" dominant-baseline="middle">${escapeHtml(l)}</text>`).join("");
  return `<g>${body}${text}</g>`;
}
function edgeToSVG(e){
  const A=nodeById(e.from), B=nodeById(e.to); if(!A||!B) return "";
  const pts=edgePoints(e); if(pts.length<2) return "";
  const T=THEMES[doc.theme];
  const col=e.lineColor||T.edge;
  const d=pts.map((p,i)=>(i?"L":"M")+p.x+","+p.y).join(" ");
  let m=""; if(e.endArrow!==false){ const l=pts[pts.length-1], p=pts[pts.length-2], a=Math.atan2(l.y-p.y,l.x-p.x); m+=`<polygon points="${l.x},${l.y} ${l.x-11*Math.cos(a)+6*Math.sin(a)},${l.y-11*Math.sin(a)-6*Math.cos(a)} ${l.x-11*Math.cos(a)-6*Math.sin(a)},${l.y-11*Math.sin(a)+6*Math.cos(a)}" fill="${col}"/>`; }
  return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="${e.dashed?'8,7':''}" marker-end=""/>` + m;
}

function loadDemo(){
  pushUndo();
  P().nodes=[];
  P().edges=[];
  const A=nextNode(P(),"Cliente",200,200,"user");
  const B=nextNode(P(),"API",500,200,"rect");
  const C=nextNode(P(),"Base de datos",800,200,"db");
  P().edges.push({id:P().nextId++,from:A,to:B,fromSide:"e",toSide:"w",route:"straight",waypoints:[],label:"REST",animated:true,dashed:false,startArrow:false,endArrow:true,flowDir:"normal",speedFactor:1,dotCount:null});
  P().edges.push({id:P().nextId++,from:B,to:C,fromSide:"e",toSide:"w",route:"straight",waypoints:[],label:"SQL",animated:true,dashed:false,startArrow:false,endArrow:true,flowDir:"normal",speedFactor:1,dotCount:null});
  centerView(); scheduleAutosave();
}

let dropDragCount=0;
window.addEventListener("dragenter", ev=>{ if(!ev.dataTransfer) return; const hasFile=[...ev.dataTransfer.items].some(i=>i.kind==="file"); if(hasFile){ dropDragCount++; $("dropOverlay").style.display="flex"; } });
window.addEventListener("dragover", ev=>{ if(!ev.dataTransfer) return; if([...ev.dataTransfer.items].some(i=>i.kind==="file")) ev.preventDefault(); });
window.addEventListener("dragleave", ev=>{ dropDragCount=Math.max(0, dropDragCount-1); if(!dropDragCount) $("dropOverlay").style.display="none"; });
window.addEventListener("drop", ev=>{
  ev.preventDefault(); dropDragCount=0; $("dropOverlay").style.display="none";
  const f=ev.dataTransfer?.files?.[0]; if(!f) return;
  if(/\.(daigram|json)$/i.test(f.name)){
    const r=new FileReader();
    r.onload=()=>{ try{ const d=JSON.parse(r.result); if(d.app===APP) applyProjectData(d); else alert(t("notDaigram")); }catch(e){ alert(t("badJson")); } };
    r.readAsText(f);
  } else if(f.type.startsWith("image/")){
    const r=new FileReader();
    r.onload=()=>{ const img=new Image(); img.onload=()=>{ pushUndo(); newNode("image", 0, 0, {w:Math.min(320,img.naturalWidth), h:Math.min(320,img.naturalHeight)*img.naturalHeight/img.naturalWidth, img:r.result, label:f.name}); }; img.src=r.result; };
    r.readAsDataURL(f);
  }
});

$("autosaveRestore").onclick=()=>{
  const d=loadAutosaveData(); if(d) applyProjectData(d);
  closeRestorePrompt();
};
$("autosaveDiscard").onclick=()=>{ clearAutosave(); closeRestorePrompt(); };

window.addEventListener("beforeunload", ()=>saveAutosave());
window.addEventListener("resize", centerView);

const AI_KEY_STORE="daigram.minimax.key";
const AI_ENDPOINT="https://api.minimax.io/v1/text/chatcompletion_v2";
const AI_MODEL="MiniMax-M3";
const ENV_AI_KEY=import.meta.env.PUBLIC_MINIMAX_KEY||"";
function aiSystemPrompt(){
  const iconKeys=Object.keys(ICONS).join(", ");
  return `Eres un generador de diagramas de arquitectura de software. Respondes SOLO con un objeto JSON válido, sin markdown, sin explicaciones, con esta forma exacta:
{"name":"nombre corto","nodes":[{"id":"n1","label":"Cliente","shape":"user","x":80,"y":80}],"edges":[{"from":"n1","to":"n2","label":"HTTPS","dashed":false}]}
Reglas:
- shape puede ser una forma: rect, cylinder, diamond, circle, hex, text — o un icono: ${iconKeys}.
- Usa cylinder o db para bases de datos, diamond para decisiones, iconos cuando encajen con la tecnología.
- Posiciona en cuadrícula: columnas x = 80, 360, 640, 920, 1200, 1480; filas y = 80, 260, 440, 620. Flujo de izquierda a derecha, en orden de proceso (cada paso a la derecha o debajo del anterior), sin solapar nodos y dejando al menos 140 px entre centros.
- labels cortos (1-3 palabras), en el mismo idioma que el usuario.
- edges con dashed:true para flujos asíncronos, respuestas o replicación.
- Entre 4 y 15 nodos.`;
}
$("btnAI").onclick=()=>{
  $("aiKey").value=localStorage.getItem(AI_KEY_STORE)||ENV_AI_KEY;
  $("aiStatus").textContent="";
  $("aiModal").classList.add("show");
  setTimeout(()=>$("aiPrompt").focus(),50);
};
$("aiCancel").onclick=()=>$("aiModal").classList.remove("show");
function tryParseGraph(s){
  try{ const g=JSON.parse(s); return (g && Array.isArray(g.nodes) && g.nodes.length)? g : null; }catch(e){ return null; }
}
function parseAIGraph(raw){
  let s=String(raw).replace(/<think>[\s\S]*?<\/think>/g,"").trim();
  const fence=s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if(fence){ const g=tryParseGraph(fence[1].trim()); if(g) return g; }
  let g=tryParseGraph(s); if(g) return g;
  const a=s.indexOf("{"), b=s.lastIndexOf("}");
  if(a>=0 && b>a){ g=tryParseGraph(s.slice(a,b+1)); if(g) return g; }
  for(let i=s.indexOf("{"); i>=0; i=s.indexOf("{",i+1)){
    let depth=0;
    for(let j=i;j<s.length;j++){
      if(s[j]==="{") depth++;
      else if(s[j]==="}"){ depth--; if(depth===0){ g=tryParseGraph(s.slice(i,j+1)); if(g) return g; break; } }
    }
  }
  console.warn("daigram AI: respuesta no parseable:", raw);
  return null;
}
function aiGraphToPage(g, promptTxt){
  const p=blankPage(g.name || "IA: "+promptTxt.slice(0,24));
  const SHAPES=["rect","cylinder","diamond","circle","hex","text"];
  const idMap={};
  g.nodes.slice(0,30).forEach((nd,i)=>{
    let shape=String(nd.shape||"rect");
    if(shape==="db") shape="cylinder";
    if(!ICONS[shape] && !SHAPES.includes(shape)) shape="rect";
    const x=Number.isFinite(+nd.x)? +nd.x : 80+(i%4)*280;
    const y=Number.isFinite(+nd.y)? +nd.y : 80+Math.floor(i/4)*180;
    const ci=shape==="cylinder"?2:ICONS[shape]?0:i%PALETTE.length;
    idMap[nd.id ?? i]=tplNode(p, String(nd.label??""), x, y, shape, ci);
  });
  (g.edges||[]).forEach(ed=>{
    const from=idMap[ed.from], to=idMap[ed.to];
    if(from==null||to==null||from===to) return;
    p.edges.push({id:p.nextId++, from, to, fromSide:null, toSide:null, route:"straight", waypoints:[],
      label:String(ed.label||""), animated:true, dashed:!!ed.dashed, startArrow:false, endArrow:true,
      flowDir:"normal", speedFactor:1, dotCount:null});
  });
  spreadOverlaps(p);
  return p;
}
// Separa nodos solapados empujándolos por el eje de menor solape.
// Red de seguridad para diagramas generados (la IA a veces amontona posiciones).
function spreadOverlaps(page){
  const MARGIN=36;
  for(let it=0; it<40; it++){
    let moved=false;
    for(let i=0;i<page.nodes.length;i++) for(let j=i+1;j<page.nodes.length;j++){
      const a=page.nodes[i], b=page.nodes[j];
      const ox=(a.w+b.w)/2+MARGIN-Math.abs(a.x-b.x);
      const oy=(a.h+b.h)/2+MARGIN-Math.abs(a.y-b.y);
      if(ox>0 && oy>0){
        moved=true;
        if(ox<oy){ const s=(a.x<=b.x? -1:1)*ox/2; a.x+=s; b.x-=s; }
        else     { const s=(a.y<=b.y? -1:1)*oy/2; a.y+=s; b.y-=s; }
      }
    }
    if(!moved) break;
  }
  page.nodes.forEach(n=>{ n.x=snap(n.x); n.y=snap(n.y); });
}
async function generateAI(){
  const key=$("aiKey").value.trim()||ENV_AI_KEY;
  const promptTxt=$("aiPrompt").value.trim();
  if(!key){ $("aiStatus").textContent=t("aiKeyMissing"); return; }
  if(!promptTxt){ $("aiStatus").textContent=t("aiPromptMissing"); return; }
  if(key!==ENV_AI_KEY) localStorage.setItem(AI_KEY_STORE, key);
  $("aiStatus").innerHTML='<span class="spinner"></span>'+t("aiWorking"); $("aiGo").disabled=true;
  try{
    const res=await fetch(AI_ENDPOINT,{
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":"Bearer "+key },
      body:JSON.stringify({ model:AI_MODEL, max_tokens:8192, messages:[
        {role:"system", content:aiSystemPrompt()},
        {role:"user", content:promptTxt},
      ]})
    });
    if(!res.ok) throw new Error("HTTP "+res.status);
    const data=await res.json();
    if(data.base_resp && data.base_resp.status_code && data.base_resp.status_code!==0)
      throw new Error(data.base_resp.status_msg||("MiniMax "+data.base_resp.status_code));
    const raw=data?.choices?.[0]?.message?.content ?? data?.reply ?? "";
    const g=parseAIGraph(raw);
    if(!g) throw new Error(t("aiBadResp"));
    pushUndo();
    doc.pages.push(aiGraphToPage(g, promptTxt));
    doc.cur=doc.pages.length-1;
    renderTabs(); syncProjectControls(); clearSel(); centerView(); scheduleAutosave();
    $("aiModal").classList.remove("show");
  }catch(e){ $("aiStatus").textContent=t("errorPrefix")+e.message; }
  finally{ $("aiGo").disabled=false; }
}
$("aiGo").onclick=generateAI;

$("langSel").onchange=()=>{ lang=$("langSel").value; applyLang(); };

async function init(){
  buildIconDrawer();
  applyLang();
  applyAside();
  const fromLink=await loadFromHash();
  if(!fromLink && hasAutosave()) showAutosaveRestorePrompt();
  syncProjectControls();
  renderTabs();
  setTimeout(centerView, 50);
  if("serviceWorker" in navigator && import.meta.env.PROD){
    navigator.serviceWorker.register("/sw.js").catch(()=>{});
  }
}
init();
