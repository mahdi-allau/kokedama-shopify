/**
 * Template di prodotto, collezione e pagine per il tema Kokedama.
 *
 *   node templates-dawn.js
 *
 * Va lanciato dopo personalizza-dawn.js. Scrive dentro dawn-kokedama/templates/.
 * I template "page.*.json" appaiono in Shopify nel menu a tendina
 * "Template" quando si crea o modifica una pagina.
 */
const fs = require("fs");
const path = require("path");

const TEMA = path.join(__dirname, "dawn-kokedama");
if (!fs.existsSync(TEMA)) {
  console.error("Cartella dawn-kokedama non trovata. Lancia prima personalizza-dawn.js");
  process.exit(1);
}
const salva = (nome, dati) => {
  fs.writeFileSync(path.join(TEMA, "templates", nome), JSON.stringify(dati, null, 2), "utf8");
  console.log("  scritto templates/" + nome);
};

/* ------------------------------------------------- PAGINA PRODOTTO */
// Foto a sinistra, informazioni a destra che restano ferme allo scroll.
// Le tre righe apribili in fondo replicano Dettagli / Cura / Spedizione del prototipo.

salva("product.json", {
  sections: {
    main: {
      type: "main-product",
      blocks: {
        occhiello: { type: "text", settings: { text: "Pezzo unico", text_style: "uppercase" } },
        title: { type: "title" },
        price: { type: "price" },
        // Avvisa quando restano pochi pezzi: utile con esemplari unici
        inventory: { type: "inventory", settings: { text_style: "body", inventory_threshold: 3, show_inventory_quantity: true } },
        variant_picker: { type: "variant_picker", settings: { picker_type: "button", swatch_shape: "none" } },
        quantity_selector: { type: "quantity_selector" },
        buy_buttons: { type: "buy_buttons", settings: { show_dynamic_checkout: true, show_gift_card_recipient: false } },
        description: { type: "description" },
        dettagli: {
          type: "collapsible_tab",
          settings: {
            heading: "Dettagli",
            icon: "ruler",
            content: "<p>Altezza e diametro indicativi. Ogni esemplare varia leggermente per forma e colore.</p>",
            page: "",
          },
        },
        cura: {
          type: "collapsible_tab",
          settings: {
            heading: "Cura",
            icon: "plant",
            // Collegare qui la pagina "Cura del kokedama" dall'editor:
            // il campo "page" ha la precedenza sul testo qui sotto.
            content: "<p>Immersione in acqua ogni 7&ndash;10 giorni, luce indiretta, nebulizzazione sulle foglie in estate.</p>",
            page: "cura-del-kokedama",
          },
        },
        spedizione: {
          type: "collapsible_tab",
          settings: {
            heading: "Consegna e resi",
            icon: "truck",
            // La pagina "spedizioni" e stata eliminata dal pannello: qui resta il testo.
            content: "<p>Le piante vive si consegnano a mano a Ferrara e dintorni, entro circa 30 km, oppure si ritirano in laboratorio su appuntamento. Niente corriere: in un pacco chiuso soffrirebbero.</p><p><a href=\"/pages/resi-e-rimborsi\">Come funzionano i resi</a></p>",
            page: "",
          },
        },
      },
      block_order: [
        "occhiello",
        "title",
        "price",
        "inventory",
        "variant_picker",
        "quantity_selector",
        "buy_buttons",
        "description",
        "dettagli",
        "cura",
        "spedizione",
      ],
      settings: {
        enable_sticky_info: true,
        color_scheme: "scheme-1",
        media_position: "left",
        gallery_layout: "thumbnail",       // miniature sotto la foto, come nel prototipo
        media_size: "large",
        constrain_to_viewport: true,
        media_fit: "contain",
        image_zoom: "lightbox",
        mobile_thumbnails: "show",
        hide_variants: true,
        enable_video_looping: false,
        padding_top: 36,
        padding_bottom: 24,
      },
    },
    correlati: {
      type: "related-products",
      settings: {
        heading: "Altri kokedama",
        heading_size: "h2",
        products_to_show: 3,
        columns_desktop: 3,
        color_scheme: "scheme-2",
        image_ratio: "portrait",
        image_shape: "default",
        show_secondary_image: true,
        show_vendor: false,
        show_rating: false,
        columns_mobile: "2",
        padding_top: 56,
        padding_bottom: 56,
      },
    },
  },
  order: ["main", "correlati"],
});

