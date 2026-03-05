# Site Documentation — hazepitesikalauz.hu

> Developer-level architectural reference.
> Cél: bárki le tudja klónozni ezt a struktúrát egy másik témájú knowledge hub-hoz.

---

## 1. Projekt összefoglaló

| Kulcs | Érték |
|-------|-------|
| **Domain** | hazepitesikalauz.hu |
| **Típus** | SEO-optimalizált knowledge hub (content site) |
| **Stack** | Deno Fresh 2.x + Vite 7 + Preact 10 + Tailwind v4 + MDX v3 |
| **Hosting** | Deno Deploy (GitHub Actions CI/CD) |
| **DNS / Email** | Cloudflare |
| **Form backend** | Resend API (server-side, `/api/contact`) |
| **Tartalom** | 17 publikált cikk, 11 kategória (120 tervezett) |
| **Nyelv** | Magyar (hu) |

---

## 2. Fájlstruktúra

```
hazepitesikalauz/
│
├── deno.json                     # Deno config, tasks, import map
├── vite.config.ts                # Vite plugins: MDX → Fresh → Tailwind
├── main.ts                       # Fresh App entry (staticFiles, trailingSlashes, fsRoutes)
├── dev.ts                        # Dev szerver (EISDIR workaround, Vite HMR)
├── client.ts                     # Client entry — only `import "./styles.css"`
├── styles.css                    # Tailwind v4 CSS-first config + custom theme
├── generate-sitemap.ts           # Build-time static sitemap generator
│
├── routes/
│   ├── _app.tsx                  # HTML shell: <head> (meta, schema, favicon), <body>
│   ├── _error.tsx                # 404 / generic error page
│   ├── _middleware.ts            # HTTPS redirect, trailing slash, security & cache headers
│   ├── index.tsx                 # Főoldal (hero, features, stats, articles, categories, CTA)
│   ├── kapcsolat.tsx             # Kapcsolat / Impresszum oldal
│   ├── koszonjuk.tsx             # Form elküldés utáni köszönjük oldal
│   ├── sitemap.xml.ts            # Dinamikus sitemap endpoint
│   ├── [...slug].tsx             # CATCHALL: cikk + kategória overview oldalak
│   └── api/
│       └── contact.ts            # POST: form → Resend email API
│
├── islands/                      # Preact client-hydrated interaktív komponensek
│   ├── ThemeToggle.tsx           # Sötét/világos mód váltó
│   ├── HeadUpdater.tsx           # <head> frissítés Partial nav után, scroll restoration
│   ├── TableOfContents.tsx       # Jobb oldali TOC scroll-tracking markerrel
│   ├── CostCalculator.tsx        # Interaktív költségkalkulátor
│   ├── ContactMe.tsx             # Kapcsolat form (fetch → /api/contact)
│   └── utils/
│       └── useTheme.ts           # Theme hook (localStorage + class toggle)
│
├── components/                   # Statikus Preact komponensek (SSR only)
│   ├── Header.tsx                # Sticky header: logo, nav, sidebar toggle, TOC dropdown
│   ├── Footer.tsx                # Footer link oszlopok + brand
│   ├── Breadcrumbs.tsx           # Kategória breadcrumb
│   ├── DocsSidebar.tsx           # Oldalsó navigáció (rekurzív kategória fa)
│   └── mdx/                     # MDX-ben auto-injektált komponensek
│       ├── InfoCard.tsx          # Callout box (tip/info/warn/case)
│       ├── Accordion.tsx         # Összecsukható FAQ/details
│       ├── CaseStudy.tsx         # Esettanulmány kártya
│       ├── CostRange.tsx         # Ár-tartomány vizualizáció
│       ├── ExpertQuote.tsx       # Szakértői idézet
│       ├── ComparisonRow.tsx     # Összehasonlító sor (winner jelöléssel)
│       ├── ProConList.tsx        # Előnyök / Hátrányok két oszlop
│       ├── StepByStep.tsx        # Lépésenkénti folyamat
│       ├── Checklist.tsx         # Interaktív checklist
│       ├── Timeline.tsx          # Idővonal
│       └── MdxLink.tsx           # Link override (external → target=_blank)
│
├── data/
│   └── docs.ts                   # toc.ts → TABLE_OF_CONTENTS + CATEGORIES feldolgozó
│
├── utils/
│   ├── state.ts                  # Fresh State interface (title, schemas, ogImage...)
│   ├── schema.ts                 # Schema.org generátorok (Organization, WebSite, Breadcrumb)
│   ├── markdown.ts               # Marked pipeline: FAQ, KaTeX, PrismJS, smart quotes
│   ├── mdx.ts                    # MDX compile + run + component injection + cache
│   └── global-polyfill.ts        # globalThis.global = globalThis (Deno Deploy PrismJS fix)
│
├── content/
│   ├── toc.ts                    # Master tartalomjegyzék (11 kategória, slug → title)
│   └── {kategoria}/
│       └── {slug}.mdx            # Cikk: YAML frontmatter + MDX body
│
├── static/
│   ├── favicon.svg               # SVG favicon (gradient ház ikon)
│   ├── favicon.ico               # ICO fallback
│   ├── site.webmanifest           # PWA manifest
│   ├── robots.txt
│   ├── markdown.css              # Markdown body + MDX komponens stílusok (1700 sor)
│   ├── prism.css                 # PrismJS Okaidia téma
│   ├── icons.svg                 # SVG sprite (admonition ikonok)
│   ├── fonts/
│   │   └── FixelVariable.woff2   # Custom variable font
│   ├── img/docs/{kat}/{slug}-hero.svg    # Hero képek (1200×630)
│   └── diagrams/docs/{kat}/{slug}-diagram-{N}.svg  # Magyarázó diagramok
│
├── .github/workflows/
│   └── deploy.yml                # CI: deno task build → deployctl
│
└── internal-docs/                # Belső dokumentáció (nem publikus)
    ├── MASTER-01-philosophy.md
    ├── MASTER-02-architecture.md
    ├── MASTER-03-playbook.md
    ├── MASTER-04-Szintaxis.md
    ├── HUB-KONCEPCIO-03-hazepites.md
    └── site-documentation.md     # EZ A FÁJL
```

