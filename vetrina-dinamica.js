/*
 * vetrina-dinamica.js
 *
 *   node vetrina-statica.js && node vetrina-dinamica.js
 *
 * Secondo passo della vetrina. Il primo (`vetrina-statica.js`) fa la copia del
 * negozio Shopify; questo prende quella copia e la stacca dal catalogo di
 * Shopify: le schede prodotto e le griglie non sono piu pagine fisse, ma
 * modelli che si riempiono con i NOSTRI dati.
 *
 * Perche serve: senza questo passo, "aggiungere un prodotto" vorrebbe dire
 * rifare la copia da Shopify — cioe tenerlo acceso e pagarlo. Con questo,
 * i prodotti arrivano da `contenuti/prodotti.json` e, appena il database sara
 * pronto, da Supabase: Simona ne aggiunge uno dal pannello e il sito lo mostra.
 *
 * Cosa diventa dinamico:
 *   - le quattordici schede prodotto  ->  una sola pagina modello
 *     (`products/scheda.html`), servita a ogni indirizzo /products/<handle>
 *   - le griglie delle due collezioni e le due fasce prodotti della home
 *
 * Cosa resta copia fissa: home, workshop, chi sono, contatti, resi, informative.
 * Quelle non le tocca nessuno dal pannello, quindi non vale la pena.
 */

const fs = require("fs");
const path = require("path");

const RADICE = __dirname;
const SITO = path.join(RADICE, "vetrina");
const CONTENUTI = path.join(RADICE, "contenuti");
const WHATSAPP = "393478202607";

/* ---------------------------------------------------------------------------
 * Il codice che gira nel browser di chi visita il sito. Sta qui dentro, e non
 * in un file a parte, perche e strettamente legato ai segnaposto data-campo
 * che questo script scrive nelle pagine: separarli vorrebbe dire poterli
 * cambiare uno senza l'altro.
 * ------------------------------------------------------------------------ */

