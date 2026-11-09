/**
 * Genera prodotti.csv per l'importazione in Shopify.
 *
 *   node prodotti-csv.js
 *
 * Perche il CSV e non il pannello: nove prodotti a mano sono nove moduli
 * da riempire, con il rischio di sbagliare un prezzo. Con l'importazione
 * si controlla tutto in un file solo e si rifa in un minuto.
 *
 * Le foto devono essere gia caricate in Contenuto > File: il CSV le richiama
 * per URL pubblico, non le carica.
 *
 * Prezzi: listino unico per taglia (25 / 38 / 55 euro), spedizione esclusa.
 */
const fs = require("fs");
const path = require("path");

const NEGOZIO = "https://kokedamasculture.myshopify.com/cdn/shop/files/";
const MARCHIO = "Kokedama & Sculture Naturali";


/* Listino unico per taglia. Il prezzo non dipende piu dalla singola pianta:
   dipende dalla misura della sfera, esattamente come sulla pagina Prezzi.
   Cosi il cliente trova lo stesso numero ovunque e Simona ha tre prezzi da
   ricordare invece di nove.
   La spedizione NON e inclusa: 9,90 euro in Italia, gratis a mano a Ferrara. */
const TAGLIE = {
  piccolo: { prezzo: "25.00", etichetta: "Piccolo", sfera: "8-10 cm" },
  medio: { prezzo: "38.00", etichetta: "Medio", sfera: "12-15 cm" },
  grande: { prezzo: "55.00", etichetta: "Grande", sfera: "15-20 cm" },
};
const prodotti = [
  {
    handle: "kokedama-sansevieria-cilindrica",
    titolo: "Sansevieria cilindrica",
    taglia: "grande",
    grammi: 1300,
    tipo: "Kokedama",
    tag: "kokedama, pianta viva, poca acqua, luce indiretta",
    testo:
      "<p>Foglie cilindriche che si aprono a ventaglio, rigide e disegnate da striature scure. &Egrave; la pianta pi&ugrave; indulgente che conosciamo: sopporta la penombra, le dimenticanze e l&rsquo;aria secca dei termosifoni.</p>" +
      "<p>Va immersa raramente, ogni dieci o quindici giorni: se hai paura di annaffiare troppo, questa &egrave; la tua.</p>" +
      "<p>Sfera di circa 14 cm, appoggiata su piattino incluso. Altezza totale intorno ai 45 cm.</p>",
  },
  {
    handle: "kokedama-aglaonema",
    titolo: "Aglaonema screziata",
    taglia: "grande",
    grammi: 1400,
    tipo: "Kokedama",
    tag: "kokedama, pianta viva, luce indiretta, poca luce",
    testo:
      "<p>Foglie larghe e lucide, verde scuro percorso da venature argentate che catturano la luce anche negli angoli meno illuminati.</p>" +
      "<p>Sta bene dove le altre piante soffrono: corridoi, stanze con una sola finestra, uffici. Immersione ogni sette giorni circa, nebulizzazione sulle foglie quando l&rsquo;aria &egrave; secca.</p>" +
      "<p>Sfera di circa 15 cm con piattino incluso. Attenzione: tossica se ingerita, meglio tenerla lontana da gatti e bambini piccoli.</p>",
  },
  {
    handle: "kokedama-pothos-e-felce",
    titolo: "Pothos e felce",
    taglia: "medio",
    grammi: 1200,
    tipo: "Kokedama",
    tag: "kokedama, pianta viva, ricadente, due piante",
    testo:
      "<p>Due piante nella stessa sfera: il pothos variegato che ricade in tralci lunghi e una piccola felce che riempie il centro. Crescono insieme e si bilanciano, una in orizzontale e una in verticale.</p>" +
      "<p>&Egrave; il kokedama che consigliamo a chi comincia: perdona gli errori e cresce in fretta, cos&igrave; si vede subito il risultato delle proprie cure.</p>" +
      "<p>Bello appoggiato su una mensola alta, dove i tralci possono scendere liberi. Sfera di circa 14 cm, piattino incluso.</p>",
  },
  {
    handle: "kokedama-palmetta",
    titolo: "Palmetta da interno",
    taglia: "grande",
    grammi: 1200,
    tipo: "Kokedama",
    tag: "kokedama, pianta viva, luce indiretta, elegante",
    testo:
      "<p>Fronde sottili che si aprono verso l&rsquo;alto e ricadono appena in punta: da lontano sembra un piccolo albero. Cresce lentamente e mantiene la forma per anni.</p>" +
      "<p>Vuole luce indiretta e un po&rsquo; di umidit&agrave;: nebulizza le fronde due volte a settimana in estate. Immersione ogni sei o sette giorni.</p>" +
      "<p>Sfera di circa 14 cm con piattino incluso. Altezza totale intorno ai 50 cm.</p>",
  },
  {
    handle: "kokedama-clorofito-sospeso",
    titolo: "Clorofito sospeso",
    taglia: "medio",
    grammi: 1100,
    tipo: "Kokedama",
    tag: "kokedama, pianta viva, sospeso, sicuro per animali",
    testo:
      "<p>Foglie a nastro bordate di bianco che ricadono in tutte le direzioni. Montato su corda di canapa annodata a mano, pensato per stare appeso: &egrave; l&rsquo;unico modo per vedere davvero come si apre.</p>" +
      "<p>Cresce in fretta e con il tempo produce piccole piantine pendenti, che si possono staccare e far radicare. Non &egrave; tossico per cani e gatti.</p>" +
      "<p>Sfera di circa 13 cm, corda inclusa. Per l&rsquo;annaffiatura si sgancia, si immerge e si riappende dopo che ha scolato.</p>",
  },
  {
    handle: "kokedama-tradescantia",
    titolo: "Tradescantia e filodendro",
    taglia: "medio",
    grammi: 1100,
    tipo: "Kokedama",
    tag: "kokedama, pianta viva, colore, ricadente",
    testo:
      "<p>La tradescantia porta il viola sul rovescio delle foglie, il filodendro il verde brillante: insieme fanno un contrasto che cambia con la luce del giorno.</p>" +
      "<p>Entrambe crescono veloci. Ogni tanto vanno accorciate le punte: la pianta si infoltisce invece di allungarsi, e i rametti tagliati radicano in un bicchiere d&rsquo;acqua.</p>" +
      "<p>Sfera di circa 13 cm con piattino incluso. Immersione ogni cinque o sei giorni.</p>",
  },
  {
    handle: "kokedama-foglie-tonde",
    titolo: "Peperomia dalle foglie tonde",
    taglia: "piccolo",
    grammi: 1000,
    tipo: "Kokedama",
    tag: "kokedama, pianta viva, piccolo, scrivania",
    testo:
      "<p>Foglie tonde e carnose su piccioli sottili, che si muovono al minimo spostamento d&rsquo;aria. Un kokedama piccolo, adatto a una scrivania o a un davanzale stretto.</p>" +
      "<p>Le foglie immagazzinano acqua, quindi tollera bene qualche giorno di ritardo. Meglio poca acqua che troppa: se le foglie diventano molli, stai esagerando.</p>" +
      "<p>Sfera di circa 12 cm con piattino incluso. Altezza totale intorno ai 30 cm.</p>",
  },
  {
    handle: "kokedama-composizione-autunno",
    titolo: "Composizione d'autunno",
    taglia: "medio",
    grammi: 900,
    tipo: "Composizione secca",
    tag: "kokedama, fiori secchi, non richiede acqua, regalo",
    testo:
      "<p>Ortensie essiccate nei toni dell&rsquo;ottone e del blu profondo, una foglia di magnolia, bacche e graminacee. Sopra una sfera di muschio compatto che fa da base scura a tutto il resto.</p>" +
      "<p>Non &egrave; una pianta viva: <strong>non va annaffiata</strong>. Basta tenerla lontana dal sole diretto perch&eacute; i colori non sbiadiscano, e spolverarla ogni tanto con un pennello morbido.</p>" +
      "<p>Dura anni senza cambiare. La scelgono spesso come regalo per chi non ha il pollice verde. Sfera di circa 14 cm, piattino incluso.</p>",
  },
  {
    handle: "kokedama-bouquet-secco",
    titolo: "Bouquet secco",
    taglia: "medio",
    grammi: 900,
    tipo: "Composizione secca",
    tag: "kokedama, fiori secchi, non richiede acqua, regalo",
    testo:
      "<p>Capsule di papavero, spighe, eucalipto e una protea aperta come un ventaglio arancione. Un mazzo che sembra appena raccolto in un campo di fine estate, fermato sul muschio.</p>" +
      "<p>Nessuna acqua, nessuna cura: solo luce non diretta e una spolverata ogni tanto.</p>" +
      "<p>Sfera di circa 13 cm con piattino incluso. Altezza totale intorno ai 45 cm. Ogni composizione &egrave; diversa: i fiori secchi non si ripetono mai uguali.</p>",
  },
];

