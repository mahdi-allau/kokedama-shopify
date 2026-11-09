/* Riempie le pagine con i prodotti. Generato da vetrina-dinamica.js. */
(function () {
  var CFG = window.VETRINA || {};
  var BASE = CFG.base || "";
  var WHATSAPP = "393478202607";

  /* Il simbolo basta: "25,00 EUR" con l'euro davanti lo diceva due volte. */
  function euro(n) {
    return "\u20ac" + Number(n).toFixed(2).replace(".", ",");
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
    document.title = p.titolo + " \u2013 Kokedama & Sculture Naturali";

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
      foto.alt = p.titolo + " \u2014 kokedama fatto a mano";
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
        " \u00c8 disponibile?";
      bottone.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(messaggio);
    }

    document.querySelectorAll('[data-campo="taglie"] input').forEach(function (r) {
      r.addEventListener("change", aggiorna);
    });
    aggiorna();
  }

  function nonTrovato() {
    document.title = "Questa pianta non c\u2019\u00e8 pi\u00f9 \u2013 Kokedama & Sculture Naturali";
    var info = document.querySelector(".product__info-container");
    if (!info) return;
    info.innerHTML =
      '<h1 class="product__title">Questa pianta non c\u2019\u00e8 pi\u00f9</h1>' +
      '<p class="rte">Forse \u00e8 stata venduta, o ha cambiato nome. ' +
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
      var handle = location.pathname.replace(/\/$/, "").split("/").pop().replace(/\.html$/, "");
      var p = online.find(function (x) { return x.handle === handle; });
      if (p) scheda(p); else nonTrovato();
    }

    griglie(online);
  });
})();
