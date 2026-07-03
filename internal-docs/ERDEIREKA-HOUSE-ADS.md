# erdeireka.hu house-ad réteg — hazepitesikalauz.hu

> Létrehozva: 2026-07-04. Az erdeireka.hu saját (house-ad) hirdetési rétege,
> ami az AdSense **helyett** hirdethető, a meglévő feature-flag architektúrára
> építve (minta: [`utils/features.ts`](../utils/features.ts) AdSense-kapcsoló).
> A megvalósítás a **mathSeo (matekmegoldasok.hu)** azonos rétegéből portolt —
> mindkettő Deno Fresh projekt, a felépítés 1:1.

## Mi ez?

Egy **env-kapcsolóval + egy SSOT JSON-nal** vezérelt hirdetési réteg, ami az
erdeireka.hu-t hirdeti **AdSense-mintára**: site-wide alsó/felső beúszó (anchor)
banner, felugró popup (interstitial), plusz a tartalmi felületek (sidebar a TOC
alatt, cikk közepe/vége, homepage szekció) saját bannerekkel.

A Google AdSense **kódja megmarad** — a két réteg egymástól függetlenül
kapcsolható. Réka bannerei akkor jelennek meg, ha `ERDEIREKA_ADS_ENABLED=true`.

## Kapcsolók (env)

| env | érték | hatás |
|---|---|---|
| `ERDEIREKA_ADS_ENABLED` | `true` | **Réka bannerei minden felületen ON.** Bármi más / üres / nincs → OFF (minden rejtve). |
| `ERDEIREKA_TARGET_URL` | `https://erdeireka.hu` | Kattintási cél (UTM auto). Csak http(s) — guard, mert href-be kerül. |
| `ADSENSE_ENABLED` | `false` | (Külön kapcsoló) AdSense script + CSP-whitelist OFF (kód marad). |

**Alapértelmezés: OFF.** Csak az explicit `true` kapcsolja be — így véletlenül
nem jelenik meg éles hirdetés. A két réteg (AdSense / erdeireka) egymástól
független; ha mindkettő ON, mindkettő megjelenhet, ezért éles üzemben tipikusan
az egyik legyen csak bekapcsolva.

**Lokál dev:** másold a [`.env.example`](../.env.example)-t `.env`-be és írd be
`ERDEIREKA_ADS_ENABLED=true`. A Fresh/Vite betölti a `.env`-et a szerver-env-be
(`Deno.env`). **Flag-váltáshoz teljes szerver-restart kell** (`deno task dev`
újraindítás) — a folyamat-env nem frissül hot-reloaddal.

**Production (Deno Deploy):** a dashboard env-jei közé kell felvenni az
`ERDEIREKA_ADS_ENABLED`-et (a `.env` fájlt a repo nem tartalmazza).

## Megjelenés-beállítások (SSOT config)

A **mely felület jelenjen meg + időzítés** egy külön JSON-ban:
[`data/erdeireka-config.json`](../data/erdeireka-config.json). A
[`utils/erdeireka.ts`](../utils/erdeireka.ts) `getErdeirekaSettings()` olvassa
(hiányzó/rossz mezőre defaulttal), a route-ok ez alapján döntenek. A fő be/ki
továbbra is az `ERDEIREKA_ADS_ENABLED` env; ez a JSON csak finomhangol.

```jsonc
{
  "placements": {
    "sidebar":      { "enabled": true },   // TOC alatti half-page (desktop)
    "inArticleEnd": { "enabled": true },   // cikk-vég large-rectangle
    "inArticleMid": { "enabled": true }    // cikk-közép (2. H2 után) leaderboard
  },
  "anchor":       { "top": false, "bottom": true, "showDelayMs": 1200 },
  "interstitial": { "enabled": true, "minPageviews": 2, "delayMs": 4000 },
  "homepage":     { "enabled": true }      // homepage billboard szekció
}
```

| mező | default | mit vezérel |
|---|---|---|
| `placements.sidebar.enabled` | true | sidebar (TOC alatti) banner be/ki |
| `placements.inArticleEnd.enabled` | true | cikk-vég banner be/ki |
| `placements.inArticleMid.enabled` | true | cikk-közép banner be/ki (csak ha van ≥3 H2) |
| `homepage.enabled` | true | homepage billboard szekció be/ki |
| `anchor.top` | **false** | felső beúszó anchor be/ki |
| `anchor.bottom` | true | alsó beúszó anchor be/ki |
| `anchor.showDelayMs` | 1200 | anchor késleltetett megjelenés (ms) |
| `interstitial.enabled` | true | felugró popup be/ki |
| `interstitial.minPageviews` | 2 | popup csak ennyiedik oldalletöltéstől (session) |
| `interstitial.delayMs` | 4000 | popup késleltetés (ms) |

