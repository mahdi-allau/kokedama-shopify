# Contesto del progetto — leggere prima di toccare qualsiasi cosa

Questo file esiste perché l'utente non debba rispiegare il progetto a ogni nuova
sessione o a un'altra IA. Leggilo tutto: contiene decisioni già prese, errori già
commessi e trappole già scoperte. Rifarli costa tempo a lui, non a te.

Tutto quello che scrivi — codice, commenti, testi del sito, risposte — va in **italiano**.

---

## Cos'è

Sito e-commerce per la vendita di kokedama (piante su sfera di muschio, senza vaso),
costruito su **Shopify** con un tema derivato da **Dawn**.

- **Cliente**: Simona Panico. Il negozio è intestato a lei.
- **Chi sviluppa**: l'utente di questa cartella.
- **Compenso**: 400 € per la realizzazione, prezzo agevolato.
- **Fuori dal compenso**: dominio, abbonamento Shopify, app a pagamento,
  consulenze legali o fiscali, funzionalità nuove dopo la consegna.
- **Stile richiesto**: naturale, elegante, artigianale. Molto spazio bianco,
  fotografie grandi, tipografia pulita, ottima resa da smartphone.
  Direzione scelta dall'utente: **editoriale, come una rivista**.

## Il negozio

| | |
|---|---|
| Indirizzo | `kokedamasculture.myshopify.com` |
| Proprietaria | `simona.panico.shopify@gmail.com` (accesso pannello) |
| Nome pubblico | Kokedama & Sculture Naturali |
| Contatti pubblici | panico.simona.sp@gmail.com &middot; +39 347 820 2607 |
| Sede | Ferrara, centro storico. **L&rsquo;indirizzo non va pubblicato**: si svela solo dopo la prenotazione. |
| Prenotazioni | WhatsApp `https://wa.me/393478202607` &mdash; e il canale principale, davanti a mail e telefono |
| Prodotti | 9 kokedama caricati via CSV. Listino per taglia: **25 / 38 / 55 &euro;**, allineato alla pagina Prezzi (verificato il 9 settembre 2026). Dal 29 settembre le taglie sono varianti vere: vedi *Taglie e prezzi*. |
| Reso | Informativa su /policies/refund-policy: 14 giorni, spese di reso al cliente, esclusi personalizzati / piante deperibili / workshop con data. **Bozza da far verificare a un professionista.** |
| Spedizioni | Italia **12,90 &euro;** (gratis oltre 120 &euro;) &middot; UE 34,90 &euro; &middot; resto del mondo 89,90 &euro;. Due profili: *Piante vive - solo Italia* (7 prodotti) e *Profilo generale* (le 2 composizioni secche, che vanno anche all&rsquo;estero). |
| Perche cosi | Poste Delivery Standard 0-3 kg costa **10,30 &euro;** allo sportello + 2-3 &euro; di imballo. La tariffa precedente era 7 &euro; con gratis sopra 55 &euro;: Simona perdeva ~6 &euro; a ordine e ~13 &euro; su ogni kokedama grande. Le piante vive non escono dall&rsquo;Italia: servono certificati fitosanitari. |
| Collezione | `tutti-i-kokedama` (automatica per venditore): 9 nel pannello ma **0 in vetrina**, indicizzazione Shopify indietro. La home usa `all` come ripiego. |
| Tema nostro | `tema-kokedama`, id **204758417733** |
| Tema pubblicato | **`tema-kokedama`** (verificato con `theme list` il 17 settembre 2026). Horizon è in libreria, non pubblicato. |
| Pannello | `https://admin.shopify.com/store/kokedamasculture` |
| **Partita IVA** | Simona **non ce l&rsquo;ha**. Senza, la vendita online continuativa non &egrave; regolare: vedi "Il nodo fiscale" qui sotto. **Blocca l&rsquo;apertura del negozio.** |
| Stato | negozio privato, protetto da password; prova gratuita in scadenza |

Anteprima del nostro tema:
`https://kokedamasculture.myshopify.com/?preview_theme_id=204758417733`

---

## Il modello a due linee — deciso il 17 settembre 2026

Simona ha scelto di dividere la vendita in due linee:

1. **Laboratorio Ferrara** — kokedama **vivi**, fatti a mano da lei. Solo consegna a mano
   a Ferrara e dintorni (circa 30 km) o ritiro su appuntamento. Niente corriere: in un
   pacco chiuso, d'estate, le piante muoiono. Qui stanno anche workshop ed eventi.
