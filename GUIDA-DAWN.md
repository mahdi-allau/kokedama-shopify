# Porting su Dawn — guida operativa

Il tema personalizzato è già pronto in `dawn-kokedama/`.
Questa guida serve a portarlo dentro Shopify e completarlo.

---

## Fase 0 — Cosa è già fatto

`dawn-kokedama/` è Dawn (versione 10 agosto 2026) con applicato:

- **Colori**: crema `#FBFAF7`, sabbia `#F4F1EA`, verde `#5A6B53`, verde scuro `#3D4A38`, testo `#2E2E2A`, distribuiti sui 5 schemi colore del tema.
- **Tipografia**: Cormorant Garamond per i titoli, Inter per il testo.
- **Forme**: nessun angolo arrotondato, nessuna ombra, bordi da 1px.
- **Carrello a tendina** invece della pagina separata (meno passaggi su smartphone).
- **`assets/kokedama.css`**: i ritocchi che l'editor Shopify non espone (occhielli, bottoni maiuscoletto, nomi prodotto in serif).
- **`templates/index.json`**: home con hero, prodotti in evidenza, storia, i tre gesti di cura.
- **`templates/product.json`**: foto a sinistra con miniature, informazioni a destra che restano ferme allo scroll, avviso "ultimi pezzi" sotto le 3 unità, e le tre righe apribili Dettagli / Cura / Spedizione.
- **`templates/collection.json`**: griglia a 3 colonne (2 su smartphone), foto verticali, filtri disattivati.
- **`templates/page.testo.json`**: per Chi siamo, Cura, Spedizioni — testo + richiamo allo shop.
- **`templates/page.faq.json`**: le 8 domande già scritte, in righe apribili.
- **`templates/page.contact.json`**: testo introduttivo + modulo di contatto.

Verificato con `shopify theme check`: 0 errori.

Per rigenerare tutto dopo un aggiornamento di Dawn:

```bash
node personalizza-dawn.js
```

```bash
node templates-dawn.js
```

---

## Fase 1 — Creare lo store (serve la cliente)

Lo store va intestato a lei: è lei che paga l'abbonamento ed è lei che dovrà gestirlo.

1. Vai su shopify.com e avvia la prova gratuita **con l'email della cliente**.
2. Rispondi alle domande iniziali (cosa vendi, dove) — si può cambiare tutto dopo.
3. Non serve scegliere un piano subito: la prova basta per costruire e testare.

Il dominio **non** va comprato ora: si collega alla fine, quando il sito è pronto.

> Finché lo store non esiste, tutte le fasi successive sono bloccate.
> Il prototipo statico serve intanto a farle approvare l'aspetto.

---

## Fase 2 — Caricare il tema

Due strade. La seconda è più comoda se lavori sul codice.

### A. Caricamento ZIP (più semplice)

```bash
cd dawn-kokedama
git archive --format=zip -o ../kokedama-tema.zip HEAD
```

> Nota: `git archive` include solo i file tracciati. Le personalizzazioni non ancora
> committate non ci finiscono — fai prima `git add -A && git commit -m "stile kokedama"`
> dentro `dawn-kokedama/`, oppure zippa la cartella a mano da Esplora file.

Poi in Shopify: **Negozio online → Temi → Aggiungi tema → Carica file ZIP**.
Il tema appare tra quelli non pubblicati. Aprilo con **Personalizza**.

### B. Shopify CLI (consigliata)

```bash
cd dawn-kokedama
npx @shopify/cli theme dev --store nome-negozio.myshopify.com
```

Apre un'anteprima locale collegata allo store vero: modifichi un file, il browser si aggiorna da solo.
Quando sei soddisfatto:

```bash
npx @shopify/cli theme push
```

---

## Fase 3 — Controllare font e colori

I nomi dei font sono stati scritti nel file di configurazione, ma la libreria di Shopify
usa handle propri e potrebbe rifiutarli.

**Personalizza → Impostazioni tema → Tipografia**: verifica che titoli e testo siano
davvero Cormorant Garamond e Inter. Se non lo sono, selezionali dal menu.

Se Cormorant Garamond non è disponibile, alternative con lo stesso carattere:
EB Garamond, Crimson Pro, Lora.