---

## 3. Technikai architektúra

### 3.1. Framework: Deno Fresh 2.x

Fresh 2.x JSR-alapú (nem a régi `deno.land/x` verzió). Vite-tel buildel, island architecture-t használ.

**Entry point:** `main.ts`

```typescript
import { App, staticFiles, trailingSlashes } from "fresh";

export const app = new App()
  .use(staticFiles())
  .use(trailingSlashes("never"))
  .fsRoutes();
```

**Island pattern:** Csak az `islands/` mappában lévő komponensek kapnak client-side hydration-t. Minden más SSR-only. Ez drasztikusan csökkenti a kliens JS-t — a legtöbb oldal < 30 kB JS-t tölt.

### 3.2. Vite config

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    { enforce: "pre", ...mdx({ jsxImportSource: "preact" }) },
    fresh(),
    tailwindcss(),
  ],
});
```

**Plugin sorrend kritikus:**
1. `mdx` (enforce: "pre") — .mdx fájlokat JSX-re fordítja MIELŐTT a Fresh feldolgozná
2. `fresh()` — route-ok, island-ek, Partial navigation
3. `tailwindcss()` — CSS processing

### 3.3. Content routing: `routes/[...slug].tsx`

Ez a fájl az egész site lelke. Egyetlen catchall route kezel mindent:

**Kategória áttekintő** (pl. `/koltsegek`):
```
URL → CATEGORY_SLUGS.has(slug) → true → kategória overview page
```

**Cikk oldal** (pl. `/koltsegek/hazepites-koltseg-2026`):
```
URL → TABLE_OF_CONTENTS[slug] → resolveContentFile() → .mdx/.md
    → frontmatter parse → markdown/MDX render → page()
```

**Dual format:** A route először `.mdx`-et keres, aztán `.md`-t. Ha MDX parse hibázik, markdown fallback.

**Fájl elérés workaround:**

```typescript
const _CONTENT_UP = import.meta.url.includes("_fresh") ? "../../../" : "../";
```

Build után a route chunk a `_fresh/server/assets/` mappában van (3 szint mélyen), dev-ben a `routes/` mappában (1 szint). Ezért dinamikus az útvonal.

### 3.4. Markdown pipeline (`utils/markdown.ts`)

Marked v17 custom renderer:

| Extension | Mit csinál | Szintaxis |
|-----------|-----------|-----------|
| **FAQ** | `<details>/<summary>` blokk | `::: faq Kérdés\nVálasz\n:::` |
| **KaTeX** | Matematikai képletek | `$inline$` vagy `$$block$$` |
| **PrismJS** | Szintaxis kiemelés | ` ```tsx ... ``` ` |
| **Smart quotes** | Tipográfiai idézőjelek | `"text"` → `"text"` |
| **Heading IDs** | Anchor linkek | `## Cím` → `<h2 id="cim">` |
| **Admonitions** | Kiemelő boxok | `> [tip]: szöveg` |