// Il CSV di Shopify vuole le virgolette raddoppiate dentro i campi
const campo = (v) => '"' + String(v).replace(/"/g, '""') + '"';

const intestazione = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Variant SKU", "Variant Grams",
  "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy",
  "Variant Fulfillment Service", "Variant Price", "Variant Requires Shipping",
  "Variant Taxable", "Image Src", "Image Position", "Image Alt Text", "Status",
];

const righe = prodotti.map((p) =>
  [
    p.handle,
    p.titolo,
    p.testo,
    MARCHIO,
    p.tipo,
    p.tag,
    "TRUE",
    "Title",
    "Default Title",
    "",                    // SKU: lo assegna Simona se le serve
    p.grammi,
    "shopify",
    1,                     // pezzo unico: uno solo disponibile
    "deny",                // finito il pezzo, il prodotto risulta esaurito
    "manual",
    TAGLIE[p.taglia].prezzo,
    "TRUE",
    "TRUE",
    NEGOZIO + p.handle + ".jpg",
    1,
    p.titolo + " &mdash; kokedama fatto a mano",
    "active",
  ].map(campo).join(",")
);

const csv = [intestazione.map(campo).join(","), ...righe].join("\r\n") + "\r\n";
const dest = path.join(__dirname, "prodotti.csv");
fs.writeFileSync(dest, "﻿" + csv, "utf8"); // BOM: senza, Shopify sbaglia gli accenti

console.log(prodotti.length + " prodotti scritti in prodotti.csv");
const prezzi = prodotti.map((p) => parseFloat(TAGLIE[p.taglia].prezzo));
console.log("prezzi da " + Math.min(...prezzi) + " a " + Math.max(...prezzi) + " euro, spedizione esclusa (9,90 in Italia)");
Object.entries(TAGLIE).forEach(([k, v]) =>
  console.log("  " + v.etichetta + " (" + v.sfera + "): " + v.prezzo + " euro -> " + prodotti.filter((x) => x.taglia === k).length + " prodotti")
);