**Impostazioni tema → Colori**: controlla i 5 schemi. Devono corrispondere alla palette della Fase 0.

---

## Fase 4 — Prodotti

**Prodotti → Aggiungi prodotto**, per ciascun kokedama:

- Titolo, descrizione, foto (più angolazioni: intera, dettaglio muschio, in ambiente).
- Prezzo.
- **Inventario**: attiva "Tieni traccia della quantità". Per i pezzi unici, quantità 1.
- **Varianti**: se ci sono più dimensioni, opzione "Dimensione" con Piccolo / Medio / Grande.
- **Spedizione**: peso reale, serve per calcolare i costi.

Poi **Raccolte → Crea raccolta** (es. "Tutti i kokedama", manuale o automatica) e collegala
alla sezione "La collezione" della home: **Personalizza → home → La collezione → Raccolta**.

---

## Fase 5 — Pagine

**Negozio online → Pagine → Aggiungi pagina**. Copia i testi dal prototipo e, in fondo
alla schermata, scegli il template nel riquadro **"Suffisso del template"**:

| Pagina Shopify | Testi da | Template da scegliere |
|---|---|---|
| Chi siamo | `chi-siamo.html` | `page.testo` |
| Cura del kokedama | `cura.html` | `page.testo` |
| Spedizioni | `spedizioni.html` | `page.testo` |
| FAQ | già nel template | `page.faq` |
| Contatti | `contatti.html` | `page.contact` |

La pagina FAQ ha già dentro le 8 domande: crea la pagina con titolo "FAQ" e corpo vuoto,
scegli il template `page.faq`, e le domande compaiono da sole. Si modificano da
**Personalizza → FAQ → sezione Contenuto apribile**.

Nella pagina prodotto, le righe "Cura" e "Spedizione e resi" contengono un testo breve
di ripiego. Meglio collegarle alle pagine vere: **Personalizza → prodotto → blocco Cura →
campo Pagina**. Così il testo si aggiorna in un punto solo.

---

## Fase 6 — Menu

**Negozio online → Menu → Menu principale**. Voci, nell'ordine:

Home · Shop · Chi siamo · Cura · Spedizioni · FAQ · Contatti

Nel footer: **Menu piè di pagina** con Chi siamo, FAQ, Contatti, Spedizioni + le pagine legali.

---

## Fase 7 — Spedizioni e pagamenti

- **Impostazioni → Spedizioni e consegna**: crea le tariffe per Italia e isole, con i costi
  che la cliente deve ancora confermare. Se pesano molto, valuta tariffe per fascia di peso.
- **Impostazioni → Pagamenti**: attiva Shopify Payments (carte) e, se richiesto, PayPal.
  Serve l'IBAN e i dati fiscali della cliente — è un passaggio suo.
- **Impostazioni → Notifiche**: controlla l'email di conferma ordine, tradotta in italiano.

---

## Fase 8 — Pagine legali

**Impostazioni → Criteri**: Shopify genera bozze di privacy, resi, termini e spedizione.
Sono modelli generici: vanno lette e adattate, e per le condizioni di vendita
la cliente dovrebbe farle verificare da un professionista. Non è compreso nel lavoro.

---

## Fase 9 — Dominio e pubblicazione

1. La cliente compra il dominio (~10 €/anno) e attiva un piano Shopify.
2. **Impostazioni → Domini → Collega dominio esistente**, poi si seguono le istruzioni DNS.
3. **Negozio online → Preferenze**: titolo, meta description, favicon.
4. **Temi → Pubblica**.
5. Rimuovi la password di accesso allo store (Preferenze → Limita accesso).

---

## Prima di pubblicare

- [ ] Sito mobile verificato
- [ ] Menu funzionante
- [ ] Link funzionanti
- [ ] Prodotti configurati
- [ ] Prezzi verificati
- [ ] Disponibilità verificata
- [ ] Carrello testato
- [ ] Checkout testato (usa la modalità test dei pagamenti)
- [ ] Pagamenti verificati
- [ ] Spedizioni verificate
- [ ] Email ordine verificate
- [ ] Dominio collegato
- [ ] Logo/favicon configurati
- [ ] Titoli e meta description controllati
- [ ] Privacy/cookie/termini verificati
- [ ] Test finale mobile e desktop
