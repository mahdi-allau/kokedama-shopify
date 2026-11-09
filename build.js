/**
 * Generatore statico del prototipo.
 * Uso:  node build.js
 * Compone le pagine unendo header/footer condivisi ai contenuti definiti qui sotto.
 * Quando si passa a Shopify, header/footer diventano sections del tema
 * e i contenuti diventano template Liquid.
 */
const fs = require("fs");
const path = require("path");

const BRAND = "Kokedama";        // <-- sostituire con il nome definitivo del brand
const PAYOFF = "Giardini sospesi";
const EMAIL = "info@esempio.it";

const NAV = [
  ["index.html", "Home"],
  ["shop.html", "Shop"],
  ["chi-siamo.html", "Chi siamo"],
  ["cura.html", "Cura"],
  ["spedizioni.html", "Spedizioni"],
  ["faq.html", "FAQ"],
  ["contatti.html", "Contatti"],
];

const PRODOTTI = [
  { slug: "felce", nome: "Felce di bosco", prezzo: "38,00", nota: "Foto prodotto 1", badge: "Disponibile" },
  { slug: "ficus", nome: "Ficus ginseng", prezzo: "45,00", nota: "Foto prodotto 2", badge: "Disponibile" },
  { slug: "asplenium", nome: "Asplenium", prezzo: "42,00", nota: "Foto prodotto 3", badge: "Ultimi pezzi" },
  { slug: "pothos", nome: "Pothos", prezzo: "32,00", nota: "Foto prodotto 4", badge: "Disponibile" },
  { slug: "muschio", nome: "Muschio e pietra", prezzo: "36,00", nota: "Foto prodotto 5", badge: "Su ordinazione" },
  { slug: "orchidea", nome: "Orchidea", prezzo: "58,00", nota: "Foto prodotto 6", badge: "Disponibile" },
];

const menuVoci = (attivo, cls) =>
  NAV.map(([href, testo]) =>
    `<li><a href="${href}"${href === attivo ? ' aria-current="page"' : ""}>${testo}</a></li>`
  ).join("\n        ");

const header = (attivo) => `  <a class="skip" href="#contenuto">Vai al contenuto</a>
  <header class="site-header">
    <div class="wrap nav">
      <a class="logo" href="index.html">${BRAND}<small>${PAYOFF}</small></a>
      <nav aria-label="Principale">
        <ul class="menu">
        ${menuVoci(attivo)}
        </ul>
      </nav>
      <div class="azioni">
        <a class="carrello" href="#carrello">Carrello (0)</a>
        <button class="hamburger" type="button" data-menu-toggle aria-expanded="false" aria-controls="menu-mobile" aria-label="Apri il menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="menu-mobile" id="menu-mobile">
      <ul>
        ${menuVoci(attivo)}
      </ul>
    </div>
  </header>`;

const footer = () => `  <footer class="site-footer">
    <div class="wrap">
      <div class="f-griglia">
        <div>
          <h4>${BRAND}</h4>
          <p class="soft" style="color:#c9cec0;font-size:.9rem">Kokedama fatti a mano, uno per uno.<br>Spedizione in tutta Italia.</p>
        </div>
        <div>
          <h4>Negozio</h4>
          <ul>
            <li><a href="shop.html">Tutti i kokedama</a></li>
            <li><a href="cura.html">Cura del kokedama</a></li>
            <li><a href="spedizioni.html">Spedizioni</a></li>
          </ul>
        </div>
        <div>
          <h4>Informazioni</h4>
          <ul>
            <li><a href="chi-siamo.html">Chi siamo</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="contatti.html">Contatti</a></li>
          </ul>
        </div>
        <div>
          <h4>Scrivici</h4>
          <ul>
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
            <li><a href="#instagram">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div class="f-fine">
        <span>&copy; <span id="anno">2026</span> ${BRAND}. Tutti i diritti riservati.</span>
        <span><a href="#privacy">Privacy</a> &nbsp;&middot;&nbsp; <a href="#cookie">Cookie</a> &nbsp;&middot;&nbsp; <a href="#termini">Termini</a></span>
      </div>
    </div>
  </footer>`;

