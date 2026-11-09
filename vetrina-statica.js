/*
 * vetrina-statica.js
 *
 *   node vetrina-statica.js
 *
 * Fa una copia statica del negozio Shopify dentro `vetrina/`, togliendo tutto
 * cio che senza Shopify non funziona: carrello, pagamenti, ricerca, account,
 * iscrizione alla newsletter. Al loro posto resta un pulsante WhatsApp.
 *
 * Perche copiare invece di rifare: il sito deve essere IDENTICO a quello che
 * Simona ha gia visto e approvato. Rigenerare le pagine dal vecchio prototipo
 * di agosto vorrebbe dire rifare a mano un lavoro di tre settimane e
 * somigliargli soltanto.
 *
 * Il risultato sta in piedi da solo: niente Shopify, niente abbonamento,
 * hosting gratuito. Il negozio vero resta dov'e, spento, pronto a riaprire.
 *
 * ATTENZIONE: il sorgente e il sito pubblicato. Se cambi i testi su Shopify,
 * rilancia questo script, non modificare i file dentro `vetrina/`.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawnSync } = require("child_process");

const ORIGINE = "https://kokedamasculture.myshopify.com";
const USCITA = path.join(__dirname, "vetrina");

/* La rete di salvataggio. Ogni copia riuscita viene messa da parte qui: il
   giorno che l'abbonamento Shopify scade e il negozio si spegne, questo script
   non puo piu scaricare niente, e senza questa cartella il sito non si
   ricostruirebbe mai piu. Con questa, si riparte da qui e non cambia nulla.
   Va tenuta nel progetto, non cancellata per fare spazio. */
const STRUTTURA = path.join(__dirname, "struttura");

/* Si puo forzare il funzionamento senza Shopify, per provare che la rete di
   salvataggio tenga davvero: node vetrina-statica.js --senza-shopify */
const SENZA_SHOPIFY = process.argv.includes("--senza-shopify");
const WHATSAPP = "393478202607";

/* Il dominio definitivo, quando ci sara (senza barra finale). Finche e vuoto,
   gli indirizzi canonici vengono tolti invece di puntare al negozio Shopify. */
const DOMINIO = "";

/* I profili di Simona. Gli indirizzi sono ripuliti dai parametri di
   tracciamento con cui le app li copiano (?cplk=, ?_r=, ?_t=): quelli servono
   a Instagram e TikTok per sapere chi ha condiviso cosa, non a chi clicca. */
const SOCIAL = [
  {
    nome: "Instagram",
    indirizzo: "https://instagram.com/kokedama__sculture_naturali",
    disegno:
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'width="20" height="20" aria-hidden="true" focusable="false">' +
      '<rect x="3" y="3" width="18" height="18" rx="5"/>' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
  },
  {
    nome: "TikTok",
    indirizzo: "https://www.tiktok.com/@kokedamasculturenaturali",
    disegno:
      '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" ' +
      'width="20" height="20" aria-hidden="true" focusable="false">' +
      '<path d="M16.5 3c.3 1.9 1.4 3.4 3.2 3.8v2.6c-1.2.1-2.4-.2-3.4-.8v5.9c0 3.3-2.5 5.5-5.4 5.5' +
      'A5.4 5.4 0 0 1 5.5 14c0-3.2 2.8-5.7 6.1-5.3v2.7c-.3-.1-.7-.2-1-.2-1.5 0-2.7 1.2-2.7 2.8 0 ' +
      '1.5 1.2 2.7 2.7 2.7 1.5 0 2.8-1.1 2.8-2.9V3h3.1z"/></svg>',
  },

  {
    nome: "Facebook",
    indirizzo: "https://www.facebook.com/kokedamasculturenaturali",
    disegno:
      '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" ' +
      'width="20" height="20" aria-hidden="true" focusable="false">' +
      '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 ' +
      '1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>',
  },
];

/* Script del tema che servono alla pagina: menu, gallerie, animazioni.
   Tutto il resto (carrello, ricerca, pagamenti, analytics) viene buttato. */
const SCRIPT_DA_TENERE = [
  "constants.js",
  "pubsub.js",
  "global.js",
  "details-disclosure.js",
  "details-modal.js",
  "animations.js",
  "media-gallery.js",
  "product-modal.js",
];

/* I workshop in terrazzo non si fanno piu: resta solo quello a domicilio.
   Sul negozio Shopify il terrazzo c'e ancora, perche quel negozio e fermo e
   non lo tocchiamo: lo si toglie qui, in fase di copia, cosi ogni
   ricostruzione della vetrina riparte pulita.
   Le frasi sono scritte come stanno nel sorgente, senza accenti sostituiti,
   e se una non si trova piu lo script si ferma invece di far finta. */
const FRASI_TERRAZZO = [
  ["in un terrazzo del centro storico di Ferrara", "nel centro storico di Ferrara"],
  ["a casa tua o nel mio terrazzo in centro a Ferrara", "a casa tua"],
  ["a casa tua o sul terrazzo, in due ore", "a casa tua, in due ore"],
  [" e sul terrazzo segreto", ""],
  ["Ferrara centro · massimo 6 persone", "Ferrara e dintorni, fino a 30 km"],
];

const CONTATTI_VECCHIO =
  "<p>Lavoriamo solo su prenotazione, per tenere l'esperienza intima e tranquilla. Il luogo esatto ti viene svelato dopo la prenotazione.</p><p><strong>Prenota su WhatsApp</strong><br><a href=\"https://wa.me/393478202607\">Scrivici al +39 347 820 2607</a></p><p><strong>Email</strong><br><a href=\"mailto:panico.simona.sp@gmail.com\">panico.simona.sp@gmail.com</a></p><p><strong>Dove siamo</strong><br>Ferrara, centro storico, a pochi passi dal Castello Estense.</p><p>Per ordini, spedizioni, installazioni o eventi scrivici pure: rispondiamo di solito entro uno o due giorni lavorativi.</p>";

const CONTATTI_NUOVO =
  "<p>Faccio tutto su appuntamento, cos&igrave; c&rsquo;&egrave; tempo e nessuno va di fretta. Qui sotto come funziona, una cosa per volta.</p><div class=\"vetrina-schede\"><div class=\"vetrina-scheda\"><h2>I workshop</h2><p>A casa tua, con chi vuoi tu, oppure in una delle location partner in giro per Ferrara.</p><p class=\"vetrina-piccolo\">La data e il posto li scegliamo insieme quando prenoti.</p></div><div class=\"vetrina-scheda\"><h2>I kokedama vivi</h2><p>Te li porto a mano a Ferrara e dintorni, fino a 30 km.</p><p class=\"vetrina-piccolo\">Oppure li ritiri da me su appuntamento: l&rsquo;indirizzo te lo do quando ci accordiamo, perch&eacute; non &egrave; un negozio aperto al pubblico.</p></div><div class=\"vetrina-scheda\"><h2>Gli stabilizzati</h2><p>Quelli viaggiano: li spedisco in tutta Italia.</p><p class=\"vetrina-piccolo\">Ti scrivo appena parte il pacco.</p></div></div><div class=\"vetrina-schede vetrina-schede--due\"><div class=\"vetrina-scheda\"><h2>Scrivimi su WhatsApp</h2><p><a class=\"button\" href=\"https://wa.me/393478202607\">WhatsApp +39 347 820 2607</a></p><p class=\"vetrina-piccolo\">&Egrave; il modo pi&ugrave; veloce: rispondo di solito entro uno o due giorni.</p></div><div class=\"vetrina-scheda\"><h2>Email</h2><p><a href=\"mailto:panico.simona.sp@gmail.com\">panico.simona.sp@gmail.com</a></p><p class=\"vetrina-piccolo\">Per richieste, collaborazioni e ordini personalizzati.</p></div></div>";

