/**
 * Applica lo stile "Kokedama" al tema Dawn scaricato in ./dawn-kokedama
 *
 *   node personalizza-dawn.js
 *
 * Lo script e ripetibile: se un giorno si riscarica Dawn aggiornato,
 * basta rilanciarlo per riapplicare tutte le personalizzazioni.
 *
 * Cosa tocca:
 *  1. config/settings_data.json  -> colori, font, spaziature, bordi
 *  2. assets/kokedama.css        -> ritocchi tipografici non esposti nell'editor
 *  3. layout/theme.liquid        -> include del CSS sopra
 *  4. templates/index.json       -> home composta come nel prototipo
 */
const fs = require("fs");
const path = require("path");

const TEMA = path.join(__dirname, "dawn-kokedama");
if (!fs.existsSync(TEMA)) {
  console.error("Cartella dawn-kokedama non trovata. Scarica prima Dawn:");
  console.error("  git clone --depth 1 https://github.com/Shopify/dawn.git dawn-kokedama");
  process.exit(1);
}

const leggi = (p) => fs.readFileSync(path.join(TEMA, p), "utf8");
const scrivi = (p, c) => fs.writeFileSync(path.join(TEMA, p), c, "utf8");

/* ---------------------------------------------------------------- 1. Settings */

// Palette del prototipo
const CREMA = "#FBFAF7";
const SABBIA = "#F4F1EA";
const VERDE = "#5A6B53";
const VERDE_SCURO = "#3D4A38";
const TESTO = "#2E2E2A";

const schemi = {
  // scheme-1: sfondo principale del sito
  "scheme-1": { background: CREMA, text: TESTO, button: VERDE, button_label: "#FFFFFF", secondary_button_label: VERDE_SCURO, shadow: TESTO },
  // scheme-2: sezioni alternate color sabbia
  "scheme-2": { background: SABBIA, text: TESTO, button: VERDE, button_label: "#FFFFFF", secondary_button_label: VERDE_SCURO, shadow: TESTO },
  // scheme-3: blocchi scuri (footer, banner con testo sopra foto)
  "scheme-3": { background: VERDE_SCURO, text: "#E9E7DF", button: "#E9E7DF", button_label: VERDE_SCURO, secondary_button_label: "#E9E7DF", shadow: "#000000" },
  // scheme-4: verde pieno, per accenti
  "scheme-4": { background: VERDE, text: "#FFFFFF", button: "#FFFFFF", button_label: VERDE, secondary_button_label: "#FFFFFF", shadow: "#000000" },
  // scheme-5: bianco puro, per le schede prodotto
  "scheme-5": { background: "#FFFFFF", text: TESTO, button: VERDE, button_label: "#FFFFFF", secondary_button_label: VERDE_SCURO, shadow: TESTO },
};

const impostazioni = {
  // Logo e favicon: caricati nei File del negozio, non negli asset del tema.
  // Il formato shopify://shop_images/<nome> e quello che usa image_picker.
  logo: "shopify://shop_images/logo-kokedama.png",
  logo_width: 220,          // il logo e largo il doppio dell altezza: 220px sta bene nell header
  favicon: "shopify://shop_images/favicon-kokedama.png",

  // Tipografia. Handle verificati contro la libreria font di Shopify:
  // "cormorant_garamond_n4" NON esiste, il nome giusto e "cormorant_n4".
  type_header_font: "cormorant_n4",
  type_body_font: "inter_n4",
  heading_scale: 115,
  body_scale: 100,

  // Respiro: piu spazio bianco, come da preferenze della cliente
  page_width: 1200,
  spacing_sections: 24,
  spacing_grid_horizontal: 24,
  spacing_grid_vertical: 32,

  // Linee sottili, niente angoli arrotondati, niente ombre
  buttons_radius: 0,
  buttons_border_thickness: 1,
  buttons_shadow_opacity: 0,
  inputs_radius: 0,
  inputs_border_thickness: 1,
  inputs_shadow_opacity: 0,
  variant_pills_radius: 0,
  variant_pills_border_thickness: 1,
  variant_pills_shadow_opacity: 0,
  media_radius: 0,
  media_border_thickness: 0,
  media_shadow_opacity: 0,
  text_boxes_radius: 0,
  text_boxes_shadow_opacity: 0,
  popup_corner_radius: 0,
  badge_corner_radius: 0,

  // Schede prodotto pulite, senza cornice
  card_style: "standard",
  card_image_padding: 0,
  card_text_alignment: "left",
  card_border_thickness: 0,
  card_corner_radius: 0,
  card_shadow_opacity: 0,
  collection_card_style: "standard",
  collection_card_border_thickness: 0,
  collection_card_corner_radius: 0,
  collection_card_shadow_opacity: 0,
  blog_card_border_thickness: 0,
  blog_card_corner_radius: 0,
  blog_card_shadow_opacity: 0,

  // Carrello a tendina: meno passaggi su smartphone
  cart_type: "drawer",
  cart_color_scheme: "scheme-1",
  animations_reveal_on_scroll: true,
};

const dati = JSON.parse(leggi("config/settings_data.json"));
const preset = dati.presets.Dawn;

Object.entries(schemi).forEach(([nome, valori]) => {
  preset.color_schemes[nome] = preset.color_schemes[nome] || { settings: {} };
  Object.assign(preset.color_schemes[nome].settings, valori);
});
Object.assign(preset, impostazioni);

// Dawn appena scaricato ha "current": "Dawn", cioe un rimando al preset.
// L'editor di Shopify pretende invece le impostazioni scritte per esteso,
// altrimenti mostra l'avviso "gli schemi di colori devono essere definiti
// nei file settings_data e settings_schema" e non applica i colori.
dati.current = JSON.parse(JSON.stringify(preset));

