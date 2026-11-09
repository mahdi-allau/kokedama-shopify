/**
 * Testi italiani e struttura di header e footer.
 *
 *   node testi-dawn.js
 *
 * Dawn arriva con le stringhe di esempio in inglese ("Welcome to our store",
 * "Subscribe to our emails"): qui vengono sostituite e il footer viene
 * organizzato in colonne come nel prototipo.
 *
 * I menu richiamati per nome ("main-menu", "footer") vanno creati in
 * Shopify sotto Negozio online > Navigazione, altrimenti le colonne
 * restano vuote.
 */
const fs = require("fs");
const path = require("path");

const TEMA = path.join(__dirname, "dawn-kokedama");
const leggi = (p) => JSON.parse(fs.readFileSync(path.join(TEMA, p), "utf8"));
const scrivi = (p, d) => fs.writeFileSync(path.join(TEMA, p), JSON.stringify(d, null, 2), "utf8");

/* ------------------------------------------------------------- HEADER */

const header = leggi("sections/header-group.json");

// Barra annunci: un messaggio utile, non un saluto generico.
header.sections["announcement-bar"].blocks["announcement-bar-0"].settings.text =
  "Workshop su prenotazione · Ferrara centro · massimo 6 persone";

// Secondo annuncio, a rotazione col primo: le due linee di vendita.
// Chi arriva capisce subito cosa si spedisce e cosa no, prima di innamorarsi
// di una pianta viva che a casa sua non puo arrivare.
header.sections["announcement-bar"].blocks["announcement-bar-1"] = {
  type: "announcement",
  settings: {
    text: "Kokedama vivi a Ferrara · Stabilizzati spediti in tutta Italia",
    link: "",
  },
};
header.sections["announcement-bar"].block_order = ["announcement-bar-0", "announcement-bar-1"];

// Ripuliamo eventuali chiavi finite per errore sul blocco in passato.
delete header.sections["announcement-bar"].blocks["announcement-bar-0"].settings.text_alignment;
delete header.sections["announcement-bar"].blocks["announcement-bar-0"].settings.color_scheme;

// Allineamento e colore stanno sulla SEZIONE, non sul blocco:
// il blocco announcement accetta solo text e link.
Object.assign(header.sections["announcement-bar"].settings, {
  color_scheme: "scheme-2",
  show_line_separator: false,
  show_social: false,
  enable_country_selector: false,
  enable_language_selector: false,
  // Due annunci: ruotano da soli, uno ogni 5 secondi
  auto_rotate: true,
  change_slides_speed: 5,
});

// Header: logo a sinistra, menu accanto, header che resta visibile.
Object.assign(header.sections.header.settings, {
  color_scheme: "scheme-1",
  logo_position: "top-left",
  menu: "main-menu",
  menu_type_desktop: "dropdown",
  sticky_header_type: "on-scroll-up",
  show_line_separator: false,
  enable_country_selector: false,
  enable_language_selector: false,
});

scrivi("sections/header-group.json", header);
console.log("header-group.json   barra annunci e header sistemati");

/* ------------------------------------------------------------- FOOTER */

const footer = leggi("sections/footer-group.json");
const f = footer.sections.footer;

Object.assign(f.settings, {
  color_scheme: "scheme-3",              // verde scuro, come nel prototipo
  newsletter_enable: true,
  newsletter_heading: "Resta aggiornata",
  enable_follow_on_shop: false,
  show_social: false,              // nessun profilo collegato: la riga icone resterebbe vuota
  // Il selettore di paese resta spento: un solo mercato configurato,
  // si vende solo in Italia, quindi non serve scegliere il paese.
  enable_country_selector: false,
  enable_language_selector: false,
  payment_enable: true,
  show_policy: true,
  padding_top: 48,
  padding_bottom: 32,
});

f.blocks = {
  presentazione: {
    type: "text",
    settings: {
      heading: "Kokedama &amp; Sculture Naturali",
      subtext:
        // La tagline del brand apre la colonna: e la frase che deve restare in testa.
        "<p><em>Un bosco tra le mani.</em></p>" +
        "<p>Dal 2022, kokedama fatti a mano in un terrazzo del centro storico di Ferrara. " +
        "Laboratorio su prenotazione, collezione stabilizzata spedita in tutta Italia.</p>",
    },
  },
  negozio: {
    type: "link_list",
    settings: { heading: "Negozio", menu: "footer" },
  },
  // I contatti in chiaro nel footer: si trovano da ogni pagina, senza cercarli.
  contatti: {
    type: "text",
    settings: {
      heading: "Scrivici",
      subtext:
        // WhatsApp per primo: e il canale con cui si prenota davvero.
        "<p><a href=\"https://wa.me/393478202607\">Prenota su WhatsApp</a><br>" +
        "<a href=\"mailto:panico.simona.sp@gmail.com\">panico.simona.sp@gmail.com</a><br>" +
        "<a href=\"tel:+393478202607\">+39 347 820 2607</a><br>" +
        "Ferrara, centro storico &middot; su prenotazione</p>",
    },
  },
};
/* Tre colonne, non quattro. C'era un quarto blocco "brand_information" con i
   social: senza un account collegato nelle impostazioni del tema Dawn lo
   stampa comunque, e restava una colonna alta 250px completamente vuota che
   sbilanciava tutta la riga. Quando Simona dara l'Instagram, si rimette:
   blocco brand_information + account in Impostazioni > Social media. */
f.block_order = ["presentazione", "negozio", "contatti"];

scrivi("sections/footer-group.json", footer);
console.log("footer-group.json   colonne, colori e testi italiani");

/* --------------------------------------------------- ALTRI TESTI TEMA */

// Le stringhe restanti (bottoni, carrello, moduli) arrivano dal file di lingua.
// Shopify sceglie it.json quando la lingua del negozio e l'italiano:
// va verificato in Impostazioni > Lingue del negozio.
const lingue = fs.readdirSync(path.join(TEMA, "locales")).filter((n) => n.startsWith("it"));
console.log("lingue disponibili nel tema:", lingue.join(", ") || "nessuna");