const META_VECCHIO =
  "Lavoriamo solo su prenotazione, per tenere l&#39;esperienza intima e tranquilla. Il luogo esatto ti viene svelato dopo la prenotazione.Prenota su WhatsAppScrivici al +39 347 820 2607Emailpanico.simona.sp@gmail.comDove siamoFerrara, centro storico, a pochi passi dal Castello Estense.Per ordini, spedizioni, installazioni o e";

const META_NUOVO =
  "Workshop a casa tua o in una location partner a Ferrara. Kokedama vivi consegnati a mano a Ferrara e dintorni, stabilizzati spediti in tutta Italia. Tutto su appuntamento.";

/* ---------------------------------------------------------------------------
 * Correzioni chieste da Simona dopo aver guardato il sito (27 ottobre 2026).
 * Stanno qui e non nei file gia costruiti: la vetrina si rifa da zero a ogni
 * ricostruzione, e una modifica fatta a mano dentro vetrina/ sparirebbe.
 * ------------------------------------------------------------------------ */
const CORREZIONI_SIMONA = [
  /* La Locanda 22 non c'entra piu con i workshop di adesso. */
  ["i workshop alla Locanda 22 e questo shop", "i workshop in giro per Ferrara e questo shop"],

  /* Shopify aveva copiato quella frase anche nei meta della pagina, tagliata
     a meta parola: "i workshop alla L". Non si vede sul sito, ma si legge su
     Google e nell anteprima dei link su WhatsApp. Va dopo la riga qui sopra:
     nel testo vero la frase e gia stata sostituita, qui resta solo il monco. */
  ["i workshop alla L", "i workshop in giro per Ferrara."],

  /* La colonna si intitola "Kokedama da interno": il seguito parlava di
     piante al femminile. Tutto al maschile, come il resto del sito. */
  [
    "Piante vive, fatte a mano una per una.",
    "Kokedama vivi, fatti a mano uno per uno.",
  ],

  /* I contatti: si diceva "su prenotazione" e "il luogo te lo sveliamo dopo"
     senza dire di cosa si parlasse. Adesso c'e una riga per i workshop, una
     per i kokedama vivi e una per gli stabilizzati. */
  [CONTATTI_VECCHIO, CONTATTI_NUOVO],
  [META_VECCHIO, META_NUOVO],

  /* "Chi sono" parlava di se stessa al plurale, come se dietro ci fosse
     un'azienda: "artigiani italiani", "il nostro workshop", "insieme a noi".
     I kokedama li fa lei e i workshop li tiene lei, quindi tutto al
     singolare. Chiesto da Simona il 28 ottobre. */
  [
    "realizzate a mano da artigiani italiani.",
    "realizzate a mano da me, artigiana italiana.",
  ],
  [
    "crearle con le tue mani durante il nostro workshop</strong>, scegliendo insieme a noi la composizione che pi\u00f9 ti piace.",
    "crearle con le tue mani durante uno dei miei workshop</strong>, scegliendo insieme la composizione che ti piace di pi\u00f9.",
  ],

  /* La firma in fondo prometteva ancora il posto segreto del terrazzo:
     "Ferrara centro, il luogo esatto ti verra svelato dopo la prenotazione".
     Il terrazzo non c'e piu e un negozio non c'e mai stato. */
  [
    "<p><strong>Simona</strong><br>Kokedama Ferrara \u2014 Ferrara centro, solo su prenotazione. Il luogo esatto ti verr\u00e0 svelato dopo la prenotazione.</p>",
    "<p><strong>Simona</strong><br>Kokedama &amp; Sculture Naturali \u2014 Ferrara, tutto su appuntamento.</p>",
  ],

  /* Il pie di pagina diceva ancora "Scrivici", al plurale, e sotto il
     telefono metteva "Ferrara, centro storico", che si legge come
     l'indirizzo di un negozio: un negozio che non c'e, come abbiamo gia
     scritto nei Contatti. Stessa correzione al singolare del 28 ottobre. */
  [
    '<h2 class="footer-block__heading inline-richtext">Scrivici</h2>',
    '<h2 class="footer-block__heading inline-richtext">Scrivimi</h2>',
  ],
  [
    "Ferrara, centro storico &middot; su prenotazione",
    "Ferrara e dintorni &middot; solo su appuntamento",
  ],
];

/* Le pagine da copiare. I prodotti si aggiungono da soli piu sotto. */
const PAGINE_FISSE = [
  "/",
  "/collections/laboratorio-ferrara",
  "/collections/collezione-stabilizzata",
  "/collections/all",
  "/pages/chi-siamo",
  "/pages/contatti",
  "/pages/workshop-kokedama-vivi",
  "/pages/resi-e-rimborsi",
  "/policies/privacy-policy",
  "/policies/refund-policy",
];

/* ------------------------------------------------------------- UTILITA */

const daScaricare = new Map(); // url assoluto -> nome del file locale

/** Taglia un elemento intero, tag di apertura e chiusura compresi. */
function togliElemento(html, nomeTag) {
  const apertura = new RegExp("<" + nomeTag + "(\\s|>)", "i");
  const chiusura = "</" + nomeTag + ">";
  let risultato = html;

  for (let giro = 0; giro < 40; giro++) {
    const m = apertura.exec(risultato);
    if (!m) break;
    const fine = risultato.indexOf(chiusura, m.index);
    if (fine === -1) break;
    risultato = risultato.slice(0, m.index) + risultato.slice(fine + chiusura.length);
  }
  return risultato;
}

/** Taglia un <div> (o <a>, o <form>) partendo da un pezzo del suo tag di
    apertura, contando le aperture annidate fino alla chiusura giusta. */
