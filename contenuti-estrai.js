/*
 * contenuti-estrai.js
 *
 *   node contenuti-estrai.js
 *
 * Tira fuori da Shopify il catalogo e lo mette in casa nostra:
 * `contenuti/prodotti.json` piu le foto in `contenuti/foto/`.
 *
 * Perche adesso: la vetrina oggi e una copia del negozio, quindi il contenuto
 * vive ancora su Shopify. Appena quel negozio si spegne, la sorgente sparisce
 * e non si ricostruisce piu niente. Questo script taglia il cordone: da qui in
 * avanti i prodotti sono un file nostro, che il pannello di Simona potra
 * modificare senza che Shopify c'entri piu.
 *
 * Si lancia una volta sola. Dopo, la verita sta in contenuti/prodotti.json
 * (e, quando il pannello sara in piedi, su Supabase).
 */

const fs = require("fs");
const path = require("path");

const ORIGINE = "https://kokedamasculture.myshopify.com";
const CARTELLA = path.join(__dirname, "contenuti");
const FOTO = path.join(CARTELLA, "foto");

/* Le taglie del listino. Shopify le tiene come varianti; qui diventano un
   campo del prodotto, perche e cosi che le pensa chi le vende. */
const MISURE = { Piccolo: "8-10 cm", Medio: "12-15 cm", Grande: "15-20 cm" };

/* I tre prodotti messi in bozza perche senza foto: Shopify non li espone piu,
   ma il testo lo abbiamo ancora nei CSV di caricamento. Vanno ripresi da li,
   altrimenti il lavoro fatto sulle descrizioni si perde. */
const DA_CSV = ["kokedama-asparagina", "kokedama-pilea", "kokedama-sospeso"];

function leggiCsv(percorso) {
  const testo = fs.readFileSync(percorso, "utf8").replace(/^﻿/, "");
  const righe = [];
  let riga = [], campo = "", dentro = false;

  for (let i = 0; i < testo.length; i++) {
    const c = testo[i];
    if (dentro) {
      if (c === '"') {
        if (testo[i + 1] === '"') { campo += '"'; i++; } else dentro = false;
      } else campo += c;
    } else if (c === '"') dentro = true;
    else if (c === ",") { riga.push(campo); campo = ""; }
    else if (c === "\n") {
      riga.push(campo); campo = "";
      if (riga.some((x) => x !== "")) righe.push(riga);
      riga = [];
    } else if (c !== "\r") campo += c;
  }
  riga.push(campo);
  if (riga.some((x) => x !== "")) righe.push(riga);

  const testa = righe.shift();
  return righe.map((r) => Object.fromEntries(testa.map((k, i) => [k, r[i]])));
}

async function main() {
  fs.mkdirSync(FOTO, { recursive: true });

  const risposta = await fetch(ORIGINE + "/products.json?limit=250");
  if (!risposta.ok) throw new Error("il negozio non risponde: HTTP " + risposta.status);
  const { products } = await risposta.json();

  const prodotti = [];

  for (const p of products) {
    /* Una foto per prodotto: e cosi che e fatto il catalogo oggi, e il
       pannello ne chiedera una sola. Il nome del file viene dall'handle,
       cosi si capisce a colpo d'occhio a chi appartiene. */
    let foto = null;
    if (p.images.length) {
      const url = p.images[0].src.split("?")[0];
      foto = p.handle + path.extname(url);
      const dati = Buffer.from(await (await fetch(url + "?width=1600")).arrayBuffer());
      fs.writeFileSync(path.join(FOTO, foto), dati);
    }

    const vivo = p.product_type === "Kokedama";

    prodotti.push({
      handle: p.handle,
      titolo: p.title,
      tipo: p.product_type,
      /* I vivi hanno tre taglie, le composizioni secche un prezzo solo. */
      taglie: vivo
        ? p.variants.map((v) => ({
            nome: v.title,
            prezzo: Number(v.price),
            misura: MISURE[v.title] || "",
          }))
        : [{ nome: "unica", prezzo: Number(p.variants[0].price), misura: "" }],
      descrizione: p.body_html,
      tag: (p.tags || []).join(", "),
      foto,
      occhiello: vivo ? "Pezzo unico" : "Non chiede acqua",
      collezione: vivo ? "laboratorio-ferrara" : "collezione-stabilizzata",
      online: true,
      ordine: prodotti.length,
    });
    console.log("  " + p.handle + (foto ? "  (foto scaricata)" : "  (senza foto)"));
  }

  /* I tre in bozza: niente foto, quindi restano spenti. Il testo pero si
     salva, cosi Simona deve solo caricare la foto e accenderli. */
  const csv = ["prodotti-nuovi.csv", "prodotti-nuovi-2.csv"]
    .filter((f) => fs.existsSync(path.join(__dirname, f)))
    .flatMap((f) => leggiCsv(path.join(__dirname, f)));

  for (const handle of DA_CSV) {
    const r = csv.find((x) => x.Handle === handle);
    if (!r) { console.warn("  ! " + handle + " non trovato nei CSV"); continue; }
    prodotti.push({
      handle,
      titolo: r.Title,
      tipo: "Kokedama",
      taglie: Object.entries(MISURE).map(([nome, misura], i) => ({
        nome,
        prezzo: [25, 38, 55][i],
        misura,
      })),
      descrizione: r["Body (HTML)"],
      tag: r.Tags,
      foto: null,
      occhiello: "Pezzo unico",
      collezione: "laboratorio-ferrara",
      online: false, // manca la foto: si accende dal pannello quando arriva
      ordine: prodotti.length,
    });
    console.log("  " + handle + "  (da CSV, spento: manca la foto)");
  }

  fs.writeFileSync(
    path.join(CARTELLA, "prodotti.json"),
    JSON.stringify(prodotti, null, 2) + "\n",
    "utf8"
  );

  const vivi = prodotti.filter((p) => p.tipo === "Kokedama").length;
  const online = prodotti.filter((p) => p.online).length;
  console.log(
    "\ncontenuti/prodotti.json: " + prodotti.length + " prodotti (" + vivi + " vivi), " +
    online + " online, " + fs.readdirSync(FOTO).length + " foto in contenuti/foto/"
  );
}

main().catch((e) => {
  console.error("\nfermato: " + e.message);
  process.exit(1);
});
