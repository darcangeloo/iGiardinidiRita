# Piano off-page — "B&B Margherita di Savoia"

Il codice del sito è sistemato. Il ranking locale però dipende soprattutto da fattori fuori dal sito.
Fonte: riferimenti claude-seo `local-seo-signals.md` (Whitespark 2026, Search Atlas 2025, Sterling Sky, BrightLocal 2026).

| Gruppo di fattori (local pack) | Peso |
|---|---|
| Google Business Profile | 32% |
| Recensioni | ~20% |
| On-page (il sito) | 15-19% |

Prossimità all'utente spiega il 55% della varianza (Search Atlas): chi cerca "B&B Margherita di Savoia" stando in paese vede prima i B&B vicini. Non si controlla, ma il resto sì.

## 1. Google Business Profile (priorità assoluta)
- [ ] Verifica se esiste già un profilo (cerca "I Giardini di Rita" su Google Maps). Se esiste, rivendicalo; se no, crealo su business.google.com.
- [ ] **Categoria principale: "Bed & breakfast"**. La categoria sbagliata è il fattore negativo n.1.
- [ ] Nome: il nome reale ("I Giardini di Rita - Rooms & Garden Loft"). Non aggiungere "B&B Margherita di Savoia" se non fa parte del nome legale: Google lo considera spam e può sospendere il profilo.
- [ ] Sito web: link al sito (quando avrai il dominio definitivo, aggiornalo).
- [ ] Indirizzo, telefono, email identici al sito (NAP): Via Cavaliere, 15 · +39 2379928882.
- [ ] Attributi: WiFi, parcheggio, animali ammessi, colazione.
- [ ] Foto: esterno, camere, giardino, bagno, colazione. Aggiungerne alcune aiuta; aggiungerne troppe non dà benefici extra (WebFX).
- [ ] Controlla che non esistano profili duplicati allo stesso indirizzo (fattore negativo n.2).

## 2. Recensioni Google
- [ ] Obiettivo iniziale: **10 recensioni Google**. Sterling Sky ha misurato un salto di ranking proprio a quota 10.
- [ ] Continuità: se non arrivano recensioni nuove per circa 3 settimane i ranking calano (Sterling Sky). Meglio 1-2 a settimana che 20 in un mese.
- [ ] Come chiederle: messaggio WhatsApp dopo il check-out con il link diretto alla recensione.
- [ ] **Vietato il review gating** (chiedere la recensione solo agli ospiti soddisfatti) e vietate le recensioni false o incentivate: violano le policy Google.
- [ ] Rispondi a tutte le recensioni, anche quelle negative.

## 3. Profili che collegano al sito (citazioni + backlink)
Ognuno dovrebbe avere lo stesso nome/indirizzo/telefono e il link al sito:
- [ ] Facebook (facebook.com/igiardinidirita): inserisci il link al sito nelle info.
- [ ] Booking.com e TripAdvisor: aggiungi il sito se il pannello lo permette.
- [ ] **Bing Places**: ChatGPT, Copilot e Alexa usano l'indice Bing.
- [ ] **Apple Business** (Apple Maps / Siri).
- [ ] viaggiareinpuglia.it: il portale turistico regionale ti elenca già. Chiedi di aggiungere il link al sito.
- [ ] Instagram: BrightLocal 2026 lo indica al 37% di utilizzo per le recensioni locali, in crescita.

## 4. Search Console e Bing Webmaster (appena possibile)
- [ ] Google Search Console: aggiungi il sito, invia `sitemap.xml`, richiedi l'indicizzazione della home.
- [ ] Bing Webmaster Tools: stessa cosa.
- [ ] Oggi `site:i-giardinidi-rita.vercel.app` restituisce 0 risultati: finché Google non indicizza la pagina, non può posizionarla.

## 5. Dominio definitivo
- [ ] Un dominio proprio (es. `igiardinidirita.it`, se libero) al posto di `*.vercel.app`.
- [ ] Il dominio `www.igiardinidirita.it` oggi mostra un sito estraneo (gate "18+"): verifica se è acquistabile o scegline un altro.
- [ ] Dopo il cambio: aggiorna canonical, og:url, schema `url`/`@id`, sitemap, robots.txt, llms.txt e il link su GBP/Facebook.

## Come capire se funziona
- 2-4 settimane dopo Search Console: la home compare con `site:dominio`.
- Report Performance di Search Console: impressioni per "b&b margherita di savoia".
- GBP Insights: chiamate, richieste di indicazioni stradali, click al sito.
- Numero di recensioni Google e data dell'ultima (non lasciar passare più di 3 settimane).

## Realismo
Superare Booking.com nei risultati organici per quella keyword è molto difficile per un sito nuovo: Booking ha un'enorme autorità di dominio. Il posto realistico dove comparire sopra Booking è il **local pack / Google Maps** (i 3 risultati con la mappa), che dipende da GBP + recensioni + prossimità, non da Booking.
