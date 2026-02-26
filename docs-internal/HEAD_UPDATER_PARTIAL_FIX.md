# HeadUpdater — `<head>` frissítés Fresh 2.x Partial navigáció alatt

## A probléma

Fresh 2.x-ben a `<Partial>` + `f-client-nav={true}` rendszer **client-side navigációt** biztosít oldalak között: csak a `<Partial name="...">` blokk tartalma cserélődik, a teljes oldal nem töltődik újra. Ez gyors és SPA-szerű élményt ad.

**Viszont a `<head>` tartalma NEM frissül** Partial swap során, mert az a `_app.tsx`-ből renderelődik SSR-kor, és a Partial rendszer nem nyúl hozzá.

### Ami nem frissül client-side navigációnál:
- `<title>`
- `<meta name="description">`
- `<meta property="og:title">`, `og:description`, `og:url`
- `<link rel="canonical">`
- `<script type="application/ld+json">` (Article, FAQ, HowTo, BreadCrumb, stb.)

### Miért probléma ez:
1. **Böngésző tab title** — az első oldal title-je marad
2. **Megosztás** — ha a user Partial navigáció után másol URL-t és megosztja, az OG meták rosszak
3. **Google indexelés** — A Googlebot általában full page load-ot csinál (tehát SSR-ből kap helyes `<head>`-et), DE a JavaScript-alapú renderelés során a Googlebot SPA-ként is navigálhat, és ilyenkor a rossz schemákat olvassa

---

## A megoldás: HeadUpdater island

Egy láthatatlan Preact island (`return null`), ami a `<Partial>` blokkon belül van. Minden Partial swap után mount-ol (vagy update-el), és **JavaScript-tel szinkronizálja a `<head>` DOM elemeit** a szerver által küldött aktuális adatokkal.

### Működési elv

```
┌───────────────────────────────────────────────────────┐
│  Első betöltés (full SSR)                             │
│  _app.tsx rendereli a <head>-et a state-ből           │
│  → title, meta, canonical, JSON-LD schemák rendben    │
│  → HeadUpdater is mount-ol, de nem csinál semmit      │
│    (DOM már helyes)                                   │
└───────────────────────────────────────────────────────┘
                        │
                   user kattint
                   (Partial nav)
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│  Partial swap                                         │
│  Fresh cseréli a <Partial name="docs-main"> blokkot   │
│  → Új tartalom renderelődik (benne HeadUpdater)       │
│  → HeadUpdater useEffect lefut az ÚJ props-szal      │
│  → document.title = új title                          │
│  → meta description/OG frissítés                      │
│  → canonical link frissítés                           │
│  → JSON-LD script-ek: frissít / létrehoz / töröl      │
└───────────────────────────────────────────────────────┘
```

---

## Integrációs lépések (új projektbe)

### 1. Island létrehozása: `islands/HeadUpdater.tsx`

```tsx
import { useEffect } from "preact/hooks";

interface HeadUpdaterProps {
  title: string;
  description: string;
  canonical: string;
  schemas: Record<string, string>; // { Article: "...", FAQ: "...", ... }
}

// A projektben használt összes schema id – bővíthető
const SCHEMA_IDS = ["Article", "FAQ", "HowTo", "Software", "Main", "BreadCrumb"];

export default function HeadUpdater({ title, description, canonical, schemas }: HeadUpdaterProps) {
  useEffect(() => {
    // ── Title ──
    if (document.title !== title) {
      document.title = title;
    }

    // ── Meta description ──
    const descMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (descMeta) {
      descMeta.content = description;
    } else if (description) {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // ── OG metas ──
    updateMetaProperty("og:title", title);
    updateMetaProperty("og:description", description);
    updateMetaProperty("og:url", canonical);

    // ── Canonical ──
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalLink) {
      canonicalLink.href = canonical;
    } else if (canonical) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonical;
      document.head.appendChild(link);
    }

    // ── JSON-LD schemas ──
    for (const id of SCHEMA_IDS) {
      const existing = document.getElementById(id);
      if (schemas[id]) {
        // Van schema → frissítés vagy létrehozás
        if (existing) {
          existing.textContent = schemas[id];
        } else {
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.id = id;
          script.textContent = schemas[id];
          document.head.appendChild(script);
        }
      } else {
        // Nincs schema → törlés ha volt
        if (existing) {
          existing.remove();
        }
      }
    }
  }, [title, description, canonical, schemas]);

  return null; // Nem renderel semmit vizuálisan
}

function updateMetaProperty(property: string, content: string) {
  const meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (meta) {
    meta.content = content;
  } else if (content) {
    const el = document.createElement("meta");
    el.setAttribute("property", property);
    el.content = content;
    document.head.appendChild(el);
  }
}
```

### 2. Page interface bővítése (route handler fájl)

A handler által visszaadott page data-ba bele kell tenni a head adatokat is, mert a Preact page komponens nem fér hozzá a `ctx.state`-hez (az csak az `_app.tsx`-ben elérhető).

```typescript
interface Page {
  // ... meglévő mezők ...

  // HeadUpdater-nek átadott adatok
  headTitle: string;
  headDescription: string;
  headCanonical: string;
  headSchemas: Record<string, string>;
}
```

### 3. Handler módosítása: schema adatok összegyűjtése

