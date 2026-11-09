/**
 * Impaginazione editoriale sopra Dawn.
 *
 *   node editoriale-dawn.js
 *
 * Va lanciato DOPO personalizza-dawn.js, templates-dawn.js e testi-dawn.js,
 * di cui riscrive due cose:
 *   - assets/kokedama.css  (tipografia grande, griglia sfalsata, movimento)
 *   - templates/index.json (home a ritmo irregolare, con sezione scura)
 *
 * Perche esiste un file separato: personalizza-dawn.js porta lo stile "base"
 * ripetibile su un Dawn appena scaricato; questo aggiunge le scelte
 * editoriali che possono cambiare senza rifare tutto.
 *
 * PROMEMORIA: Dawn usa html{font-size:62.5%} -> 1rem = 10px.
 */
const fs = require("fs");
const path = require("path");

const TEMA = path.join(__dirname, "dawn-kokedama");
const scrivi = (p, c) => fs.writeFileSync(path.join(TEMA, p), c, "utf8");

/* ============================================================== CSS */

const css = `/* Kokedama - impaginazione editoriale sopra Dawn.
   ATTENZIONE: in Dawn 1rem = 10px (html{font-size:62.5%}).
   Per agganciare una sezione NON usare #shopify-section-<chiave>: nei template JSON
   Shopify genera id tipo shopify-section-template--1234__<chiave>, quindi serve
   il selettore per suffisso [id$="__<chiave>"]. */

:root {
  --kokedama-terra: #8a7a66;
  --kokedama-bordo: #e4e0d6;
  --kokedama-verde-scuro: #3d4a38;
  --lento: 1.1s cubic-bezier(0.2, 0.6, 0.2, 1);
  /* --veloce: usata per hover e transizioni brevi (25 decimi di secondo) */
  --veloce: 0.25s ease;
}

/* ---------------------------------------------------------- TIPOGRAFIA */

/* Il serif regge le dimensioni grandi solo se alleggerito e stretto di interlinea */
h1, h2, h3, .h0, .h1, .h2, .h3 {
  font-weight: 300;
  letter-spacing: -0.005em;
  line-height: 1.05;
}

/* Titolo della home: grande davvero. Da 48px su telefono a 120px su desktop */
.banner__heading {
  font-size: clamp(4.8rem, 8vw, 12rem);
  line-height: 0.94;
  letter-spacing: -0.015em;
}

/* Titoli di sezione: contrasto netto rispetto al testo corrente */
.title, .title-wrapper h2, .rich-text__heading {
  font-size: clamp(3.2rem, 4.5vw, 5.6rem);
}

.rte, .rte p {
  line-height: 1.75;
}

/* Paragrafo introduttivo piu largo del testo normale */
.banner__text, .rich-text__text {
  font-size: 1.7rem;
}

/* Occhielli: piccoli, distanziati, color terra */
.subtitle, .caption-with-letter-spacing {
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--kokedama-terra);
  font-size: 1.2rem;
}

/* ------------------------------------------------------------ BOTTONI */

.button, .shopify-challenge__button, .customer button {
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 1.3rem;
  padding: 1.6rem 3.4rem;
  min-height: 4.8rem;
  /* transition su tre proprieta: colore, sfondo, micro-spostamento */
  transition: background-color var(--veloce), color var(--veloce), transform var(--veloce);
}

/* Micro-spostamento verso l'alto al passaggio del mouse */
.button:hover {
  transform: translateY(-2px);
}

/* Su schermi touch il transform non ha senso */
@media (hover: none) {
  .button:hover {
    transform: none;
  }
}

/* ------------------------------------------------------------- HEADER */

.header-wrapper {
  border-bottom: 1px solid var(--kokedama-bordo);
}

.header__menu-item {
  letter-spacing: 0.06em;
  font-size: 1.5rem;
}

/* Voci di menu: sottolineatura che cresce dal basso al passaggio del mouse */
.header__menu-item span {
  position: relative;
}
.header__menu-item span::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.25s ease;
}
.header__menu-item:hover span::after,
.header__menu-item[aria-current] span::after {
  width: 100%;
}

/* Nome del negozio in serif, spaziato: e il logo finche non ce n'e uno vero */
.header__heading-link .h2 {
  font-size: 2.4rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 300;
}

/* --------------------------------------------------------------- HERO */

/* Niente scritte sopra la fotografia: il testo sta su fondo sabbia a
   sinistra, la foto occupa la meta destra e si muove piano da sola
   (image_behavior "ambient" impostato nel template).
   Titolo grande anche qui: e la prima cosa che si legge. */
[id$="__banner"] .image-with-text__heading {
  font-size: clamp(3.4rem, 3.6vw, 6.4rem);
  line-height: 1.02;
  letter-spacing: -0.015em;
  /* La colonna e stretta: senza questo il browser spezza le parole a meta */
  overflow-wrap: normal;
  hyphens: none;
}

[id$="__banner"] .image-with-text__content {
  padding: clamp(3.2rem, 6vw, 8rem);
}

/* Il testo entra dal basso al caricamento, una riga dopo l'altra.
   Movimento breve e discreto: deve sembrare che la pagina si posi,
   non che rimbalzi. */
@keyframes kokedamaEntra {
  from {
    opacity: 0;
    transform: translateY(1.6rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[id$="__banner"] .image-with-text__content > * {
  animation: kokedamaEntra 0.9s cubic-bezier(0.2, 0.6, 0.2, 1) both;
}

[id$="__banner"] .image-with-text__content > *:nth-child(1) { animation-delay: 0.05s; }
[id$="__banner"] .image-with-text__content > *:nth-child(2) { animation-delay: 0.18s; }
[id$="__banner"] .image-with-text__content > *:nth-child(3) { animation-delay: 0.31s; }
[id$="__banner"] .image-with-text__content > *:nth-child(4) { animation-delay: 0.44s; }

/* La foto entra in dissolvenza, piu lenta del testo */
[id$="__banner"] .image-with-text__media {
  animation: kokedamaDissolve 1.6s ease both;
}

@keyframes kokedamaDissolve {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Chi ha chiesto meno animazioni nel sistema non ne vede nessuna */
@media (prefers-reduced-motion: reduce) {
  [id$="__banner"] .image-with-text__content > *,
  [id$="__banner"] .image-with-text__media {
    animation: none;
  }
}

/* --------------------------------------------------- GRIGLIA PRODOTTI */

/* Schede allineate sulla stessa riga d'orizzonte.
   Lo sfalsamento verticale c'era ed e stato tolto: con foto di altezze
   diverse faceva sembrare la pagina sbilanciata invece che editoriale. */
.product-grid .grid__item,
.collection .grid__item {
  margin-top: 0;
}

/* Tutte le foto alla stessa altezza: e questo che allinea davvero le schede.
   Senza, una foto piu alta spinge giu il nome e il prezzo della sua colonna. */
.card-wrapper .card__inner {
  aspect-ratio: 3 / 4;
}

.card-wrapper .card__media img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

/* Schede prodotto: nome in serif grande, prezzo discreto */
.card__heading {
  font-family: var(--font-heading-family);
  font-size: 2.2rem;
  font-weight: 300;
  letter-spacing: 0;
}

.card-information .price {
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  opacity: 0.6;
}

/* Linea sottile che appare sotto la scheda al passaggio del mouse */
.card-wrapper .card {
  border-bottom: 1px solid transparent;
  transition: border-color 0.25s ease;
}
.card-wrapper:hover .card {
  border-bottom-color: var(--kokedama-bordo);
}

/* Movimento: la foto si avvicina piano al passaggio del mouse */
.card__media img,
.media img {
  transition: transform var(--lento);
}

.card-wrapper:hover .card__media img {
  transform: scale(1.05);
}

/* Su schermi touch l'hover non esiste: nessuna animazione a vuoto */
@media (hover: none) {
  .card-wrapper:hover .card__media img {
    transform: none;
  }
  .card-wrapper .card {
    border-bottom-color: transparent !important;
  }
}

/* ------------------------------------------ SEZIONE COS'E UN KOKEDAMA */

/* La pausa scura a piena larghezza: una frase sola, grande, in corsivo. */
[id$="__cosa_e"] .rich-text__heading {
  font-style: italic;
  font-size: clamp(2.8rem, 4vw, 4.8rem);
  line-height: 1.2;
  max-width: 22ch;
  margin-inline: auto;
}

[id$="__cosa_e"] .rich-text__blocks {
  max-width: 90rem;
}

/* --------------------------------------------------------- ACCORDION */

.accordion summary {
  padding: 1.6rem 0;
  cursor: pointer;
  transition: opacity 0.25s ease;
}
.accordion summary:hover {
  opacity: 0.75;
}

/* --------------------------------------------- SEZIONE COSA TROVERAI */

/* Titoli delle tre colonne in maiuscolo spaziato.
   ATTENZIONE: in questa versione di Dawn il titolo e un <h3 class="inline-richtext">
   dentro .multicolumn-card__info. La classe .multicolumn-card__title NON esiste:
   la regola scritta cosi non applicava niente (verificato sul sito il 23 settembre). */
[id$="__cosa_troverai"] .multicolumn-card__info h3 {
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 1.4rem;
  font-weight: 500;
}

/* Separatore verticale tra le colonne su desktop */
@media screen and (min-width: 750px) {
  [id$="__cosa_troverai"] .multicolumn-card {
    border-left: 1px solid var(--kokedama-bordo);
    padding-left: 3.2rem;
  }
  [id$="__cosa_troverai"] .grid__item:first-child .multicolumn-card {
    border-left: 0;
    padding-left: 0;
  }
}

/* --------------------------------------------------------------- FOOTER */

.footer__content-top {
  padding-bottom: 3.2rem;
}

/* Filetto sottile sopra il footer */
.footer-wrapper {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

/* ----------------------------------------------------------- CARRELLO */

/* Numero di articoli nel carrello: sempre visibile */
.cart-count-bubble {
  background: var(--kokedama-verde-scuro);
  color: #fff;
}

/* -------------------------------------------------------- PAGINA 404 */

.template-404 .page-width {
  text-align: center;
  padding-block: 10rem;
}

/* ---------------------------------------------- PAGINE DI TESTO */

.main-page__content .article__title,
.main-page__content h1 {
  font-size: clamp(3.6rem, 5vw, 6rem);
  font-weight: 300;
  letter-spacing: -0.01em;
  margin-bottom: 4rem;
}

.main-page__content .rte {
  max-width: 68ch;
}

/* --------------------------------------------------------- FORM CONTATTI */

.contact-form {
  max-width: 64rem;
}

/* Label sopra i campi: piu spaziata, come un occhiello */
.field__label {
  letter-spacing: 0.08em;
  font-size: 1.2rem;
}

/* ------------------------------------------------ FOTO DEL TERRAZZO */

/* Soluzione provvisoria. Le sezioni di Dawn prendono l'immagine da un campo
   image_picker, che pesca dai File del negozio: finche le foto non sono
   caricate li, le mettiamo come sfondo CSS. I file stanno negli assets del
   tema, e il CSS li raggiunge con un percorso relativo perche vive nella
   stessa cartella sul CDN.
   Quando le foto saranno nei File di Shopify, togliere questo blocco e
   impostarle dall'editor: cosi la cliente potra cambiarle da sola. */

[id$="__banner"] .image-with-text__media,
[id$="__terrazzo"] .image-with-text__media {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Il segnaposto grigio di Dawn va nascosto, altrimenti copre la foto */
[id$="__banner"] .image-with-text__media .placeholder-svg,
[id$="__terrazzo"] .image-with-text__media .placeholder-svg {
  display: none;
}

/* Tre classi per battere la regola di Dawn che azzera lo sfondo quando la
   sezione non e in modalita overlap: la sua e a tre classi, queste a quattro.
   Serve a tutte e due le sezioni. Il terrazzo era rimasto con una classe sola
   e in pagina si vedeva un rettangolo grigio al posto della foto: con una
   classe la regola di Dawn vince, e azzera anche size e position perche usa
   la scorciatoia "background". Per questo ogni blocco se le riscrive. */
[id$="__banner"] .image-with-text__media.background-transparent.global-media-settings {
  background-image: url("terrazzo-vista-tetti.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

[id$="__terrazzo"] .image-with-text__media.background-transparent.global-media-settings {
  background-image: url("terrazzo-tramonto.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* ------------------------------------------- MENU SU TELEFONO */

/* Dawn su schermi stretti nasconde il menu dietro l hamburger. Qui lo teniamo
   sempre in vista, come su computer: le voci vanno a capo su piu righe.
   Il limite e 989px perche e la soglia con cui Dawn stessa passa al drawer. */
@media screen and (max-width: 989px) {
  .header {
    grid-template-areas:
      "heading icons"
      "navigation navigation" !important;
    grid-template-columns: 1fr auto !important;
    row-gap: 0.8rem;
  }

  /* Via l hamburger e il pannello a scomparsa */
  header-drawer,
  .header__icon--menu {
    display: none !important;
  }

  .header__inline-menu {
    display: block !important;
    grid-area: navigation;
    margin-left: 0;
  }

  /* Sette voci non stanno su una riga sola: vanno a capo ordinate */
  .header__inline-menu .list-menu--inline {
    flex-wrap: wrap;
    justify-content: flex-start;
    row-gap: 0.4rem;
    column-gap: 1.8rem;
  }

  .header__menu-item {
    font-size: 1.3rem;
    padding: 0.4rem 0;
  }
}

/* ------------------------------------------- BOTTONI DENTRO LE PAGINE */

/* Un link scritto come <a class="button"> nel testo di una pagina (per esempio
   i pulsanti WhatsApp della pagina Workshop): la regola ".rte a" di Dawn pesa
   piu della classe ".button", quindi il testo restava verde scuro su verde
   scuro, illeggibile. Qui la battiamo per specificita. */
.rte a.button {
  color: rgb(var(--color-button-text));
  text-decoration: none;
}

.rte a.button:hover {
  text-decoration: none;
}

/* --------------------------------------------------------- TELEFONO */

@media screen and (max-width: 749px) {
  /* Hero: su telefono le due meta si impilano e la foto finiva sopra il testo.
     Invertiamo l ordine: prima il titolo e il bottone, la foto sotto come chiusura. */
  [id$="__banner"] .image-with-text__text-item {
    order: 1;
  }
  [id$="__banner"] .image-with-text__media-item {
    order: 2;
  }
  /* Foto abbastanza alta da farsi guardare, non una striscia */
  [id$="__banner"] .image-with-text__media {
    min-height: 46vh;
  }
  .banner__heading {
    font-size: 4.6rem;
  }
  .title, .title-wrapper h2, .rich-text__heading {
    font-size: 3rem;
  }
  /* Niente sfalsamento su telefono: una colonna sola, deve restare ordinata */
  .product-grid .grid__item,
  .collection .grid__item {
    margin-top: 0;
  }
  /* Cura: separatore orizzontale invece che verticale su mobile */
  [id$="__cosa_troverai"] .multicolumn-card {
    border-left: 0;
    padding-left: 0;
    border-top: 1px solid var(--kokedama-bordo);
    padding-top: 2.4rem;
    margin-top: 2.4rem;
  }
  [id$="__cosa_troverai"] .grid__item:first-child .multicolumn-card {
    border-top: 0;
    padding-top: 0;
    margin-top: 0;
  }
}
`;

