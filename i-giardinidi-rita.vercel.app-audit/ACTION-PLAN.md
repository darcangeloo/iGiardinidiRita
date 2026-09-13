# Action Plan — I Giardini di Rita

## Phase 1: Critical Fixes (this week)

- [ ] **Fix canonical + OG domain.** Replace `https://www.igiardinidirita.it/` with `https://i-giardinidi-rita.vercel.app/` in: `<link rel="canonical">`, `og:url`, `og:image`, and the JSON-LD `url` field. Swap back only once the real domain is bought and verified serving this site.
- [ ] Add `robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://i-giardinidi-rita.vercel.app/sitemap.xml
  ```
- [ ] Add `sitemap.xml` (single URL, `lastmod` = deploy date).
- [ ] Add `sameAs` array to the LodgingBusiness schema (Booking.com, TripAdvisor, Facebook, Bedandbreakfast.eu links — all live, see report).

## Phase 2: High-Impact Improvements (weeks 2-3)

- [ ] Compress `assets/esterno.jpg` (690KB → <150KB) and convert to WebP with JPEG fallback.
- [ ] Add `loading="lazy"` to the 5 gallery `<img>` tags.
- [ ] Add `aggregateRating` + `geo` (real coordinates) to schema.
- [ ] Link the existing Facebook page from the footer.
- [ ] Set `document.documentElement.lang` in the IT/EN toggle handler so `<html lang>` matches the visible language.
- [ ] Trim meta description to ~155-160 characters.

## Phase 3: Content & Authority (month 2)

- [ ] Verify the Booking.com rating shown on-site (8.8) still matches the live extranet figure (an aggregator search this session showed 9.1 — could be stale on either side).
- [ ] Add a small "Trovaci anche su" row linking Booking/TripAdvisor/Facebook near the footer or booking CTA.
- [ ] Consider 1-2 supporting pages for longer-tail local queries (e.g. "Le saline di Margherita di Savoia", transport/airport info) if organic growth matters beyond direct/OTA traffic.
- [ ] Add `srcset`/responsive sizes to gallery photos.

## Phase 4: Monitoring & Iteration (ongoing)

- [ ] Once the real domain is live, submit both the domain and sitemap to Google Search Console.
- [ ] Re-run this search after Phase 1 ships: `site:i-giardinidi-rita.vercel.app` (or the real domain) to confirm indexing.
- [ ] Re-check "B&B Margherita di Savoia" ranking monthly — current page 1 is dominated by OTAs and 6-7 named competitors (see report), all beatable once technical basics are fixed and the domain accrues age/links.
