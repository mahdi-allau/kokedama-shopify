// Menu mobile
document.querySelectorAll("[data-menu-toggle]").forEach(function (b) {
  b.addEventListener("click", function () {
    var m = document.getElementById("menu-mobile");
    var aperto = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!aperto));
    m.classList.toggle("aperto", !aperto);
  });
});

// Selettore varianti (in Shopify sara collegato alle varianti prodotto)
document.querySelectorAll("[data-opzioni]").forEach(function (g) {
  g.addEventListener("click", function (e) {
    var b = e.target.closest(".opzione");
    if (!b) return;
    g.querySelectorAll(".opzione").forEach(function (o) {
      o.setAttribute("aria-pressed", "false");
    });
    b.setAttribute("aria-pressed", "true");
  });
});

// Quantita
document.querySelectorAll("[data-qta]").forEach(function (q) {
  var input = q.querySelector("input");
  q.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var v = parseInt(input.value, 10) || 1;
    input.value = Math.max(1, b.dataset.step === "piu" ? v + 1 : v - 1);
  });
});

// Galleria prodotto (placeholder: scambia la nota della foto principale)
document.querySelectorAll("[data-galleria]").forEach(function (g) {
  var principale = g.querySelector(".principale");
  g.querySelectorAll(".mini .foto").forEach(function (m) {
    m.addEventListener("click", function () {
      principale.dataset.nota = m.dataset.nota;
    });
  });
});