2. **Kokedama Stabilizzati — Non chiedono acqua** (era "Collezione stabilizzata") —
   piante stabilizzate e fiori secchi, **spediti solo in Italia**. Correzione del
   23 settembre: l'Europa è stata tolta da tutto il sito, non si vende all'estero. In futuro potrebbe includere prodotti di fornitori esterni
   (se ne è parlato: Omotesandō Plants, Lezio; *Flormarc* non risulta in rete).
   **Fornitori, prezzi e P.IVA si decidono alla fine**: scelta esplicita dell'utente.

### Cosa è già fatto sul negozio

| | |
|---|---|
| Collezioni | `laboratorio-ferrara` = tag **pianta viva** (7 prodotti) &middot; `collezione-stabilizzata` = tag **non richiede acqua** (2 composizioni). Automatiche: un prodotto nuovo finisce nella linea giusta mettendogli il tag. |
| Menu principale | Home &middot; Kokedama vivi &middot; Stabilizzati &middot; Servizi &middot; Prezzi &middot; Filosofia &middot; Chi sono &middot; Contatti |
| Home | 10 sezioni: apertura, **le due linee** (due schede con foto), manifesto, **Dal laboratorio di Ferrara**, **Collezione stabilizzata**, servizi, testimonianze, terrazzo, storia, cura. |
| Barra annunci | Due messaggi a rotazione: workshop + "Kokedama vivi a Ferrara · Collezione stabilizzata spedita in tutta Europa" |
| Pagine riscritte | Spedizioni (le due linee), Prezzi (blocco Consegna), FAQ ("Spedite anche i kokedama vivi?") |
| Workshop | Pagina `workshop-kokedama-vivi` (23 settembre): domicilio 55 &euro;, terrazzo 70 &euro;, altri servizi. Tre pulsanti WhatsApp con messaggio gi&agrave; scritto. **Manca la foto del terrazzo**: nei file del negozio non ce n'&egrave; nessuna. |
| Prodotti (29 settembre) | **12 kokedama vivi online**, tutti con la loro foto. **Asparagina, Pilea e Kokedama sospeso sono in bozza**: le loro foto non esistono, non sono mai state scattate. Appena arrivano: carica in Contenuto &rarr; File, collega con "Seleziona esistente", rimetti Attivo. Sono gia pronti di testo, tag, taglie e prezzi. |
| Taglie e prezzi (29 settembre) | Ogni vivo ha **tre varianti**: Piccolo 25 &euro; (8-10 cm), Medio 38 &euro; (12-15 cm), Grande 55 &euro; (15-20 cm). La sceglie il cliente sulla scheda prodotto; in collezione si legge "Da 25,00 &euro;". Generate da `prodotti-taglie.js` &rarr; `prodotti-taglie.csv`. Le due composizioni secche restano a prezzo unico (38 &euro;). |
| Scorte dei vivi | **Non monitorate**, di proposito. Con tre taglie a magazzino 1 il sito avrebbe scritto "ne restano 1" su 45 varianti che Simona non ha in laboratorio: la taglia si fa su richiesta, e la descrizione lo dice ("se non &egrave; pronta la preparo io"). Se un giorno le taglie diventano pezzi gia fatti, si riattiva il monitoraggio. |
| Footer (29 settembre) | **Tre colonne**, non quattro: presentazione, Negozio, Scrivici. Il quarto blocco era `brand_information` per i social e, senza un profilo collegato, Dawn lo stampava vuoto: 250px di niente che sbilanciavano la riga. Il **menu footer** conteneva solo "Cerca": ora ha Kokedama vivi, Stabilizzati, Workshop, Chi sono (**non** i Resi, che restano fuori dai menu per scelta). In fondo: `&copy; 2026 ... &middot; Sito realizzato da Sarah &middot;` piu le informative. |
| Storico prodotti in bozza | Gli otto arrivati fra il 23 e il 28 settembre (`prodotti-nuovi.csv`, `prodotti-nuovi-2.csv`) sono online dal 29, tranne i tre senza foto. La riga *Prodotti (29 settembre)* qui sopra e quella buona: questa resta solo per capire da dove arrivano i file. |
| Foto prodotto | Gli originali stanno in `prodotti/`. Su Shopify sono caricate in Contenuto &rarr; File e collegate ai prodotti con "Seleziona esistente". **L'input file della sezione media del prodotto non &egrave; raggiungibile dall'automazione** (sta dentro un componente chiuso): la strada che funziona &egrave; caricare prima in File, poi scegliere il file dalla scheda prodotto. |
| Home (23 settembre, seconda versione) | Otto sezioni: apertura "Piante che abbracciano", **Chi sono** (la storia di Simona in tre righe), **Cos'&egrave; un kokedama** (fascia verde scura), **Cosa troverai** (tre colonne con link: vivi, stabilizzati, workshop), i due blocchi prodotti, il terrazzo, la chiusura con il pulsante WhatsApp. Tolte: le due schede collezione, i servizi e la **finta testimonianza** con "[Nome, Citt&agrave;]", che era pubblica. |
| Spedizioni nel checkout | **Solo Italia** (12,90 &euro;, gratis da 120 &euro;). Le zone UE e Internazionale sono state eliminate il 23 settembre. |
| Resi | Pagina `resi-e-rimborsi`, **volutamente fuori dal menu**: ci si arriva dal link nelle schede prodotto. Rimanda all'informativa formale su /policies/refund-policy. |
| Prodotti stabilizzati | Template dedicato `product.stabilizzato.json`, assegnato a Bouquet secco e Composizione d'autunno: occhiello "Non chiede acqua" e riga **"Non serve curarlo"** al posto di "Cura". Uno stabilizzato non si annaffia: la scheda con le immersioni faceva credere di aver comprato una pianta viva. |
| Pagine sparite | Il 23 settembre **Spedizioni, Prezzi, Servizi e Filosofia non esistono piu** (eliminate da qualcun altro). I link del tema che ci puntavano sono stati rediretti: "La nostra storia" e "Workshop e servizi" in home, e le schede prodotto ora hanno il testo dentro invece del rimando alla pagina. **Il sito non ha piu una pagina che spieghi spedizioni e resi.** |
| Collezione vivi | Template dedicato `collection.vivi.json`, assegnato a Laboratorio Ferrara: descrizione, griglia, poi "Quale pianta scegliere?" con pulsante WhatsApp e "Cura nel tempo". Serviva un template a parte perche la descrizione di una collezione esce tutta **sopra** la griglia. |