const CATALOGO_JS = `/* Riempie le pagine con i prodotti. Generato da vetrina-dinamica.js. */
(function () {
  var CFG = window.VETRINA || {};
  var BASE = CFG.base || "";
  var WHATSAPP = "${WHATSAPP}";

  /* Il simbolo basta: "25,00 EUR" con l'euro davanti lo diceva due volte. */
  function euro(n) {
    return "\\u20ac" + Number(n).toFixed(2).replace(".", ",");
  }

  function urlFoto(p) {
    if (!p.foto) return null;
    return CFG.supabaseUrl
      ? CFG.supabaseUrl + "/storage/v1/object/public/kokedama-foto/" + p.foto
      : BASE + "foto/" + p.foto;
  }

  function daQuanto(p) {
    var prezzi = (p.taglie || []).map(function (t) { return Number(t.prezzo); });
    if (!prezzi.length) return "";
    var minimo = Math.min.apply(null, prezzi);
    return prezzi.length > 1 ? "Da " + euro(minimo) : euro(minimo);
  }

  /* Prima si prova il database; se non risponde si usa la copia dei dati nel
     sito, cosi un disservizio di Supabase non lascia la vetrina vuota. */
  async function carica() {
    if (CFG.supabaseUrl && CFG.supabaseKey) {
      try {
        var r = await fetch(
          CFG.supabaseUrl + "/rest/v1/kokedama_prodotti?select=*&order=ordine",
          { headers: { apikey: CFG.supabaseKey, Authorization: "Bearer " + CFG.supabaseKey } }
        );
        if (r.ok) return await r.json();
      } catch (e) {
        /* si continua col file */
      }
    }
    return await (await fetch(BASE + "dati/prodotti.json")).json();
  }

  /* ------------------------------------------------------- SCHEDA PRODOTTO */

  function scheda(p) {
    document.title = p.titolo + " \\u2013 Kokedama & Sculture Naturali";

    document.querySelectorAll('[data-campo="titolo"]').forEach(function (e) {
      e.textContent = p.titolo;
    });
    var link = document.querySelector('[data-campo="titolo-link"]');
    if (link) link.setAttribute("href", "/products/" + p.handle);

    var occhiello = document.querySelector('[data-campo="occhiello"]');
    if (occhiello) occhiello.textContent = p.occhiello || "";

    var descrizione = document.querySelector('[data-campo="descrizione"]');
    if (descrizione) descrizione.innerHTML = p.descrizione || "";

    var foto = document.querySelector('[data-campo="foto"]');
    var indirizzo = urlFoto(p);
    if (foto && indirizzo) {
      foto.src = indirizzo;
      foto.alt = p.titolo + " \\u2014 kokedama fatto a mano";
    } else if (foto) {
      foto.remove();
    }

    /* La riga "Cura" non vale per gli stabilizzati: non si annaffiano. */
    document.querySelectorAll("[data-solo]").forEach(function (e) {
      if (e.getAttribute("data-solo") !== p.tipo) e.remove();
    });

    var taglie = (p.taglie || []).filter(function (t) { return t.nome !== "unica"; });
    var contenitore = document.querySelector('[data-campo="taglie"]');

    if (contenitore && taglie.length) {
      contenitore.innerHTML =
        '<fieldset class="js product-form__input product-form__input--pill">' +
        '<legend class="form__label">Taglia</legend>' +
        taglie.map(function (t, i) {
          var id = "taglia-" + i;
          return (
            '<input type="radio" id="' + id + '" name="Taglia" value="' + t.nome + '"' +
            (i === 0 ? " checked" : "") + ">" +
            '<label for="' + id + '">' + t.nome + "</label>"
          );
        }).join("") +
        "</fieldset>";
    } else if (contenitore) {
      contenitore.remove();
    }

    function scelta() {
      var segnata = document.querySelector('[data-campo="taglie"] input:checked');
      return taglie.length
        ? taglie.find(function (t) { return t.nome === (segnata && segnata.value); }) || taglie[0]
        : (p.taglie || [])[0];
    }

    function aggiorna() {
      var t = scelta();
      if (!t) return;

      document.querySelectorAll(".product__info-container .price-item--regular")
        .forEach(function (e) { e.textContent = euro(t.prezzo); });

      var bottone = document.querySelector('[data-campo="whatsapp"]');
      if (!bottone) return;
      var messaggio =
        "Ciao Simona! Ho visto " + p.titolo + " sul sito e mi interessa." +
        (taglie.length ? " Sarebbe la taglia " + t.nome + "." : "") +
        " \\u00c8 disponibile?";
      bottone.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(messaggio);
    }

    document.querySelectorAll('[data-campo="taglie"] input').forEach(function (r) {
      r.addEventListener("change", aggiorna);
    });
    aggiorna();
  }

  function nonTrovato() {
    document.title = "Questa pianta non c\\u2019\\u00e8 pi\\u00f9 \\u2013 Kokedama & Sculture Naturali";
    var info = document.querySelector(".product__info-container");
    if (!info) return;
    info.innerHTML =
      '<h1 class="product__title">Questa pianta non c\\u2019\\u00e8 pi\\u00f9</h1>' +
      '<p class="rte">Forse \\u00e8 stata venduta, o ha cambiato nome. ' +
      '<a href="/collections/laboratorio-ferrara">Guarda le altre</a>, ' +
      'oppure scrivimi e te ne preparo una.</p>' +
      '<p><a class="button" href="https://wa.me/' + WHATSAPP + '">Scrivimi su WhatsApp</a></p>';
    var foto = document.querySelector('[data-campo="foto"]');
    if (foto) foto.remove();
  }

  /* ------------------------------------------------------------- GRIGLIE */

  function cartellino(p) {
    var indirizzo = urlFoto(p);
    return (
      '<li class="grid__item">' +
      '<div class="card-wrapper product-card-wrapper underline-links-hover">' +
      '<div class="card card--standard card--media" style="--ratio-percent: 125.0%;">' +
      '<div class="card__inner color-scheme-2 gradient ratio" style="--ratio-percent: 125.0%;">' +
      '<div class="card__media">' +
      '<div class="media media--transparent media--hover-effect">' +
      (indirizzo
        ? '<img src="' + indirizzo + '" alt="' + p.titolo + '" class="motion-reduce" loading="lazy" width="800" height="1000">'
        : "") +
      "</div></div></div>" +
      '<div class="card__content"><div class="card__information">' +
      '<h3 class="card__heading h5">' +
      '<a href="/products/' + p.handle + '" class="full-unstyled-link">' + p.titolo + "</a></h3>" +
      '<div class="card-information"><span class="price">' +
      '<span class="price-item price-item--regular">' + daQuanto(p) + "</span>" +
      "</span></div></div></div>" +
      "</div></div></li>"
    );
  }

  /* I prodotti si mescolano, cosi chi arriva vede un po' di tutto e non
     sempre le stesse sei piante in cima. Due accortezze:

     - l'ordine cambia a ogni VISITA, non a ogni clic: il sorteggio si fa una
       volta sola e si tiene in sessione. Altrimenti, uscendo da una scheda e
       tornando indietro, la griglia sarebbe tutta un'altra e si perderebbe
       la pianta che si stava guardando.
     - il mescolamento e sempre lo stesso dentro la visita, quindi anche la
       fascia in home e il catalogo restano d'accordo fra loro. */
  function seme() {
    var chiave = "vetrina-mescola";
    var n;
    try {
      n = sessionStorage.getItem(chiave);
      if (!n) { n = String(Math.floor(Math.random() * 1e9)); sessionStorage.setItem(chiave, n); }
    } catch (e) {
      n = "1"; /* niente sessione (navigazione privata): ordine fisso, pazienza */
    }
    return Number(n);
  }

  function mescola(elenco) {
    var s = seme();
    /* Un generatore piccolo e ripetibile: dallo stesso seme esce sempre lo
       stesso ordine, che e esattamente quello che serve qui. */
    var casuale = function () {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    };
    var copia = elenco.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(casuale() * (i + 1));
      var t = copia[i]; copia[i] = copia[j]; copia[j] = t;
    }
    return copia;
  }

  function griglie(prodotti) {
    document.querySelectorAll('[data-campo="griglia"]').forEach(function (ul) {
      var quale = ul.getAttribute("data-collezione");
      var quanti = Number(ul.getAttribute("data-quanti") || 0);

      var scelti = mescola(
        prodotti.filter(function (p) {
          return quale === "tutte" || p.collezione === quale;
        })
      );
      /* La fascia in home mostra solo i primi: mescolando, ogni visita ne
         vede sei diversi invece che sempre gli stessi. */
      if (quanti) scelti = scelti.slice(0, quanti);

      ul.innerHTML = scelti.map(cartellino).join("");

      /* Ogni scheda prende la forma della propria foto. Il tema ne impone una
         sola, verticale: una foto orizzontale (come il kit) ci finiva dentro
         tagliata a meta. Cosi non si taglia mai niente, e vale anche per le
         foto che Simona carichera dal telefono, verticali o orizzontali. */
      ul.querySelectorAll(".card__media img").forEach(function (img) {
        /* Le schede restano TUTTE della stessa forma (3/4), altrimenti la
           griglia va a scalini e i titoli non si allineano piu: con foto
           verticali diverse fra loro era venuta fuori una scacchiera.
           Il taglio non si puo evitare, ma si puo scegliere dove fa danno:
           - foto verticali (piante appoggiate 3/4, sospese 2:3): riempiono
             la scheda, il ritaglio e di pochi punti percentuali e prende
             solo aria sopra e sotto;
           - foto orizzontali (il kit): tagliarle a 3/4 vorrebbe dire
             perderne meta, quindi si mostrano intere dentro la scheda. */
        var adatta = function () {
          if (!img.naturalWidth) return;
          var orizzontale = img.naturalWidth / img.naturalHeight > 1;
          if (orizzontale) {
            img.style.objectFit = "contain";
            img.style.background = "rgb(var(--color-background))";
          }
        };
        if (img.complete) adatta(); else img.addEventListener("load", adatta);
      });

      /* Il conteggio "N prodotti" sopra la griglia */
      var conteggio = document.querySelector(".product-count__text, .product-count");
      if (conteggio && quale !== "tutte" && !quanti) {
        conteggio.textContent = scelti.length + (scelti.length === 1 ? " prodotto" : " prodotti");
      }
    });
  }

  /* ------------------------------------------------------------- AVVIO */

  carica().then(function (tutti) {
    var online = tutti.filter(function (p) { return p.online !== false; });

    if (document.querySelector('[data-campo="taglie"], [data-campo="descrizione"]')) {
      var handle = location.pathname.replace(/\\/$/, "").split("/").pop().replace(/\\.html$/, "");
      var p = online.find(function (x) { return x.handle === handle; });
      if (p) scheda(p); else nonTrovato();
    }

    griglie(online);
  });
})();
`;