> **Dev figyelem:** a Vite az SSR-modul JSON-importját cache-eli, ezért a JSON
> módosítása után **szerver-restart** kell (`deno task dev` újraindítás) — élesben
> (Deno Deploy) a build bundle-eli, ott nincs teendő.

## Hirdetési felületek

| Felület | Hol a kódban | Kreatív | Formátum |
|---|---|---|---|
| Sidebar, TOC alatt (desktop) | [`routes/[...slug].tsx`](../routes/[...slug].tsx) jobb `aside` | `ErdeirekaBanner` | half-page 300×600 (`zoom:0.8`-cal a ~240px oszlopba skálázva) |
| Cikk közepe (2. H2 után) | `routes/[...slug].tsx` (`splitHtmlAfterNthH2`) | `ErdeirekaBanner` | leaderboard 728×90 (mobil: rectangle 300×250) |
| Cikk vége | `routes/[...slug].tsx` | `ErdeirekaInArticle` | large-rectangle 336×280 (mobil: rectangle 300×250) |
| Homepage szekció | [`routes/index.tsx`](../routes/index.tsx) (Featured után) | `ErdeirekaBanner` | billboard 970×250 (mobil: rectangle) |
| Felső sticky anchor (site-wide) | [`routes/_app.tsx`](../routes/_app.tsx) | `ErdeirekaAnchor` | leaderboard 728×90 / mobil 320×100 |
| Alsó sticky anchor (site-wide) | `routes/_app.tsx` | `ErdeirekaAnchor` | leaderboard 728×90 / mobil 320×100 |
| Felugró popup (interstitial) | `routes/_app.tsx` | `ErdeirekaInterstitial` | large-rectangle 336×280 |

**Footprint:** a **sidebar / cikk-közép / cikk-vég MINDEN rendes cikkoldalon**
megjelenik (nem a kategória-áttekintőn), ha ON. A cikk-közép csak akkor, ha a
cikkben van legalább 3 `<h2>` (különben nincs hova beszúrni — kimarad). Az
**anchor + popup minden oldalon** (site-wide, `_app.tsx`).

**Cikk-közép beszúrás:** a `splitHtmlAfterNthH2(html, 2)` a renderelt HTML-t a
2. `<h2>` szekció után vágja ketté, és közé teszi a leaderboardot. Kevés H2
esetén `null` → nem szúr be semmit.

**Sidebar méretezés:** a half-page 300px széles, a jobb `aside` viszont ~256px
(`w-64`). A bannert `zoom:0.8`-cal skálázzuk — a `zoom` (szemben a `transform`-mal)
a **helyfoglalást is** arányosítja, így nincs kilógás és nincs üres hely alatta.

## Ideális banner-méretek (IAB/Google)

| Felület | Desktop | Mobil |
|---|---|---|
| Felső/alsó anchor | 728×90 (leaderboard) | 320×100 (v. 320×50) |
| Sidebar (TOC alatt) | 300×600 (half-page) | — (mobilon rejtve) |
| Cikk vége | 336×280 (large rect.) | 300×250 |
| Cikk közepe | 728×90 | 300×250 |
| Popup | 336×280 / 300×250 | 300×250 |
| Homepage | 970×250 (billboard) | 300×250 |

Asset: 2× retina (pl. 728×90 → 1456×180), WebP, <150 KB. A doboz fix méretet
foglal → **CLS=0**.

## Kreatívok

Katalógus: [`data/erdeireka-ads.ts`](../data/erdeireka-ads.ts). Minden tétel
**kép-elsődleges, szöveges fallbackkel**:
- `img` → `static/erdeireka/...` (ha van, kép renderel: sima `<img>` +
  width/height + `aspect-ratio` + `srcset` a `@2x`-hez),
- ha nincs `img` → `headline`/`subline`/`cta` + `bgFrom`/`bgTo`/`accent`
  márkaszínekből generált szöveges banner.

**Képek:** [`static/erdeireka/*.webp`](../static/erdeireka/) — 6 méret ×
(1× + 2×), a **mathSeo-ból átvett valódi Erdei Réka bannerek**. Cseréléshez
tedd be az új fájlt azonos névvel (vagy írd át a katalógusban a `img` mezőt).
A `ad-banners/a` és `ad-banners/b` mappában a forrás PNG-variánsok találhatók
(nem élesek, csak referencia — A/B rotációhoz beköthetők).

**Rotáció:** adj több azonos `format`-ú tételt `weight`-tel — a
`pickErdeirekaCreative()` súlyozottan választ (SSR-ben, propként adja az
island-eknek → nincs hydration-mismatch).

## AdSense-szerű opciók

