/**
 * Crea tema-kokedama.zip, il file da caricare su Shopify.
 *
 *   node pacchetto-tema.js
 *
 * Rifallo ogni volta che cambi qualcosa dentro dawn-kokedama/.
 * Esclude .git e .github, che a Shopify non servono.
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const TEMA = path.join(__dirname, "dawn-kokedama");
const USCITA = path.join(__dirname, "tema-kokedama.zip");
const ESCLUDI = [".git", ".github", "node_modules"];

// Raccoglie i file, con percorsi in stile Unix: Shopify rifiuta le barre rovesciate.
function raccogli(dir, base = "") {
  let out = [];
  for (const nome of fs.readdirSync(dir)) {
    if (ESCLUDI.includes(nome)) continue;
    const pieno = path.join(dir, nome);
    const relativo = base ? base + "/" + nome : nome;
    if (fs.statSync(pieno).isDirectory()) out = out.concat(raccogli(pieno, relativo));
    else out.push({ pieno, relativo });
  }
  return out;
}

// Scrittore ZIP minimo (deflate), senza dipendenze esterne.
const crc32tab = (() => {
  const t = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();
const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crc32tab[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

// Data/ora in formato DOS: alcuni strumenti rifiutano gli zip con data a zero.
const adesso = new Date();
const dosOra = (adesso.getHours() << 11) | (adesso.getMinutes() << 5) | (adesso.getSeconds() >> 1);
const dosData = ((adesso.getFullYear() - 1980) << 9) | ((adesso.getMonth() + 1) << 5) | adesso.getDate();

const file = raccogli(TEMA);
const pezzi = [];
const indice = [];
let offset = 0;

for (const f of file) {
  const dati = fs.readFileSync(f.pieno);
  const compressi = zlib.deflateRawSync(dati, { level: 9 });
  const nome = Buffer.from(f.relativo, "utf8");

  const locale = Buffer.alloc(30);
  locale.writeUInt32LE(0x04034b50, 0);
  locale.writeUInt16LE(20, 4);
  locale.writeUInt16LE(0x0800, 6); // nomi in UTF-8
  locale.writeUInt16LE(8, 8);      // deflate
  locale.writeUInt16LE(dosOra, 10);
  locale.writeUInt16LE(dosData, 12);
  locale.writeUInt32LE(crc32(dati), 14);
  locale.writeUInt32LE(compressi.length, 18);
  locale.writeUInt32LE(dati.length, 22);
  locale.writeUInt16LE(nome.length, 26);
  pezzi.push(locale, nome, compressi);

  const centrale = Buffer.alloc(46);
  centrale.writeUInt32LE(0x02014b50, 0);
  centrale.writeUInt16LE(20, 4);
  centrale.writeUInt16LE(20, 6);
  centrale.writeUInt16LE(0x0800, 8);
  centrale.writeUInt16LE(8, 10);
  centrale.writeUInt16LE(dosOra, 12);
  centrale.writeUInt16LE(dosData, 14);
  centrale.writeUInt32LE(crc32(dati), 16);
  centrale.writeUInt32LE(compressi.length, 20);
  centrale.writeUInt32LE(dati.length, 24);
  centrale.writeUInt16LE(nome.length, 28);
  centrale.writeUInt32LE(offset, 42);
  indice.push(centrale, nome);

  offset += locale.length + nome.length + compressi.length;
}

const corpo = Buffer.concat(pezzi);
const dir = Buffer.concat(indice);
const fine = Buffer.alloc(22);
fine.writeUInt32LE(0x06054b50, 0);
fine.writeUInt16LE(file.length, 8);
fine.writeUInt16LE(file.length, 10);
fine.writeUInt32LE(dir.length, 12);
fine.writeUInt32LE(corpo.length, 16);

fs.writeFileSync(USCITA, Buffer.concat([corpo, dir, fine]));
console.log(file.length + " file, " + (fs.statSync(USCITA).size / 1048576).toFixed(1) + " MB");
console.log("Pronto: tema-kokedama.zip");