### 3.5. MDX pipeline (`utils/mdx.ts`)

```
.mdx fájl
  → @mdx-js/mdx compile() → JS function body
  → run() → Preact component
  → preact-render-to-string → HTML
  → addHeadingIds() → heading ID-k injektálás
  → cache (memória, slug alapján)
```

**Auto-injektált komponensek** — nem kell importálni az .mdx fájlban:

```typescript
const MDX_COMPONENTS = {
  a: MdxLink,        // Link override
  InfoCard,           // Callout boxok
  Accordion,          // Összecsukható szekciók
  CaseStudy,          // Esettanulmány
  CostRange,          // Ár-tartomány
  ExpertQuote,        // Szakértői idézet
  ComparisonRow,      // Összehasonlítás
  ProConList,         // Előnyök/hátrányok
  StepByStep,         // Lépések
  Checklist,          // Checklist
  Timeline,           // Idővonal
};
```

### 3.6. Tailwind v4 (CSS-first)

Nincs `tailwind.config.ts`. Minden a `styles.css`-ben:

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary-50: #eff6ff;
  --color-primary-600: #2563eb;
  /* ... */
  --font-sans: "Fixel", "Inter", system-ui, sans-serif;
}
```

**Dark mode:** Class-based (`.dark` a `<html>`-en). A `ThemeToggle` island kezeli, `localStorage`-ban tárolja.

### 3.7. Partial navigation (SPA-like)

A Fresh beépített Partial rendszere: a `f-client-nav={true}` attributum engedélyezi a kliens oldali navigációt. A `<Partial name="docs-main">` wrapper a content részt cseréli navigációnál — a sidebar és header nem renderelődik újra.

**HeadUpdater island** kezeli:
- `<title>`, `<meta>` frissítés
- Schema.org `<script>` injection
- Sidebar aktív link highlight
- Scroll pozíció mentés/visszaállítás
- Mobile sidebar/TOC bezárás

**Module-level state** (nem component state):
```typescript
let _prevPath: string | null = null;    // Persists across island re-mounts
let _popstateFlag = false;              // Detects back/forward
let _listenersRegistered = false;       // Global listener guard
```

Ez azért kell mert a Partial swap elpusztítja és újra létrehozza az island-eket — a React-szerű useState elveszne.

---

## 4. Tartalomkezelés

### 4.1. Tartalomjegyzék: `content/toc.ts`

Master lista az összes cikkről. Amit kikommentálsz, az nem jelenik meg a sidebar-ban és a sitemap-ben.

```typescript
const toc = {
  label: "hazepitesi-kalauz",
  content: {
    koltsegek: {
      title: "Költségek",
      pages: [
        ["page", "hazepites-koltseg-2026", "Házépítés költség 2026"],
        ["page", "negyzetmeter-ar", "Négyzetméter ár kalkuláció"],
        // ["page", "gepeszet-koltseg", "Gépészet költsége"],  ← nem publikált
      ],
    },
    // ... 10 további kategória
  },
};
```

A `data/docs.ts` ezt feldolgozza:
- `TABLE_OF_CONTENTS`: slug → entry Record (route handler használja)
- `CATEGORIES`: hierarchikus struktúra (sidebar, sitemap használja)

### 4.2. Cikk formátum: `.mdx`

```mdx
---
title: "Házépítés költség 2026"
description: "120-160 karakter meta description"
canonical: "https://hazepitesikalauz.hu/koltsegek/hazepites-koltseg-2026"
published_at: "2026-02-13"
refreshed_at: "2026-02-13"
articleSchema:
  "@context": "https://schema.org"
  "@type": "Article"
  # ... teljes Article schema
faqPageSchema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  "question1": "Mennyibe kerül?"
  "answer1": "Válasz..."
---

## Első szekció

Markdown tartalom **MDX komponensekkel** keverve:

<InfoCard type="tip" title="Tudtad?">
  A rejtett költségek 15-20%-ot tehetnek ki.
</InfoCard>