scrivi("assets/kokedama.css", css);
console.log("assets/kokedama.css   tipografia, griglia, hover bottoni, menu, sezioni home, 404, form");

/* ============================================================== HOME */

const home = {
  sections: {
    // 1. Apertura. Testo a sinistra su fondo sabbia, fotografia a destra.
    //    Niente scritte sopra la foto: si legge sempre, anche su immagini chiare.
    banner: {
      type: "image-with-text",
      blocks: {
        occhiello: {
          type: "caption",
          settings: { caption: "Fatti a mano a Ferrara", text_style: "caption-with-letter-spacing", text_size: "small" },
        },
        titolo: {
          type: "heading",
          settings: { heading: "Piante che abbracciano.", heading_size: "h0" },
        },
        testo: {
          type: "text",
          settings: {
            text: "<p>Kokedama fatti a mano, per portare un pezzo di bosco in casa.</p>",
            text_style: "body",
          },
        },
        bottone: {
          type: "button",
          settings: {
            button_label: "Scopri la collezione",
            button_link: "/collections/laboratorio-ferrara",
            button_style_secondary: false,
          },
        },
      },
      block_order: ["occhiello", "titolo", "testo", "bottone"],
      settings: {
        height: "large",
        desktop_image_width: "medium",
        layout: "text_first",
        image_behavior: "ambient",
        content_layout: "no-overlap",
        desktop_content_position: "middle",
        desktop_content_alignment: "left",
        section_color_scheme: "scheme-2",
        color_scheme: "scheme-2",
        mobile_content_alignment: "left",
        padding_top: 0,
        padding_bottom: 0,
      },
    },

    // 3. La pausa scura: spiega la parola a chi non la conosce.
    cosa_e: {
      type: "rich-text",
      blocks: {
        occhiello: {
          type: "caption",
          settings: { caption: "In giapponese, palla di muschio", text_style: "caption-with-letter-spacing", text_size: "small" },
        },
        titolo: { type: "heading", settings: { heading: "Cos&rsquo;&egrave; un kokedama?", heading_size: "h1" } },
        testo: {
          type: "text",
          settings: {
            text:
              "<p>Una pianta avvolta da terra, muschio e spago. Vive sospesa o appoggiata su un piatto.</p>" +
              "<p>Non serve il pollice verde: bastano un po&rsquo; d&rsquo;acqua e la luce giusta. Ogni pezzo &egrave; unico e creato a mano a Ferrara.</p>",
          },
        },
      },
      block_order: ["occhiello", "titolo", "testo"],
      settings: {
        desktop_content_position: "center",
        content_alignment: "center",
        color_scheme: "scheme-3",
        full_width: true,
        padding_top: 96,
        padding_bottom: 96,
      },
    },

    // 4. Tre porte d'ingresso al negozio, con il link a ciascuna.
    //    Nell'idea originale la terza voce era un "kit fai-da-te": non esiste
    //    a catalogo, al suo posto c'e il workshop, che insegna la stessa cosa.
    cosa_troverai: {
      type: "multicolumn",
      blocks: {
        interno: {
          type: "column",
          settings: {
            title: "Kokedama da interno",
            text: "<p>Per il salotto e la camera da letto. Piante vive, fatte a mano una per una.</p>",
            link_label: "Guarda i kokedama vivi",
            link: "/collections/laboratorio-ferrara",
          },
        },
        stabilizzati: {
          type: "column",
          settings: {
            title: "Kokedama stabilizzati",
            text: "<p>Non chiedono acqua n&eacute; luce. Per un bagno cieco, un ufficio, un negozio.</p>",
            link_label: "Guarda gli stabilizzati",
            link: "/collections/collezione-stabilizzata",
          },
        },
        workshop: {
          type: "column",
          settings: {
            title: "Workshop",
            text: "<p>Se vuoi provare a crearne uno tu: a casa tua o sul terrazzo, in due ore.</p>",
            link_label: "Scopri i workshop",
            link: "/pages/workshop-kokedama-vivi",
          },
        },
      },
      block_order: ["interno", "stabilizzati", "workshop"],
      settings: {
        title: "Cosa troverai",
        heading_size: "h2",
        image_width: "full",
        image_ratio: "adapt",
        columns_desktop: 3,
        column_alignment: "left",
        background_style: "none",
        button_label: "",
        button_link: "",
        color_scheme: "scheme-1",
        columns_mobile: "1",
        swipe_on_mobile: false,
        padding_top: 88,
        padding_bottom: 72,
      },
    },

    // 5. I kokedama vivi. La descrizione lunga sta nella pagina della
    //    collezione: qui basta il titolo, altrimenti la home diventa un muro.
    in_evidenza: {
      type: "featured-collection",
      settings: {
        title: "Dal laboratorio di Ferrara",
        heading_size: "hxl",
        description: "",
        show_description: false,
        description_style: "body",
        collection: "laboratorio-ferrara",
        products_to_show: 6,
        columns_desktop: 3,
        full_width: false,
        show_view_all: true,
        view_all_style: "link",
        enable_desktop_slider: false,
        color_scheme: "scheme-1",
        image_ratio: "portrait",
        image_shape: "default",
        show_secondary_image: true,
        show_vendor: false,
        show_rating: false,
        quick_add: "none",
        columns_mobile: "1",
        swipe_on_mobile: false,
        padding_top: 16,
        padding_bottom: 72,
      },
    },

    // 6. Gli stabilizzati. Qui la descrizione della collezione si vede:
    //    sono tre righe, e dicono la cosa piu importante (non chiedono acqua).
    stabilizzata: {
      type: "featured-collection",
      settings: {
        title: "Kokedama stabilizzati",
        heading_size: "hxl",
        description: "",
        show_description: true,
        description_style: "body",
        collection: "collezione-stabilizzata",
        products_to_show: 4,
        columns_desktop: 2,
        full_width: false,
        show_view_all: true,
        view_all_style: "link",
        enable_desktop_slider: false,
        color_scheme: "scheme-2",
        image_ratio: "portrait",
        image_shape: "default",
        show_secondary_image: true,
        show_vendor: false,
        show_rating: false,
        quick_add: "none",
        columns_mobile: "1",
        swipe_on_mobile: false,
        padding_top: 88,
        padding_bottom: 88,
      },
    },

    // 7. Il terrazzo: il luogo che rende riconoscibile il marchio.
    terrazzo: {
      type: "image-with-text",
      blocks: {
        occhiello: { type: "caption", settings: { caption: "Il laboratorio", text_style: "caption-with-letter-spacing", text_size: "small" } },
        titolo: { type: "heading", settings: { heading: "Il terrazzo", heading_size: "h1" } },
        testo: {
          type: "text",
          settings: {
            text:
              "<p>Un tavolo di legno, la terra sotto le unghie, una tisana calda. In due ore impari un gesto antico e torni a casa con il tuo giardino sospeso, fatto da te.</p>" +
              "<p>Gruppi da massimo sei persone, nel cuore di Ferrara. L&rsquo;indirizzo te lo dico al momento della prenotazione.</p>",
            text_style: "body",
          },
        },
        bottone: { type: "button", settings: { button_label: "Prenota su WhatsApp", button_link: "https://wa.me/393478202607", button_style_secondary: true } },
      },
      block_order: ["occhiello", "titolo", "testo", "bottone"],
      settings: {
        height: "large",
        desktop_image_width: "medium",
        layout: "image_first",
        image_behavior: "ambient",
        content_layout: "no-overlap",
        desktop_content_position: "middle",
        desktop_content_alignment: "left",
        section_color_scheme: "scheme-1",
        color_scheme: "scheme-1",
        mobile_content_alignment: "left",
        padding_top: 0,
        padding_bottom: 0,
      },
    },

    // 8. Chiusura: la frase che congeda, e come si ordina davvero.
    //    Instagram non c'e ancora fra i contatti del tema: quando Simona
    //    dara il profilo, si aggiunge qui e nelle impostazioni social.
    chiusura: {
      type: "rich-text",
      blocks: {
        titolo: { type: "heading", settings: { heading: "Se ne vedi uno che ti parla, &egrave; tuo.", heading_size: "h1" } },
        testo: {
          type: "text",
          settings: {
            text:
              "<p>Ogni kokedama &egrave; fatto per durare, con piante scelte per stare bene in casa.</p>" +
              "<p>Consegna a mano a Ferrara e dintorni. Gli stabilizzati li spedisco in tutta Italia.</p>",
          },
        },
        bottone: {
          type: "button",
          settings: {
            button_label: "Scrivimi su WhatsApp",
            button_link: "https://wa.me/393478202607",
            button_style_secondary: false,
            button_label_2: "",
            button_link_2: "",
            button_style_secondary_2: false,
          },
        },
      },
      block_order: ["titolo", "testo", "bottone"],
      settings: {
        desktop_content_position: "center",
        content_alignment: "center",
        color_scheme: "scheme-2",
        full_width: false,
        padding_top: 96,
        padding_bottom: 96,
      },
    },
  },
  order: ["banner", "cosa_e", "cosa_troverai", "in_evidenza", "stabilizzata", "terrazzo", "chiusura"],
};

scrivi("templates/index.json", JSON.stringify(home, null, 2));
console.log("templates/index.json  home a " + home.order.length + " sezioni: " + home.order.join(", "));