### Cosa NON è ancora allineato — da fare prima di aprire

- **Instagram non è configurato** (`social_instagram_link` è vuoto). I testi non lo
  citano: quando Simona dà il profilo, va messo nelle impostazioni del tema.
- **Il checkout spedisce ancora le piante vive in tutta Italia.** Il profilo *Piante vive -
  solo Italia* va trasformato in sola consegna locale. Non l'ho toccato per la regola sul
  nodo fiscale qui sotto. Finché il negozio è chiuso nessuno lo vede, ma il sito dice
  "solo Ferrara" e il checkout dice "Italia": vanno riallineati.
- **Non usare il "Ritiro in negozio" di Shopify**: mostra l'indirizzo al checkout, e
  l'indirizzo non va pubblicato. Il ritiro si concorda su WhatsApp.
- **Prezzi**: sul sito i vivi restano 25 / 38 / 55 €. Il piano propone 49–69 € per i vivi
  e 69,90–74,90 € per gli stabilizzati. Non deciso.

### Regola sui testi: "fatto a mano" solo per i vivi

Vendere col proprio marchio prodotti di un fornitore è legittimo. Presentarli come fatti a
mano nel laboratorio di Ferrara no: è pratica commerciale ingannevole. "Fatti a mano",
"uno per uno" e "pezzo unico" si usano **solo per la linea Ferrara**. Della collezione
stabilizzata si dice cosa è (non chiede acqua, dura a lungo, viaggia bene), non chi la fa.
E va detto chiaro che non è una pianta viva.

---

## Il nodo fiscale — aperto, viene prima di tutto il resto

**Simona non ha partita IVA.** Emerso il 9 settembre 2026, mentre si sceglieva il
corriere. Cambia la natura del progetto, non è un dettaglio.

In Italia vendere beni in modo continuativo e organizzato — catalogo, carrello,
spedizioni — è attività d'impresa: richiede P.IVA, iscrizione alla Camera di
Commercio e SCIA per il commercio elettronico. Non esiste una soglia di esenzione:
la vendita occasionale vale per operazioni sporadiche, non per un negozio con nove
prodotti a listino.

Il costo che pesa non è la tassazione (forfettario al 5% i primi anni) ma i
**contributi INPS commercianti**: minimale fisso intorno ai 4.000 € l'anno, dovuto
anche a zero vendite. Sotto i 6.000–8.000 € di fatturato non si ripaga.

### Le tre strade