const pagina = (file, titolo, contenuto) => `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titolo} &middot; ${BRAND}</title>
<meta name="description" content="${BRAND}: kokedama artigianali, piccoli giardini sospesi realizzati a mano. Spedizione in tutta Italia.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
${header(file)}
  <main id="contenuto">
${contenuto}
  </main>
${footer()}
<script src="assets/main.js"></script>
<script>document.getElementById("anno").textContent = new Date().getFullYear();</script>
</body>
</html>
`;

const cardProdotto = (p) => `        <a class="card" href="prodotto.html">
          <div class="foto v" data-nota="${p.nota}"></div>
          <div class="nome">${p.nome}</div>
          <div class="prezzo">${p.prezzo} &euro;</div>
          <span class="badge">${p.badge}</span>
        </a>`;

const intestazione = (occhiello, titolo, testo) => `    <section class="sezione sabbia">
      <div class="wrap">
        <p class="occhiello">${occhiello}</p>
        <h1>${titolo}</h1>
        <p class="soft misura">${testo}</p>
      </div>
    </section>`;

/* ------------------------------ PAGINE ------------------------------ */

const PAGINE = {};

PAGINE["index.html"] = ["Home", `    <section class="hero">
      <div class="foto" data-nota="Foto hero &mdash; kokedama in primo piano"></div>
      <div class="hero-testo">
        <p class="occhiello">Fatti a mano, uno per uno</p>
        <h1>Piccoli giardini<br>sospesi</h1>
        <p class="soft misura">Ogni kokedama nasce da un gesto antico: una sfera di terra e muschio che sostiene la pianta senza vaso. Nessun pezzo &egrave; uguale a un altro.</p>
        <p><a class="btn" href="shop.html">Scopri la collezione</a></p>
      </div>
    </section>

    <section class="sezione">
      <div class="wrap">
        <p class="occhiello">In evidenza</p>
        <h2>La collezione</h2>
        <div class="griglia" style="margin-top:34px">
${PRODOTTI.slice(0, 4).map(cardProdotto).join("\n")}
        </div>
        <p style="margin-top:38px"><a class="btn ghost" href="shop.html">Vedi tutti i kokedama</a></p>
      </div>
    </section>

    <section class="sezione sabbia">
      <div class="wrap due">
        <div class="foto q" data-nota="Foto laboratorio"></div>
        <div>
          <p class="occhiello">La storia</p>
          <h2>Un gesto lento</h2>
          <p class="soft">Il progetto nasce dal desiderio di portare in casa un pezzo di bosco. Ogni sfera viene composta a mano, legata con spago naturale e lasciata riposare prima di partire.</p>
          <p class="soft">Le piante vengono scelte una a una: resistenti, adatte alla vita in appartamento e semplici da curare.</p>
          <p><a class="btn ghost" href="chi-siamo.html">Chi siamo</a></p>
        </div>
      </div>
    </section>

    <section class="sezione">
      <div class="wrap">
        <p class="occhiello">Semplice da curare</p>
        <h2>Tre gesti, tutto qui</h2>
        <ol class="passi misura" style="margin-top:26px">
          <li><strong>Acqua.</strong> Immergi la sfera per qualche minuto quando la senti leggera, poi lasciala scolare.</li>
          <li><strong>Luce.</strong> Luce indiretta e abbondante, mai sole diretto nelle ore centrali.</li>
          <li><strong>Posizione.</strong> Lontano da termosifoni e correnti d&rsquo;aria.</li>
        </ol>
        <p style="margin-top:34px"><a class="btn ghost" href="cura.html">Guida completa alla cura</a></p>
      </div>
    </section>`];

PAGINE["shop.html"] = ["Shop", `${intestazione("Collezione", "Shop", "Pezzi unici realizzati a mano. Le disponibilit&agrave; si aggiornano automaticamente da Shopify.")}
    <section class="sezione">
      <div class="wrap">
        <div class="griglia">
${PRODOTTI.map(cardProdotto).join("\n")}
        </div>
      </div>
    </section>`];