scrivi("config/settings_data.json", JSON.stringify(dati, null, 2));
console.log("1/4  settings_data.json  colori, font e spaziature applicati");

/* ---------------------------------------------------------------- 2. CSS */

const css = `/* Ritocchi Kokedama sopra Dawn.
   ATTENZIONE: Dawn usa html{font-size:62.5%}, quindi qui 1rem = 10px.
   Un 1.4rem vale 14px, non 22px. Sbagliare questo rimpicciolisce tutto. */

:root {
  --kokedama-terra: #8a7a66;
  --kokedama-bordo: #e4e0d6;
}

/* Titoli piu leggeri: il serif regge bene le dimensioni grandi */
h1, h2, h3, .h0, .h1, .h2, .h3 {
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1.15;
}

/* Testo corrente piu arioso */
.rte, .rte p {
  line-height: 1.75;
}

/* Occhielli: testo piccolo maiuscolo sopra i titoli (12px) */
.subtitle, .caption-with-letter-spacing {
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--kokedama-terra);
  font-size: 1.2rem;
}

/* Bottoni: maiuscoletto spaziato (13px) */
.button, .shopify-challenge__button, .customer button {
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 1.3rem;
  padding: 1.6rem 3.4rem;
  min-height: 4.8rem;
}

/* Schede prodotto: nome in serif (20px), prezzo discreto (14px) */
.card__heading {
  font-family: var(--font-heading-family);
  font-size: 2rem;
  font-weight: 400;
}
.card-information .price {
  font-size: 1.4rem;
  opacity: 0.75;
}

/* Header: linea sottile invece dell ombra */
.header-wrapper {
  border-bottom: 1px solid var(--kokedama-bordo);
}

/* Voci di menu (15px): leggibili anche da lontano */
.header__menu-item {
  letter-spacing: 0.06em;
  font-size: 1.5rem;
}

/* Accordion (Dettagli / Cura / Spedizione) */
.accordion summary {
  padding: 1.6rem 0;
}

/* Su smartphone: titoli un filo piu contenuti (42px) */
@media screen and (max-width: 749px) {
  .banner__heading {
    font-size: 4.2rem;
  }
}
`;
scrivi("assets/kokedama.css", css);
console.log("2/4  assets/kokedama.css     creato");

/* ---------------------------------------------------------------- 3. Layout */

let layout = leggi("layout/theme.liquid");
const riga = "{{ 'base.css' | asset_url | stylesheet_tag }}";
const nuova = riga + "\n    {{ 'kokedama.css' | asset_url | stylesheet_tag }}";
if (layout.includes("kokedama.css")) {
  console.log("3/4  theme.liquid           include gia presente");
} else if (layout.includes(riga)) {
  layout = layout.replace(riga, nuova);
  scrivi("layout/theme.liquid", layout);
  console.log("3/4  theme.liquid           include del CSS aggiunto");
} else {
  console.warn("3/4  theme.liquid           ATTENZIONE: riga base.css non trovata, aggiungi a mano l'include di kokedama.css");
}

/* ------------------------------------------------- 4. Firma nel footer */

// Dawn stampa "Powered by Shopify" in fondo alla pagina. Non e obbligatorio:
// si puo togliere modificando il tema, ed e quello che facciamo qui.
// Per cambiare la firma basta modificare questa riga e rilanciare lo script.
// Il punto in mezzo apre la riga: Dawn stampa questa firma subito dopo
// "&copy; 2026, Kokedama & Sculture Naturali", senza separatore, e le due frasi
// si attaccavano. Lo stesso segno separa le informative che seguono.
const FIRMA =
  '&middot; Sito realizzato da <a href="https://sarah-studio-it.netlify.app/" target="_blank" rel="noopener">Sarah</a>';

let piede = leggi("sections/footer.liquid");
const rigaShopify = '<small class="copyright__content">{{ powered_by_link }}</small>';
const rigaFirma = '<small class="copyright__content">' + FIRMA + "</small>";
// Riconosce una firma gia messa da un giro precedente, anche se il testo e
// cambiato: senza questa riga, cambiare FIRMA non aveva piu effetto perche
// "powered_by_link" era gia stato sostituito.
const firmaVecchia = new RegExp(String.raw`<small class="copyright__content">Sito realizzato da[^]*?</small>`);

if (piede.includes(rigaFirma)) {
  console.log("4/4  footer.liquid          firma gia presente");
} else if (piede.includes(rigaShopify)) {
  piede = piede.replace(rigaShopify, rigaFirma);
  scrivi("sections/footer.liquid", piede);
  console.log('4/4  footer.liquid          "Powered by Shopify" sostituito con la firma');
} else if (firmaVecchia.test(piede)) {
  piede = piede.replace(firmaVecchia, rigaFirma);
  scrivi("sections/footer.liquid", piede);
  console.log("4/4  footer.liquid          firma aggiornata");
} else {
  console.warn("4/4  footer.liquid          ATTENZIONE: riga powered_by_link non trovata");
}

// La home (templates/index.json) viene scritta da editoriale-dawn.js, non qui.
// Questo script si occupa solo di settings, CSS di base e layout.
// Separare le due responsabilita evita che l'ordine di esecuzione conti.

// La home (templates/index.json) viene scritta da editoriale-dawn.js, non qui.
// Questo script si occupa solo di settings, CSS di base e layout.

console.log([
  "",
  "Fatto. Lancia nell ordine:",
  "  node templates-dawn.js",
  "  node testi-dawn.js",
  "  node editoriale-dawn.js",
  "  node verifica-tema.js",
  "  npx @shopify/cli@latest theme push --store kokedamasculture.myshopify.com --theme 204758417733",
].join(String.fromCharCode(10)));