1. **Sito vetrina** (la più probabile): via il carrello, i prodotti restano a
   catalogo con foto e descrizioni, il pulsante d'acquisto diventa WhatsApp. La
   vendita avviene fuori dal sito. Il tema costruito funziona identico. Fa cadere
   tutto il capitolo spedizioni: niente tariffe, niente corrieri, niente Sendcloud.
2. **Workshop come attività principale**: insegnare è prestazione occasionale di
   lavoro autonomo, regole più morbide della vendita di merce (soglia 5.000 €
   lordi annui per i contributi). I kokedama diventano il souvenir del laboratorio.
3. **Aprire la P.IVA**: ha senso solo oltre i ~6.000–8.000 € l'anno.

### Decisione presa il 9 settembre 2026

Il sito **resta un e-commerce completo** e si consegna cos&igrave;: negozio chiuso con
password, pronto ad aprire. Convertirlo in vetrina sono trenta minuti, si fa
quando e se serve &mdash; non c&rsquo;&egrave; motivo di deciderlo prima del commercialista.

Un sito chiuso non vende: il momento delicato &egrave; solo quello in cui si toglie la
password. Quella decisione &egrave; di Simona, ed &egrave; stata comunicata per iscritto.

Da verificare: Shopify Payments chiede dati fiscali in attivazione. Senza P.IVA
l&rsquo;attivazione potrebbe bloccarsi, e il carrello resterebbe senza incasso.

### Regola per chi lavora qui

Non è consulenza fiscale e nessuno in questo progetto è un commercialista. La
decisione va presa da Simona con un professionista **prima** di togliere la
password al negozio. Finché non è presa:

- non attivare pagamenti, non configurare spedizioni, non aprire il negozio;
- non installare app di spedizione: Sendcloud e simili chiedono la P.IVA in fase
  di registrazione, senza non si passa;
- il lavoro su tema e contenuti prosegue normalmente, non è bloccato.

La consulenza è **fuori dal compenso di 400 €**, come le altre voci legali e fiscali.

---

## Come è organizzata la cartella

### Il tema vero (quello che conta)

```
dawn-kokedama/          copia di Dawn con le nostre personalizzazioni
```

Non si modifica a mano se non per casi isolati: viene **rigenerato dagli script**.

Gli script vanno lanciati **in quest'ordine**, perché ognuno riscrive pezzi del precedente:

```bash
node personalizza-dawn.js   # colori, font, spaziature, bordi, carrello
node templates-dawn.js      # template di prodotto, collezione e pagine
node testi-dawn.js          # testi italiani di barra annunci, header, footer
node editoriale-dawn.js     # tipografia grande, griglia sfalsata, home
node verifica-tema.js       # controllo locale PRIMA di caricare
```

`pacchetto-tema.js` crea `tema-kokedama.zip` per il caricamento manuale.
Serve solo se la riga di comando non è disponibile: normalmente si usa `theme push`.

### La vetrina (7 ottobre, staccata da Shopify il 13 ottobre)

```
contenuti-estrai.js  ->  contenuti/prodotti.json + contenuti/foto/
vetrina-statica.js   ->  vetrina/      copia del negozio, senza carrello
vetrina-dinamica.js  ->  vetrina/      schede e griglie riempite dai dati
struttura/                             copia di sicurezza delle pagine
serve-vetrina.js                       la guarda in locale, porta 4320
supabase/kokedama-schema.sql           tabella e permessi del pannello
```

Si lanciano **in quest'ordine**, e i primi due vanno insieme:

```bash
node vetrina-statica.js && node vetrina-dinamica.js
```

`vetrina-dinamica.js` **consuma** quello che `vetrina-statica.js` ha appena
scritto: legge una scheda prodotto, ne ricava il modello e poi cancella tutte
le copie. Rilanciarlo due volte di fila si ferma da solo e lo dice.

**La rete di salvataggio (`struttura/`).** `vetrina-statica.js` scarica le
pagine dal negozio Shopify: se quell'abbonamento scade, senza una copia il
sito non si ricostruirebbe **mai piu**. Per questo ogni copia riuscita viene
messa da parte in `struttura/` (5,7 MB, va tenuta nel progetto).

Quando il negozio non risponde — o con `--senza-shopify` — lo script riparte
da li invece di scaricare, e lo dice a schermo. Provato il 14 ottobre 2026: le
pagine ricostruite dalla copia sono **identiche al byte** a quelle scaricate
(stesso md5 su `index.html` e `kokedama.css`), e il sito finito funziona
uguale. La copia si aggiorna **solo a lavoro finito**: se qualcosa va storto a
meta, lo script si ferma e la copia buona di prima resta intatta.