function togliBlocco(html, inizioTag, tag = "div") {
  let risultato = html;

  for (let giro = 0; giro < 40; giro++) {
    const inizio = risultato.indexOf(inizioTag);
    if (inizio === -1) break;

    /* Dal punto trovato si torna indietro fino all'inizio vero del tag */
    const apre = risultato.lastIndexOf("<" + tag, inizio);
    if (apre === -1) break;

    let i = apre;
    let livello = 0;
    const cercaApre = new RegExp("<" + tag + "(\\s|>)", "ig");
    const cercaChiude = new RegExp("</" + tag + ">", "ig");

    while (i < risultato.length) {
      cercaApre.lastIndex = i;
      cercaChiude.lastIndex = i;
      const a = cercaApre.exec(risultato);
      const c = cercaChiude.exec(risultato);
      if (!c) return risultato; // markup rotto: meglio non toccare niente

      if (a && a.index < c.index) {
        livello++;
        i = a.index + 1;
      } else {
        livello--;
        i = c.index + 1;
        if (livello === 0) {
          risultato = risultato.slice(0, apre) + risultato.slice(c.index + tag.length + 3);
          break;
        }
      }
    }
  }
  return risultato;
}

/** Registra un file del CDN Shopify e restituisce il SOLO nome del file.
    Il percorso lo costruisce chi chiama: dalle pagine serve "../../assets/x",
    da dentro un foglio di stile serve "x" e basta. Tenere il conto qui aveva
    gia prodotto pagine interne senza CSS. */