/* La scheda da cui si ricava il modello: una vale l'altra, basta che sia un
   kokedama vivo (ha le taglie) e che abbia la foto. */
const MODELLO_DA = "kokedama-ficus-ginseng";

/* ------------------------------------------------------------- ATTREZZI */

const leggi = (p) => fs.readFileSync(p, "utf8");
const scrivi = (p, t) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, t, "utf8");
};

/** Sostituisce una volta sola e si lamenta se non trova: meglio fermarsi che
    produrre una pagina muta che nessuno guarda finche non e online.
    Vuole un'espressione regolare, non un testo: il markup di Shopify e pieno
    di a capo e di spazi di rientro, e cercare la stringa esatta non funziona. */
function cambia(testo, regex, dopo, dove) {
  if (!regex.test(testo)) {
    throw new Error("in " + dove + " non trovo: " + regex);
  }
  return testo.replace(regex, dopo);
}

/** Svuota una <ul> riconosciuta dal suo tag di apertura e le attacca
    l'attributo che dice al JS cosa metterci dentro.
    Si cerca col tag intero, non con un pezzo di id: lo stesso id compare
    anche negli aria-controls dei pulsanti, e si finiva sulla <ul> sbagliata. */
function svuotaGriglia(html, regexApertura, attributo, dove) {
  const m = regexApertura.exec(html);
  if (!m) throw new Error("in " + dove + " non trovo la griglia " + regexApertura);

  const apre = m.index;
  const fineTag = apre + m[0].length;

  /* Le schede prodotto non contengono altre <ul>, ma contiamo lo stesso. */
  let i = fineTag;
  let livello = 1;
  while (livello > 0) {
    const a = html.indexOf("<ul", i);
    const c = html.indexOf("</ul>", i);
    if (c === -1) throw new Error("in " + dove + " la griglia non si chiude");
    if (a !== -1 && a < c) { livello++; i = a + 3; } else { livello--; i = c + 5; }
  }

  const tagApertura = m[0].replace(/>$/, " " + attributo + ">");
  return html.slice(0, apre) + tagApertura + "</ul>" + html.slice(i);
}