Quindi: i **prodotti** stanno in `contenuti/`, le **pagine** in `struttura/`.
Shopify ormai non serve piu a niente e si puo spegnere.

**Com'e fatta adesso.** Le quattordici schede prodotto non esistono piu come
file: ce n'e **una sola**, `products/scheda.html`, che dall'indirizzo capisce
quale pianta mostrare. Ogni `/products/<handle>` ci arriva per una riga in
`_redirects` (e `serve-vetrina.js` fa lo stesso in locale, altrimenti in
locale si vedrebbe un 404 e online no). I percorsi dentro quella pagina sono
**assoluti**: con quelli relativi, un indirizzo con la barra finale la
lasciava senza grafica.

Le griglie — le due collezioni, `/collections/all` e le due fasce della home —
sono `<ul>` vuote con `data-campo="griglia"`. Le riempie `assets/catalogo.js`.

**Da dove arrivano i prodotti.** Da `contenuti/prodotti.json`, estratto da
Shopify una volta sola. Quando Supabase sara configurato, `catalogo.js` legge
da li e **ricade sul file** se il database non risponde: un disservizio non
lascia la vetrina vuota. Gli indirizzi si mettono con due variabili d'ambiente
prima della ricostruzione:

```bash
SUPABASE_URL=... SUPABASE_ANON_KEY=... node vetrina-dinamica.js
```

**Cosa resta copia fissa**: home (la parte di testo), workshop, chi sono,
contatti, resi, informative. Dal pannello non si toccano, non vale la pena.

**Le differenze che il modello gestisce da solo**: gli stabilizzati non hanno
le taglie (prezzo unico) e **non hanno la riga "Cura"** — marcata
`data-solo="Kokedama"` e tolta a chi non e una pianta viva. Dire a chi ha
comprato una composizione secca di immergerla e il modo piu veloce per
farsela tornare indietro.

**Un handle che non esiste** non da errore: la pagina dice che quella pianta
non c'e piu e offre le altre e WhatsApp.

### Il prototipo statico (storico)

```
build.js + index.html, shop.html, prodotto.html, ...
```

Sito finto in HTML puro, servito per far approvare il disegno **prima** di costruire
su Shopify. Ha esaurito la sua funzione: si tiene come riferimento visivo, non è il
sito vero. Le pagine `.html` sono **generate** da `build.js` — modificarle a mano è
inutile, al prossimo `node build.js` si perde tutto.

### Documenti

- `consegna.html` — elenco di tutto ciò che manca per consegnare, diviso per
  responsabile. **È il documento più aggiornato sullo stato del progetto.**
- `GUIDA-DAWN.md` — come si carica e si configura il tema su Shopify.
- `README.md` — riguarda il prototipo statico, non il tema.

---

## Comandi

La riga di comando Shopify è già autenticata su questo computer.

```bash
cd dawn-kokedama
npx @shopify/cli@latest theme push  --store kokedamasculture.myshopify.com --theme 204758417733
npx @shopify/cli@latest theme list  --store kokedamasculture.myshopify.com
npx @shopify/cli@latest theme check
```

Per la vetrina statica:

```bash
node contenuti-estrai.js    # una volta sola: porta via da Shopify catalogo e foto
node vetrina-statica.js && node vetrina-dinamica.js   # ricostruisce la vetrina
node vetrina-statica.js --senza-shopify               # prova la rete di salvataggio
node serve-vetrina.js       # la guarda su http://localhost:4320
```

**Il tema è pubblicato**: `theme push` senza `--allow-live` si ferma chiedendo conferma
e, da riga di comando non interattiva, fallisce. Aggiungere `--allow-live`.

`theme list` è l'unica risposta affidabile alla domanda "qual è il tema pubblicato".
Non fidarti di quello che si vede nel browser: vedi la trappola numero 6.

Per caricare un solo file: `theme push --only assets/kokedama.css`.

---

## Trappole già scoperte — non ricascarci

**1. In Dawn 1rem = 10px.**
Il tema imposta `html { font-size: 62.5% }`. Un `font-size: 0.85rem` diventa 8,5 px,
non 13,6. Ha già prodotto un sito con scritte illeggibili. Nel CSS del tema usa la
scala di Dawn: `1.5rem` = 15px.

**2. Il font si chiama `cormorant_n4`.**
`cormorant_garamond_n4` non esiste nella libreria di Shopify e fa fallire il push.
Gli handle dei font vanno verificati provando a caricare, non a memoria.