<CostRange min={350000} max={500000} unit="Ft/m²" label="Téglaház, 2026" />

## Második szekció

<ComparisonRow
  label="Ár"
  left="380-450e Ft/m²"
  right="350-420e Ft/m²"
  leftHeader="Tégla"
  rightHeader="Ytong"
  winner="right"
/>
```

### 4.3. YAML frontmatter → Schema.org

A route handler a frontmatter-ből olvassa ki a schema adatokat és a `_app.tsx` `<head>`-jébe injektálja:

```
frontmatter.articleSchema  → ctx.state.articleSchema  → <script type="application/ld+json">
frontmatter.faqPageSchema  → ctx.state.faqPageSchema  → <script type="application/ld+json">
frontmatter.softwareSchema → ctx.state.softwareSchema → <script type="application/ld+json">
```

A `faqPageSchema` speciális: a flat YAML formátumból (`question1`, `answer1`, `question2`, `answer2`) a route handler építi össze a standard `FAQPage` schema `mainEntity` tömbjét.

### 4.4. Fájlok cikkenként

Minden cikkhez 3 fájl kötelező:

```
content/{kategoria}/{slug}.mdx           # Tartalom
static/img/docs/{kategoria}/{slug}-hero.svg    # OG kép (1200×630)
static/diagrams/docs/{kategoria}/{slug}-diagram-1.svg  # Min. 1 diagram
```

---

## 5. Form kezelés (Resend)

### Architektúra

```
ContactMe island (kliens)
  → POST /api/contact (JSON)
  → Deno Deploy szerver
  → Resend REST API
  → Email: info@hazepitesikalauz.hu
  → Cloudflare Email Routing
  → Személyes email (Gmail, stb.)
```

### Spam védelem

| Réteg | Megvalósítás |
|-------|-------------|
| **Honeypot** | Rejtett `website` mező — bot kitölti, szerver csendben eldobja |
| **Rate limit** | 5 kérés / IP / 10 perc (in-memory Map) |
| **Validáció** | Email formátum, tárgy 2-200 kar, üzenet 10-5000 kar |
| **Sanitize** | HTML tag stripping |

### Env var

```
RESEND_API_KEY=re_xxxxxxx   # Deno Deploy dashboard > Settings > Environment Variables
```

### Email formátum

- **From:** `Házépítési Kalauz <info@hazepitesikalauz.hu>`
- **To:** `info@hazepitesikalauz.hu`
- **Reply-To:** a kitöltő email címe (közvetlenül válaszolhatsz)
- **Subject:** `[Kapcsolat] {tárgy}`
- **Body:** HTML táblázat (feladó, tárgy, üzenet, IP)

---

## 6. SEO infrastruktúra

### Schema.org

Minden oldalon:
- `Organization` + `WebSite` + `WebPage` (főoldal schema.ts-ből)
- `BreadcrumbList` (dinamikus, slug alapján)

Cikk oldalakon:
- `Article` schema (frontmatter-ből)
- `FAQPage` schema (frontmatter-ből, kérdés-válasz párok)
- `HowTo` schema (opcionális)
- `SoftwareApplication` schema (kalkulátor oldalaknál)

### Sitemap

`/sitemap.xml` — dinamikus route, nem pre-generated fájl:
- `lastmod` a frontmatter `refreshed_at` mezőjéből
- Prioritás kategória-függő (költségek: 0.8, eszközök: 0.9, stb.)
- Cache: 10 perc kliens, 1 óra CDN edge

### Middleware

```typescript
// _middleware.ts
// 1. HTTPS + www redirect (301)
// 2. Trailing slash eltávolítás (301)
// 3. Security headers (nosniff, SAMEORIGIN, strict-origin referrer, permissions-policy)
// 4. Cache headers:
//    - Fonts: 1 év immutable
//    - Képek: 30 nap + stale-while-revalidate
//    - Vite hashed assets: 1 év immutable
```

---

## 7. Deployment

### CI/CD: GitHub Actions

```yaml
# .github/workflows/deploy.yml
on: push/PR to main
steps:
  1. actions/checkout@v4
  2. denoland/setup-deno@v2 (v2.x)
  3. deno task build        # generate-sitemap.ts + vite build
  4. deployctl              # Upload _fresh/server.js to Deno Deploy
