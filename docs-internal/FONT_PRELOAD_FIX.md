# Font Preload Fix – Vite + Fresh 2.x

## A probléma

**Console warning (production):**
```
The resource http://127.0.0.1:5174/fonts/FixelVariable.woff2?__frsh_c=...
was preloaded using link preload but not used within a few seconds
from the window's load event.
Please make sure it has an appropriate `as` value and it is preloaded intentionally.
```

## Gyökérok

A Fresh 2.x Vite-alapú build pipeline-ban a CSS fájlok tartalmát a Vite feldolgozza és hash-eli.
Amikor a `styles.css`-ben `@font-face` van definiálva:

```css
@font-face {
  font-family: Fixel;
  font-style: normal;
  src: url("/fonts/FixelVariable.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
```

A Vite a CSS-ben lévő `url()` hivatkozást átírja egy **hash-elt útvonalra**, pl.:
```
/fonts/FixelVariable.woff2?__frsh_c=abc123hash
```

Közben az `_app.tsx`-ben volt egy kézzel írt preload link:
```tsx
<link rel="preload" href={asset("/fonts/FixelVariable.woff2")} as="font" />
```

Az `asset()` függvény **más hash-t** generál, mint amit a Vite a CSS-be ír, mivel ez a Fresh runtime saját cache-buster-je. Eredmény:
- A böngésző **letölti a font-ot a preload URL-ről** (hash A)
- A CSS `@font-face` **újra letölti** a font-ot (hash B)
- A preload-dal letöltött verziót **nem használja senki** → console warning

## A megoldás

**Töröld a `<link rel="preload">` sort az `_app.tsx`-ből.**

A `@font-face` blokkban a `font-display: swap` elegendő:
- A böngésző rendszer-fonttal renderel azonnal (FOIT elkerülése)
- Háttérben letölti a custom font-ot
- Amint kész, cseréli (swap) — ez általában <100ms

### Előtte (_app.tsx):
```tsx
<link rel="preload" href={asset("/fonts/FixelVariable.woff2")} as="font" />
```

### Utána (_app.tsx):
```tsx
{/* Font preload removed: @font-face in styles.css (Vite pipeline) handles font loading.
    The old <link rel=preload> URL diverges from Vite's hashed CSS url(), causing
    "preloaded but not used" console warnings. font-display:swap is sufficient. */}
```

## Miért NEM kell preload Vite pipeline mellett?

1. A Vite a CSS-t build-kor feldolgozza, a font URL-t automatikusan hash-eli
2. A böngésző a CSS parse-olás után azonnal elkezdi letölteni a fontot
3. A `font-display: swap` biztosítja, hogy nem lesz láthatatlan szöveg (FOIT)
4. A preload dupla letöltést okoz, mert a két URL (asset() vs Vite hash) nem egyezik
5. Gyakorlati hatás: **0ms** különbség a megjelenésben, de **megszűnik a warning**

## Általános szabály Vite/Fresh 2.x projektekhez

> **Soha ne használj `<link rel="preload">` font-okra, ha a font `@font-face`-zel van betöltve egy Vite által feldolgozott CSS fájlból.** A Vite pipeline hash-elt URL-eket generál, és az `asset()` függvény más hash-t ad — ez mindig "preloaded but not used" warningot okoz.

### Kivétel
Ha a font **NEM** a Vite pipeline-on megy keresztül (pl. külső CDN-ről jön), akkor a preload hasznos lehet:
```tsx
<link rel="preload" href="https://cdn.example.com/font.woff2" as="font" crossOrigin="anonymous" />
```
