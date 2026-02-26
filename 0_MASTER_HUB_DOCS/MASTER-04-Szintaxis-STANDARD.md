# MASTER-04 – SZINTAXIS ÉS TARTALMI SZABVÁNY

> **KANONIKUS DOKUMENTUM – ELSŐDLEGES SZABÁLYRENDSZER**
> Ebben a dokumentumban rögzített szabályok **minden más master dokumentummal szemben elsőbbséget élveznek** minden olyan kérdésben, amely **szintaxisra, struktúrára, címkézésre, markdown- és YAML-használatra** vonatkozik.

Ez a dokumentum **témablind**: bármilyen vertikálra (SEO, matematika, pénzügy, ipar, építőipar, oktatás, B2B tudástár stb.) **változtatás nélkül alkalmazható**.

---

## 🔐 Dokumentum státusz

Ez a dokumentum **KANONIKUS és LOCKOLT**.

- A benne szereplő szabályok **kötelező érvényűek**.
- A szintaxis **nem értelmezhető, nem rövidíthető, nem optimalizálható**.
- A szabályok célja nem az esztétika, hanem:
  - gépi feldolgozhatóság
  - AI-kompatibilitás
  - hosszú távú karbantarthatóság
  - tömeges tartalomgyártás biztonsága

Ha egy másik dokumentum (MASTER-01 / MASTER-02 / MASTER-03) **strukturális vagy szintaktikai kérdésben eltérne**, akkor:

> **A MASTER-04 az abszolút elsődleges jogforrás.**

---

## 1. OLDALTÍPUSOK

Három oldaltípus létezik. Más nem.

### 1.1 Elméleti cikk (Article oldal)
- nincs interaktív eszköz (tsx island)
- elsődleges schema: `articleSchema`
- cél: definíció, elmélet, összefüggés, példák, hibák, alkalmazások

### 1.2 Kalkulátor / Eszköz oldal (Tool oldal)
- **tsx island** a markdown előtt (kötelező)
- alatta **markdown dokumentáció** (kötelező)
- elsődleges schema: `softwareSchema`
- cél: gyors számítás + használat + rövid elméleti háttér + példák

> NINCS „tool-only" oldal. A kalkulátor **mindig** markdowndal együtt él.

### 1.3 Utility Hub oldal
- standalone eszköz (kalkulátor, átváltó, ellenőrző tool)
- a forgalom értéke passzív (ads), nem lead
- schema: `softwareSchema` (ajánlott, nem kötelező)
- szabályai: MASTER-02 RÉSZ I – „Utility Hub (Tool-oldal)"

---

## 2. SITE-SZINTŰ CONTENT MAP – BELSŐ LINKEK FORRÁSA

### 2.1 Mit jelent?
- Ez **nem** a cikkbe írt tartalomjegyzék.
- Ez a **teljes site tartalomtérképe slugokkal**, amiből a belső linkelés dolgozik.

### 2.2 Szabály
- Belső link **csak** a content map-ben szereplő slugra mutathat.
- „Majd lesz ilyen oldal" link → **TILOS**.

---

## 3. CÍMSOR SZABÁLYRENDSZER

### 3.1 H1 – abszolút tilalom a body-ban
- A markdown body-ban **TILOS** a `#` használata.
- Az oldal **egyetlen H1 eleme** a frontmatter `title` mezőből származik.
- A body-ban megjelenő legmagasabb szintű cím **mindig H2**.

Ez a szabály nem függ a tartalom típusától, a CMS-től, az SSR / SSG megoldástól.

### 3.2 Kötelező hierarchia
- A tartalom **kötelezően H2-vel indul**.
- H3 csak H2 alatt, H4 csak H3 alatt áll.

Engedélyezett struktúra:
```
H2
 └─ H3
     └─ H4
```

Tiltott minták:
- H3 közvetlenül body elején
- H2 kihagyása
- címhierarchia visszaugrása (pl. H4 → H2)
- duplikált címsor

### 3.3 Címsor SEO-guideline
- Címsor legyen **egyértelmű, leíró, nem clickbait**.
- Ne legyen keyword-stuffing.
- Legalább **3 db kérdés-alapú H2** legyen minden oldalon (featured snippet + AI Overview eligibilitás).

Ajánlott címsor sablonok:
- `## Mi ez?`
- `## Hogyan működik?`
- `## Használati útmutató`
- `## Példa számítás`
- `## Érvényességi tartomány`
- `## Tipikus hibák és megoldások`
- `## Gyakorlati alkalmazások`
- `## Kapcsolódó eszközök / cikkek`
- `## Gyakran Ismételt Kérdések (FAQ)`

### 3.4 Automatikus navigáció
- A weboldal automatikusan generál **On this page** navigációt a H2-ekből.
- Manuális TOC a body-ban **TILOS**.

---

## 4. YAML FRONTMATTER

### 4.1 Kötelező keret
- YAML mindig a fájl legelején.
- `---` nyitó és záró sor kötelező.
- Behúzás: **space**. TAB **TILOS**.

### 4.2 Kötelező alapmezők (minden oldal)
```yaml
---
title: "Oldal címe"
description: "Meta description – 120–160 karacter"
canonical: "https://domain.tld/utvonal"
published_at: 2026-01-01T10:00:00.000Z
refreshed_at: 2026-01-01T10:00:00.000Z
---
```

### 4.3 Mező-szabályok

| Mező | Szabály |
|------|---------|
| `title` | 50–60 karakter, kulcsszavas, nem marketing |
| `description` | 120–160 karacter, döntéstámogató |
| `canonical` | kötelező, hálózatvédelem miatt |
| `published_at` | ISO 8601, nem változik, első publikáláskor ugyanaz, mint a `refreshed_at` |
| `refreshed_at` | ISO 8601, frissítéskor változik |

### 4.4 Ajánlott mezők
- `slug` (hierarchikus, kategória/oldal)
- `category` (1 szó, tematika szerint)
- `type` (pl. `doc`)
- `keywords` (nem SEO-faktor, de belsőnek hasznos)