/* ------------------------------------------------- 1. I DATI NEL SITO */

const prodotti = JSON.parse(leggi(path.join(CONTENUTI, "prodotti.json")));

/* Copia di servizio: finche Supabase non c'e, il sito legge da qui. Dopo,
   questo file resta come rete di sicurezza se il database non risponde. */
scrivi(path.join(SITO, "dati", "prodotti.json"), JSON.stringify(prodotti, null, 1));

const foto = path.join(CONTENUTI, "foto");
for (const f of fs.readdirSync(foto)) {
  fs.mkdirSync(path.join(SITO, "foto"), { recursive: true });
  fs.copyFileSync(path.join(foto, f), path.join(SITO, "foto", f));
}

/* ------------------------------------------ 2. LA SCHEDA PRODOTTO MODELLO */

const sorgente = path.join(SITO, "products", MODELLO_DA, "index.html");
if (!fs.existsSync(sorgente)) {
  /* Questo script consuma la copia appena fatta: le schede che legge, poi le
     cancella. Rilanciarlo due volte di fila non puo funzionare. */
  throw new Error(
    "manca la copia da cui ricavare il modello.\n" +
    "  Lancia prima:  node vetrina-statica.js"
  );
}
let scheda = leggi(sorgente);

/* Occhiello ("Pezzo unico" / "Non chiede acqua") */
scheda = cambia(
  scheda,
  /<p[^>]*class="product__text[^"]*"[\s\S]*?>\s*Pezzo unico\s*<\/p>/,
  '<p class="product__text inline-richtext caption-with-letter-spacing" data-campo="occhiello"></p>',
  "scheda: occhiello"
);