**3. `settings_data.json` va scritto per esteso.**
Dawn appena scaricato ha `"current": "Dawn"`, cioè un rimando al preset. Il nuovo
editor di Shopify non lo risolve: mostra l'avviso *"gli schemi di colori devono essere
definiti nei file settings_data e settings_schema"* e ignora i colori. `personalizza-dawn.js`
espande il preset dentro `current`: non tornare indietro.

**4. Ogni impostazione va verificata contro lo schema della sezione.**
Le sezioni accettano solo le chiavi dichiarate nel loro `{% schema %}`. Esempio già
capitato: il blocco `announcement` accetta solo `text` e `link` — colore e allineamento
stanno sulla **sezione**, non sul blocco. Shopify scarta in silenzio le chiavi ignote,
quindi l'errore non si vede finché non manca l'effetto. Per questo esiste `verifica-tema.js`:
lanciarlo prima di ogni push.

**5. I template delle pagine si possono assegnare solo a tema pubblicato.**
Nel menu "Modello" di una pagina Shopify elenca i template del tema **pubblicato**.
Finché il nostro resta in bozza, `page.testo`, `page.faq` e `page.contact` non compaiono.

**6. L'anteprima inganna.**
Aprendo un link con `?preview_theme_id=...` Shopify salva una sessione di anteprima:
da quel momento **anche l'indirizzo normale mostra la bozza**, ma solo in quel browser.
È già successo di credere il tema pubblicato quando non lo era. Verifica con `theme list`.

**7. I file `.html` e i file dentro `dawn-kokedama/` sono generati.**
Modificali negli script, non nel risultato.

**8. Le sezioni non si agganciano con `#shopify-section-<chiave>`.**
Nei template JSON Shopify genera id del tipo `shopify-section-template--31444990689605__banner`,
non `shopify-section-banner`. Il selettore giusto è per suffisso: `[id$="__banner"]`.
Con la forma sbagliata il CSS viene caricato ma non applica niente, e l'errore è invisibile:
la pagina sembra solo "un po' spenta". Verifica sempre con `getComputedStyle` sul sito, non a occhio.

**9. Nel pannello Shopify, scrivere senza il cursore in un campo fa danni.**
Il pannello ha scorciatoie da tastiera: se il testo digitato non finisce in un campo,
ogni lettera diventa un comando e si aprono finestre a caso (è successo: "Aggiungi prodotto",
"Aggiungi articolo del blog"). Prima di scrivere, fai clic sul campo e **verifica che ci sia
il cursore** con uno screenshot ingrandito. Subito dopo un caricamento di pagina il clic
spesso non basta: aspetta qualche secondo e riprova.

**10. L'editor HTML delle pagine si blocca con testi lunghi.**
Digitare più di ~600 caratteri in un colpo nella vista codice congela la scheda per minuti,
e a volte per sempre. Scrivi a pezzi, e tra un pezzo e l'altro controlla che il testo sia
entrato tutto. Il timeout dello strumento non vuol dire che il testo sia perso: di solito
arriva, solo lentamente. Niente si salva finché non si preme Salva.

**11. Le collezioni automatiche impiegano un po' a comparire in vetrina.**
`tutti-i-kokedama` è rimasta per giorni a 0 prodotti in vetrina. Le due collezioni del
17 settembre invece sono comparse subito. Dopo averne creata una, controlla sul sito
quante schede mostra davvero, non solo il numero nel pannello.

**17. "Attivo" non vuol dire "sul sito".** Un prodotto importato da CSV con
`Published=FALSE` resta fuori dai canali di vendita: nella lista prodotti la colonna
**Canali segna 0** e in vetrina non compare, anche se lo stato e Attivo. Servono due
passaggi: *Imposta come attivo* e poi *Altre azioni &rarr; Includi nei canali di vendita
&rarr; Negozio online*. Verifica sempre sul sito, non nel pannello.

**18. La tabella di modifica in blocco mangia i tasti.** Cliccare una cella e digitare
"38" scrive "3". Funziona cosi: doppio clic sulla cella, `ctrl+a`, digita, `Invio`
(che conferma e scende alla riga sotto).

**20. "Seleziona esistente" puo attaccare la foto sbagliata.** Il Ficus ginseng si e
ritrovato come seconda immagine il file del Pothos e felce, preso dalla libreria File:
in vetrina la galleria mostrava due piante diverse. Dopo aver collegato le foto,
**controlla che ogni prodotto abbia solo il suo file**, dal sito e non dal pannello:
`/products.json` elenca `images[].src` e il nome del file si confronta con l'handle.

