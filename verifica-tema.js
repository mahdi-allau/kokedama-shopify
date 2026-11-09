/**
 * Verifica i file JSON del tema contro gli schemi reali delle sezioni Dawn.
 *
 *   node verifica-tema.js
 *
 * Da lanciare SEMPRE prima di un push: intercetta in locale gli errori che
 * altrimenti Shopify segnala solo a caricamento avvenuto, uno alla volta.
 *
 * Controlla:
 *   - sezioni e blocchi che non esistono nel tema
 *   - impostazioni inventate
 *   - valori fuori dall'elenco ammesso (select, radio)
 *   - numeri fuori dai limiti min/max
 *   - numeri che non rispettano lo step (es. opacita a passi di 10)
 */
const fs = require("fs");
const path = require("path");

const TEMA = path.join(__dirname, "dawn-kokedama");
const problemi = [];

const leggiJson = (p) =>
  JSON.parse(fs.readFileSync(p, "utf8").replace(/^﻿/, "").replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ""));

const schemaCache = {};
function schema(tipo) {
  if (schemaCache[tipo] !== undefined) return schemaCache[tipo];
  try {
    const testo = fs.readFileSync(path.join(TEMA, "sections", tipo + ".liquid"), "utf8");
    const m = testo.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
    schemaCache[tipo] = m ? JSON.parse(m[1]) : null;
  } catch (e) {
    schemaCache[tipo] = null;
  }
  return schemaCache[tipo];
}

function controlla(setts, defs, dove) {
  const per = {};
  (defs || []).forEach((d) => { if (d.id) per[d.id] = d; });
  Object.entries(setts || {}).forEach(([k, v]) => {
    const d = per[k];
    if (!d) return problemi.push(`impostazione inesistente   ${dove}.${k}`);
    if (d.options && !d.options.some((o) => o.value === v)) {
      return problemi.push(`valore non ammesso         ${dove}.${k} = ${JSON.stringify(v)}  (ammessi: ${d.options.map((o) => o.value).join(", ")})`);
    }
    if (d.type === "range" && typeof v === "number") {
      if (v < d.min || v > d.max) {
        return problemi.push(`numero fuori dai limiti    ${dove}.${k} = ${v}  (da ${d.min} a ${d.max})`);
      }
      if (d.step && (v - d.min) % d.step !== 0) {
        return problemi.push(`numero non a passo         ${dove}.${k} = ${v}  (passo ${d.step}, quindi ${d.min}, ${d.min + d.step}, ${d.min + 2 * d.step}, ...)`);
      }
    }
  });
}

const file = fs
  .readdirSync(path.join(TEMA, "templates"))
  .filter((f) => f.endsWith(".json"))
  .map((f) => "templates/" + f)
  .concat(["sections/header-group.json", "sections/footer-group.json"]);

file.forEach((f) => {
  let t;
  try { t = leggiJson(path.join(TEMA, f)); } catch (e) { return problemi.push(`file illeggibile           ${f}: ${e.message}`); }
  Object.entries(t.sections || {}).forEach(([id, sec]) => {
    const j = schema(sec.type);
    if (!j) return; // sezione senza schema: e codice di Dawn, non ci riguarda
    controlla(sec.settings, j.settings, `${f} > ${id}`);
    Object.entries(sec.blocks || {}).forEach(([bid, b]) => {
      const bd = (j.blocks || []).find((x) => x.type === b.type);
      if (!bd) return problemi.push(`blocco inesistente         ${f} > ${id} > ${bid}  (tipo "${b.type}")`);
      controlla(b.settings, bd.settings, `${f} > ${id} > ${bid}`);
    });
  });
});

if (problemi.length) {
  console.log(problemi.join("\n"));
  console.log(`\n${problemi.length} problemi. Correggili prima del push.`);
  process.exit(1);
}
console.log(`${file.length} file controllati: nessun problema.`);