function registraFile(url) {
  let assoluto = url.startsWith("//") ? "https:" + url : url;
  if (assoluto.startsWith("/")) assoluto = ORIGINE + assoluto;
  if (!/^https?:\/\//.test(assoluto)) return null;

  const pulito = assoluto.split("?")[0];
  let nome = decodeURIComponent(pulito.split("/").pop());
  if (!nome || !nome.includes(".")) return null;

  /* Le immagini arrivano con la dimensione nella query: ne teniamo una sola,
     grande abbastanza per gli schermi normali, e buttiamo il srcset. */
  const estensione = nome.split(".").pop().toLowerCase();
  const immagine = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(estensione);
  const scarica = immagine && /[?&]v=/.test(assoluto) ? pulito + "?width=1600" : assoluto;

  if (!daScaricare.has(nome)) daScaricare.set(nome, { url: scarica });
  return nome;
}

/* Segna quali frasi sono state davvero sostituite: serve a scoprire se un
   testo cambia su Shopify e la regola smette di agganciarsi. */
const frasiUsate = new Set();

/** Toglie il terrazzo: la sezione in home, il blocco nella pagina workshop
    e le frasi sparse che lo nominano. */
function togliIlTerrazzo(html) {
  /* La sezione della home, foto compresa */
  html = togliBlocco(html, '__terrazzo" class="shopify-section', "div");

  /* Nella pagina workshop il blocco va dal suo titolo al titolo dopo */
  const inizio = html.indexOf("<h2>Workshop in terrazzo");
  if (inizio !== -1) {
    const dopo = html.indexOf("<h2>", inizio + 4);
    if (dopo !== -1) {
      html = html.slice(0, inizio) + html.slice(dopo);
      frasiUsate.add("blocco-workshop-terrazzo");
    }
  }

  /* La foto grande in cima alla home e il terrazzo con le persone
     all'aperitivo: e un'immagine vera, caricata nei File di Shopify, non uno
     sfondo CSS. Al suo posto va una pianta. Le classi restano quelle del
     tema, cosi il taglio e la posizione non cambiano. */
  html = html.replace(/<img[^>]*ChatGPT_Image_9_set_2026_00_29_58[^>]*>/gi, (tag) => {
    const classe = (tag.match(/class=['"]([^'"]*)['"]/) || [, ""])[1];
    frasiUsate.add("foto-apertura");
    return (
      '<img src="__FOTO_APERTURA__" alt="Kokedama di ficus ginseng sospeso, legato a mano con lo spago"' +
      (classe ? ' class="' + classe + '"' : "") +
      ' loading="eager">'
    );
  });

  for (const [prima, dopo] of FRASI_TERRAZZO) {
    if (html.includes(prima)) {
      html = html.split(prima).join(dopo);
      frasiUsate.add(prima);
    }
  }
  return html;
}

/* ------------------------------------------------- PULIZIA DI UNA PAGINA */

function ripulisci(html, percorso, prodotto) {
  const sotto = percorso === "/" ? "" : percorso.slice(1); // per i percorsi relativi
  const base = (sotto.match(/\//g) || []).length + (sotto ? 1 : 0);
  const rel = (f) => "../".repeat(base) + "assets/" + f;

  /* 0. Il terrazzo, prima di tutto il resto: cosi se una sezione sparisce
        non restano in giro i suoi pezzi. */
  html = togliIlTerrazzo(html);

  /* 1. Via tutti gli script inline: sono analytics, captcha, pixel, PayPal,
        dati del carrello. Nessuno serve a far vedere la pagina. */
  html = html.replace(/<script(?![^>]*\ssrc=)[^>]*>[\s\S]*?<\/script>/gi, "");

  /* 2. Degli script con src restano solo quelli del tema che muovono la
        pagina. cart.js, product-form.js e compagnia parlerebbero con un
        negozio che non c'e piu. */
  html = html.replace(/<script[^>]*\ssrc=['"]([^'"]+)['"][^>]*>\s*<\/script>/gi, (tutto, src) => {
    const nome = src.split("?")[0].split("/").pop();
    return SCRIPT_DA_TENERE.includes(nome) ? tutto : "";
  });

  /* 3. Gli elementi che sono carrello, ricerca o pagamento. */
  for (const tag of [
    "cart-drawer",
    "cart-notification",
    "cart-drawer-items",
    "product-form",
    "pickup-availability",
    "predictive-search",
    "shopify-payment-button",
    "shopify-accelerated-checkout",
    "shopify-account", // l'omino in testata: porta all'area clienti del negozio
    "product-recommendations",
  ]) {
    html = togliElemento(html, tag);
  }

  /* 4. Le icone in testata: cerca, account, carrello. */
  html = togliBlocco(html, 'class="header__search"', "details-modal");
  html = togliBlocco(html, 'href="/search"', "a");
  html = togliBlocco(html, 'href="/account"', "a");
  html = togliBlocco(html, 'id="cart-icon-bubble"', "a");
  html = togliBlocco(html, 'href="/cart"', "a");

  /* 5. In fondo: iscrizione alla newsletter (manderebbe a Shopify) e le
        icone dei metodi di pagamento, che su una vetrina sono una bugia. */
  html = togliBlocco(html, "footer-block--newsletter");
  html = togliBlocco(html, 'class="footer__payment"');

  /* 5sexies. Le correzioni chieste da Simona il 27 ottobre.

     1) La Locanda 22 non c'entra piu: i workshop si fanno a casa del cliente
        o nelle location partner. Era rimasta scritta in "Chi sono".
     2) "Piante vive, fatte a mano una per una" parlava delle piante (femminile)
        mentre la colonna parla di kokedama (maschile): suonava sbagliato.
     3) I Contatti dicevano "lavoriamo su prenotazione, il luogo te lo diciamo
        dopo" senza dire DI COSA: del workshop? del ritiro? Riscritti per
        intero, una riga per ciascuna cosa, e in prima persona come il resto
        del sito (era l'unica pagina che diceva "noi"). */
  for (const [prima, dopo] of CORREZIONI_SIMONA) {
    if (html.includes(prima)) {
      html = html.split(prima).join(dopo);
      frasiUsate.add(prima);
    }
  }


  /* 5septies. Il workshop nelle location partner: 75 euro a persona, aperitivo
        o colazione compresi. Prezzo dato da Simona il 28 ottobre; prima la
        pagina mostrava solo quello a domicilio, e le location comparivano
        nell'illustrazione senza che si capisse quanto costassero. */
  if (percorso === "/pages/workshop-kokedama-vivi") {
    const ancoraAltri = "<h2>Altri servizi su prenotazione</h2>";
    if (!html.includes(ancoraAltri)) {
      throw new Error("workshop: non trovo dove inserire il blocco delle location");
    }
    html = html.replace(ancoraAltri, "<h2>Workshop in una location partner &mdash; 75 &euro; a persona</h2><p>Ci vediamo in uno dei posti con cui collaboro a Ferrara: un bar, un ristorante, un parco. Porto io tutto l&rsquo;occorrente, tu porti solo le mani.</p><p><strong>Nel prezzo &egrave; compreso l&rsquo;aperitivo o la colazione</strong>, a seconda dell&rsquo;ora e del posto. E il kokedama che fai te lo porti a casa, con il bigliettino di cura.</p><p><a class=\"button\" href=\"https://wa.me/393478202607?text=Ciao%20Simona!%20Vorrei%20sapere%20le%20prossime%20date%20del%20workshop%20in%20una%20location%20a%20Ferrara.\">Chiedi le prossime date su WhatsApp</a></p>" + ancoraAltri);
  }

  /* 5ter. I due formati del workshop, in cima alla pagina: si capisce a
        colpo d'occhio dove si fa, senza leggere.
        Nota: il testo di partenza diceva "in giro per Milano". Simona lavora
        a Ferrara, e l'illustrazione stessa dice Ferrara: era un refuso di un
        appunto scritto per un altro contesto. */
  if (percorso === "/pages/workshop-kokedama-vivi") {
    const formati =
      '<div class="vetrina-formati">' +
      '<figure><img src="/immagini/workshop-a-casa-tua.jpg" alt="Illustrazione: una casa con tre kokedama su una mensola e gli attrezzi del laboratorio">' +
      "<figcaption>A casa tua, con chi vuoi tu</figcaption></figure>" +
      '<figure><img src="/immagini/workshop-in-giro-per-ferrara.jpg" alt="Illustrazione: una tazza, un fiore di loto e un kokedama sotto un segnaposto di mappa">' +
      "<figcaption>Oppure ci vediamo in una delle location partner in giro per Ferrara</figcaption></figure>" +
      "</div>";

    /* L'apertura diceva solo "a casa tua": con due formati diventava falsa. */
    const aperturaVecchia = "Te lo insegno io, a casa tua.</p>";
    const aperturaNuova =
      "Te lo insegno io: a casa tua, o in una delle location partner in giro per Ferrara.</p>";
    if (!html.includes(aperturaVecchia)) {
      throw new Error("workshop: non trovo la frase di apertura da aggiornare");
    }
    html = html.replace(aperturaVecchia, aperturaNuova + formati + "<figure class=\"vetrina-video\"><video src=\"/immagini/workshop-kokedama.mp4\" autoplay muted loop playsinline controls preload=\"auto\" width=\"480\" height=\"480\" aria-label=\"Due mani legano una sfera di muschio attorno a una pianta: crea, lega, sospendi, respira\"></video><figcaption>Quello che si fa in due ore, in cinque secondi.</figcaption></figure>");
  }

  /* 5quinquies. In fondo alla collezione dei vivi: la frase diventa un invito
        diretto, e sotto ci va il pulsante. Prima la frase finiva li, senza
        niente da toccare: chi voleva una pianta diversa doveva cercarsi i
        contatti da solo. */
  const frasePreparo = "Me la dici e te la preparo.";
  if (html.includes(frasePreparo)) {
    html = html.replace(
      frasePreparo,
      "Dimmi quale vuoi e te la preparo io.</p>" +
        '<p><a class="button" href="https://wa.me/' + WHATSAPP +
        '?text=' +
        encodeURIComponent("Ciao Simona! Vorrei un kokedama con una pianta che non vedo sul sito. Si può fare?") +
        '" target="_blank" rel="noopener">Chiedimi una pianta su WhatsApp</a>'
    );
  }

  /* 5quater. La voce "Kit fai da te" nel menu, dopo "Stabilizzati". Il menu
        arriva da Shopify e li la voce non c'e: si aggiunge qui, su ogni
        pagina. Chi non sa curare una pianta compra il kit, chi la vuole gia
        pronta compra il kokedama: tenerli separati aiuta tutti e due. */
  const voceKit =
    '<li><a id="HeaderMenu-kit-fai-da-te" href="/collections/kit-fai-da-te" ' +
    'class="header__menu-item list-menu__item link link--text focus-inset">' +
    "<span>Kit fai da te</span></a></li>";
  const dopoStabilizzati = /(>Stabilizzati<\/span>\s*<\/a><\/li>)/g;
  if (dopoStabilizzati.test(html)) {
    html = html.replace(dopoStabilizzati, "$1" + voceKit);
  }

  /* 5bis. Instagram, TikTok e Facebook, sotto i contatti. Vanno messi qui e non su
        Shopify: quel negozio e fermo, la vetrina e il sito vero. Le classi
        sono quelle di Dawn, cosi li disegna il CSS che c'e gia. */
  const elenco =
    '<ul class="list-social list-unstyled vetrina-social">' +
    SOCIAL.map(
      (s) =>
        '<li class="list-social__item"><a href="' + s.indirizzo + '" class="link list-social__link" ' +
        'target="_blank" rel="noopener" aria-label="' + s.nome + ' (si apre in una nuova scheda)">' +
        s.disegno + '<span class="visually-hidden">' + s.nome + "</span></a></li>"
    ).join("") +
    "</ul>";

  const ancoraSocial = "Ferrara e dintorni &middot; solo su appuntamento</p>";
  if (html.includes(ancoraSocial)) {
    html = html.replace(ancoraSocial, ancoraSocial + elenco);
  } else if (html.includes("footer-block__heading")) {
    throw new Error(
      "il pie di pagina c'e ma la riga a cui agganciare i social no:\n" +
      "  cercavo " + JSON.stringify(ancoraSocial) + "\n" +
      "  se il testo e cambiato su Shopify, aggiorna ancoraSocial qui sopra."
    );
  }

  /* 6. Il selettore della taglia resta a vedersi ma smette di essere un
        componente vivo: cosi non prova a ricaricare la scheda da Shopify. */
  html = html
    .replace(/<variant-selects/gi, '<div data-vetrina-taglie="1"')
    .replace(/<\/variant-selects>/gi, "</div>")
    .replace(/<variant-radios/gi, '<div data-vetrina-taglie="1"')
    .replace(/<\/variant-radios>/gi, "</div>");

  /* 7. Quantita: senza carrello non vuol dire niente. */
  html = togliBlocco(html, 'product-form__input product-form__quantity');

  /* 7bis. "Imposte incluse." e una frase da negozio che incassa. Qui non si
     incassa niente e la posizione fiscale e ancora da decidere: meglio non
     scrivere sul sito una cosa che non sappiamo ancora se e vera. */
  html = html.replace(/<div class="product__tax[^"]*">[\s\S]*?<\/div>/g, "");

  /* 8. Il pulsante WhatsApp va dove stava "Aggiungi al carrello". */
  if (prodotto) {
    const messaggio =
      "Ciao Simona! Ho visto " +
      prodotto.titolo +
      " sul sito e mi interessa. Sarebbe la taglia TAGLIA. E disponibile?";
    const bottone =
      '\n<div class="vetrina-ordine">\n' +
      '  <a class="button button--full-width" target="_blank" rel="noopener"\n' +
      '     data-vetrina-whatsapp="' +
      encodeURIComponent(messaggio) +
      '"\n     href="https://wa.me/' +
      WHATSAPP +
      "?text=" +
      encodeURIComponent(messaggio.replace("TAGLIA", prodotto.taglie[0] || "")) +
      '">Ordina su WhatsApp</a>\n' +
      '  <p class="vetrina-nota">Ti rispondo io, di persona. Ti dico se &egrave; pronto, ' +
      "quanto ci metto e come te lo faccio avere.</p>\n" +
      "</div>\n";
    html = html.replace(/(<\/noscript>\s*)?(<div class="product__description)/, bottone + "$2");
    if (!html.includes("vetrina-ordine")) {
      /* Se la descrizione non c'e, il pulsante va dopo il prezzo. */
      html = html.replace(/(<div[^>]*class="product__info-container[^"]*"[^>]*>)/, "$1" + bottone);
    }
  }

  /* 9. I file del CDN diventano file locali: fogli di stile, script del tema,
        foto e anche i caratteri, che stanno in /cdn/fonts/ e la prima volta
        erano rimasti fuori. Il srcset se ne va: una sola immagine per foto,
        piu che sufficiente e molto piu semplice. */
  html = html.replace(/\s(?:srcset|imagesrcset)=['"][^'"]*['"]/gi, "");
  html = html.replace(/(href|src)=['"]([^'"]*(?:cdn\.shopify\.com|\/cdn\/)[^'"]*)['"]/gi, (tutto, attr, url) => {
    const nome = registraFile(url);
    return nome ? attr + '="' + rel(nome) + '"' : tutto;
  });

  /*  9bis. I caratteri del tema stanno in un @font-face dentro uno <style>
         scritto nella pagina, non in un foglio esterno: li gli indirizzi
         restavano quelli di Shopify e il browser li rifiutava (CORS), cosi
         il sito ripiegava sui caratteri di sistema. */
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (blocco) =>
    blocco.replace(/url\((['"]?)([^'")]+)\1\)/gi, (tutto, virg, url) => {
      if (url.startsWith("data:")) return tutto;
      const nome = registraFile(url);
      return nome ? 'url("' + rel(nome) + '")' : tutto;
    })
  );

  /* 10. I collegamenti di servizio a Shopify: preconnect ai suoi server,
         canonical e og:url che puntano al negozio. Se restassero, i motori
         di ricerca manderebbero la gente a un negozio spento. Quando ci sara
         un dominio, basta riempire DOMINIO qui sopra e tornano scritti bene. */
  /* L'ordine degli attributi cambia da un tag all'altro, quindi si guarda
     il tag intero invece di pretendere rel prima di href. */
  html = html.replace(/<link[^>]*>/gi, (tag) => {
    const servizio = /rel=['"](?:preconnect|dns-prefetch)['"]/i.test(tag) && /shopify/i.test(tag);
    const oembed = /oembed/i.test(tag); // rimanda alla scheda sul negozio
    return servizio || oembed ? "" : tag;
  });
  if (DOMINIO) {
    html = html.replace(new RegExp(ORIGINE, "g"), DOMINIO);
  } else {
    html = html.replace(/<link[^>]*rel=['"]canonical['"][^>]*>/gi, "");
    html = html.replace(/<meta[^>]*property=['"]og:url['"][^>]*>/gi, "");
  }

  /* 10bis. La foto che sostituisce il terrazzo in apertura: il percorso si
         sa solo qui, dove si conosce la profondita della pagina. */
  html = html.replace("__FOTO_APERTURA__", "/immagini/apertura-ficus-sospeso.webp");

  /* 11. I nostri due file: lo stile della vetrina e lo script della taglia. */
  html = html.replace(
    "</head>",
    '  <link rel="stylesheet" href="' + rel("vetrina.css") + '">\n</head>'
  );
  html = html.replace(
    "</body>",
    '  <script src="' + rel("vetrina.js") + '" defer></script>\n</body>'
  );

  return html;
}

/* ------------------------------------------------------------- ESECUZIONE */

const NOME_PROGRAMMA = "Mozilla/5.0 (copia vetrina kokedama)";

/* Davanti al negozio c'e un filtro di Cloudflare che non guarda solo cosa
   chiedi, ma come ti presenti, fin dentro la stretta di mano cifrata. Le
   richieste di Node ricevono 429 "local_rate_limited" anche quando sono la
   prima della giornata; curl, dalla stessa macchina, con lo stesso nome e
   nello stesso istante, riceve 200. Non e una gara da vincere aggiungendo
   intestazioni: le ho provate tutte, anche il modulo https al posto di
   fetch, e il risultato non cambia.
   Quindi si scarica con curl, che su Windows c'e da anni ed e gia usato
   altrove in questo progetto. fetch resta come riserva per le macchine che
   curl non ce l'hanno. */
const CURL = (() => {
  const prova = spawnSync("curl", ["--version"], { encoding: "utf8" });
  return prova.status === 0;
})();

const SCARICHI = fs.mkdtempSync(path.join(os.tmpdir(), "vetrina-"));

/* Quanto aspettare quando Shopify dice "rallenta": lo dice lui stesso
   nell'intestazione Retry-After, in secondi. Se non lo dice, un minuto. */
function quantoAspettare(secondiDetti) {
  const detto = Number(secondiDetti);
  return (detto > 0 ? Math.min(detto, 120) : 60) * 1000;
}

/** Una richiesta sola, senza riprovare: { codice, dati, attesa }. */
async function unaRichiesta(url, binario) {
  if (CURL) {
    const file = path.join(SCARICHI, "scarico");
    const esito = spawnSync(
      "curl",
      ["-s", "-L", "--max-time", "60", "-A", NOME_PROGRAMMA,
       "-D", file + ".testa", "-o", file, "-w", "%{http_code}", url],
      { encoding: "utf8" }
    );
    if (esito.status !== 0) {
      throw new Error(url + " -> curl non ha funzionato: " + (esito.stderr || esito.status));
    }
    const testa = fs.readFileSync(file + ".testa", "utf8");
    const detto = /retry-after:\s*(\d+)/i.exec(testa);
    const dati = fs.readFileSync(file);
    return {
      codice: Number(esito.stdout.trim()),
      dati: binario ? dati : dati.toString("utf8"),
      attesa: detto && detto[1],
    };
  }

  const r = await fetch(url, { headers: { "User-Agent": NOME_PROGRAMMA } });
  return {
    codice: r.status,
    dati: binario ? Buffer.from(await r.arrayBuffer()) : await r.text(),
    attesa: r.headers.get("retry-after"),
  };
}

async function prendi(url, binario = false) {
  /* Una copia intera sono un centinaio di richieste di fila: se un giorno
     Shopify ne ha abbastanza davvero, risponde 429 e qui si aspetta invece
     di fermarsi. Senza questa attesa la ricostruzione si interrompeva a
     meta e lasciava la cartella vetrina/ con dentro mezzo sito. */
  for (let tentativo = 1; ; tentativo++) {
    const r = await unaRichiesta(url, binario);
    if (r.codice === 200) return r.dati;
    if (r.codice !== 429 || tentativo > 4) {
      throw new Error(url + " -> HTTP " + r.codice);
    }
    const attesa = quantoAspettare(r.attesa);
    console.log(
      "  Shopify chiede di rallentare: aspetto " + attesa / 1000 +
      "s e riprovo (" + tentativo + " di 4)"
    );
    await new Promise((f) => setTimeout(f, attesa));
  }
}

function scrivi(percorsoRelativo, contenuto) {
  const completo = path.join(USCITA, percorsoRelativo);
  fs.mkdirSync(path.dirname(completo), { recursive: true });
  fs.writeFileSync(completo, contenuto);
}

/** Il negozio risponde ancora? Una domanda sola, con poca pazienza: se non
    risponde non e un errore, e il giorno in cui si usa la copia salvata. */
async function negozioAcceso() {
  if (SENZA_SHOPIFY) return false;

  /* Piu tentativi e non uno solo. Il 30 ottobre Shopify ha risposto "429,
     troppe richieste" dopo qualche ricostruzione ravvicinata: lo script
     l'ha scambiato per un negozio spento e ha rifatto il sito dalla copia
     vecchia, buttando via le correzioni di quel giorno senza un errore.
     Adesso si distinguono tre casi diversi, perche vogliono tre risposte
     diverse:
       - risponde                -> si scarica tutto, come sempre;
       - risponde "aspetta"      -> si aspetta, e se insiste ci si ferma:
                                    meglio nessuna ricostruzione che una
                                    ricostruzione muta sulla copia vecchia;
       - non risponde del tutto  -> il negozio e spento davvero, si usa la
                                    rete di salvataggio. */
  const attese = [60000, 60000, 90000];

  for (let tentativo = 0; tentativo <= attese.length; tentativo++) {
    let risposta = null;
    try {
      risposta = await unaRichiesta(ORIGINE + "/products.json?limit=1", false);
    } catch (e) {
      console.log("  Shopify non ha risposto: " + e.message);
      if (tentativo === attese.length) return false;
      await new Promise((r) => setTimeout(r, attese[tentativo]));
      continue;
    }

    if (risposta.codice === 200) return true;

    /* 429 = troppe richieste, 5xx = Shopify ha un problema suo. In tutti e
       due i casi il negozio c'e, sta solo chiedendo di riprovare. */
    const passeggero = risposta.codice === 429 || risposta.codice >= 500;
    if (!passeggero) {
      console.log("  Shopify risponde " + risposta.codice + ": negozio spento.");
      return false;
    }

    if (tentativo === attese.length) {
      throw new Error(
        "Shopify risponde " + risposta.codice + " (troppe richieste ravvicinate).\n" +
        "  Il negozio e acceso, sta solo chiedendo di rallentare: aspetta\n" +
        "  qualche minuto e rilancia. Non ricostruisco dalla copia salvata,\n" +
        "  altrimenti le modifiche di oggi sparirebbero senza accorgersene."
      );
    }
    /* Quanto aspettare lo decide lui, non noi: continuare a bussare prima
       del tempo fa ripartire il conto da capo e non si esce piu. */
    const attesa = Math.max(quantoAspettare(risposta.attesa), attese[tentativo]);
    console.log(
      "  Shopify dice di aspettare (" + risposta.codice + "): riprovo fra " +
      attesa / 1000 + " secondi."
    );
    await new Promise((r) => setTimeout(r, attesa));
  }
  return false;
}

function svuota(cartella) {
  fs.mkdirSync(cartella, { recursive: true });
  for (const voce of fs.readdirSync(cartella)) {
    fs.rmSync(path.join(cartella, voce), { recursive: true, force: true, maxRetries: 10, retryDelay: 150 });
  }
}

async function main() {
  /* Niente Shopify: si riparte dalla copia salvata l'ultima volta. */
  if (!(await negozioAcceso())) {
    if (!fs.existsSync(path.join(STRUTTURA, "index.html"))) {
      throw new Error(
        "il negozio non risponde e non c'e nessuna copia salvata in struttura/.\n" +
        "  Senza una delle due cose la vetrina non si puo ricostruire."
      );
    }
    svuota(USCITA);
    fs.cpSync(STRUTTURA, USCITA, { recursive: true });
    /* La nota e per noi, non per chi visita: non deve finire pubblicata. */
    fs.rmSync(path.join(USCITA, "QUANDO.txt"), { force: true });
    const quante = fs.readdirSync(USCITA).length;
    console.log(
      (SENZA_SHOPIFY ? "forzato senza Shopify" : "Shopify non risponde") +
      ": ricostruito da struttura/ (" + quante + " voci).\n" +
      "Le pagine sono quelle dell'ultima copia riuscita; i prodotti arrivano\n" +
      "comunque da contenuti/ e li aggiorna vetrina-dinamica.js."
    );
    return;
  }

  /* Si svuota il contenuto, non si cancella la cartella: su Windows basta
     che un terminale o un server la stia guardando e la rimozione fallisce. */
  svuota(USCITA);

  /* I prodotti li chiede il sito stesso: cosi non c'e un elenco da aggiornare
     a mano ogni volta che Simona ne pubblica uno nuovo. */
  const catalogo = JSON.parse(await prendi(ORIGINE + "/products.json?limit=250"));
  const prodotti = catalogo.products.map((p) => ({
    percorso: "/products/" + p.handle,
    titolo: p.title,
    taglie: p.variants.map((v) => v.title).filter((t) => t !== "Default Title"),
    prezzi: Object.fromEntries(p.variants.map((v) => [v.title, v.price])),
  }));

  const pagine = [...PAGINE_FISSE.map((p) => ({ percorso: p })), ...prodotti];
  const prezziPerPagina = {};

  for (const pagina of pagine) {
    const html = await prendi(ORIGINE + pagina.percorso);
    const pulito = ripulisci(html, pagina.percorso, pagina.titolo ? pagina : null);
    const dove = pagina.percorso === "/" ? "index.html" : pagina.percorso.slice(1) + "/index.html";
    scrivi(dove, pulito);
    if (pagina.prezzi) prezziPerPagina[pagina.percorso] = pagina.prezzi;
    console.log("  pagina  " + pagina.percorso);
  }

  /* I CSS vanno letti a loro volta: dentro hanno altre immagini e i caratteri. */
  const fogli = [...daScaricare.entries()].filter(([nome]) => nome.endsWith(".css"));
  for (const [nome, info] of fogli) {
    let css = await prendi(info.url);

    /* Le regole che caricano una foto del terrazzo spariscono del tutto:
       la sezione che le usava non c'e piu e il file non viene copiato. */
    css = css.replace(/[^{}]*\{[^}]*terrazzo-[^}]*\}/g, "");
    /* Dentro un foglio di stile gli indirizzi sono relativi al foglio, che
       sta gia in assets/: basta il nome del file. */
    css = css.replace(/url\((['"]?)([^'")]+)\1\)/gi, (tutto, virg, url) => {
      if (url.startsWith("data:") || url.startsWith("#")) return tutto;
      /* Dentro i CSS di Dawn ci sono anche indirizzi relativi ("./sparkle.gif"):
         vanno risolti rispetto al foglio che li contiene, altrimenti restano
         fuori dalla copia e il file manca. */
      const nome = registraFile(new URL(url, info.url).href);
      return nome ? 'url("' + nome + '")' : tutto;
    });
    scrivi("assets/" + nome, css);
    daScaricare.delete(nome);
  }

  let scaricati = 0;
  for (const [nome, info] of daScaricare) {
    try {
      scrivi("assets/" + nome, await prendi(info.url, true));
      scaricati++;
    } catch (e) {
      console.warn("  ! non scaricato: " + nome + " (" + e.message + ")");
    }
  }

  /* Le illustrazioni delle pagine (non dei prodotti: quelle le gestisce
     contenuti-estrai.js). Sono nostre, non arrivano da Shopify. */
  const immagini = path.join(__dirname, "contenuti", "immagini");
  let quanteImmagini = 0;
  if (fs.existsSync(immagini)) {
    for (const nome of fs.readdirSync(immagini)) {
      scrivi(path.join("immagini", nome), fs.readFileSync(path.join(immagini, nome)));
      quanteImmagini++;
    }
  }

  scrivi("assets/vetrina.css", STILE);
  scrivi("assets/vetrina.js", SCRIPT.replace("/*PREZZI*/", JSON.stringify(prezziPerPagina)));
  /* Un indirizzo sbagliato riporta alla home, ma con lo stato 404: cosi chi
     ci arriva vede un sito e non una pagina di errore di Netlify, e i motori
     di ricerca capiscono lo stesso che quella pagina non esiste. */
  scrivi("_redirects", "/*  /index.html  404\n");

  /* Qui dentro non c'e niente da compilare: sono pagine gia pronte.
     Senza questo file Netlify cercherebbe un progetto da costruire. */
  scrivi(
    "netlify.toml",
    [
      "# Vetrina statica: nessuna compilazione, si pubblica la cartella com'e.",
      "[build]",
      '  publish = "."',
      "",
      "[[headers]]",
      '  for = "/*"',
      "  [headers.values]",
      '    X-Frame-Options = "DENY"',
      '    X-Content-Type-Options = "nosniff"',
      '    Referrer-Policy = "strict-origin-when-cross-origin"',
      "",
    ].join("\n")
  );

  /* Se una frase sul terrazzo non si aggancia piu, meglio saperlo subito:
     vorrebbe dire che il testo su Shopify e cambiato e che in vetrina il
     terrazzo e rimasto scritto da qualche parte. */
  const mancate = FRASI_TERRAZZO.map(([f]) => f).filter((f) => !frasiUsate.has(f));
  if (!frasiUsate.has("blocco-workshop-terrazzo")) {
    throw new Error("il blocco del workshop in terrazzo non e stato trovato");
  }

  console.log(
    "\nvetrina/: " + pagine.length + " pagine, " + (scaricati + fogli.length) + " file copiati"
  );
  console.log("terrazzo tolto: sezione home, blocco workshop, " + (FRASI_TERRAZZO.length - mancate.length) + " frasi");
  if (mancate.length) {
    console.warn("  ! frasi non trovate (testo cambiato su Shopify?):\n    " + mancate.join("\n    "));
  }

  /* La copia riuscita si mette da parte. Si salva SOLO adesso, a lavoro
     finito: se qualcosa fosse andato storto piu sopra, lo script si e gia
     fermato e la copia buona di prima e rimasta intatta. */
  svuota(STRUTTURA);
  fs.cpSync(USCITA, STRUTTURA, { recursive: true });
  fs.writeFileSync(
    path.join(STRUTTURA, "QUANDO.txt"),
    [
      "Copia della struttura del sito, presa da Shopify il " +
        new Date().toLocaleString("it-IT"),
      "",
      "A cosa serve: se il negozio Shopify si spegne, vetrina-statica.js non",
      "puo piu scaricare niente e riparte da questa cartella. Senza, il sito",
      "non si ricostruisce piu.",
      "",
      "Non si modifica a mano: la riscrive vetrina-statica.js a ogni copia",
      "riuscita. Per provare che funzioni:  node vetrina-statica.js --senza-shopify",
      "",
    ].join("\n"),
    "utf8"
  );
  console.log("struttura/: copia di sicurezza aggiornata (serve se Shopify si spegne)");
}

/* ------------------------------------------------------- I NOSTRI DUE FILE */

const STILE = `/* Aggiunte della vetrina. Tutto il resto e il tema vero. */

.vetrina-ordine {
  margin: 2.4rem 0 1.2rem;
}

/* Il pulsante WhatsApp prende il posto di "Aggiungi al carrello": stesso
   peso visivo, perche e l'unica azione rimasta sulla pagina. */
.vetrina-ordine .button {
  width: 100%;
  min-height: 5.2rem;
}

.vetrina-nota {
  margin-top: 1.2rem;
  font-size: 1.4rem;
  line-height: 1.6;
  opacity: 0.75;
}

/* Senza il form, il selettore della taglia resta senza respiro sotto. */
[data-vetrina-taglie] fieldset {
  margin-bottom: 1.6rem;
}

/* Tutte le schede della stessa forma: la griglia deve essere dritta, con i
   titoli allineati. Lasciare che ogni foto dettasse la sua altezza aveva
   prodotto una scacchiera, perche le foto dei sospesi sono piu allungate di
   quelle delle piante appoggiate. Chi guarda vede prima il disordine della
   griglia che le piante. */
.card-wrapper .card__inner {
  aspect-ratio: 3 / 4;
}

/* I riquadri dei Contatti. Il disegno approvato da Simona mette ogni cosa
   nella sua scatola, cosi si legge una per volta invece che tutto di fila.
   I colori sono quelli del sito, non quelli del disegno: li erano scritti a
   mano e non andavano d'accordo con il resto delle pagine. */
.vetrina-schede {
  display: grid;
  gap: 1.6rem;
  margin: 3.2rem 0;
}

@media screen and (min-width: 750px) {
  .vetrina-schede {
    grid-template-columns: repeat(3, 1fr);
  }

  /* La pagina Contatti ha un contenitore stretto, pensato per il testo:
     i riquadri ci stavano a 231px l uno, illeggibili. Qui escono dal
     contenitore e arrivano a 1100px, come nel disegno approvato. */
  .vetrina-schede {
    width: min(110rem, 100vw - 4.8rem);
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .vetrina-schede--due {
    grid-template-columns: 1.2fr 0.8fr;
  }
}

.vetrina-scheda {
  background: #f4f1ea;
  border-radius: 1.8rem;
  padding: 2.8rem;
}

.vetrina-scheda h2 {
  font-size: 2.4rem;
  margin: 0 0 1.2rem;
}

.vetrina-scheda p {
  margin: 0 0 1.2rem;
}

.vetrina-scheda p:last-child {
  margin-bottom: 0;
}

.vetrina-piccolo {
  font-size: 1.4rem;
  line-height: 1.6;
  opacity: 0.75;
}

.vetrina-scheda .button {
  margin-top: 0.4rem;
}

/* I due formati del workshop, uno accanto all'altro su schermo largo e uno
   sotto l'altro sul telefono. */
.vetrina-formati {
  display: grid;
  gap: 2.4rem;
  margin: 3.2rem 0 4.8rem;
}

@media screen and (min-width: 750px) {
  .vetrina-formati {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

.vetrina-formati figure {
  margin: 0;
}

/* Le illustrazioni hanno il fondo bianco e la pagina e color crema: senza
   questo si vedrebbero due rettangoli bianchi appiccicati sopra. Il
   "multiply" fa sparire il bianco e lascia solo il disegno. */
.vetrina-formati img {
  display: block;
  width: 100%;
  height: auto;
  mix-blend-mode: multiply;
}

.vetrina-formati figcaption {
  margin-top: 0.8rem;
  font-family: var(--font-heading-family);
  font-size: 1.9rem;
  line-height: 1.4;
}

/* Il video del laboratorio. E girato a 480x480: oltre quella misura si
   sgrana, quindi non lo si allarga mai piu di cosi, nemmeno su schermi
   grandi. Il bordo tondo e lo stesso dei riquadri dei contatti. */
.vetrina-video {
  margin: 0 0 4.8rem;
  max-width: 48rem;
}

.vetrina-video video {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 1.8rem;
  background: #e8e3d8;
}

.vetrina-video figcaption {
  margin-top: 0.8rem;
  font-family: var(--font-heading-family);
  font-size: 1.9rem;
  line-height: 1.4;
}

/* Instagram e TikTok sotto i contatti: il disegno lo fa gia Dawn con
   .list-social, qui serve solo staccarli dal testo sopra. */
.footer .vetrina-social.list-social {
  display: flex;
  gap: 0.4rem;
  margin-top: 1.2rem;
  /* Dawn centra le icone social; qui la colonna e allineata a sinistra
     come il testo sopra, e centrarle le faceva sembrare fuori posto. */
  justify-content: flex-start;
  margin-left: -0.8rem;
}

/* L'apertura della home era la foto del terrazzo, con le persone
   all'aperitivo. Via anche quella: al suo posto una pianta, che poi e la cosa
   che si vende. Quattro classi per battere la regola del tema, come tutte le
   altre foto di sfondo (vedi la trappola 21 in AGENTS.md).
   Le foto terrazzo-*.jpg non vengono nemmeno piu copiate. */
[id$="__banner"] .image-with-text__media.background-transparent.global-media-settings {
  background-image: url("../immagini/apertura-ficus-sospeso.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* La foto della pianta e verticale (1024x1536), l'apertura di Dawn e una
   fascia larga e bassa: dentro 752x357 si vedeva solo una striscia ingrandita
   del tronco. Si alza il riquadro, cosi la pianta ci sta quasi tutta.
   Quattro classi perche la regola di Dawn sull'altezza ne ha tre. */
[id$="__banner"] .image-with-text__media.background-transparent.global-media-settings {
  height: 68rem;
}

[id$="__banner"] .image-with-text__media img {
  object-position: center 55%;
}

@media screen and (max-width: 749px) {
  [id$="__banner"] .image-with-text__media.background-transparent.global-media-settings {
    height: 42rem;
  }
}
`;

const SCRIPT = `/* Vetrina senza Shopify: la taglia cambia il prezzo e il messaggio WhatsApp.
   Lo faceva il tema parlando col negozio; qui sono quindici righe. */
(function () {
  var PREZZI = /*PREZZI*/;
  var listino = PREZZI[location.pathname.replace(/\\/$/, "")] || {};

  var bottone = document.querySelector("[data-vetrina-whatsapp]");
  var radio = document.querySelectorAll('[data-vetrina-taglie] input[type="radio"]');
  if (!bottone || !radio.length) return;

  function euro(valore) {
    return "€" + Number(valore).toFixed(2).replace(".", ",") + " EUR";
  }

  function aggiorna() {
    var scelta = document.querySelector('[data-vetrina-taglie] input[type="radio"]:checked');
    if (!scelta) return;
    var taglia = scelta.value;

    document.querySelectorAll(".product__info-container .price-item--regular").forEach(function (e) {
      if (listino[taglia]) e.textContent = euro(listino[taglia]);
    });

    var testo = decodeURIComponent(bottone.dataset.vetrinaWhatsapp).replace("TAGLIA", taglia);
    bottone.href = "https://wa.me/${WHATSAPP}?text=" + encodeURIComponent(testo);
  }

  radio.forEach(function (r) { r.addEventListener("change", aggiorna); });
  aggiorna();
})();

/* Chi ha chiesto meno animazioni nelle impostazioni del sistema non si
   ritrova un video che parte da solo: resta fermo, con i comandi per
   avviarlo se lo vuole. */
(function () {
  if (!window.matchMedia) return;
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll("video[autoplay]").forEach(function (video) {
    video.autoplay = false;
    video.loop = false;
    video.pause();
  });
})();
`;

main().catch((e) => {
  console.error("\nfermato: " + e.message);
  process.exit(1);
});