**22. Le immagini di Dawn senza il loro rapporto d'aspetto sono alte zero.**
Riusando il markup `.media` di Dawn per la foto della scheda, l'immagine
caricava (1086x1448, nessun errore in console) ma veniva resa **627x0**: quel
contenitore prende l'altezza da una variabile che il carosello imposta a mano,
e l'`img` dentro e `position: absolute`. Non si vedeva niente e non c'era
nessun errore da cercare. Se riusi un pezzo di Dawn fuori dal suo contesto,
**misura l'elemento reso** (`getBoundingClientRect`), non fidarti del fatto
che il file esista e il `src` sia giusto. Nella scheda ora c'e markup nostro:
`.vetrina-foto { width: 100%; height: auto }`, l'altezza la decide la foto.

Stesso giorno, stesso tema: l'apertura della home e una fascia **larga e
bassa** (752x357) e le foto dei prodotti sono **verticali** (1086x1448). Con
`object-fit: cover` si vedeva una striscia ingrandita del tronco. Si e alzato
il riquadro a 52rem (42 su telefono).

**21. Lo sfondo CSS delle sezioni vuole quattro classi, sempre.** La foto del
terrazzo non si vedeva: al suo posto un rettangolo grigio in mezzo alla home. La
regola era scritta su `[id$="__terrazzo"] .image-with-text__media`, una classe, e
Dawn la batteva con `.image-with-text__media.background-transparent.global-media-settings`,
tre classi, che azzera lo sfondo con la scorciatoia `background` &mdash; quindi porta via
anche `size` e `position`. Il banner era gia stato sistemato mesi fa, il terrazzo no.
Quando aggiungi una sezione con foto di sfondo: **quattro classi e riscrivi
size/position/repeat dentro lo stesso blocco.**

**19. Le varianti si rifanno con un import CSV, non a mano.** Per passare i 15 vivi
da un prezzo unico a tre taglie bastano 45 righe (tre per handle: solo la prima porta
titolo, descrizione e tag, le altre due solo la variante) importate con
*Sovrascrivi i prodotti con handle corrispondenti*. L'anteprima dice "Importerai circa
45 prodotti": **conta le righe, non i prodotti** &mdash; i prodotti restano 15 e le
vecchie varianti (`Default Title`, `Da definire`) vengono sostituite, non affiancate.
Due colonne vanno lasciate fuori: **Image Src** (le foto sono gia su Shopify, se
rimetti gli URL Shopify le riscarica e fa doppioni) e **Variant Inventory Qty**.

**16. In Dawn il titolo di una colonna "multicolonna" non ha la classe che ti aspetti.**
È un `<h3 class="inline-richtext">` dentro `.multicolumn-card__info`. La regola scritta
su `.multicolumn-card__title` non applicava niente ed è rimasta morta per giorni senza
che si vedesse. Quando scrivi CSS per una sezione, guarda il markup vero con
`read_page` o `getComputedStyle`, non fidarti del nome che sembra logico.

**14. `show_description` mostra la descrizione DELLA COLLEZIONE, non il campo lì accanto.**
Nella sezione "Collezione in evidenza" il campo `description` del tema viene ignorato se
`show_description` è acceso: Shopify stampa la descrizione della collezione. Sulla home
finiva tutto il testo lungo della pagina vivi. Se vuoi un testo diverso, spegnilo.

**15. Chi lavora qui non è solo.** Fra il 17 e il 23 settembre qualcun altro ha cambiato
menu, descrizioni e ha eliminato quattro pagine. Prima di dare per buono quello che
c'è scritto in questo file, **controlla sul sito**: i link che puntano a pagine
eliminate diventano 404 silenziosi.

**13. Un `<a class="button">` dentro il testo di una pagina esce illeggibile.**
La regola `.rte a` di Dawn pesa più della classe `.button`, quindi il testo del pulsante
resta verde scuro su verde scuro. In `kokedama.css` c'è la correzione `.rte a.button`:
non toglierla, e se aggiungi pulsanti nei testi verifica il colore con `getComputedStyle`.

**12. Il connettore Shopify dell'app può scadere.**
Se gli strumenti API rispondono "connection invalidated", i dati del negozio (collezioni,
menu, pagine) vanno modificati dal pannello via Chrome. Il tema resta raggiungibile
con la riga di comando.

