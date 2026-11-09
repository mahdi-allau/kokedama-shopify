/* Vetrina senza Shopify: la taglia cambia il prezzo e il messaggio WhatsApp.
   Lo faceva il tema parlando col negozio; qui sono quindici righe. */
(function () {
  var PREZZI = {"/products/kokedama-pothos-argentato":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-nolina":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-calathea-triostar":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-ficus-ginseng":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-felce":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-bouquet-secco":{"Default Title":"38.00"},"/products/kokedama-composizione-autunno":{"Default Title":"38.00"},"/products/kokedama-foglie-tonde":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-tradescantia":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-clorofito-sospeso":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-palmetta":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-pothos-e-felce":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-aglaonema":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"},"/products/kokedama-sansevieria-cilindrica":{"Piccolo":"25.00","Medio":"38.00","Grande":"55.00"}};
  var listino = PREZZI[location.pathname.replace(/\/$/, "")] || {};

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
    bottone.href = "https://wa.me/393478202607?text=" + encodeURIComponent(testo);
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