PAGINE["prodotto.html"] = ["Felce di bosco", `    <section class="sezione">
      <div class="wrap due" style="align-items:start">
        <div class="galleria" data-galleria>
          <div class="foto principale" style="aspect-ratio:4/5" data-nota="Foto prodotto 1"></div>
          <div class="mini">
            <div class="foto q" data-nota="Foto prodotto 1"></div>
            <div class="foto q" data-nota="Dettaglio muschio"></div>
            <div class="foto q" data-nota="Vista dall&rsquo;alto"></div>
            <div class="foto q" data-nota="In ambiente"></div>
          </div>
        </div>
        <div>
          <p class="occhiello">Pezzo unico</p>
          <h1 style="font-size:clamp(2rem,5vw,2.8rem)">Felce di bosco</h1>
          <p class="prezzo-grande">38,00 &euro;</p>
          <p class="soft">Felce coltivata su sfera di terra e muschio, legata con spago naturale. Adatta a interni luminosi e ambienti leggermente umidi.</p>

          <label>Dimensione</label>
          <div class="opzioni" data-opzioni>
            <button class="opzione" type="button" aria-pressed="true">Piccolo &middot; 12 cm</button>
            <button class="opzione" type="button" aria-pressed="false">Medio &middot; 16 cm</button>
            <button class="opzione" type="button" aria-pressed="false">Grande &middot; 20 cm</button>
          </div>

          <label>Quantit&agrave;</label>
          <div class="qta" data-qta>
            <button type="button" data-step="meno" aria-label="Diminuisci">&minus;</button>
            <input type="text" value="1" inputmode="numeric" aria-label="Quantit&agrave;">
            <button type="button" data-step="piu" aria-label="Aumenta">+</button>
          </div>

          <button class="btn pieno" type="button">Aggiungi al carrello</button>
          <p class="soft" style="font-size:.85rem;margin-top:14px">Spedizione in 2&ndash;4 giorni lavorativi &middot; Imballo protettivo dedicato</p>

          <div style="margin-top:34px">
            <details open>
              <summary>Dettagli</summary>
              <div class="corpo">Altezza indicativa 25 cm con pianta. Diametro sfera 12 cm. Ogni esemplare varia leggermente per forma e colore.</div>
            </details>
            <details>
              <summary>Cura</summary>
              <div class="corpo">Immersione in acqua ogni 7&ndash;10 giorni, luce indiretta, nebulizzazione sulle foglie in estate. <a href="cura.html">Guida completa</a>.</div>
            </details>
            <details>
              <summary>Spedizione e resi</summary>
              <div class="corpo">Consegna in tutta Italia. Condizioni dettagliate nella pagina <a href="spedizioni.html">Spedizioni</a>.</div>
            </details>
          </div>
        </div>
      </div>
    </section>

    <section class="sezione sabbia">
      <div class="wrap">
        <p class="occhiello">Potrebbe piacerti</p>
        <h2>Altri kokedama</h2>
        <div class="griglia" style="margin-top:30px">
${PRODOTTI.slice(1, 4).map(cardProdotto).join("\n")}
        </div>
      </div>
    </section>`];

PAGINE["chi-siamo.html"] = ["Chi siamo", `${intestazione("La nostra storia", "Chi siamo", "Un laboratorio piccolo, mani lente e piante scelte una a una.")}
    <section class="sezione">
      <div class="wrap due">
        <div class="foto v" data-nota="Foto ritratto / laboratorio"></div>
        <div>
          <h2>Come e nato il progetto</h2>
          <p class="soft">Testo da definire con la cliente: l&rsquo;origine del progetto, il primo kokedama, cosa ha spinto a farne un lavoro.</p>
          <h3 style="margin-top:32px">Come lavoriamo</h3>
          <p class="soft">Ogni sfera viene composta a mano con terra, torba e muschio, poi legata con spago naturale. Nessuno stampo, nessuna produzione in serie.</p>
          <h3 style="margin-top:32px">Cosa ci sta a cuore</h3>
          <p class="soft">Materiali naturali, imballi ridotti al minimo e piante che possano vivere a lungo in casa.</p>
        </div>
      </div>
    </section>`];