/* Titolo: due volte, quello grande e quello della barra che segue lo scorrimento */
scheda = cambia(
  scheda,
  /<div class="product__title"[\s\S]*?<\/div>/,
  '<div class="product__title"><h1 data-campo="titolo"></h1><a data-campo="titolo-link" class="product__title"><h2 class="h1" data-campo="titolo"></h2></a></div>',
  "scheda: titolo"
);

/* Taglie: via le radio del ficus, le rifa il JS con le classi di Dawn */
const iTaglie = scheda.indexOf('<div data-vetrina-taglie="1"');
const fineTaglie = scheda.indexOf("</div>", scheda.indexOf("</fieldset>", iTaglie)) + 6;
if (iTaglie === -1 || fineTaglie < 6) throw new Error("scheda: non trovo il blocco delle taglie");
scheda =
  scheda.slice(0, iTaglie) +
  '<div data-vetrina-taglie="1" data-campo="taglie"></div>' +
  scheda.slice(fineTaglie);

/* Descrizione: dentro ci sono solo <p>, quindi il primo </div> e il suo. */
const iDesc = scheda.indexOf('<div class="product__description');
if (iDesc === -1) throw new Error("scheda: non trovo la descrizione");
const fineDesc = scheda.indexOf("</div>", iDesc) + 6;
scheda =
  scheda.slice(0, iDesc) +
  '<div class="product__description rte" data-campo="descrizione"></div>' +
  scheda.slice(fineDesc);

/* Galleria: una foto sola per prodotto, quindi niente carosello */
const iGall = scheda.indexOf("<media-gallery");
const fineGall = scheda.indexOf("</media-gallery>") + "</media-gallery>".length;
if (iGall === -1) throw new Error("scheda: non trovo la galleria");
/* Markup nostro, non quello di Dawn: la sua galleria calcola l'altezza da un
   rapporto d'aspetto che il carosello imposta a mano. Riusandola a pezzi
   l'immagine restava alta zero pixel — caricata, ma invisibile. Qui l'altezza
   la decide la foto stessa. */
scheda =
  scheda.slice(0, iGall) +
  '<div class="vetrina-galleria"><img data-campo="foto" class="vetrina-foto" alt="" loading="eager"></div>' +
  scheda.slice(fineGall);

scheda = scheda.replace(
  "</head>",
  "<style>\n" +
    ".vetrina-galleria { position: sticky; top: 2.4rem; }\n" +
    ".vetrina-foto { display: block; width: 100%; height: auto; }\n" +
    "@media screen and (max-width: 749px) { .vetrina-galleria { position: static; } }\n" +
    "</style>\n</head>"
);

/* Pulsante WhatsApp: il messaggio lo scrive il JS, che sa pianta e taglia */
const iOrdine = scheda.indexOf('<div class="vetrina-ordine">');
const fineOrdine = scheda.indexOf("</div>", scheda.indexOf("vetrina-nota")) + 6;
if (iOrdine === -1) throw new Error("scheda: non trovo il blocco WhatsApp");
scheda =
  scheda.slice(0, iOrdine) +
  '<div class="vetrina-ordine"><a class="button button--full-width" data-campo="whatsapp" target="_blank" rel="noopener">Ordina su WhatsApp</a>' +
  '<p class="vetrina-nota">Ti rispondo io, di persona. Ti dico se &egrave; pronto, quanto ci metto e come te lo faccio avere.</p></div>' +
  scheda.slice(fineOrdine);