- **Anchor ads** (felül/alul) — **ÖSSZECSUKHATÓ nyíllal**: a banner ki-/lekúszik
  és egy kis „Hirdetés ▼" fül marad az él közepén. Az állapotot
  `sessionStorage` őrzi pozíciónként (kulcs-prefix: `hk-erd-anchor-…`): ha
  összecsukod, minden oldalon csukva marad; új munkamenetben nyitva indul.
  Csukott állapotban nincs helyfoglalás.
- **Interstitial / vignette** — KONZERVATÍV: csak a `minPageviews`-edik
  oldalletöltéstől, `delayMs` késleltetés, 1×/munkamenet (`sessionStorage`:
  `hk-erdeireka-interstitial-shown`); desktopon modal / mobilon alsó kártya
  (nem teljes képernyős → nincs Google intrusive-interstitial büntetés).
- **Helyfoglalás (CLS=0):** az anchor a valós magasságát megmérve tolja a
  tartalmat — injektált `<style>`, amit bezáráskor törlünk. A hazepites fejléc
  `sticky top-0`, ezt a `.sticky.top-0` szelektor kezeli. (A felső anchor
  alapból OFF; ha bekapcsolod, a `top-16`/`top-20` pinelt elemek finomhangolást
  igényelhetnek — az alsó anchor minden layouton gond nélkül működik.)
- **Kreatív-rotáció** (súlyozott, `weight`).
- **Reszponzív** (desktop/mobil kreatív külön, `md` breakpoint).
- **Analytics** — [`utils/analytics.ts`](../utils/analytics.ts):
  `erdeireka_impression | click | dismiss` (placement + format paraméterrel).
  Ha van `window.gtag`/`window.plausible`, oda küld; különben csendben no-op.
- **`rel="sponsored noopener"` + `target="_blank"`** minden linken, UTM-mel
  (`utm_source=hazepitesikalauz.hu&utm_medium=banner&utm_campaign=erdeireka&utm_content=<placement>`).

**CSP:** nem igényel változtatást — a képek `img-src 'self'` alatt (first-party
`static/erdeireka/`), a linkek top-level navigáció, az island-ek first-party JS
(`script-src 'self'`).

## Fájlok

**Új:**
- `utils/erdeireka.ts` — szerver-oldali kapcsoló + settings + kreatív-választó.
- `utils/analytics.ts` — könnyű, függőségmentes event-küldő (GA4/Plausible/no-op).
- `data/erdeireka-ads.ts` — kreatív-katalógus + méretek + UTM-helper (kliens-biztos).
- `data/erdeireka-config.json` — **megjelenítési SSOT** (placements + anchor + popup + homepage).
- `components/erdeireka/{ErdeirekaBanner,ErdeirekaCreativeBox,ErdeirekaInArticle}.tsx` — statikus (0 JS).
- `islands/erdeireka/{ErdeirekaAnchor,ErdeirekaInterstitial}.tsx` — kliens-logika.
- `static/erdeireka/*.webp` — a valódi Réka bannerek (6 méret × 1×/2×).
- `ad-banners/{a,b}/*.png` — forrás PNG-variánsok (referencia).

**Módosított:**
- `routes/_app.tsx` — anchor (felül/alul) + interstitial mount.
- `routes/[...slug].tsx` — sidebar + cikk-közép + cikk-vég slot, `splitHtmlAfterNthH2` helper.
- `routes/index.tsx` — homepage billboard szekció.
- `.env.example` — `ERDEIREKA_ADS_ENABLED` + `ERDEIREKA_TARGET_URL`.

## Ellenőrzés lokál szerveren

```bash
cp .env.example .env      # majd írd be: ERDEIREKA_ADS_ENABLED=true
deno task dev             # http://localhost:5173
```

Gyors ellenőrzés (a placementek SSR-ben jönnek, kivéve anchor+popup, amik island-ek):

```bash
# Cikkoldal — 3 in-content placement (SSR):
curl -s http://localhost:5173/koltsegek/keszultsegi-fokok \
  | grep -o 'utm_content=[a-z-]*' | sort | uniq -c
#   → sidebar / in-article-mid / in-article-end

# Homepage — billboard:
curl -s http://localhost:5173/ | grep -c erdeireka   # > 0

# OFF állapot (állítsd ERDEIREKA_ADS_ENABLED=false + restart):
#   → mindkét grep 0-t ad, az oldal 200 marad
```

Az **anchor + interstitial** böngészőben látszik (island, JS kell): az alsó
sticky sáv a `showDelayMs` után úszik be, a popup a 2. oldalletöltéstől
`delayMs` késéssel.

## Kikapcsolás / visszaállás

`ERDEIREKA_ADS_ENABLED` törlése / `false` → minden Réka-felület eltűnik (az
oldalak érintetlenül renderelnek tovább). AdSense külön, az `ADSENSE_ENABLED`-del.