/* ------------------------- PRODOTTO STABILIZZATO (template "stabilizzato") */
// Uguale alla scheda prodotto normale, ma senza la riga "Cura" con acqua,
// immersioni e luce: uno stabilizzato non si annaffia e non va esposto.
// Dirlo chiaro evita il reso di chi crede di aver comprato una pianta viva.
// Va assegnato ai prodotti stabilizzati dal pannello:
// Prodotti > [prodotto] > Modello di tema > "stabilizzato".

salva("product.stabilizzato.json", {
  sections: {
    main: {
      type: "main-product",
      blocks: {
        occhiello: { type: "text", settings: { text: "Non chiede acqua", text_style: "uppercase" } },
        title: { type: "title" },
        price: { type: "price" },
        inventory: { type: "inventory", settings: { text_style: "body", inventory_threshold: 3, show_inventory_quantity: true } },
        variant_picker: { type: "variant_picker", settings: { picker_type: "button", swatch_shape: "none" } },
        quantity_selector: { type: "quantity_selector" },
        buy_buttons: { type: "buy_buttons", settings: { show_dynamic_checkout: true, show_gift_card_recipient: false } },
        description: { type: "description" },
        dettagli: {
          type: "collapsible_tab",
          settings: {
            heading: "Dettagli",
            icon: "ruler",
            content: "<p>Altezza e diametro indicativi. Ogni composizione &egrave; fatta a mano, quindi varia leggermente per forma e colore.</p>",
            page: "",
          },
        },
        niente_cura: {
          type: "collapsible_tab",
          settings: {
            heading: "Non serve curarlo",
            icon: "leaf",
            content:
              "<p>Niente acqua, niente luce, niente potature: la pianta &egrave; stabilizzata e resta com&rsquo;&egrave;.</p>" +
              "<p>Tienila lontana dall&rsquo;acqua, dall&rsquo;umidit&agrave; forte e dal sole diretto. " +
              "Se prende polvere, una spolverata leggera con un pennello morbido.</p>",
            page: "",
          },
        },
        spedizione: {
          type: "collapsible_tab",
          settings: {
            heading: "Spedizione e resi",
            icon: "truck",
            // La pagina "spedizioni" e stata eliminata dal pannello: qui resta il testo.
            content: "<p>Spedizione in tutta Italia, imballo protettivo dedicato.</p><p><a href=\"/pages/resi-e-rimborsi\">Come funzionano i resi</a></p>",
            page: "",
          },
        },
      },
      block_order: [
        "occhiello",
        "title",
        "price",
        "inventory",
        "variant_picker",
        "quantity_selector",
        "buy_buttons",
        "description",
        "dettagli",
        "niente_cura",
        "spedizione",
      ],
      settings: {
        enable_sticky_info: true,
        color_scheme: "scheme-1",
        media_position: "left",
        gallery_layout: "thumbnail",
        media_size: "large",
        constrain_to_viewport: true,
        media_fit: "contain",
        image_zoom: "lightbox",
        mobile_thumbnails: "show",
        hide_variants: true,
        enable_video_looping: false,
        padding_top: 36,
        padding_bottom: 24,
      },
    },
    correlati: {
      type: "related-products",
      settings: {
        heading: "Altre composizioni",
        heading_size: "h2",
        products_to_show: 3,
        columns_desktop: 3,
        color_scheme: "scheme-2",
        image_ratio: "portrait",
        image_shape: "default",
        show_secondary_image: true,
        show_vendor: false,
        show_rating: false,
        columns_mobile: "2",
        padding_top: 56,
        padding_bottom: 56,
      },
    },
  },
  order: ["main", "correlati"],
});

/* ------------------------------------------------- COLLEZIONE (Shop) */
// Niente filtri: con pochi prodotti sono rumore. Si riattivano dall'editor
// quando il catalogo cresce.

salva("collection.json", {
  sections: {
    banner: {
      type: "main-collection-banner",
      settings: { show_collection_description: true, show_collection_image: false, color_scheme: "scheme-2" },
    },
    griglia: {
      type: "main-collection-product-grid",
      settings: {
        products_per_page: 16,
        columns_desktop: 3,
        color_scheme: "scheme-1",
        image_ratio: "portrait",
        image_shape: "default",
        show_secondary_image: true,
        show_vendor: false,
        show_rating: false,
        quick_add: "none",
        enable_filtering: false,
        filter_type: "horizontal",
        enable_sorting: true,
        columns_mobile: "2",
        padding_top: 48,
        padding_bottom: 64,
      },
    },
  },
  order: ["banner", "griglia"],
});