### 4.5 YAML tiltások

- YAML tömbök **TILOS** (nincs `- item`)
- Bonyolult nested listák **TILOS**
- Duplikált kulcs **TILOS**
- TAB **TILOS**
- Üres string mezők **TILOS**

Nested object (pl. `articleSchema:` alatti struktúra) **megengedett**, mert a parser kezelni tudja.
A tiltás kizárólag a YAML arrays/listákra vonatkozik.

---

## 5. SCHEMA SZABÁLYRENDSZER

### 5.1 Alapelv
- A schema **nem SEO eszköz**, hanem **strukturált tükör**.
- A schema **nem tartalmazhat új információt**, amit a body-ban nem találnál.

### 5.2 Source vs. renderelt output
- A forrás-fájlban (`.md`) a schema a **YAML frontmatterben** él (pl. `articleSchema:`, `softwareSchema:`).
- A parser a YAML schema-t **JSON-LD `<script>` tagba** alakítja a renderelt HTML-ben.
- Ez nem ellentmondás: a forrás YAML, az output JSON-LD.

### 5.3 Tiltott gyakorlatok
- schema-ben szereplő, body-ban nem létező állítás
- schema-ben tömörített vagy átírt szöveg
- kulcsszóhalmozás schema-ben
- breadcrumb schema kézzel (a parser slugból generálja automatikusan)

### 5.4 Mikor melyik schema kötelező?

| Oldal típusa | Kötelező schema | Opcionális |
|--------------|-----------------|------------|
| Elméleti cikk | `articleSchema`, `faqPageSchema` | `howToSchema` |
| SEO technikai cikk | `articleSchema` (TechArticle type), `faqPageSchema` | `howToSchema` |
| Kalkulátor / eszköz | `softwareSchema`, `faqPageSchema` | `howToSchema` |
| Utility Hub | ajánlott: `softwareSchema`, `faqPageSchema` | `howToSchema` |

---

## 6. ARTICLE SCHEMA – KANONIKUS MINTA

```yaml
articleSchema:
  "@context": "https://schema.org"
  "@type": "Article"
  "@id": "https://DOMAIN.TLD/UTVONAL"
  "headline": "Cikk címe"
  "description": "Cikk leírása"
  "image":
    "@type": "ImageObject"
    "url": "https://DOMAIN.TLD/img/docs/{category}/{slug}-hero.jpg"
    "width": 1200
    "height": 630
  "datePublished": "2026-01-01"
  "dateModified": "2026-01-01"
  "inLanguage": "hu"
  "author":
    "@type": "Organization"
    "name": "Publisher neve"
    "url": "https://DOMAIN.TLD"
  "publisher":
    "@type": "Organization"
    "name": "Publisher neve"
    "url": "https://DOMAIN.TLD"
    "logo":
      "@type": "ImageObject"
      "url": "https://DOMAIN.TLD/logo.png"
      "width": 600
      "height": 60
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://DOMAIN.TLD/UTVONAL"
```

**Szabályok:**
- `@id` és `mainEntityOfPage.@id` legyen stabil, kanonikus URL.
- `dateModified` frissítéskor változzon.
- `headline` legyen olvasható, ne túloptimalizált.
- `image.url`: **kötelező**, hero kép (1200×630 px, Open Graph standard)
- `image.width` és `image.height`: ajánlott (structured data validáció)
- `publisher.logo`: **kötelező** (Google Rich Results eligibility)
- `publisher.logo` ajánlott méret: 600×60 px vagy 600×600 px (square)
- TechArticle type használható SEO-technikai témákhoz (azonos struktúra, eltérő `@type`).

### 6.1 Article Schema `image` – képstratégia

Az `image` mező **kötelező** az Article schema-ban. A Google Rich Results, Top Stories és Discover megjelenéshez szükséges.

**Képforrás prioritás (fallback logika):**

| Prioritás | Feltétel | Képforrás | Példa path |
|-----------|----------|-----------|------------|
| 1. | A cikkben van tartalmi featured image | A cikk featured image-e | `/img/docs/{category}/{slug}-hero.jpg` |
| 2. | A cikkben nincs használható kép | Generált branded OG kép | `/img/docs/{category}/{slug}-hero.jpg` |

**Szabályok:**
- A path konvenció **mindig** `/img/docs/{category}/{slug}-hero.jpg` – függetlenül attól, hogy a kép tartalmi vagy generált.
- Méret: **1200×630 px** (Open Graph standard, 1.91:1 arány).
- Ha a cikkben van releváns illusztráció vagy fotó, azt kell a schema `image.url`-be tenni – a Google a releváns tartalmi képet preferálja.
- Ha a cikk tisztán szöveges (nincs featured image), **generált branded OG képet kell készíteni**: cikk címe + kategória ikon + site branding.
- A generált kép **SVG source-ból** készül, exportálva JPG/PNG formátumba.
- A schema `image.url`-ben hivatkozott kép **kötelezően léteznie kell** a publikálás pillanatában.

**TILTOTT:**
- Placeholder vagy üres `image.url` mező.
- Generált kép használata, ha van releváns tartalmi kép (felesleges felülírás).
- A schema-ból az `image` mező elhagyása.

---

## 7. SOFTWAREAPPLICATION SCHEMA – KANONIKUS MINTA

```yaml
softwareSchema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  "@id": "https://DOMAIN.TLD/UTVONAL#app"
  "name": "Eszköz / kalkulátor neve"
  "applicationCategory": "EducationalApplication"
  "operatingSystem": "Web"
  "browserRequirements": "Requires JavaScript"
  "description": "Mit csinál az eszköz, kinek, mire"
  "publisher":
    "@id": "https://DOMAIN.TLD/#organization"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://DOMAIN.TLD/UTVONAL"
  "offers":
    "@type": "Offer"
    "price": "0"
    "priceCurrency": "HUF"
    "availability": "https://schema.org/InStock"
    "category": "Free"
  "url": "https://DOMAIN.TLD/UTVONAL"
  "datePublished": "2026-01-01T10:00:00.000Z"
  "dateModified": "2026-01-01T10:00:00.000Z"
```

