# Kokedama — prototipo sito

Prototipo statico del sito e-commerce, mobile-first, da usare come base visiva
prima del passaggio su Shopify.

## Avvio locale

```bash
npx serve -l 4321 .
```

Poi apri http://localhost:4321

## Struttura

| File | Contenuto |
|---|---|
| `build.js` | Generatore: header, footer, elenco prodotti e testi di tutte le pagine |
| `assets/style.css` | Design system (colori, tipografia, componenti) |
| `assets/main.js` | Menu mobile, varianti, quantità, galleria |
| `*.html` | Pagine generate — **non modificare a mano**, si rigenerano |

Dopo ogni modifica ai testi in `build.js`:

```bash
node build.js
```

## Pagine

Home, Shop, Pagina prodotto, Chi siamo, Cura del kokedama, Spedizioni, FAQ, Contatti.
Carrello e checkout restano su Shopify.

## Cosa è finto nel prototipo

- **Foto**: rettangoli con etichetta al posto delle immagini reali.
- **Prodotti**: 6 esempi con nomi e prezzi inventati (in `PRODOTTI` dentro `build.js`).
- **Carrello**: il contatore è statico, "Aggiungi al carrello" non fa nulla.
- **Modulo contatti**: mostra solo un avviso, non invia.
- **Testi**: bozza. Ogni punto marcato "da definire" va compilato con la cliente.
- **Privacy / Cookie / Termini**: link segnaposto.

## Da chiedere alla cliente prima di procedere

Nome brand · logo · colori · foto · elenco prodotti · prezzi · disponibilità ·
descrizioni · dimensioni · costi e zone di spedizione · email aziendale · social ·
testi esistenti · metodo di pagamento · condizioni di reso · dominio.

Con questi dati si aggiornano `BRAND`, `PAYOFF`, `EMAIL` e `PRODOTTI` in `build.js`
e si sostituiscono i testi segnaposto.

## Passaggio a Shopify

1. Creazione store e scelta di un tema gratuito (Dawn è la base consigliata).
2. Riporto di colori e tipografia di `assets/style.css` nelle impostazioni tema.
3. Header e footer → sections del tema.
4. Home → sections configurabili (hero, prodotti in evidenza, testo+immagine, passi).
5. Shop → template collezione. Pagina prodotto → template prodotto con varianti.
6. Chi siamo, Cura, Spedizioni, FAQ, Contatti → pagine Shopify.
7. Carrello, checkout, pagamenti, spedizioni: configurazione nativa Shopify.
8. Collegamento dominio, favicon, meta title/description, pagine legali.

## Checklist prima della pubblicazione

- [ ] Sito mobile verificato
- [ ] Menu funzionante
- [ ] Link funzionanti
- [ ] Prodotti configurati
- [ ] Prezzi verificati
- [ ] Disponibilità verificata
- [ ] Carrello testato
- [ ] Checkout testato
- [ ] Pagamenti verificati
- [ ] Spedizioni verificate
- [ ] Email ordine verificate
- [ ] Dominio collegato
- [ ] Logo/favicon configurati
- [ ] Titoli e meta description controllati
- [ ] Privacy/cookie/termini verificati
- [ ] Test finale mobile e desktop