/* --------------------------------- COLLEZIONE KOKEDAMA VIVI (template "vivi") */
// Il testo della linea Ferrara ha la griglia dei prodotti IN MEZZO: prima la
// presentazione (che sta nella descrizione della collezione), poi le foto, poi
// l'aiuto nella scelta e il servizio di rimessa in sesto.
// La descrizione di una collezione esce tutta sopra la griglia, quindi le due
// sezioni finali stanno qui, nel template.
// Va assegnato alla collezione "Laboratorio Ferrara" dal pannello:
// Collezioni > Laboratorio Ferrara > Modello di tema > "vivi".

salva("collection.vivi.json", {
  sections: {
    banner: {
      type: "main-collection-banner",
      settings: { show_collection_description: true, show_collection_image: false, color_scheme: "scheme-2" },
    },
    griglia: {
      type: "main-collection-product-grid",
      settings: {
        products_per_page: 16,
        columns_desktop: 3,
        color_scheme: "scheme-1",
        image_ratio: "portrait",
        image_shape: "default",
        show_secondary_image: true,
        show_vendor: false,
        show_rating: false,
        quick_add: "none",
        enable_filtering: false,
        filter_type: "horizontal",
        enable_sorting: true,
        columns_mobile: "2",
        padding_top: 48,
        padding_bottom: 48,
      },
    },
    scelta: {
      type: "rich-text",
      blocks: {
        titolo: { type: "heading", settings: { heading: "Quale pianta scegliere?", heading_size: "h1" } },
        testo: {
          type: "text",
          settings: {
            text:
              "<ul>" +
              "<li><strong>Se hai poca luce:</strong> felce, asparagina, pothos.</li>" +
              "<li><strong>Se hai molta luce:</strong> ficus ginseng, pilea, tradescantia.</li>" +
              "<li><strong>Se vuoi qualcosa di speciale:</strong> un kokedama sospeso, pi&ugrave; grande.</li>" +
              "</ul>" +
              "<p>Non trovi quella che cerchi? Me la dici e te la preparo.</p>",
          },
        },
        bottone: {
          type: "button",
          settings: {
            button_label: "Chiedimi una pianta su WhatsApp",
            // Messaggio gia scritto: chi scrive non deve pensare a come iniziare
            button_link: "https://wa.me/393478202607?text=Ciao%20Simona!%20Vorrei%20un%20kokedama%20con%20una%20pianta%20particolare.",
            button_style_secondary: false,
            button_label_2: "",
            button_link_2: "",
            button_style_secondary_2: false,
          },
        },
      },
      block_order: ["titolo", "testo", "bottone"],
      settings: {
        desktop_content_position: "left",
        content_alignment: "left",
        color_scheme: "scheme-1",
        full_width: false,
        padding_top: 72,
        padding_bottom: 72,
      },
    },
    cura_nel_tempo: {
      type: "rich-text",
      blocks: {
        occhiello: { type: "caption", settings: { caption: "Solo per i miei kokedama", text_style: "caption-with-letter-spacing", text_size: "small" } },
        titolo: { type: "heading", settings: { heading: "Cura nel tempo", heading_size: "h2" } },
        testo: {
          type: "text",
          settings: {
            text:
              "<p>Se dopo qualche mese il muschio si dirada o la sfera si indurisce, non buttarlo. " +
              "Me lo riporti e lo rimetto in sesto.</p>",
          },
        },
      },
      block_order: ["occhiello", "titolo", "testo"],
      settings: {
        desktop_content_position: "center",
        content_alignment: "center",
        color_scheme: "scheme-2",
        full_width: true,
        padding_top: 80,
        padding_bottom: 80,
      },
    },
  },
  order: ["banner", "griglia", "scelta", "cura_nel_tempo"],
});

/* ------------------------------------------------- PAGINE SEMPLICI */
// Chi siamo, Cura, Spedizioni: testo dell'editor pagine + un richiamo allo shop in fondo.