### Tool ↔ Elmélet kapcsolat (kötelező)
Kalkulátor oldalon kötelező hivatkozni az elméleti cikkre:
```yaml
  "about":
    "@type": "Article"
    "@id": "https://DOMAIN.TLD/ELMELETI-CIKK-UTVONAL"
    "name": "Elméleti oldal címe"
    "description": "Rövid leírás"
```

---

## 8. FAQPAGE SCHEMA + MARKDOWN SZINKRON

### 8.1 YAML minta
```yaml
faqPageSchema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  "question1": "Kérdés 1?"
  "answer1": "Válasz 1."
  "question2": "Kérdés 2?"
  "answer2": "Válasz 2."
```

### 8.2 Markdown minta (kanonikus szintaxis – `.md` fájlokban)
```markdown
## Gyakran Ismételt Kérdések (FAQ)

::: faq Kérdés 1?
Válasz 1.
:::

::: faq Kérdés 2?
Válasz 2.
:::
```

### 8.2b MDX minta (`.mdx` fájlokban)

Az `.mdx` fájlokban a `::: faq` szintaxis **nem renderel** – a custom marked parser nem fut MDX-en. Ezért az `.mdx` fájlokban **kizárólag** az `<Accordion>` komponenst kell használni.

**Standard MDX FAQ szintaxis:**
```mdx
<Accordion items={[
  { q: "Kérdés 1?", a: "Válasz 1." },
  { q: "Kérdés 2?", a: "Válasz 2." },
  { q: "Kérdés 3?", a: "Válasz 3." }
]} />
```

**TILOS:** `::: faq` blokkok `.mdx` fájlban. Nem renderelnek.

### 8.3 KRITIKUS 1:1 megfelelés
A YAML `faqPageSchema` és a body FAQ blokk (`<Accordion items={[...]}/>`):
- **azonos darabszám**
- **azonos sorrend**
- **szóról szóra azonos szöveg**

Eltérés → **HIBÁS OLDAL.**

---

## 9. HOWTO SCHEMA

### 9.1 Mikor használjuk?
Csak ha az oldal tartalma valóban:
- lépésről lépésre folyamat
- a lépések konkrétak
- az olvasó „végrehajtja" (pl. egyenlet megoldása, kalkulátor használata)

### 9.2 Mikor TILOS?
- ha nincs valódi lépéslista a cikkben
- ha csak elméleti magyarázat
- ha a lépések marketing jellegűek

### 9.3 Kanonikus YAML szintaxis (tömb nélkül)
```yaml
howToSchema:
  "@context": "https://schema.org"
  "@type": "HowTo"
  "name": "Hogyan használd a Százalék kalkulátort?"
  "description": "Lépésről lépésre útmutató a kalkulátor használatához."
  "step1":
    "@type": "HowToStep"
    "name": "Válaszd ki a műveletet"
    "text": "Válaszd ki, hogy százalékértéket, százaléklábat, változást vagy eltérést számolsz."
  "step2":
    "@type": "HowToStep"
    "name": "Add meg az értékeket"
    "text": "Töltsd ki a mezőket a kiválasztott művelet szerint."
  "step3":
    "@type": "HowToStep"
    "name": "Olvasd le az eredményt"
    "text": "Az eredmény valós időben frissül, a képlet és a számítási lépések is megjelennek."
```

### 9.4 Kötelező tartalmi megfeleltetés
Ha van `howToSchema`, a markdownban is legyen azonos logikájú szakasz. A kanonikus megoldás (H3 TILOS a body-ban):

```markdown
## Használati útmutató

1. **Válaszd ki a műveletet:** ...
2. **Add meg az értékeket:** ...
3. **Olvasd le az eredményt:** ...
```

---

## 10. KIEMELŐ BOXOK (KANONIKUS SZINTAXIS)

### 10.1 Markdown szintaxis (`.md` fájlokban)

```markdown
> [tip]: 💡 Praktikus tanács, gyors tipp, használati javaslat.
> Több soros szöveg is megengedett.

> [info]: ℹ️ további kontextus, háttértudás.

> [warn]: ⚠️ Figyelmeztetés, limitáció, hibalehetőség.
```

Más box-format → **TILOS.**

### 10.2 MDX szintaxis (`.mdx` fájlokban)

Az `.mdx` fájlokban a `> [tip]:` szintaxis **nem renderel** – helyette az `<InfoCard>` komponenst kell használni:

```mdx
<InfoCard type="tip" title="Tipp címe">
  Tipp tartalma. Több soros szöveg, **markdown formázás** megengedett.
</InfoCard>

<InfoCard type="info" title="Info címe">
  Információ tartalma.
</InfoCard>

<InfoCard type="warn" title="Figyelmeztetés címe">
  Figyelmeztetés tartalma.
</InfoCard>

<InfoCard type="case" title="Esettanulmány címe">
  Esettanulmány tartalma (rövidebb, inline CaseStudy alternatíva).
</InfoCard>
```

**Szabály:** MDX fájlban kizárólag `<InfoCard>` használható kiemelő dobozként. A blockquote `>` szintaxis MDX-ben **nem renderel vizuális box-ot**.

---

## 11. KÉPLETEK (KaTeX)

- **Inline:** `$a^2 + b^2 = c^2$` – rövid, magyarázó képletek.
- **Blokk:** levezetés, számítás – fenced blokk formátumban:

````markdown
$$
\frac{a}{b} \times 100
$$
````

---

## 12. KÓD BLOKKOK

- Minden kód fenced blockban.
- Komment csak a kódon belül.

---

## 13. BELSŐ LINK SZABÁLYOK

