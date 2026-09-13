# SEO Audit — I Giardini di Rita
URL audited: https://i-giardinidi-rita.vercel.app (temporary domain, will change)
Date: 2026-09-13
Scope note: single-page static site — audit scaled accordingly (no 500-page crawl, no cluster/ecommerce/maps agents; those don't apply to a 1-page brochure site).

## Executive Summary

**SEO Health Score: 57 / 100**

Business type detected: Lodging (B&B / rooms & garden loft), local/brick-and-mortar.

The site is well-written and technically clean in most respects, but it is currently **invisible on Google** for "B&B Margherita di Savoia" — confirmed by live search. That's expected for a few-days-old site with zero backlinks and no sitemap, but one issue makes it actively harmful once it *does* get crawled.

### Top 5 critical/high issues
1. **Canonical + Open Graph point to a domain you don't control.** `https://www.igiardinidirita.it/` currently serves an unrelated adult "18+ Access" gate page (confirmed live). Every canonical tag, OG url, and OG image on the site references this domain.
2. **No `robots.txt` or `sitemap.xml`** (both 404). Nothing tells Google what to crawl or where the map is.
3. **Schema is missing `sameAs`, `image`, `aggregateRating`, `geo`.** You already have real reviews and profiles on Booking.com, TripAdvisor, Facebook, and Bedandbreakfast.eu — none are linked from the schema, so Google can't connect them to this site.
4. **Hero image (`assets/esterno.jpg`) is 690KB**, unoptimized, and is the desktop LCP element — the single biggest performance drag on the page.
5. **Bilingual toggle has no `hreflang`/lang-switching**: `<html lang="it">` never changes when a visitor switches to English, and both language variants sit in the DOM simultaneously (one hidden via CSS). Search engines will only ever index the Italian text.

### Quick wins (cheap, high impact)
- Point canonical/OG to the live Vercel URL until the real domain is ready (5 min fix, prevents actively misleading search engines).
- Add a 6-line `robots.txt` + a 1-URL `sitemap.xml`.
- Add `sameAs` array to the LodgingBusiness schema linking Booking.com, TripAdvisor, Facebook (all found live, see Local section).
- Add `loading="lazy"` to the 5 gallery `<img>` tags (below the fold).
- Compress `esterno.jpg` (690KB → target under 150KB, WebP).
- Link the existing Facebook page from the footer.

---

## Technical SEO — Score: 45/100

**What works:**
- HTTPS everywhere, HSTS header present (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`).
- Correct viewport meta (`width=device-width, initial-scale=1`), pinch-zoom not disabled.
- Single `<h1>`, clean `h1 → h2` hierarchy, no skipped levels.
- Clean URL, no redirect chains, 200 status, Vercel CDN cache HIT.

**Findings:**

| Severity | Finding | Detail | Fix |
|---|---|---|---|
| Critical | Canonical/OG domain not owned/live | `<link rel="canonical" href="https://www.igiardinidirita.it/">` and the matching `og:url`/`og:image` point to a domain that currently resolves to an unrelated adult-content landing page (verified live via curl, `Server: cloudflare`, title "18+ Access"). If this domain is ever crawled while pointing here, or if anyone shares this site's link preview, the OG image/url metadata is wrong. | Change canonical + OG url/image to `https://i-giardinidi-rita.vercel.app/` now; swap back only once the real domain is purchased, DNS-configured, and verified serving *this* site. |
| High | `robots.txt` missing (404) | No crawl directives, no sitemap pointer. | Add a minimal `robots.txt`: `User-agent: *\nAllow: /\nSitemap: https://<domain>/sitemap.xml` |
| High | `sitemap.xml` missing (404) | Even a 1-page site benefits from an explicit sitemap for faster discovery/indexing signals. | Add a single-URL sitemap.xml. |
| Medium | No `hreflang` / no lang-switch on toggle | `<html lang="it">` is static; the EN text sits in the same DOM, just CSS-hidden. Google will index the Italian copy only; English-speaking search demand is left on the table. | Short-term: set `document.documentElement.lang` in the JS toggle handler (cheap, fixes accessibility + gives a truthful lang signal). Longer-term: real `/en/` URL + `hreflang="en"`/`hreflang="it"` alternates if English traffic matters. |
| Low | No CSP header | Vercel doesn't set one by default; not required for a static brochure site with no user input, but cheap to add via `vercel.json` headers if you want the extra hardening. | Optional. |

---

## Content Quality — Score: 65/100

**What works:**
- All body copy is original (verified — not copy-pasted from Booking.com or Wikipedia, per prior work in this project).
- Specific, non-generic facts: salt-pan size, Ramsar wetland status, IGP onion, real distances to landmarks — this is exactly the kind of specific detail that helps both classic SEO and AI-answer citability.
- Real photos (not stock), matching the descriptive text.

**Findings:**

| Severity | Finding | Detail | Fix |
|---|---|---|---|
| Medium | Single page, no depth content | A 1-page brochure site has no supporting content (no "things to do" page, no blog, no dedicated room pages) to rank for longer-tail local queries. | Not urgent for launch; if you want more organic traffic later, a couple of dedicated pages ("Le saline di Margherita di Savoia", "Come arrivare dall'aeroporto di Bari") would give Google more to index. |
| Low | Reviews mentioned but not linked | "Favoloso 8.8 — 47 recensioni su Booking.com" is text only, no link to the actual review page. | Make it a link to your Booking.com listing (also helps the sameAs signal below). |
| Info | Rating discrepancy to verify | Live web search shows a booking aggregator citing **9.1** rating; your site shows **8.8**. Ratings drift over time — worth checking the live Booking.com number before next deploy. | Verify against your actual Booking.com extranet figure. |

---

## On-Page SEO — Score: 70/100

| Severity | Finding | Detail | Fix |
|---|---|---|---|
| Low | Meta description slightly long | 175 characters (ideal ≈155–160; Google typically truncates ~160 on mobile). | Trim ~15-20 characters. |
| Info | Title length fine | 55 characters — safely within display limits. | No action. |
| Good | Heading structure | One `h1`, sequential `h2`s per section, no skipped levels. | No action. |
| Good | Alt text | All 7 `<img>` tags have descriptive, non-generic alt text. | No action. |

---

## Schema & Structured Data — Score: 40/100

Current: single `LodgingBusiness` JSON-LD with name, description, address, telephone, url, priceRange.

**Missing, high-value additions** (all backed by real, verifiable external data found this session):

```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "I Giardini di Rita",
  "image": "https://i-giardinidi-rita.vercel.app/assets/esterno.jpg",
  "address": { "...": "unchanged" },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.383,
    "longitude": 16.147
  },
  "telephone": "+39 2379928882",
  "url": "https://i-giardinidi-rita.vercel.app/",
  "priceRange": "€€",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "8.8",
    "reviewCount": "47"
  },
  "sameAs": [
    "https://www.booking.com/hotel/it/i-giardini-di-rita-rooms-amp-garden-loft.html",
    "https://www.tripadvisor.com/Hotel_Review-g494954-d25610886-Reviews-I_Giardini_Di_Rita_Rooms_Garden_Loft-Margherita_di_Savoia_Province_of_Barletta_Andria.html",
    "https://www.facebook.com/igiardinidirita/",
    "https://www.bedandbreakfast.eu/en/a/KV3NuNCabjVq/i-giardini-di-rita-rooms-garden-loft"
  ]
}
```

`sameAs` is the single highest-leverage change available: it's what lets Google (and AI answer engines like ChatGPT/Perplexity, which cross-reference entity profiles) connect this new site to the already-established, already-reviewed business identity across Booking/TripAdvisor/Facebook. Right now those are four disconnected islands.

*(geo coordinates above are an approximate town-center placeholder — replace with the exact property coordinates, easy to grab from the Booking.com listing or Google Maps "share" link.)*

---

## Performance — Score: 55/100

Lab-estimated (no CrUX/PSI field data available — no Google Search Console/PageSpeed credentials configured in this environment).

| Severity | Finding | Detail | Fix |
|---|---|---|---|
| High | Unoptimized hero image | `assets/esterno.jpg` = 690KB, no compression, no WebP, no `srcset`. This is the desktop LCP (largest contentful paint) element — directly slows perceived load. | Compress + convert to WebP (with JPEG fallback), target <150KB. Single biggest perf win available. |
| Medium | No lazy-loading on gallery images | 5 below-the-fold photos load eagerly. | Add `loading="lazy"` to each. |
| Medium | No responsive images | Every photo ships one fixed resolution to every device. Mobile downloads the same bytes as desktop. | Add `srcset`/`sizes`, or at minimum a smaller mobile-sized copy. |
| Good | Video correctly gated to mobile-only | The 2.2MB hero video only loads (`videoFg.src = ...`) when `matchMedia('(max-width:767px)')` matches — desktop never fetches it. This is already the right call and shouldn't be undone. | No action — this was a deliberate, correct optimization from earlier in the build. |
| Low | No explicit width/height on `<img>` | Minor CLS risk while images decode, though grid/flex containers already reserve most of the space. | Add `width`/`height` attributes matching each photo's aspect ratio. |

---

## Images — Score: 65/100

- 7/7 images have descriptive alt text. ✅
- 0/7 use next-gen formats (WebP/AVIF) or are size-optimized. ❌
- Logo used correctly for favicon + OG image reference (though OG image URL currently points to the broken canonical domain — see Technical §1).

---

## AI Search Readiness (GEO) — Score: 50/100

| Severity | Finding | Detail | Fix |
|---|---|---|---|
| Medium | No `sameAs` entity graph | Covered above — this is the #1 GEO lever available: it's exactly the signal LLM-based answer engines use to corroborate "is this a real, reviewed business." | Add sameAs (see Schema section). |
| Medium | No `llms.txt` | Not yet a formal standard Google uses, but several AI crawlers respect it as a hint. Optional, low effort. | Low priority — skip unless you want to be an early adopter. |
| Good | Specific, citable facts in body text | "Europe's largest salt pans, second largest in the world," "4,000 hectares," "IGP white onion" — these are exactly the kind of extractable facts AI Overviews/ChatGPT like to quote. | No action — keep this pattern if adding more content later. |

---

## Local SEO (live findings from this session)

A live web search for "I Giardini di Rita Margherita di Savoia" surfaced an existing footprint the new site doesn't yet leverage:

- **Booking.com** listing (live, with reviews): https://www.booking.com/hotel/it/i-giardini-di-rita-rooms-amp-garden-loft.html
- **TripAdvisor** listing (live, with reviews): https://www.tripadvisor.com/Hotel_Review-g494954-d25610886-Reviews-I_Giardini_Di_Rita_Rooms_Garden_Loft-Margherita_di_Savoia_Province_of_Barletta_Andria.html
- **Facebook page** (live): https://www.facebook.com/igiardinidirita/ — **not linked anywhere on the new site**
- **Bedandbreakfast.eu**, **Ostrovok**, **LateRooms**, **AubergesDeJeunesse**, **Resapass**, **Amimir** — secondary OTA listings, all consistent on name/address.
- **viaggiareinpuglia.it** — the *official Puglia regional tourism portal* lists the property. This is a genuinely authoritative citation worth knowing you already have.
- NAP (Name/Address/Phone) consistency check: address "15 Via Cavaliere" / "Via Cavaliere, 15" matches across sources. ✅

**Competitive landscape** for "B&B Margherita di Savoia": B&B Via Veneto, B&B La Villetta, Margheritamare, ControVento Rooms, Conchiglia Suite, MEDUSA Residence B&B, Vista Mare Luxury Rooms — plus aggregator pages (Booking city page, Tripadvisor city list, bed-and-breakfast.it, cozycozy, bedebreakfast.net) dominate page 1. None of these are the new site — expected at this stage, but confirms there's real local competition to out-rank once the technical basics above are fixed.

**Recommendation:** add a "Trovaci anche su" / "Find us on" row (Booking, TripAdvisor, Facebook icons/links) somewhere on the page — cheap trust signal for visitors and reinforces the sameAs graph for search engines.