salva("page.testo.json", {
  sections: {
    main: { type: "main-page", settings: { padding_top: 48, padding_bottom: 32 } },
    richiamo: {
      type: "rich-text",
      blocks: {
        titolo: { type: "heading", settings: { heading: "Trova il tuo kokedama", heading_size: "h2" } },
        bottone: {
          type: "button",
          settings: {
            button_label: "Vai allo shop",
            button_link: "shopify://collections/all",
            button_style_secondary: true,
            button_label_2: "",
            button_link_2: "",
            button_style_secondary_2: false,
          },
        },
      },
      block_order: ["titolo", "bottone"],
      settings: {
        desktop_content_position: "center",
        content_alignment: "center",
        color_scheme: "scheme-2",
        full_width: true,
        padding_top: 56,
        padding_bottom: 56,
      },
    },
  },
  order: ["main", "richiamo"],
});

/* ------------------------------------------------- FAQ */
// Righe apribili, non un muro di testo.

const domande = [
  ["Che cos&rsquo;&egrave; un kokedama?", "question_mark", "<p>&Egrave; una tecnica giapponese: le radici della pianta vengono avvolte in una sfera di terra ricoperta di muschio, al posto del vaso. Pu&ograve; essere appoggiato su un piattino o sospeso.</p>"],
  ["Quanto dura?", "stopwatch", "<p>Con le cure giuste pu&ograve; vivere anni. Dopo due o tre anni la sfera pu&ograve; essere rifatta per dare nuovo spazio alle radici.</p>"],
  ["Ogni quanto devo annaffiarlo?", "bottle", "<p>In media ogni 7&ndash;10 giorni. Il metodo pi&ugrave; affidabile &egrave; il peso: se la sfera &egrave; leggera, &egrave; ora di immergerla.</p>"],
  ["Posso tenerlo in bagno o in cucina?", "eye", "<p>S&igrave;, se c&rsquo;&egrave; luce naturale. L&rsquo;umidit&agrave; di questi ambienti &egrave; spesso ideale per felci e piante da sottobosco.</p>"],
  ["Le piante sono sicure per animali domestici?", "paw_print", "<p>Dipende dalla specie. Nella scheda di ogni prodotto indichiamo se la pianta &egrave; tossica in caso di ingestione.</p>"],
  ["Posso ordinare un kokedama personalizzato?", "heart", "<p>S&igrave;, scrivici dalla pagina Contatti indicando pianta, dimensione e occasione.</p>"],
  ["Fate confezioni regalo?", "box", "<p>Su richiesta, con biglietto scritto a mano. Puoi segnalarlo nelle note dell&rsquo;ordine.</p>"],
  // Due linee (settembre 2026): le piante vive non viaggiano col corriere.
  ["Spedite anche i kokedama vivi?", "truck", "<p>No: le piante vive le consegniamo a mano a Ferrara e dintorni, oppure si ritirano in laboratorio su appuntamento. In un pacco chiuso, soprattutto d&rsquo;estate, soffrirebbero troppo. La collezione stabilizzata invece la spedisco in tutta Italia.</p>"],
];

const blocchiFaq = {};
domande.forEach(([heading, icon, row_content], i) => {
  blocchiFaq["faq_" + (i + 1)] = { type: "collapsible_row", settings: { heading, icon, row_content, page: "" } };
});

salva("page.faq.json", {
  sections: {
    main: { type: "main-page", settings: { padding_top: 48, padding_bottom: 0 } },
    faq: {
      type: "collapsible-content",
      blocks: blocchiFaq,
      block_order: Object.keys(blocchiFaq),
      settings: {
        caption: "Domande frequenti",
        heading: "Le risposte alle domande pi&ugrave; comuni",
        heading_size: "h2",
        heading_alignment: "left",
        layout: "none",
        container_color_scheme: "scheme-1",
        color_scheme: "scheme-1",
        open_first_collapsible_row: true,
        image_ratio: "adapt",
        desktop_layout: "image_second",
        padding_top: 16,
        padding_bottom: 64,
      },
    },
  },
  order: ["main", "faq"],
});

/* ------------------------------------------------- CONTATTI */

salva("page.contact.json", {
  sections: {
    main: { type: "main-page", settings: { padding_top: 48, padding_bottom: 0 } },
    modulo: {
      type: "contact-form",
      settings: { heading: "Scrivici", heading_size: "h2", color_scheme: "scheme-1", padding_top: 24, padding_bottom: 64 },
    },
  },
  order: ["main", "modulo"],
});

console.log("\nFatto. In Shopify assegna i template alle pagine (vedi GUIDA-DAWN.md, Fase 5).");