A handler végén, a `return page({...})` hívás előtt, a schemákat egy Record-ba gyűjtjük:

```typescript
// A handler végén, return page() előtt:

// Collect schema data for HeadUpdater (Partial navigation)
const headSchemas: Record<string, string> = {};
if (ctx.state.articleSchema) headSchemas.Article = ctx.state.articleSchema;
if (ctx.state.faqPageSchema) headSchemas.FAQ = ctx.state.faqPageSchema;
if (ctx.state.howToSchema) headSchemas.HowTo = ctx.state.howToSchema;
if (ctx.state.softwareSchema) headSchemas.Software = ctx.state.softwareSchema;
if (ctx.state.breadcrumbSchema) headSchemas.BreadCrumb = ctx.state.breadcrumbSchema;

return page({
  page: {
    ...entry,
    // ... meglévő mezők ...
    headTitle: ctx.state.title ?? "",
    headDescription: ctx.state.description ?? "",
    headCanonical: ctx.state.cleanUrl ?? "",
    headSchemas,
  },
});
```

### 4. HeadUpdater beillesztése a Partial blokkba

A page komponensben, a `<Partial>` blokk **elejére** kell tenni:

```tsx
import HeadUpdater from "../islands/HeadUpdater.tsx";

export default function DocsPage(props) {
  const { page } = props.data;

  return (
    <div>
      {/* ... header, sidebar ... */}
      <div f-client-nav={true}>
        <Partial name="docs-main">

          {/* ⚡ HeadUpdater: frissíti a <head>-et Partial swap után */}
          <HeadUpdater
            title={page.headTitle}
            description={page.headDescription}
            canonical={page.headCanonical}
            schemas={page.headSchemas}
          />

          {/* ... oldal tartalma ... */}
        </Partial>
      </div>
    </div>
  );
}
```

---

## Fontos: az `_app.tsx` `<head>` schemák MARADNAK

Az `_app.tsx`-ben lévő `<script type="application/ld+json">` blokkok **ne legyenek eltávolítva**. Ezek biztosítják, hogy:

1. **Full page load** (SSR) → a HTML-ben azonnal benne vannak a schemák
2. **Google bot** → közvetlenül a HTML forrásból olvassa (nem kell JS-re várni)
3. **HeadUpdater** → csak Partial navigáció után fut, és frissíti/cseréli ezeket

### Dupla renderelés?

Nem probléma, mert:
- SSR-nél az `_app.tsx` rendereli a `<head>`-be → HeadUpdater mount → useEffect lefut → de a DOM már helyes értékeket tartalmaz → nincs változás
- Partial swap-nél → `_app.tsx` `<head>` NEM frissül → HeadUpdater mount → useEffect lefut → **frissíti a DOM-ot** az új értékekre

---

## KÖTELEZŐ: `<script>` id-k konzisztenciája

Az `_app.tsx`-ben a JSON-LD script-eknek **kell id** attribútum, és ezeknek **meg kell egyezniük** a HeadUpdater `SCHEMA_IDS` tömbjével:

```tsx
// _app.tsx — a JSON-LD script-ek id-vel:
{state.articleSchema
  ? <script type="application/ld+json" id="Article"
      dangerouslySetInnerHTML={{ __html: state.articleSchema }} />
  : null}

{state.faqPageSchema
  ? <script type="application/ld+json" id="FAQ"
      dangerouslySetInnerHTML={{ __html: state.faqPageSchema }} />
  : null}

{state.breadcrumbSchema
  ? <script type="application/ld+json" id="BreadCrumb"
      dangerouslySetInnerHTML={{ __html: state.breadcrumbSchema }} />
  : null}
```

```typescript
// HeadUpdater.tsx — ugyanazok az id-k:
const SCHEMA_IDS = ["Article", "FAQ", "HowTo", "Software", "Main", "BreadCrumb"];
```

Ha új schema típust adsz hozzá (pl. `"Product"`, `"Recipe"`), mindkét helyen bővíteni kell.

---

## Ellenőrző checklist

| Lépés | Ellenőrzés |
|-------|------------|
| `_app.tsx` JSON-LD script-eknek van `id` | `id="Article"`, `id="FAQ"`, stb. |
| HeadUpdater `SCHEMA_IDS` egyezik | Ugyanazok az id-k |
| Handler: `headSchemas` Record kitöltve | Minden schema benne van |
| Handler: `headTitle`, `headDescription`, `headCanonical` kitöltve | `ctx.state` értékeiből |
| HeadUpdater a `<Partial>` blokkon BELÜL van | Különben nem frissül swap-kor |
| `f-client-nav={true}` a szülő div-en | Különben nincs Partial navigáció |
| Build sikeres | `deno task build` hiba nélkül |
| Tab title frissül navigációkor | Böngészőben kattintás oldalak között |
| JSON-LD frissül | DevTools Elements → `<head>` → `<script>` id-k |

---

## Méret és teljesítmény

- **Island méret**: 1.12 kB (gzip: 0.53 kB) — elhanyagolható
- **Runtime hatás**: Csak Partial swap után fut egyetlen useEffect
- **SSR hatás**: Nulla — az island `return null`, nem renderel HTML-t
- **Kompatibilitás**: Preact + Fresh 2.x Partial rendszer
