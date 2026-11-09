/*
 * prodotti-taglie.js
 *
 * Trasforma i 15 kokedama vivi da "un prezzo fisso" a "il cliente scegli la
 * taglia e paga di conseguenza": tre varianti per prodotto, Piccolo / Medio /
 * Grande, ai prezzi del listino gia pubblicato (25 / 38 / 55 euro).
 *
 * Legge i CSV con cui i prodotti sono stati caricati (prodotti.csv,
 * prodotti-nuovi.csv, prodotti-nuovi-2.csv), tiene solo i vivi (Type
 * "Kokedama": le due composizioni secche restano a prezzo unico) e scrive
 * prodotti-taglie.csv, da importare in Shopify con
 * "Sovrascrivi i prodotti con lo stesso handle".
 *
 * Due cose importanti:
 *
 * 1. La colonna Image Src NON c'e. Le foto sono gia caricate su Shopify: se si
 *    reimportano gli URL, Shopify le riscarica e si creano doppioni.
 *
 * 2. Variant Inventory Tracker resta vuoto, cioe scorte non monitorate. Con
 *    tre taglie a magazzino 1 il sito scriverebbe "ne restano 1" su 45
 *    varianti che Simona non ha in laboratorio: la taglia si fa su richiesta.
 */

const fs = require("fs");

/* ------------------------------------------------------------ IL LISTINO */

const TAGLIE = [
  { etichetta: "Piccolo", prezzo: "25.00", grammi: "700", sfera: "8-10 cm" },
  { etichetta: "Medio", prezzo: "38.00", grammi: "1200", sfera: "12-15 cm" },
  { etichetta: "Grande", prezzo: "55.00", grammi: "1800", sfera: "15-20 cm" },
];

/* ------------------------------------------------- LETTURA DEI CSV ESISTENTI */

function leggiCsv(percorso) {
  const testo = fs.readFileSync(percorso, "utf8").replace(/^﻿/, "");
  const righe = [];
  let riga = [];
  let campo = "";
  let dentroVirgolette = false;

  for (let i = 0; i < testo.length; i++) {
    const c = testo[i];
    if (dentroVirgolette) {
      if (c === '"') {
        if (testo[i + 1] === '"') { campo += '"'; i++; } else dentroVirgolette = false;
      } else campo += c;
    } else if (c === '"') dentroVirgolette = true;
    else if (c === ",") { riga.push(campo); campo = ""; }
    else if (c === "\n") {
      riga.push(campo); campo = "";
      if (riga.some((x) => x !== "")) righe.push(riga);
      riga = [];
    } else if (c !== "\r") campo += c;
  }
  riga.push(campo);
  if (riga.some((x) => x !== "")) righe.push(riga);

  const intestazione = righe.shift();
  return righe.map((r) => Object.fromEntries(intestazione.map((k, i) => [k, r[i]])));
}

const prodotti = ["prodotti.csv", "prodotti-nuovi.csv", "prodotti-nuovi-2.csv"]
  .flatMap(leggiCsv)
  .filter((p) => p.Type === "Kokedama");

if (prodotti.length !== 15) throw new Error("attesi 15 kokedama vivi, trovati " + prodotti.length);

/* --------------------------------------------- PULIZIA DELLE DESCRIZIONI */

/* Le descrizioni dei primi sette dichiarano una misura fissa ("Sfera di circa
   15 cm"): se la taglia la scegli tu, quella frase diventa una bugia. */
const CORREZIONI = [
  ["Sfera di circa 14 cm, appoggiata su piattino incluso. Altezza totale intorno ai 45 cm.", "Piattino incluso."],
  ["Sfera di circa 15 cm con piattino incluso.", "Piattino incluso."],
  ["Sfera di circa 14 cm, piattino incluso.", "Piattino incluso."],
  ["Sfera di circa 14 cm con piattino incluso. Altezza totale intorno ai 50 cm.", "Piattino incluso."],
  ["Sfera di circa 13 cm, corda inclusa.", "Corda inclusa."],
  ["Sfera di circa 13 cm con piattino incluso.", "Piattino incluso."],
  ["Sfera di circa 12 cm con piattino incluso. Altezza totale intorno ai 30 cm.", "Piattino incluso."],
  ["Un kokedama piccolo, adatto a una scrivania o a un davanzale stretto.", "Nella taglia piccola sta su una scrivania o su un davanzale stretto."],
  ["La sfera pi&ugrave; grande della collezione, legata con spago naturale per stare appesa:", "Legato con spago naturale per stare appeso:"],
];