PAGINE["cura.html"] = ["Cura del kokedama", `${intestazione("Guida", "Cura del kokedama", "Poche regole semplici: acqua, luce, posizione. Il resto lo fa la pianta.")}
    <section class="sezione">
      <div class="wrap misura">
        <h2>Annaffiatura</h2>
        <p class="soft">Solleva la sfera: se &egrave; leggera, ha bisogno di acqua. Immergila in una bacinella per 5&ndash;10 minuti, finch&eacute; smette di fare bolle, poi lasciala scolare bene prima di riappenderla o riappoggiarla.</p>
        <p class="soft">In media ogni 7&ndash;10 giorni in inverno, ogni 4&ndash;6 giorni in estate. Varia in base alla pianta e all&rsquo;ambiente.</p>

        <h2 style="margin-top:44px">Luce</h2>
        <p class="soft">Luce naturale indiretta e abbondante. Evita il sole diretto delle ore centrali, che secca il muschio e brucia le foglie.</p>

        <h2 style="margin-top:44px">Posizione</h2>
        <p class="soft">Lontano da termosifoni, condizionatori e correnti d&rsquo;aria. Se l&rsquo;aria &egrave; molto secca, nebulizza le foglie una o due volte a settimana.</p>

        <h2 style="margin-top:44px">Manutenzione</h2>
        <ol class="passi">
          <li>Rimuovi foglie secche o ingiallite con le dita o con una forbice pulita.</li>
          <li>Ruota la sfera ogni tanto perch&eacute; cresca in modo regolare.</li>
          <li>In primavera aggiungi fertilizzante liquido molto diluito nell acqua di immersione, una volta al mese.</li>
          <li>Se il muschio si dirada, pu&ograve; essere reintegrato: scrivici e ti spieghiamo come.</li>
        </ol>

        <h2 style="margin-top:44px">Segnali da osservare</h2>
        <div class="tabella-scroll">
          <table>
            <thead><tr><th>Segnale</th><th>Probabile causa</th><th>Cosa fare</th></tr></thead>
            <tbody>
              <tr><td>Foglie molli e scure</td><td>Troppa acqua</td><td>Diradare le immersioni, far scolare meglio</td></tr>
              <tr><td>Punte secche</td><td>Aria secca o poca acqua</td><td>Nebulizzare, accorciare gli intervalli</td></tr>
              <tr><td>Muschio grigio e rigido</td><td>Sfera troppo asciutta</td><td>Immersione lunga, 15 minuti</td></tr>
              <tr><td>Crescita allungata e pallida</td><td>Poca luce</td><td>Spostare vicino a una finestra luminosa</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>`];

PAGINE["spedizioni.html"] = ["Spedizioni", `${intestazione("Consegne", "Spedizioni", "Zone, tempi e costi. I valori qui sotto sono indicativi e vanno confermati con la cliente.")}
    <section class="sezione">
      <div class="wrap misura">
        <h2>Tempi e costi</h2>
        <div class="tabella-scroll">
          <table>
            <thead><tr><th>Zona</th><th>Tempi</th><th>Costo</th></tr></thead>
            <tbody>
              <tr><td>Italia (esclusa isole)</td><td>2&ndash;4 giorni lavorativi</td><td>da definire</td></tr>
              <tr><td>Isole</td><td>3&ndash;6 giorni lavorativi</td><td>da definire</td></tr>
              <tr><td>Ritiro in zona</td><td>su appuntamento</td><td>gratuito</td></tr>
            </tbody>
          </table>
        </div>
        <p class="soft">Le spedizioni partono dal luned&igrave; al gioved&igrave;, per evitare che i pacchi restino fermi durante il fine settimana.</p>

        <h2 style="margin-top:44px">Imballo</h2>
        <p class="soft">Ogni kokedama viaggia bloccato in un imballo dedicato, con materiali riciclabili e senza plastica superflua.</p>

        <h2 style="margin-top:44px">Danni e resi</h2>
        <p class="soft">Testo da definire con la cliente. Trattandosi di piante vive, va indicato con chiarezza cosa succede in caso di pacco danneggiato e quali sono i termini di reso previsti dalla legge.</p>
      </div>
    </section>`];