### 13.1 Forrás
- Belső link **csak** a content map-ben szereplő slugra mutathat.

### 13.2 Anchor text
- Minden belső link **leíró anchor texttel** → nem „itt", nem „erre kattintva".
- A link **kontextuális**: a szöveg mondatban értelmes a link nélkül is.

### 13.3 Sűrűség
- Maximum **2–3 belső link szelvényenként** (H2 szakaszonként).
- Hub → Hub: korlátlan, tematikus.
- Hub → Niche: pontosan 1/dokumentum.
- Niche → Hub: max 1–2/oldal.
- Niche → Niche (különálló domain): **TILOS.**
- Spoke → Spoke (azonos hub alatti): megengedett, max 1 link/oldal, csak ha user-journey megköveteli.

### 13.4 Keresztlinkek elhelyezése

**Rossz gyakorlat (manuális TOC):**
```markdown
## Tartalomjegyzék
- [Alapfogalmak](#alapfogalmak)
- [Miért reped](#miért-reped)
```
→ TILOS (automatikus "On this page" navigáció van)

**Jó gyakorlat (kontextuális keresztlinkek a szövegben):**
```markdown
## Alapfogalmak és definíciók

A betonpadló repedések megértéséhez fontos ismerni a [beton szilárdság és terhelhetőség](https://iparimegoldasok.hu/docs/beton/beton-szillardsag) alapelveit.
```

### 13.5 "Kapcsolódó témák" info box (opcionális)

Ha a kapcsolódó cikkek **valóban előfeltételek**, használható:

```markdown
## Mi az ipari betonpadló repedés?

> [info]: ℹ️ **Kapcsolódó témák:** 
> Mielőtt tovább olvasol, érdemes megismerni az [ipari padlóburkolatok típusait](link) és a [beton alapvető tulajdonságait](link).
```

**Szabály:**
- Maximum **1 ilyen box / cikk**
- Csak előfeltétel jellegű linkek
- Nem helyettesíti a végi "Kapcsolódó cikkek" szekciót (hub dokumentumoknál)

### 13.6 Breadcrumb automatikus generálás

A breadcrumb **automatikusan generálódik** a slug alapján:
- Slug: `beton/ipari-betonpadlo-repedesek`
- Breadcrumb: Főoldal → Beton → Ipari betonpadló repedések

A breadcrumb schema-t a parser generálja automatikusan (szekció 5.3).

(Részletes linkelési szabályok: MASTER-02 RÉSZ I)

---

## 14. KÜLSŐ HIVATKOZÁSOK

### 14.1 Mikor megengedett külső hivatkozás?

Külső hivatkozás **megengedett**, ha:
- **Tudományos/szakmai forrás:** szabvány, tanulmány, kutatás
- **Hivatalos forrás:** jogszabály, hatósági közlemény
- **Ipari best practice:** gyártói műszaki dokumentáció

Külső hivatkozás **TILOS**, ha:
- Affiliate link
- Versenytárs oldal
- Nem megbízható forrás (blog, fórum)
- Marketing jellegű tartalom

### 14.2 Külső hivatkozás szabályok

- Maximum **2-3 külső hivatkozás / cikk**
- Minden külső link `rel="nofollow"` vagy `rel="noopener"` attribútummal
- Anchor text: tényszerű, nem marketing
- Kontextus: az állítás alátámasztása, nem promóció

### 14.3 Példák