/* Il paragrafo che spiega le tre taglie, uguale su tutti. */
const PARAGRAFO_TAGLIE =
  "<p><strong>Le taglie:</strong> " +
  TAGLIE.map((t) => t.etichetta.toLowerCase() + " " + t.sfera).join(", ") +
  " di diametro della sfera di muschio. Scegli la taglia qui sopra: se non &egrave; pronta la preparo io e ti scrivo appena &egrave; disponibile.</p>";

const usate = new Set();

function descrizione(prodotto) {
  let testo = prodotto["Body (HTML)"];
  for (const [prima, dopo] of CORREZIONI) {
    if (testo.includes(prima)) { testo = testo.replace(prima, dopo); usate.add(prima); }
  }
  /* Doppio spazio lasciato dalle frasi togliate a meta paragrafo */
  testo = testo.replace(/ {2,}/g, " ").replace(/<p> /g, "<p>").replace(/ <\/p>/g, "</p>");
  if (/\d+ cm/.test(testo.replace(/8-10 cm|12-15 cm|15-20 cm/g, "")))
    throw new Error("restano misure fisse in " + prodotto.Handle);
  return testo + PARAGRAFO_TAGLIE;
}

/* ------------------------------------------------------ SCRITTURA DEL CSV */

const COLONNE = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Variant SKU", "Variant Grams",
  "Variant Inventory Tracker", "Variant Inventory Policy",
  "Variant Fulfillment Service", "Variant Price", "Variant Requires Shipping",
  "Variant Taxable", "Status",
];

const virgolette = (v) => '"' + String(v).replace(/"/g, '""') + '"';
const righe = [COLONNE.map(virgolette).join(",")];

for (const p of prodotti) {
  const testo = descrizione(p);
  TAGLIE.forEach((t, indice) => {
    /* Solo la prima riga di ogni prodotto porta i dati del prodotto: le altre
       due aggiungono soltanto la variante. Cosi vuole l'importatore Shopify. */
    const primaRiga = indice === 0;
    righe.push(COLONNE.map((colonna) => {
      switch (colonna) {
        case "Handle": return virgolette(p.Handle);
        case "Title": return primaRiga ? virgolette(p.Title) : '""';
        case "Body (HTML)": return primaRiga ? virgolette(testo) : '""';
        case "Vendor": return primaRiga ? virgolette(p.Vendor) : '""';
        case "Type": return primaRiga ? virgolette(p.Type) : '""';
        case "Tags": return primaRiga ? virgolette(p.Tags) : '""';
        case "Published": return primaRiga ? '"TRUE"' : '""';
        case "Status": return primaRiga ? '"active"' : '""';
        case "Option1 Name": return '"Taglia"';
        case "Option1 Value": return virgolette(t.etichetta);
        case "Variant SKU": return '""';
        case "Variant Grams": return virgolette(t.grammi);
        case "Variant Inventory Tracker": return '""';
        case "Variant Inventory Policy": return '"deny"';
        case "Variant Fulfillment Service": return '"manual"';
        case "Variant Price": return virgolette(t.prezzo);
        case "Variant Requires Shipping": return '"TRUE"';
        case "Variant Taxable": return '"TRUE"';
        default: throw new Error("colonna non gestita: " + colonna);
      }
    }).join(","));
  });
}

const mancanti = CORREZIONI.filter(([prima]) => !usate.has(prima)).map(([prima]) => prima);
if (mancanti.length) throw new Error("correzioni mai applicate:\n  " + mancanti.join("\n  "));

fs.writeFileSync("prodotti-taglie.csv", righe.join("\n") + "\n", "utf8");

console.log("prodotti-taglie.csv: " + prodotti.length + " prodotti x " + TAGLIE.length + " taglie = " + (righe.length - 1) + " righe");
TAGLIE.forEach((t) => console.log("  " + t.etichetta + " (" + t.sfera + "): " + t.prezzo + " euro"));