PAGINE["faq.html"] = ["FAQ", `${intestazione("Domande frequenti", "FAQ", "Le risposte alle domande che riceviamo pi&ugrave; spesso.")}
    <section class="sezione">
      <div class="wrap misura">
        <details open><summary>Che cos e un kokedama?</summary><div class="corpo">&Egrave; una tecnica giapponese: le radici della pianta vengono avvolte in una sfera di terra ricoperta di muschio, al posto del vaso. Pu&ograve; essere appoggiato su un piattino o sospeso.</div></details>
        <details><summary>Quanto dura?</summary><div class="corpo">Con le cure giuste pu&ograve; vivere anni. Dopo due o tre anni la sfera pu&ograve; essere rifatta per dare nuovo spazio alle radici.</div></details>
        <details><summary>Ogni quanto devo annaffiarlo?</summary><div class="corpo">In media ogni 7&ndash;10 giorni. Il metodo pi&ugrave; affidabile &egrave; il peso: se la sfera &egrave; leggera, &egrave; ora di immergerla.</div></details>
        <details><summary>Posso tenerlo in bagno o in cucina?</summary><div class="corpo">S&igrave;, se c&rsquo;&egrave; luce naturale. L&rsquo;umidit&agrave; di questi ambienti &egrave; spesso ideale per felci e piante da sottobosco.</div></details>
        <details><summary>Le piante sono sicure per animali domestici?</summary><div class="corpo">Dipende dalla specie. Nella scheda di ogni prodotto indichiamo se la pianta &egrave; tossica in caso di ingestione.</div></details>
        <details><summary>Posso ordinare un kokedama personalizzato?</summary><div class="corpo">S&igrave;, scrivici dalla pagina <a href="contatti.html">Contatti</a> indicando pianta, dimensione e occasione.</div></details>
        <details><summary>Fate confezioni regalo?</summary><div class="corpo">Su richiesta, con biglietto scritto a mano. Puoi segnalarlo nelle note dell&rsquo;ordine.</div></details>
      </div>
    </section>`];

PAGINE["contatti.html"] = ["Contatti", `${intestazione("Scrivici", "Contatti", "Per ordini personalizzati, domande sulle piante o informazioni sulle spedizioni.")}
    <section class="sezione">
      <div class="wrap due" style="align-items:start">
        <div>
          <h2>Modulo</h2>
          <form onsubmit="event.preventDefault(); alert('Prototipo: il modulo verr&agrave; collegato al form Shopify.');">
            <label for="nome">Nome</label>
            <input id="nome" type="text" required>
            <label for="email">Email</label>
            <input id="email" type="email" required>
            <label for="msg">Messaggio</label>
            <textarea id="msg" required></textarea>
            <button class="btn" type="submit">Invia</button>
          </form>
        </div>
        <div>
          <h2>Altri contatti</h2>
          <p class="soft">Email<br><a href="mailto:${EMAIL}">${EMAIL}</a></p>
          <p class="soft">Instagram<br><a href="#instagram">@da_definire</a></p>
          <p class="soft">Rispondiamo di solito entro 1&ndash;2 giorni lavorativi.</p>
        </div>
      </div>
    </section>`];

/* ------------------------------ BUILD ------------------------------ */

const out = __dirname;
Object.entries(PAGINE).forEach(([file, [titolo, contenuto]]) => {
  fs.writeFileSync(path.join(out, file), pagina(file, titolo, contenuto), "utf8");
  console.log("scritto", file);
});