```

**Deno Deploy projekt:** `jnosmszros-hazepites-75`

### Build output

```
_fresh/
├── server/
│   ├── server-entry.mjs       # ~277 kB — fő szerver
│   └── assets/
│       ├── *-route-*.mjs      # Route chunk-ok (1-35 kB)
│       ├── markdown-*.mjs     # ~633 kB — lazy loaded
│       ├── mdx-*.mjs          # ~829 kB — lazy loaded
│       └── yaml-*.mjs         # ~57 kB
└── client/
    └── assets/
        ├── client-entry-*.js  # ~22 kB
        ├── client-entry-*.css # ~67 kB (Tailwind)
        └── fresh-island-*.js  # Island JS-ek (1-5 kB each)
```

### Tasks

```json
{
  "dev": "deno run -A --node-modules-dir dev.ts",
  "build": "deno run -A generate-sitemap.ts && deno run -A --node-modules-dir npm:vite build",
  "preview": "deno serve -A _fresh/server.js"
}
```

---

## 8. Island komponensek részletesen

### ThemeToggle

Nap/hold ikon gomb. `useTheme()` hook: `localStorage` + `.dark` class a `<html>`-en.

### HeadUpdater

A legösszetettebb island. Partial navigáció után frissíti:
- `<title>`, `<meta name="description">`, `<meta property="og:*">`, `<link rel="canonical">`
- Schema `<script>` tag-ek (id alapján: Article, FAQ, HowTo, Software, BreadCrumb)
- Sidebar aktív linkek (aria-current, open/close details)
- Header nav aktív állapot
- Mobil TOC panel tartalom
- Scroll pozíció (mentés kattintáskor, visszaállítás popstate-nél)

### TableOfContents

Scroll-tracking: `requestAnimationFrame` debounced heading detection. Animált kék marker bar a CSS `transition`-nel.

### CostCalculator

Props: nincs (standalone). Inputok:
- Alapterület: 60-300 m² (range slider)
- Technológia: tégla/ytong/fa/passzív/modul (dropdown)
- Régió: Budapest+20% ... Dél-Alföld-13% (dropdown)

Kalkuláció: `min * area * region` – `max * area * region`, millió Ft-ban.

### ContactMe

Form → `fetch("/api/contact", { method: "POST" })` → JSON body. Sikeres küldés → `location.href = "/koszonjuk"`.

---

## 9. Stílusrendszer

### CSS fájlok

| Fájl | Méret | Tartalom |
|------|-------|----------|
| `styles.css` | ~200 sor | Tailwind v4 import, theme vars, font-face, dark mode, animációk |
| `static/markdown.css` | ~1700 sor | Markdown body stílusok + MDX komponens CSS-ek |
| `static/prism.css` | ~100 sor | PrismJS Okaidia dark téma |

### Szín paletta

```
Primary (kék):    50 #eff6ff → 600 #2563eb → 950 #172554
Emerald (zöld):   50 #ecfdf5 → 600 #059669 → 950 #022c22
Amber (sárga):    50 #fffbeb → 600 #d97706
Slate (szürke):   50 #f8fafc → 950 #020617
```

### Tipográfia

**Font:** Fixel Variable (woff2) — custom sans-serif. Fallback: Inter → system-ui.

### MDX komponens CSS konvenció

Minden MDX komponens saját CSS class-okat használ a `markdown.css`-ben:

```
.mdx-callout-tip      # InfoCard type="tip"
.mdx-callout-warn     # InfoCard type="warn"
.mdx-comparison-row   # ComparisonRow
.mdx-cost-range       # CostRange
.mdx-procon           # ProConList
.mdx-steps            # StepByStep
.mdx-timeline         # Timeline
# stb.
```

Ez a megközelítés (CSS class-ek a markdown.css-ben, nem Tailwind a komponensben) azért van, mert az MDX komponensek SSR-only-k — a CSS a `<link rel="stylesheet" href="/markdown.css">` -ből töltődik, ami csak content oldalakon van (az `_app.tsx` `isContentPage` feltétele alapján).

---

## 10. Tanulságok és buktatók

### 10.1. Deno Deploy 500-as hiba — code splitting

**Probléma:** Az összes cikk oldal 500-as hibát dobott Deno Deploy-on, miközben lokálisan minden működött.

**Gyökérok:** A Vite a route chunk-ba bundlelte a teljes markdown (marked + prismjs + katex) és MDX (@mdx-js/mdx + acorn) pipeline-t → **1.5 MB-os egyetlen chunk**. Deno Deploy-on ez nem töltődött be.

**Megoldás:** Static `import`-okat `await import()`-ra cserélni:

```typescript
// ELŐTTE (static → 1.5 MB chunk):
import { renderMarkdown } from "../utils/markdown.ts";
import { renderMDX } from "../utils/mdx.ts";