**Helyes külső hivatkozás:**
> Az Eurocode 2 szabvány szerint a betonpadló minimális vastagsága ipari terhelésnél 15 cm. Forrás: [EN 1992-1-1:2004 Eurocode 2](https://example.com/eurocode) (külső link, műszaki szabvány)

**Helytelen külső hivatkozás:**
> A legjobb ipari padlóburkolat a XYZ Kft. terméke. [Tudj meg többet](https://xyzkft.hu) (TILOS – marketing link)

### 14.4 Autoritatív források whitelist (példák)

- **Szabványok:** ISO, EN, MSZ szabványok hivatalos forrása
- **Jogszabályok:** Magyar Közlöny, EUR-Lex
- **Kutatás:** Peer-reviewed journals (ScienceDirect, ResearchGate)
- **Ipari szövetségek:** Magyar Betonszövetség, Magyar Építőanyagipari Szövetség
- **Gyártói műszaki dokumentáció:** hivatalos műszaki adatlap (datasheet)

**Előny:** EEAT növelés, AI-kompatibilitás, szakmai hitelesség

---

## 15. ASSET HIVATKOZÁSOK

### 15.1 Táblázatok
- **Minden táblázat markdown táblázat** (egyszerű és komplex is)
- Nincs SVG táblázat (felesleges komplexitás)
- Példa markdown táblázat:
  ```markdown
  | Repedéstípus | Szélesség | Veszély |
  |--------------|-----------|---------|
  | Hajszálrepedés | 0.1-0.5 mm | Alacsony |
  | Szerkezeti repedés | 2-10+ mm | Magas |
  ```

### 15.2 Magyarázó ábrák és diagramok (SVG)
Az SVG **magyarázó ábrák** a tartalom vizuális megértéséhez:

**Mikor kell SVG ábra:**
- Folyamatábra (pl. „Betonrepedés kialakulásának folyamata")
- Szerkezeti rajz (pl. „Betonpadló rétegfelépítése")
- Összehasonlító diagram (pl. „Repedéstípusok vizuális összehasonlítása")
- Technikai illusztráció (pl. „Dilatációs hézag elhelyezése")

**Mikor NEM kell SVG ábra:**
- Egyszerű adatok → markdown táblázat
- Szöveges magyarázat elég → nincs vizuális elem

**SVG követelmények:**
- Clean, minimal design
- Professzionális, technikai stílus (nem marketing)
- Jól olvasható szövegek
- Magyarázó feliratok (label)

Példa:
```markdown
![Betonpadló rétegfelépítése - szerkezeti diagram](https://iparimegoldasok.hu/diagrams/ipari-betonpadlo-repedesek-diagram-1.svg)
```

### 15.3 Videók (opcionális)
- YouTube embed: `https://www.youtube.com/embed/{VIDEO_ID}`
- Self-hosted: `/video/docs/{category}/{slug}-video-{N}.mp4`

**KRITIKUS SZABÁLY:** Minden videó link publikálás előtt **ellenőrzendő** (működik-e a link).

### 15.4 Asset naming convention
- Prefix: `/diagrams/docs/` vagy `/video/docs/`
- Struktúra: `{category}/{slug}-{type}-{N}.{ext}`
- Type: `diagram`, `infographic`, `photo`, `video` (nincs `table`)
- N: 1-től induló sorszám

### 15.5 Alt text szabály (SEO + accessibility)
- Minden asset-nek **kötelező alt text**
- Alt text: tényszerű leírás, nem marketing
- Példa: `![Betonpadló rétegfelépítése szerkezeti rajz - keresztmetszet](...)`

---


## 16. AI-KOMPATIBILITÁS SZABÁLYOK

### 16.1 Chunkolt szelvények
Minden H2 szakasz:
- kezdőmondattal indul (mi ez a szelvény)
- **önmagában zárt logic-egység**
- nem függ erősen a megelőző szelvénytől

Tiltott: „Ahogy fentebb..." típusú szelvény-dependencia.

### 16.2 Featured snippet + AI Overview eligibilitás
- Legalább **3 db kérdés-alapú H2** minden oldalon.
- Definíció + magyarázat: 2–3 mondat max.
- Összehasonlítás: structured table.
- A tartalom **tényszerű és citálható** (nem opinió).
- Canonical URL helyes.

### 16.3 Schema és AI
- Az Article schema + FAQ schema együtt biztosítják az AI-citálhatóságot.
- Utility Hub oldalakra `softwareSchema` ajánlott.

(Részletes AI szabályok: MASTER-02 RÉSZ IV)

---

## 17. CÍMSOR AJÁNLÁS OLDALTÍPUSONKÉNT

### 17.1 Elméleti cikk (Article) – ajánlott H2 sorrend
```
## Mi ez?
## Alapfogalmak és definíciók
## Képletek és magyarázat
## Példák lépésről lépésre
## Gyakorlati alkalmazások
## Tipikus hibák és tévhitek
## Kapcsolódó eszköz (kalkulátor link)
## Kapcsolódó cikkek
## Gyakran Ismételt Kérdések (FAQ)
```

### 17.2 Kalkulátor / eszköz oldal (Tool) – ajánlott H2 sorrend
```
## Mi ez az eszköz?
## Eszköz funkciói
## Használati útmutató (HowTo kompatibilis)
## Példa számítás
## Érvényességi tartomány
## Matematikai háttér (elméleti cikk link)
## Tipikus értékek / táblázatok (ha releváns)
## Gyakorlati tippek
## Kapcsolódó eszközök
## Gyakran Ismételt Kérdések (FAQ)
```

---

## 18. MDX KOMPONENSRENDSZER

### 18.1 Alapelv

Minden új tartalom **`.mdx` formátumban** készül. Az MDX visszafelé kompatibilis a markdownnal, de lehetővé teszi Preact komponensek inline használatát a szövegben. A komponensek **automatikusan elérhetők** minden `.mdx` fájlban – nem kell őket importálni.

A komponensek az `utils/mdx.ts` fájlban regisztráltak, a `MDX_COMPONENTS` objektumban. A renderelés szerver oldali (`preact-render-to-string`), a hydration a Deno Fresh island rendszerén keresztül történik.

### 18.2 Elérhető MDX komponensek

| Komponens | Fájl | Cél |
|-----------|------|-----|
| `InfoCard` | `components/mdx/InfoCard.tsx` | Kiemelő doboz (tip, info, warn, case) |
| `Accordion` | `components/mdx/Accordion.tsx` | Összecsukható szekciók (FAQ, részletek) |
| `CaseStudy` | `components/mdx/CaseStudy.tsx` | Esettanulmány kártya (EEAT) |
| `CostRange` | `components/mdx/CostRange.tsx` | Költségtartomány (alsó-felső határ, címkékkel) |
| `ExpertQuote` | `components/mdx/ExpertQuote.tsx` | Szakértői idézet kiemelés (EEAT) |
| `ComparisonRow` | `components/mdx/ComparisonRow.tsx` | Összehasonlító sor (két mód: verseny vagy adat) |
| `ProConList` | `components/mdx/ProConList.tsx` | Előnyök-hátrányok két oszlopban |
| `StepByStep` | `components/mdx/StepByStep.tsx` | Lépésenkénti folyamat vizualizáció |
| `Checklist` | `components/mdx/Checklist.tsx` | Interaktív checklist (CSS-only, JS nélkül) |
| `Timeline` | `components/mdx/Timeline.tsx` | Idővonal (jogszabályváltozások, fázisok) |
| `MdxLink` | `components/mdx/MdxLink.tsx` | Automatikus `target="_blank"` külső linkekre (HTML `a` override) |

### 18.3 Komponens szintaxis és propok

#### InfoCard
```mdx
<InfoCard type="tip" title="Cím">Tartalom. **Markdown formázás** támogatott.</InfoCard>
```
- **type** (kötelező): `"tip"` | `"info"` | `"warn"` | `"case"`
- **title** (kötelező): doboz fejléce
- Gyermek tartalom: szabad szöveg, más komponensek beágyazhatók

#### CaseStudy
```mdx
<CaseStudy name="Péter és Kata" location="Budaörs" year={2025}>
  Történet szövege, konkrét számokkal.
</CaseStudy>
```
- **name** (kötelező): építtető neve (anonim is lehet)
- **location** (kötelező): helyszín
- **year** (kötelező): szám, nem string – `year={2025}` nem `year="2025"`
- Gyermek tartalom: szabad szöveg

#### CostRange

Költségtartomány kijelző – alsó és felső határ, nyíllal összekötve, címkékkel.

```mdx
<CostRange min={2500000} max={4000000} unit="Ft" label="Kőzetgyapot teljes rendszer (15 cm, 120 m² homlokzat)" />
```
- **min** (kötelező): szám – alsó határ
- **max** (kötelező): szám – felső határ
- **unit** (opcionális, alapértelmezett: `"Ft"`): mértékegység string (`"Ft"`, `"Ft/m²"`, `"Ft/hó"`)
- **label** (opcionális): leíró szöveg – mondja el **mire vonatkozik** a tartomány (anyag, rendszer, vastagság, terület stb.)
- Megjelenítés: kártya, benne a label, alatta két végpont („alsó határ" és „felső határ" címkékkel), köztük nyíl

#### ExpertQuote
```mdx
<ExpertQuote name="Dr. Kiss János" role="energetikus" source="https://...">
  Idézet szövege.
</ExpertQuote>
```
- **name** (kötelező): szakértő neve VAGY szervezet neve
- **role** (kötelező): beosztás/szervezet
- **source** (opcionális): forrás URL
- Gyermek tartalom: az idézet szövege

#### ComparisonRow

Két mód:

**1. Összehasonlítás (winner megadva):** két opció szembeállítása
```mdx
<ComparisonRow
  label="Építési idő"
  left="8-14 hó"
  right="2-5 hó"
  winner="right"
  leftHeader="Téglaház"
  rightHeader="Könnyűszerkezet"
/>
```

**2. Adat megjelenítés (winner nélkül):** címke + két oszlop adat
```mdx
<ComparisonRow
  label="Homlokzati fal"
  left="max 0,24 W/m²K"
  leftHeader="U-érték előírás"
  right="12-15 cm EPS"
  rightHeader="Szükséges vastagság"
/>
```

- **label** (kötelező): sor azonosító címke (felül jelenik meg)
- **left** (kötelező): bal oldali érték
- **right** (kötelező): jobb oldali érték
- **leftHeader** (opcionális): bal oszlop fejléce – kontextust ad az értéknek
- **rightHeader** (opcionális): jobb oszlop fejléce
- **winner** (opcionális): `"left"` | `"right"` | `"tie"` – ha megadod, összehasonlító módba vált (zöld kiemelés + ✓ jel a győztesnél)

#### ProConList
```mdx
<ProConList
  title="Opcionális cím"
  pros={["Előny 1", "Előny 2"]}
  cons={["Hátrány 1", "Hátrány 2"]}
/>
```
- **pros** (kötelező): string tömb – előnyök
- **cons** (kötelező): string tömb – hátrányok
- **title** (opcionális): fejléc a lista felett

#### StepByStep
```mdx
<StepByStep
  title="Opcionális cím"
  steps={[
    { title: "Lépés 1 címe", desc: "Opcionális leírás" },
    { title: "Lépés 2 címe" }
  ]}
/>
```
- **steps** (kötelező): objektum tömb – `title` (kötelező) + `desc` (opcionális)
- **title** (opcionális): fejléc a lépéssor felett

#### Checklist
```mdx
<Checklist
  title="Opcionális cím"
  items={["Ellenőrizd ezt", "Készítsd el azt"]}
/>
```
- **items** (kötelező): string tömb – pipálható elemek
- **title** (opcionális): fejléc

#### Accordion

Két mód:

**1. Többelemű FAQ mód (items prop):** – a cikkek végén lévő FAQ szekcióhoz
```mdx
<Accordion items={[
  { q: "Kérdés 1?", a: "Válasz 1." },
  { q: "Kérdés 2?", a: "Válasz 2." }
]} />
```
- **items** (kötelező): objektum tömb – `q` (kérdés) + `a` (válasz)
- Az elemek egymáshoz kapcsolódó keretben jelennek meg (lekerekített sarkok felül/alul)

**2. Egyedi mód (title + children):** – szöveg közben részletek elrejtéséhez
```mdx
<Accordion title="Részletes műszaki háttér">
  Itt jön a rejtett tartalom, ami kattintásra nyílik ki.
</Accordion>
```
- **title** (kötelező): az összefoglaló címke
- Gyermek tartalom: a részletező szöveg

#### Timeline
```mdx
<Timeline
  title="Opcionális cím"
  events={[
    { date: "2024. október 1.", title: "Esemény címe", desc: "Opcionális leírás." },
    { date: "2025. január 1.", title: "Másik esemény" }
  ]}
/>
```
- **events** (kötelező): objektum tömb – `date` + `title` (kötelezők) + `desc` (opcionális)
- **title** (opcionális): fejléc

### 18.4 Mikor melyik komponens KÖTELEZŐ?

A komponenshasználat **nem opcionális** – a cikk típusától és tartalmától függ, hogy melyik komponens alkalmazása elvárt.

#### Minden cikkben kötelező (minimum):
- **InfoCard** – legalább 2 db (tip/info/warn/case) – szövegfal-tördelés
- **CaseStudy** VAGY **ExpertQuote** – legalább 1 db – EEAT biztosítás

#### Típus-specifikus kötelező komponensek:

| Ha a cikk tartalmaz... | Kötelező komponens | Miért |
|-------------------------|-------------------|-------|
| Költségeket, árakat, díjakat | `CostRange` | Vizuális tartomány, nem száraz szöveg |
| Összehasonlítást (A vs B) | `ComparisonRow` VAGY `ProConList` | Strukturált, átlátható összehasonlítás |
| Előnyök-hátrányok elemzést | `ProConList` | Két oszlopos megjelenítés |
| Lépésenkénti folyamatot | `StepByStep` | Vizuális folyamat, nem felsorolás |
| Ellenőrzési listát, feltételeket | `Checklist` | Interaktív, felhasználóbarát |
| Időbeli változásokat (jogszabály, trend) | `Timeline` | Kronológiai áttekinthetőség |
| FAQ-t | `Accordion` (items mód) | Összecsukható, olvasóbarát |
| Szakértői idézetet, véleményt | `ExpertQuote` | EEAT, hitelesség |

#### Vizuális sűrűség szabály:
- Minden **2-3 H2 szekción belül** legyen legalább 1 vizuális komponens
- Az oldal **NEM lehet száraz szövegfal** – a komponensek törik a monoton olvasási élményt
- Maximum **5 azonos típusú komponens** egymás után (pl. 5 db CostRange) – közéjük szöveget, más komponenst kell tenni

### 18.5 Komponens beágyazási szabályok

#### Nesting (beágyazás)
- `InfoCard` belsejébe **más komponens beágyazható**: `CostRange`, `CaseStudy`, másik `InfoCard`
- `CaseStudy`, `ExpertQuote` belsejébe **szabad szöveg** kerülhet, de **más komponens nem**
- `ProConList`, `StepByStep`, `Checklist`, `Timeline`, `ComparisonRow` **önálló blokk elemek** – nem ágyazhatók be más komponensbe

#### Prop szintaxis szigor
- **Szám propok** JSX szintaxissal: `min={250000}` – NEM `min="250000"`
- **String propok** idézőjelben: `unit="Ft/m²"`
- **Tömb propok** JSX szintaxissal: `items={["a", "b"]}` – a tömb kapcsos zárójelben
- **Objektum tömb propok**: `steps={[{ title: "Lépés 1", desc: "Leírás" }]}`

#### Magyar idézőjelek JSX kifejezésekben – KRITIKUS

Az MDX compiler (acorn parser) a `{...}` kapcsos zárójelek közötti tartalmat **JavaScript kifejezésként** értelmezi. Ebben a kontextusban a `"` (U+0022, egyenes idézőjel) **JavaScript string delimiter** – nem szöveges karakter.

**A probléma:** Ha magyar szövegben `„` (U+201E, alsó nyitó idézőjel) nyit, de `"` (U+0022, egyenes idézőjel) zár, az acorn parser a `"`-t string-lezárónak értelmezi → **MDX compilation error** → az oldal csendben markdown fallback-re vált → a JSX komponensek nem renderelnek.

**Kötelező pár:**
- Nyitó: `„` (U+201E) → Záró: `"` (U+201D) ✅
- Nyitó: `„` (U+201E) → Záró: `"` (U+0022) ❌ **TILOS – megtöri az acorn parsert**

**Érintett helyek:** Minden JSX expression prop, ahol magyar idézett szöveg van:
```mdx
❌ HIBÁS (acorn parse error):
<StepByStep steps={[
  { title: "Lépés", desc: "Ez a „rossz" példa – egyenes záró idézőjel" }
]} />

✅ HELYES (U+201E + U+201D pár):
<StepByStep steps={[
  { title: "Lépés", desc: "Ez a „helyes\u201D példa – tipográfiai záró idézőjel" }
]} />
```

**Markdown szövegben** (JSX kifejezéseken kívül) a probléma nem áll fenn, de konzisztencia érdekében **mindig** `„…"` (U+201E + U+201D) párt használj.

**Diagnosztika:** Ha `[MDX ERROR]` jelenik meg a szerver logban acorn parse error-ral, első lépésként ellenőrizd a magyar idézőjeleket a JSX kifejezésekben. A `"` (U+0022) karakterek kereséséhez:
```
deno eval "const t=Deno.readTextFileSync('fájl.mdx'); let i=0; for(const c of t){if(c==='\"' && i>0 && t[i-1]==='„')console.log('HIBA pozíció:',i); i++}"
```

#### HTML elem override-ok
- Az `<a>` tag automatikusan `MdxLink`-ké alakul – külső linkek (http/https) `target="_blank" rel="noopener noreferrer"` attribútumot kapnak
- Ez transzparens: a markdown `[szöveg](url)` szintaxis működik, az MDX pipeline kezeli

### 18.6 MDX fájlstruktúra kanonikus minta

```mdx
---
title: "Cikk címe"
description: "Meta description"
canonical: "https://hazepitesikalauz.hu/docs/{kategória}/{slug}"
published_at: "2026-02-23"
refreshed_at: "2026-02-23"
articleSchema:
  ...
faqPageSchema:
  ...
---

## Első H2 szekció

Bevezető szöveg, konkrét számmal indít.

<CostRange min={250000} max={850000} unit="Ft/m²" label="Téglaház, 2026" />

Kontextualizáló szöveg a költségtartományhoz...

<InfoCard type="tip" title="Tipp címe">
  Hasznos tanács a témában.
</InfoCard>

## Összehasonlító szekció?

<ProConList
  pros={["Előny 1", "Előny 2"]}
  cons={["Hátrány 1", "Hátrány 2"]}
/>

## Esettanulmány

<CaseStudy name="Anonim" location="Régió" year={2025}>
  Valós példa, konkrét számokkal.
</CaseStudy>

## Gyakran Ismételt Kérdések (FAQ)

::: faq
### Kérdés szövege?
Válasz szövege.
:::
```

### 18.7 MDX tiltások

- **TILOS** `.mdx` fájlban import statement – a komponensek auto-injektáltak
- **TILOS** inline `<style>` tag – minden stílus a `static/markdown.css`-ben él
- **TILOS** inline `<script>` tag – interaktivitás kizárólag Preact island-eken keresztül
- **TILOS** JSX fragment (`<>...</>`) – a komponensek önálló blokkként állnak
- **TILOS** a `> [tip]:` / `> [info]:` / `> [warn]:` szintaxis `.mdx` fájlban – kizárólag `<InfoCard>` használandó
- **TILOS** komponens nélküli `.mdx` fájl – ha nincs benne egyetlen komponens sem, legyen `.md`
- **TILOS** egyenes záró idézőjel (`"` U+0022) magyar `„` (U+201E) nyitó idézőjel párjaként JSX kifejezésben – az acorn parser megtörik (ld. 18.5 „Magyar idézőjelek JSX kifejezésekben")

---

## 19. TILTÁSOK ÖSSZESÍTVE

### 19.1 Általános tiltások
- H1 a body-ban
- H3 közvetlenül body elején (H2 nélkül)
- címhierarchia visszaugrása
- duplikált címsor
- `---` a body-ban
- manuális TOC a cikkben
- belső link nem szereplő slugra
- breadcrumb schema kézzel
- FAQ eltérés YAML ↔ body (`<Accordion items={[...]}/>` a standard)
- HowTo schema lépések nélkül / nem tükrözött tartalommal
- YAML tömb bármilyen formában
- üres string mező a YAML-ben
- „ahogy fentebb" szelvény-dependencia
- nem leíró anchor text
- külső link autoritatív forrás nélkül
- videó link ellenőrzés nélkül

### 19.2 MDX-specifikus tiltások
- `import` statement `.mdx` fájlban (auto-inject van, ld. 18.1)
- `> [tip]:` / `> [info]:` / `> [warn]:` szintaxis `.mdx` fájlban (`<InfoCard>` kell, ld. 10.2)
- inline `<style>` vagy `<script>` tag `.mdx` fájlban
- JSX fragment (`<>...</>`) használata
- komponens nélküli `.mdx` fájl (legyen `.md` ha nincs komponens)
- 5-nél több azonos komponens egymás után megszakítás nélkül (ld. 18.4)
- szám prop string-ként átadva: `min="250000"` helyett `min={250000}` (ld. 18.5)
- magyar `„` (U+201E) nyitó idézőjel + egyenes `"` (U+0022) záró pár JSX kifejezésben → acorn parse error → csendes fallback → komponensek nem renderelnek (ld. 18.5)

---

## 20. PUBLIKÁLÁSI CHECKLIST (KÖTELEZŐ)

### A. Frontmatter és schema
- [ ] YAML a fájl tetején, `---` kerettel
- [ ] Kötelező mezők megvannak: `title`, `description`, `canonical`, `published_at`, `refreshed_at`
- [ ] `title` 50–60 karakter
- [ ] `description` 120–160 karakter
- [ ] Oldaltípus helyes: Article, Tool, vagy Utility Hub
- [ ] Schema helyes (típus szerint: articleSchema / softwareSchema)
- [ ] Schema `image.url` van (hero kép 1200×630 px) – featured image VAGY generált OG kép (ld. 6.1)
- [ ] Schema `image.url`-ben hivatkozott kép **fájlként létezik** (nem placeholder)
- [ ] Schema `publisher.logo` van (600×60 vagy 600×600 px)
- [ ] Tool oldalon `softwareSchema.about` az elméleti cikkre mutat

### B. Struktúra és linkek
- [ ] Belső linkek csak a content map-ből
- [ ] Belső linkek leíró anchor texttel
- [ ] Max 2–3 belső link/szelvény
- [ ] Külső linkek autoritatív forrásokra mutatnak
- [ ] Külső linkek `target="_blank"` (MDX-ben automatikus a MdxLink `a` override miatt)
- [ ] Videó linkek manuálisan ellenőrizve (működnek)
- [ ] Címek: H2-vel indul, nincs H1 a body-ban
- [ ] Nincs `---` a body-ban
- [ ] FAQ 1:1 egyezés YAML ↔ body (`<Accordion items={[...]}/>` szintaxis)
- [ ] HowTo esetén a lépések megfelelnek a body tartalomnak
- [ ] Legalább 3 kérdés-alapú H2
- [ ] Minden H2 önmagában értelmes (nincs szelvény-dependencia)
- [ ] Canonical URL helyes
- [ ] Nincs footer szöveg a doksi végén (FAQ az utolsó)

### C. MDX komponensek (`.mdx` fájlokra kötelező)
- [ ] Fájl kiterjesztése `.mdx` (nem `.md`) – minden új tartalom MDX
- [ ] **Nincs** `import` statement (komponensek auto-injektáltak az `utils/mdx.ts`-ben)
- [ ] `InfoCard` – **minimum 2 db** (tip/info/warn/case kombináció)
- [ ] `CaseStudy` VAGY `ExpertQuote` – **minimum 1 db** (EEAT biztosítás)
- [ ] Költségek/árak → `CostRange` használva (nem csak szöveges tartomány)
- [ ] Összehasonlítás → `ComparisonRow` VAGY `ProConList` használva
- [ ] Lépésenkénti folyamat → `StepByStep` használva (nem sima numbered list)
- [ ] Feltétellista/ellenőrzés → `Checklist` használva
- [ ] Időbeli változások → `Timeline` használva
- [ ] **Nincs** `> [tip]:` szintaxis (helyette `<InfoCard>`, ld. 10.2)
- [ ] Vizuális sűrűség: minden 2-3 H2 szekción belül van vizuális komponens
- [ ] Nincs 5+ azonos komponens egymás után szöveges megszakítás nélkül
- [ ] Szám propok JSX szintaxissal: `min={250000}` (nem `min="250000"`)
- [ ] Beágyazási szabályok betartva (ld. 18.5)

### D. Fájlok és assetek
- [ ] Hero SVG mentve: `static/img/docs/{kategória}/{slug}-hero.svg` (1200×630)
- [ ] Minimum 1 magyarázó diagram SVG: `static/diagrams/docs/{kategória}/{slug}-diagram-{N}.svg`
- [ ] Minden asset-nek van alt text
- [ ] (Ha kalkulátor) Island TSX mentve: `islands/{EszközNév}.tsx`

---

## 21. ZÁRÓ ELV

> Az első verzió már helyes legyen.
> (SEO, schema, belső linkek, parser-szabályok, MDX komponensek)

Ez a dokumentum a rendszer **technikai alkotmánya**.

Aki ezt megszegi, az nem „kreatív", hanem **inkompatibilis**.

---

**KANONIKUS. LOCKED.**
