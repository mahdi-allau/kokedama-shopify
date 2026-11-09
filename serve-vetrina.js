/*
 * serve-vetrina.js
 *
 *   node serve-vetrina.js [porta]
 *
 * Serve la cartella `vetrina/` come la servirebbe Netlify: le cartelle
 * rispondono con il loro index.html, cosi i link interni (/pages/chi-siamo)
 * funzionano in locale esattamente come funzioneranno online.
 * Serve solo a guardare il risultato prima di pubblicare.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const RADICE = path.join(__dirname, "vetrina");
const PORTA = Number(process.argv[2] || 4320);

const TIPI = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  /* Senza questa riga il video arriva come "file da scaricare" invece che
     come video, e la pagina di prova mostra un riquadro vuoto. Netlify il
     tipo lo indovina da solo, qui no. */
  ".mp4": "video/mp4",
};

http
  .createServer((req, res) => {
    const pulito = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(RADICE, path.normalize(pulito).replace(/^(\.\.[/\\])+/, ""));

    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");

    /* Le schede prodotto non esistono come file: c'e una pagina sola che
       dall'indirizzo capisce quale pianta mostrare. Online lo fa Netlify con
       la riga in _redirects; qui lo rifacciamo, altrimenti in locale si vede
       un 404 e online no, che e il modo migliore per non accorgersi di niente. */
    if (!fs.existsSync(file) && /^\/products\/.+/.test(pulito)) {
      file = path.join(RADICE, "products", "scheda.html");
    }

    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Non trovato: " + pulito);
      return;
    }

    res.writeHead(200, { "Content-Type": TIPI[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  })
  .listen(PORTA, () => console.log("vetrina su http://localhost:" + PORTA));