// UTÁNA (dynamic → 34 kB route + 633 kB + 829 kB lazy chunk):
const { renderMarkdown } = await import("../utils/markdown.ts");
const { renderMDX } = await import("../utils/mdx.ts");
```

**Eredmény:** Route chunk: 1497 kB → **34 kB**. A markdown és MDX chunk-ok lazy-loaded.

### 10.2. PrismJS `global` polyfill

**Probléma:** Miután a code splitting megoldotta a chunk méret problémát, a cikk oldalak még mindig 500-at dobtak: `ReferenceError: Prism is not defined`.

**Gyökérok:** A PrismJS `global.Prism = Prism$1`-et használ, de a Deno Deploy-on nincs `global` (az Node.js-specifikus). A nyelvi plugin-ek (`prism-jsx.js` stb.) a `Prism` globális változót keresik.

**Megoldás:** `utils/global-polyfill.ts`:

```typescript
if (typeof (globalThis as Record<string, unknown>).global === "undefined") {
  (globalThis as Record<string, unknown>).global = globalThis;
}
```

Ezt a `utils/markdown.ts` ELSŐ importként tölti be, a PrismJS előtt.

### 10.3. `import.meta.url` útvonal különbség (dev vs build)

**Probléma:** A `Deno.readTextFile()` a content fájlokhoz relatív útvonalat használ `import.meta.url`-ből. Dev-ben a route a `routes/` mappában van (1 szint fel a gyökérig), build után a `_fresh/server/assets/` mappában (3 szint).

**Megoldás:**

```typescript
const _CONTENT_UP = import.meta.url.includes("_fresh") ? "../../../" : "../";
```

### 10.4. Magyar idézőjelek MDX-ben

**Probléma:** Az MDX compiler (acorn) a `{...}` zárójeleken belüli tartalmat JS-ként értelmezi. Ha magyar `„` (U+201E) nyitó idézőjelet egyenes `"` (U+0022) zárja a JSX prop-ban, az acorn a `"`-t string-lezárónak veszi → **csendes parse error** → az egész MDX markdown fallback-re esik → komponensek eltűnnek.

**Megoldás:** Mindig `„…"` (U+201E + U+201D) párt használni JSX-ben. SOHA nem `„..."` (U+201E + U+0022).

### 10.5. Fresh Partial island re-mount

**Probléma:** Partial navigáció elpusztítja és újra létrehozza az island komponenseket. A `useState` értékek elvesznek.

**Megoldás:** Module-level state az island fájl tetején:

```typescript
// Ez megmarad re-mount után is:
let _prevPath: string | null = null;