**23. Shopify risponde 429 a chi non si presenta, e non c'entra il traffico.**
Il filtro Cloudflare davanti a `*.myshopify.com` scarta le richieste senza intestazione
`User-Agent`, e `fetch()` di Node non ne manda nessuna. La risposta è
`429 local_rate_limited`, che si legge come "troppe richieste": il 30 ottobre ho
aspettato venti minuti credendo a un limite di traffico, mentre `curl` dalla stessa
macchina e nello stesso istante riceveva 200. Senza quell'intestazione non passa mai,
nemmeno alla prima richiesta della giornata — ma **non basta aggiungerla**: il 3
novembre curl riceveva 200 e Node 429 *con lo stesso nome*, perché il filtro guarda
anche la stretta di mano cifrata, non solo le intestazioni. Ho provato anche il modulo
`https` al posto di `fetch`: stesso 429. Per questo `vetrina-statica.js` scarica con
`curl` (su Windows c'è da anni) e tiene `fetch` solo come riserva. Non riportarlo a
`fetch` per "pulizia": smette di funzionare a giorni alterni.

**24. La rete di salvataggio può cancellare il lavoro del giorno.**
Quando Shopify non risponde, `vetrina-statica.js` ricostruisce da `struttura/`: le
correzioni aggiunte quel giorno in `CORREZIONI_SIMONA` **non vengono applicate**,
perché quella cartella contiene pagine già costruite. Prima lo faceva in silenzio.
Adesso si ferma con un errore se il negozio risponde "aspetta" (429 o 5xx), e usa la
copia solo se non risponde del tutto. Dopo ogni ricostruzione **leggi l'ultima riga**:
se dice "ricostruito da struttura/", le modifiche di oggi non ci sono.

---

## Cosa è fatto e cosa manca

*Aggiornato il 17 settembre 2026. Quello che segue è verificato sul sito, non ricordato.*

**Fatto**: tema costruito e **pubblicato**, colori e tipografia, home a dieci sezioni
con le due linee di vendita, template di prodotto e collezione, riga di comando collegata.
Nome del brand, logo, 9 prodotti con foto, menu principale con le due linee,
collezioni `laboratorio-ferrara` e `collezione-stabilizzata`.

**Nove pagine** scritte e pubblicate: Chi siamo (con la storia del kokedama e il
terrazzo), Cura del kokedama, Spedizioni, FAQ, Contatti, Servizi (otto servizi:
workshop e aperitivo, cura, custodia durante le vacanze, installazioni, eventi,
idee regalo, manutenzione, bomboniere) e Il terrazzo.

**Manca**, in sintesi (`consegna.html` è del 22 agosto e in parte superato):

- riallineare il checkout al modello a due linee: piante vive solo consegna locale
- decidere i prezzi delle due linee
- fornitori della collezione stabilizzata
- **nodo fiscale**: P.IVA, pagamenti, pagine legali — tutto rimandato alla fine per scelta
- **Instagram**: senza il profilo il footer resta a tre colonne. Quando arriva: blocco `brand_information` in `testi-dawn.js` + account in Impostazioni &rarr; Social media
- due collezioni vuote e duplicate "Tutti i kokedama" (0 prodotti) da far eliminare a Simona
- da verificare: template assegnati alle pagine (`page.faq`, `page.contact`, `page.testo`)

Nei testi delle pagine i buchi sono marcati fra parentesi quadre — `[da definire]`,
`[Costi di spedizione da definire con Simona]` — così si trovano cercandoli.

---

## Come lavorare qui

- **Verifica, non rassicurare.** L'utente ha già ricevuto un "è tutto a posto" che
  non era vero. Prima di dichiarare qualcosa fatto, controllalo con un comando e
  mostra il risultato.
- **Distingui il negozio dal tema.** Il tema è il vestito; prodotti, ordini,
  pagamenti e pagine sono dati del negozio e stanno altrove.
- **Non chiedere password.** Le credenziali del negozio sono di Simona. L'accesso
  corretto per uno sviluppatore è l'invito come collaboratore.
- **Non pubblicare e non aprire il negozio di iniziativa.** Pubblicare il tema e
  togliere la password sono decisioni dell'utente.
- **Scrivi in italiano corretto**, con accenti e apostrofi. Nel codice del tema
  servono le entità HTML (`&egrave;`, `&rsquo;`) dove il JSON viene interpretato come markup.
- **Commenta il perché**, non il cosa: gli script sono pieni di scelte che a distanza
  di giorni non si ricordano.