/* La riga "Cura" non vale per gli stabilizzati: uno stabilizzato non si
   annaffia, e dirgli di immergerlo e il modo piu veloce per farselo tornare
   indietro. Il JS la nasconde quando il prodotto e una composizione secca. */
const titoloCura = /<h2[^>]*accordion__title[^>]*>\s*Cura\s*<\/h2>/.exec(scheda);
if (!titoloCura) throw new Error("scheda: non trovo la riga Cura da marcare");
const apreCura = scheda.lastIndexOf("<details", titoloCura.index);
if (apreCura === -1) throw new Error("scheda: la riga Cura non sta dentro un <details>");
scheda = scheda.slice(0, apreCura + 8) + ' data-solo="Kokedama"' + scheda.slice(apreCura + 8);

/* Percorsi assoluti, non relativi. La stessa pagina risponde a /products/felce
   e a /products/felce/ : con i percorsi relativi, la barra finale sposterebbe
   la base di un livello e la scheda arriverebbe senza grafica. */
scheda = scheda.replace(/(href|src)="\.\.\/\.\.\//g, '$1="/');

scrivi(path.join(SITO, "products", "scheda.html"), scheda);

/* Via le quattordici copie: adesso le serve tutte la pagina modello. */
let tolte = 0;
for (const voce of fs.readdirSync(path.join(SITO, "products"), { withFileTypes: true })) {
  if (voce.isDirectory()) {
    try {
      fs.rmSync(path.join(SITO, "products", voce.name), { recursive: true, force: true, maxRetries: 10, retryDelay: 150 });
      tolte++;
    } catch (e) {
      /* Su Windows basta un terminale aperto dentro la cartella e la
         rimozione fallisce. Non e un motivo per buttare tutto il lavoro. */
      console.warn("  ! non ho potuto togliere products/" + voce.name + " (" + e.code + ")");
    }
  }
}

/* --------------------------------------------- 3. LE GRIGLIE DEI PRODOTTI */

const CATALOGO = /<ul[^>]*id="product-grid"[^>]*>/;
const griglie = [
  ["collections/laboratorio-ferrara/index.html", CATALOGO, 'data-collezione="laboratorio-ferrara"'],
  ["collections/collezione-stabilizzata/index.html", CATALOGO, 'data-collezione="collezione-stabilizzata"'],
  ["collections/all/index.html", CATALOGO, 'data-collezione="tutte"'],
  ["index.html", /<ul[^>]*id="Slider-[^"]*__in_evidenza"[^>]*>/, 'data-collezione="laboratorio-ferrara" data-quanti="6"'],
  ["index.html", /<ul[^>]*id="Slider-[^"]*__stabilizzata"[^>]*>/, 'data-collezione="collezione-stabilizzata"'],
];

for (const [file, regex, attributo] of griglie) {
  const percorso = path.join(SITO, file);
  scrivi(percorso, svuotaGriglia(leggi(percorso), regex, 'data-campo="griglia" ' + attributo, file));
}

/* ------------------------------------- 3bis. LA COLLEZIONE DEI KIT */

/* Su Shopify questa collezione non esiste, quindi non c'e una pagina da
   copiare: si ricava da quella degli stabilizzati, che ha la stessa forma, e
   si cambiano solo titolo, descrizione e quali prodotti mostrare. */
{
  const modello = path.join(SITO, "collections", "collezione-stabilizzata", "index.html");
  let kit = leggi(modello);

  kit = cambia(
    kit,
    /<h1 class="collection-hero__title">[\s\S]*?<\/h1>/,
    '<h1 class="collection-hero__title"><span class="visually-hidden">Collezione: </span>Kit fai da te</h1>',
    "collezione kit: titolo"
  );

  kit = cambia(
    kit,
    /<div class="collection-hero__description rte">[\s\S]*?<\/div>/,
    '<div class="collection-hero__description rte">' +
      "<p>Per chi vuole farlo con le proprie mani, a casa sua.</p>" +
      "<p>Dentro c&rsquo;&egrave; tutto quello che serve e le istruzioni le ho scritte io. " +
      "Se ti blocchi a met&agrave;, mi scrivi.</p>" +
      "</div>",
    "collezione kit: descrizione"
  );

  kit = kit.replace(
    /<title>[\s\S]*?<\/title>/,
    "<title>Kit fai da te &ndash; Kokedama &amp; Sculture Naturali</title>"
  );

  /* La pagina da cui copiamo e gia passata dal giro qui sopra: la sua griglia
     e gia vuota e gia marcata. Va solo cambiato quali prodotti chiede,
     altrimenti l'attributo finirebbe scritto due volte e vincerebbe il primo. */
  kit = cambia(
    kit,
    /data-collezione="collezione-stabilizzata"/,
    'data-collezione="kit-fai-da-te"',
    "collezione kit: quali prodotti"
  );

  /* La pagina viene da quella degli stabilizzati, che nel menu si segna come
     pagina corrente: senza questo, stando sui Kit resterebbe sottolineato
     "Stabilizzati". */
  kit = kit.replace(/\s*aria-current="page"/g, "");
  kit = kit.replace(
    'id="HeaderMenu-kit-fai-da-te"',
    'id="HeaderMenu-kit-fai-da-te" aria-current="page"'
  );

  scrivi(path.join(SITO, "collections", "kit-fai-da-te", "index.html"), kit);
}

/* --------------------------------------------------- 4. GLI INDIRIZZI */

/* Ogni /products/<handle> lo serve la stessa pagina modello, che dall'indirizzo
   capisce quale pianta mostrare. Senza questa riga, Netlify risponderebbe 404
   a ogni scheda, perche quelle cartelle non esistono piu. */
scrivi(
  path.join(SITO, "_redirects"),
  ["/products/*  /products/scheda.html  200", "/*           /index.html          404", ""].join("\n")
);

/* --------------------------------------- 5. IL CODICE CHE RIEMPIE LE PAGINE */

scrivi(path.join(SITO, "assets", "catalogo.js"), CATALOGO_JS);

/* Ogni pagina dice da che profondita si trova e dove stanno i dati. La
   configurazione e in chiaro di proposito: la chiave anon di Supabase e
   pubblica per costruzione, a decidere chi puo scrivere sono le regole del
   database, non il fatto che la chiave sia nascosta. */
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "";

const daRiempire = [
  ["index.html", ""],
  ["collections/laboratorio-ferrara/index.html", "../../"],
  ["collections/collezione-stabilizzata/index.html", "../../"],
  ["collections/all/index.html", "../../"],
  ["collections/kit-fai-da-te/index.html", "../../"],
  ["products/scheda.html", "/"],
];

for (const [file, base] of daRiempire) {
  const percorso = path.join(SITO, file);
  let html = leggi(percorso);

  /* Sulla scheda prodotto il vecchio script delle taglie non serve piu:
     adesso le taglie le costruisce catalogo.js, e in due farebbero a pugni. */
  if (file.endsWith("scheda.html")) {
    html = html.replace(/<script src="[^"]*vetrina\.js"[^>]*><\/script>/g, "");
  }

  const configurazione =
    "<script>window.VETRINA=" +
    JSON.stringify({ base, supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_KEY }) +
    "</script>\n" +
    '<script src="' + base + 'assets/catalogo.js" defer></script>\n';

  scrivi(percorso, html.replace("</body>", configurazione + "</body>"));
}

console.log(
  "vetrina-dinamica: modello scheda creato, " + tolte + " copie prodotto rimosse, " +
  griglie.length + " griglie svuotate, " + prodotti.length + " prodotti nei dati"
);
console.log(
  SUPABASE_URL
    ? "  sorgente: Supabase (" + SUPABASE_URL + ")"
    : "  sorgente: dati/prodotti.json (Supabase non ancora configurato)"
);