// Ez NEM marad meg:
const [path, setPath] = useState(null); // ← ELVESZIK
```

### 10.6. Deno dev szerver EISDIR hiba

**Probléma:** Deno 2.6+ file watcher EISDIR lstat hibát dob Windows-on (nem fatális, de spam-eli a konzolt).

**Megoldás:** `dev.ts`-ben `process.on("uncaughtException")` szűrő:

```typescript
process.on("uncaughtException", (err: Error) => {
  if (err.message?.includes("EISDIR")) return; // Ignore
  console.error("Uncaught exception:", err);
  process.exit(1);
});
```

### 10.7. Tailwind v4 — nincs config fájl

**Tanulság:** Tailwind v4 CSS-first. Nincs `tailwind.config.ts`, minden a `styles.css` `@theme {}` blokkjában van. Ez egyszerűbb, de ha megszoktad a JS config-ot, eleinte zavaró.

**Dark mode:** `@custom-variant dark (&:where(.dark, .dark *))` — class-based, nem media query.

### 10.8. Vite plugin sorrend

**Tanulság:** Az MDX plugin-nak `enforce: "pre"` kell, különben a Fresh plugin próbálja meg feldolgozni az `.mdx` fájlokat és elszáll.

### 10.9. Deploy version ellenőrzés

**Tanulság:** A Deno Deploy ~90-120 másodpercet vesz igénybe a GitHub push után. A HTML-ben a `__frsh_c=` hash-ből ellenőrizheted, hogy a legfrissebb build fut-e. Ha nem egyezik, várj és próbáld újra.

### 10.10. Windows-specifikus

**Tanulság:** A Bash tool-ok forward slash-t (`C:/dev/...`) akarnak backslash helyett. A `grep` bash parancs helyett mindig a dedikált Grep tool-t kell használni. Symlink permission warning: Windows Settings > For Developers > Developer Mode.

---

## 11. Hogyan indíts el egy másik hub-ot ezzel a struktúrával

### 11.1. Klónozás és testreszabás

1. **Fork/clone** a repót
2. **`content/toc.ts`** — írd át a kategóriákat és cikkeket az új témára
3. **`styles.css`** — cseréld a szín palettát a `@theme {}` blokkban
4. **`utils/schema.ts`** — cseréld az Organization adatokat
5. **`routes/index.tsx`** — írd át a főoldalt
6. **`components/Header.tsx`** — cseréld a brand nevet és a nav linkeket
7. **`components/Footer.tsx`** — cseréld a footer linkeket
8. **`components/DocsSidebar.tsx`** — cseréld a kategória ikonokat
9. **`static/favicon.svg`** — új favicon
10. **`.github/workflows/deploy.yml`** — cseréld a Deno Deploy projekt nevet

### 11.2. Tartalom írás

1. Hozd létre a content fájlt: `content/{kategoria}/{slug}.mdx`
2. Töltsd ki a YAML frontmatter-t (title, description, canonical, schema-k)
3. Írd meg a body-t MDX-ben — használd az auto-injektált komponenseket
4. Vedd fel a `content/toc.ts`-be (kommenteld ki amit még nem akarsz publikálni)
5. Készíts hero SVG-t: `static/img/docs/{kategoria}/{slug}-hero.svg`

### 11.3. Deployment

1. GitHub repo → Settings → Secrets: semmi nem kell (OIDC auth)
2. [dash.deno.com](https://dash.deno.com) → New project → Link GitHub repo
3. A `.github/workflows/deploy.yml` automatikusan deploy-ol push-ra
4. Env vars (ha kell): Deno Deploy dashboard → Settings → Environment Variables
   - `RESEND_API_KEY` a form kezeléshez

### 11.4. DNS + Email (Cloudflare)

1. Domain → Cloudflare DNS
2. A rekord → Deno Deploy IP-k (vagy CNAME a deploy URL-re)
3. Email Routing → `info@domain.hu` továbbítása személyes emailre
4. Resend domain verify → SPF + DKIM rekordok a Cloudflare DNS-be

---

## 12. Függőségek

| Csomag | Verzió | Miért |
|--------|--------|-------|
| `fresh` | @2.2.0 (JSR) | Web framework |
| `preact` | 10.28.3 | UI rendering |
| `@preact/signals` | ^2.5.0 | Reactive state |
| `vite` | ^7.1.12 | Build tool |
| `@mdx-js/mdx` | ^3 | MDX compiler |
| `@mdx-js/rollup` | ^3 | MDX Vite plugin |
| `marked` | ^17.0.1 | Markdown parser |
| `prismjs` | ^1.29.0 | Syntax highlight |
| `katex` | ^0.16.0 | Matek renderelés |
| `tailwindcss` | ^4.1.18 | CSS framework |
| `@tailwindcss/vite` | ^4.1.18 | Vite Tailwind plugin |
| `github-slugger` | ^2.0.0 | Heading ID generálás |
| `marked-mangle` | ^1.1.9 | Link mangling |
| `remark-gfm` | ^4 | GitHub Flavored Markdown MDX-ben |
| `@std/front-matter` | JSR | YAML frontmatter parse |
| `@std/html` | JSR | HTML escape |

---

## 13. Teljesítmény jellemzők

| Metrika | Érték |
|---------|-------|
| Route chunk | 34 kB (code splitting után) |
| Markdown chunk | 633 kB (lazy) |
| MDX chunk | 829 kB (lazy) |
| Client JS | ~22 kB entry + ~5 kB/island |
| Client CSS | ~67 kB (Tailwind compiled) |
| Markdown CSS | ~41 kB |
| Build idő | ~30-60 sec |
| Deploy idő | ~90-120 sec (GitHub Actions + Deno Deploy) |
| Hydrated islands | 5 (ThemeToggle, HeadUpdater, TableOfContents, CostCalculator, ContactMe) |

---

*Utolsó frissítés: 2026-02-28*
