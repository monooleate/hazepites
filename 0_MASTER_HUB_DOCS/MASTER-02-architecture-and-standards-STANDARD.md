# MASTER-02-architecture-and-standards.md
## Hálózati architektúra és technikai szabványok (LOCKOLT)

---

## 🔐 Dokumentum státusz

Ez a dokumentum **LOCKOLT**.

- Nem módosítjuk SEO trendek miatt
- Nem módosítjuk Google update miatt
- Nem módosítjuk technológia vagy framework váltás miatt
- Nem módosítjuk rövid távú növekedési kísérletek miatt

Ha egy javaslat megsérti ezt a dokumentumot, akkor a javaslat **strukturálisan hibás**.

---

# RÉSZ I – HÁLÓZATI ARCHITEKTÚRA

## 🎯 A hálózat alapelve

Ez a dokumentum rögzíti a **SEO-birodalom hálózati architektúráját**.

Nem technikai megvalósítást ír le, hanem azt a **strukturális logikát**, amely meghatározza:
- hogyan kapcsolódnak egymáshoz az oldalak
- hogyan áramlik az autoritás
- hogyan választjuk szét a tudást és a konverziót
- és hogyan védjük meg a rendszert hosszú távon

---

## 🧠 Alapfeltevés: a SEO nem oldalszintű játék

A rendszer **nem oldalak gyűjteménye**, hanem **hálózat**.

- Nem egy oldal rangsorol
- Nem egy kulcsszó
- Nem egy cikk

👉 **A hálózat rangsorol.**

Ezért az architektúra fontosabb, mint bármely egyedi tartalom.

---

## 🧩 A hálózat két alaptípusa

A rendszer **két és csak két** típusú publikus webes entitást használ.

### 🟦 1. Tudáshub (Hub)

**Szerep:**
- szakmai autoritás
- EEAT központ
- mély, hivatkozható tudás
- hosszú életű tartalom

**Jellemzők:**
- hierarchikus struktúra
- dokumentációs logika
- információs search intent
- nincs direkt konverziós nyomás

**Példák:**
- iparimegoldasok.hu
- matekmegoldasok.hu (mint minta)
- későbbi vertikális hubok

---

### 🟥 2. Niche oldalak (Spoke)

**Szerep:**
- egy konkrét probléma
- egy konkrét döntési helyzet
- konverzió
- lead

**Jellemzők:**
- kevés oldal
- erős fókusz
- tranzakciós / kereskedelmi search intent
- CTA-vezérelt felépítés

**Példák:**
- betonrepedesjavitas.hu
- iparihoszivattyu.hu
- atex-kornyezet.hu

---

---

### 🟩 3. Utility Hub (Tool-oldal)

Ez a kategória **speciális esetekre** vonatkozik, amelyek nem illeszkednek a hub–niche binárisba.

**Szerep:**
- standalone utility (kalkulátor, átváltó, ellenőrző eszköz)
- passzív forgalom generáció
- standalone utility döntéstámogató eszköz
- nem döntési infrastruktúra a hub értelmében
- nem konverziós lead generáció a niche értelmében

**Jellemzők:**
- egy oldal = egy eszköz (egy search intent)
- nincs CTA-driven conversion funnel
- nincs döntési útmutató szekció
- nincs niche-link a végén
- a forgalom értéke = ad revenue / passive income, nem lead

**Mikor alkalmazzuk:**
- matematikai kalkulátorok (pl. matekmegoldasok.hu)
- átváltók (mérték, valuta, egység)
- ellenőrző eszközök (SEO audit, robots.txt validator)
- ingyenes online számolóeszközök

**Hálózati kapcsolódás:**
- Utility Hub-nak **nincs kötelező niche-link**
- Utility Hub-nak **nincs kötelező hub→niche irány**
- A linkelés **szabadságfokabb**: más Utility Hub oldalakra linkelhet (tematikus relevancia alapján)
- Egy Utility Hub-ból existál **tudáshub szellemi kapcsolat** (pl. a kalkulátor oldalon rövid magyarázat, ami hub-ra mutat), de ez nem kötelező

**Optimalizálási logika:**
- SEO: long-tail kulcsszavak + tool-specific intent (pl. „online cm inch átváltó")
- Felhasználó-centrikus: gyors eredmény, nem magyarázat
- Monetizáció: ads, nem lead

👉 **A Utility Hub nem illeszkedik a MASTER-02 hub QA ellenőrzőlistájára.** Saját szabályrendszere van (fentebb leírva).

---

## 🗺️ A hálózat alaprajza (logikai modell)
```
                TUDÁSHUB
      (autoritás, EEAT, edukáció)
                   │
    ┌──────────────┼──────────────┐
    │              │              │
 NICHE A        NICHE B        NICHE C
  (lead)         (lead)         (lead)
    │              │              │
Partner A      Partner B      Partner C


        UTILITY HUB (párhuzamos)
      (kalkulátorok, átváltók, toolok)
                   │
    ┌──────────────┼──────────────┐
    │              │              │
 TOOL A         TOOL B         TOOL C
 (passive)      (passive)      (passive)
```

👉 **A tudás felfelé centralizált.**  
👉 **A konverzió lefelé decentralizált.**

---

## 🔗 Linkelési irányelvek (kritikus szabályrendszer)

### ✅ Megengedett (kötelezően alkalmazott)

#### Hub → Niche
- kontextuális link
- szövegbe ágyazva
- „gyakorlati megoldás", „ipari alkalmazás" jelleggel

**Példa:**
> „Ipari környezetben a betonrepedések kezelése külön megközelítést igényel – részletesen itt: betonrepedesjavitas.hu"

Ez az **elsődleges autoritás-átadó irány**.

---

#### Niche → Hub
- max. 1–2 link oldalanként
- „szakmai háttér", „elméleti magyarázat" célból

**Példa:**
> „A betonrepedések szerkezeti okairól részletes műszaki háttér itt érhető el: iparimegoldasok.hu/beton"

Ez **alárendelt irány**, nem SEO-erősítés.

---

### ❌ Tiltott (strukturális hibának számít)

- Niche → niche direkt linkelés **különálló domaineken**
- körbelinkelés
- footerben domainlista
- „partneroldalak" linkgyűjtés
- rejtett vagy manipulatív linkelés

👉 Ezek **PBN-szerű mintázatot** hoznak létre, ami hosszú távon kockázatos.

---

### ⚠️ Pontosítás: egydomaines spoke → spoke link

Egyetlen kivétel áll fenn a niche → niche tiltás alól:

**Ha két spoke-oldal AZONOS hub alatt él, és tematikusan relevánsak egymáshoz**, akkor a köztük lévő link **megengedett**, de szigorú feltételekkel:

- Csak ha a **felhasználó user-journey-e megköveteli** (pl. "A betonrepedés okait keresem → a javítás módszerei" – ez természetes olvasási irány)
- Maximum **1 link per oldal** a másik spoke felé
- A link **kontextuális, szövegbe ágyazva** – nem navigációs elem, nem sidebar
- Nem szükséges, ha a hub-on keresztül is elérhető a kapcsolódó anyag

**Tiltott marad:**
- Különálló domaineken lévő niche → niche link (PBN-mintázat)
- Mesterséges „ajánlott oldalak" szekció
- Hálózatos cross-linking pattern

---

## 🧱 Autoritás- és szerepmegosztás

### Tudáshub:
- rangsorol információs kulcsszavakra
- hordozza a szakmai hitelességet
- fogalommagyarázatokat ad
- döntéselőkészítő kontextust teremt

### Niche oldal:
- rangsorol tranzakciós kulcsszavakra
- nem magyaráz mindent
- nem mélyít túl
- a döntést kéri

👉 **A niche oldal soha nem próbál hubbá válni.**

---

## 🧠 Miért nem PBN?

Ez a rendszer **nem Private Blog Network**, mert:

- nincs rejtett kapcsolat
- nincs mesterséges linképítés
- minden oldal valós funkciót tölt be
- a linkelés logikailag indokolt

A hálózat **felhasználói logikát követ**, nem SEO-trükköt.

---

## 🧭 Skálázási szabály

Új oldal indításakor:

- **új probléma** → új niche oldal
- **új tudás** → meglévő hub bővítése

❌ **soha nem:**
- új niche egy meglévő hub alá konverzióval
- új hub ugyanarra a problémára ok nélkül

---

## 🧭 Hálózati összefoglalás

> **A hub tanít.**  
> **A niche döntet.**  
> **A linkelés ezt szolgálja.**

Ha ez az egy mondat sérül, akkor az architektúra sérül.

---

# RÉSZ II – TUDÁSHUB DOKUMENTÁCIÓS SZABVÁNY

## 🎯 A tudáshub dokumentum szerepe

Ez a rész rögzíti a **tudáshub oldalak kötelező technikai és tartalmi szabványát**.

Ez **nem ajánlás**, hanem **kötelező keretrendszer** minden olyan oldalhoz, amely:
- tudáshub szerepet tölt be
- dokumentációs céllal készül
- hosszú távon SEO-autorításként működik

---

## 🧠 Mit nem csinálunk?

Egy tudáshub dokumentum:
- **nem blogposzt**
- **nem marketing tartalom**
- **nem szolgáltatásleírás**

Hanem:
> **strukturált, hivatkozható, döntéselőkészítő tudásanyag**

**A cél:**
- információs search intent kiszolgálása
- EEAT építés
- belső hivatkozási pont
- niche oldalak szakmai megtámasztása

---

## 🧱 Kötelező fájlformátum

- fájltípus: `.md`
- **MDX TILOS**
- minden dokumentum **YAML frontmatterrel kezdődik**
- a frontmatter **nem tartalmazhat tömböket**

---

## 🧾 Kötelező YAML frontmatter szabvány

Minden hub dokumentum elején:
```yaml
---
title: "Betonrepedések okai ipari épületekben | Ipari Megoldások"
description: "Miért reped a beton ipari környezetben? Terhelés, zsugorodás, alapozási hibák és kockázatok döntéshozóknak."
published_at: "2026-01-24T12:00:00.000Z"
updated_at: "2026-01-24T12:00:00.000Z"
slug: "beton/betonrepedesek-okai"
category: "beton"
type: "doc"
canonical: "https://iparimegoldasok.hu/docs/beton/betonrepedesek-okai"
image: "/img/docs/beton/betonrepedesek-okai.png"
---
```

### YAML mezők kötelező szabályai

| Mező | Szabály |
|------|---------|
| `title` | 50–60 karakter, kulcsszavas, nem marketing |
| `description` | 120–160 karakter, döntéstámogató |
| `slug` | hierarchikus (kategória/oldal) |
| `category` | 1 szó, tematika szerint |
| `type` | mindig `doc` |
| `canonical` | kötelező (hálózatvédelem miatt) |
| `image` | ajánlott, de nem kötelező (később pótolható) |

---

## 🧩 Kötelező dokumentumstruktúra (NEM felcserélhető)

Minden hub dokumentum **pontosan ezt a sorrendet** követi:

### 1️⃣ H1 – Főtémacím
- 1 oldal = 1 H1
- egyértelmű, leíró
- nem kérdés, nem clickbait

### 2️⃣ Rövid összefoglaló (5–7 sor)
**Cél:**
- mit tanul meg az olvasó
- milyen döntéshez ad alapot

⚠️ Ez a rész nem SEO intro, hanem orientáció.

### 3️⃣ Mikor releváns ipari / B2B környezetben?
**Cél:**
- kontextus
- relevancia szűrés
- felelősségtudat

Ha nem ipari téma: „Mikor releváns szakmai döntési helyzetben?"

### 4️⃣ Alapfogalmak és definíciók
- rövid, pontos meghatározások
- nem enciklopédia
- segít a további szakaszok megértésében

### 5️⃣ Szakmai rész (H2–H3 bontás)
**Cél:**
- ok–okozat
- összefüggések
- döntési háttér

**Szabályok:**
- nincs kivitelezési utasítás
- nincs „hogyan csináld"
- nincs veszélyes tanács

### 6️⃣ Tipikus hibák / tévhitek
**Cél:**
- kockázatbemutatás
- rossz döntések következményei
- edukáció

### 7️⃣ Döntési útmutató
**Cél:**
- mikor elég az információ
- mikor kell szakember
- mikor sürgős

👉 Ez a szakasz hidat képez a niche oldal felé.

### 8️⃣ GYIK (FAQ)
- 6–10 kérdés
- üzleti, szakmai fókusz
- nincs marketing hang

### 9️⃣ Kapcsolódó hub cikkek
- minimum 3 belső link
- tematikus összefüggés
- nem automatikus lista

### 🔟 Gyakorlati megoldás (KÖTELEZŐ)

Ez az **egyetlen pont**, ahol niche oldalra linkelünk.

**Formátum:**
```markdown
## Gyakorlati megoldás

Ipari vagy üzemi környezetben a probléma kezelése célzott felmérést igényel.

**Kapcsolódó megoldás:**  
[Betonrepedés javítás ipari épületekben](https://betonrepedesjavitas.hu)
```

**Szabály:**
- 1 niche link
- nem agresszív CTA
- nem értékesítési szöveg

**KRITIKUS:** A dokumentum **FAQ szekcióval zárul**. 

❌ **TILTOTT:**
- Footer szöveg a doksi végén („Dokumentum státusz...")
- Megjegyzések a YAML adatokról
- Redundáns meta-információ

✅ **OK:**
- FAQ szekció az utolsó elem
- Utána közvetlenül vége a markdown file-nak

**Indok:** A YAML frontmatter tartalmazza az összes meta-adatot, a footer szöveg AI Overview / Featured Snippet esetén szennyezi az eredményt.

---

## 🔗 Belső linkelési minimum

Minden hub dokumentum:
- ✅ legalább 3 hub → hub link
- ✅ pontosan 1 hub → niche link
- ❌ nincs niche → niche linkelés

---

## 📐 Formázási szabályok (MD-only)

### Megengedett:
- listák
- táblázatok
- idézetek
- kódblokkok
- Mermaid diagram (ha támogatott)

### Tiltott:
- HTML layout hackek
- inline stílus
- vizuális trükközés

A dokumentum olvasható marad **JS nélkül is**.

---

## ✅ Hub QA ellenőrzőlista (publikálás előtt)

- [ ] Van YAML frontmatter
- [ ] Pontosan 1 H1
- [ ] Van 5–7 soros összefoglaló
- [ ] Van „Mikor releváns…" szakasz
- [ ] Van döntési útmutató
- [ ] Van FAQ
- [ ] Van 1 niche link a végén
- [ ] Nincs szolgáltatói hangnem
- [ ] Nincs több search intent

---

## 🧭 Hub szabvány összefoglalás

> **A tudáshub dokumentum nem válasz.**  
> **A tudáshub dokumentum döntési alap.**

Ha ezt a szabványt betartjuk:
- a hub autoritássá válik
- a niche oldalak erősödnek
- a rendszer hosszú távon védett marad

---

# RÉSZ III – NICHE OLDAL SZABVÁNYRENDSZER

## 🎯 A niche oldal szerepe a hálózatban

A niche oldal:
- **nem tudáshub**
- **nem blog**
- **nem szolgáltatói weboldal**

Hanem:
> **egy problémára optimalizált, konverzióvezérelt döntési felület**, amely minőségi leadet generál és továbbcsatornáz.

---

## 🧠 A niche oldal feladata

A niche oldal feladata **nem az oktatás**, hanem:

- a probléma felismerése
- a kockázatok tudatosítása
- a döntési bizonytalanság csökkentése
- a **következő lépés kikényszerítése**

**A mély tudás:** → tudáshubon van  
**A döntés:** → niche oldalon történik

---

## 🧱 Technológiai alapelv

**Ajánlott stack:**
- Astro
- AstroWind
- MD / Astro oldalak
- statikus deploy

Technológia **nem befolyásolhatja:**
- az oldalszámot
- a tartalmi struktúrát
- a szerepleválasztást

---

## 📄 Oldalszám szabvány

### 🔴 Kötelező minimum (MVP)
**5 oldal**
```
/                    – fő landing (pozicionálás)
/megoldasi-modszerek
/koltsegek
/gyik
/ajanlatkeres
```

Ez az **abszolút minimum**, amely:
- SEO-képes
- konverzióképes
- jogilag tiszta

---

### 🟠 Optimális struktúra
**7–9 oldal**
```
/
/mi-a-problema
/okok
/megoldasi-modszerek
/koltsegek
/jogszabalyi-hatter
/gyik
/esettanulmanyok        (opcionális)
/ajanlatkeres
```

Ez a **preferált állapot** a legtöbb B2B niche-nél.

---

### ❌ Tiltott

- 10+ oldalas niche site
- blog feed
- hírek / aktualitások
- „Rólunk" oldal
- szolgáltatáslista
- árlista konkrét számokkal

---

## 🧩 Kötelező szekciók a fő landing oldalon

### 1️⃣ Hero
- 1 H1
- ipari / B2B kontextus
- 1 primary CTA
- 1 secondary CTA (edukáció)

### 2️⃣ Probléma és kockázat
- miért probléma
- milyen következményei vannak
- mi történik halogatáskor

### 3️⃣ Tipikus okok / helyzetek
- 3–5 rövid pont
- nem mély szakmai magyarázat
- link a hubra (1 db)

### 4️⃣ Megoldási irányok
- módszerek összehasonlítása
- mikor melyik jöhet szóba
- nincs kivitelezői narratíva

### 5️⃣ Költség és kockázat
- ártartomány
- mitől függ
- miért veszélyes a túl olcsó

### 6️⃣ Közvetítői szerep tisztázása
- hogyan működik a folyamat
- mit csinál a rendszer
- mit nem csinál

### 7️⃣ Interaktív elem (opcionális)

**Megengedett:**
- típusválasztó
- kockázati besorolás
- fotófeltöltés

**Tiltott:**
- játékos UI
- heavy animáció
- kötelező regisztráció

### 8️⃣ GYIK
- 5–8 kérdés
- üzleti fókusz
- kifogáskezelés

### 9️⃣ Záró CTA
- egyértelmű cselekvés
- rövid űrlap
- kockázatcsökkentő szöveg

---

## 🔗 Niche linkelési szabályok

- **niche → hub:** max 1–2 link / oldal
- **hub → niche:** szabályozott (lásd RÉSZ I)
- **niche → niche (különálló domain):** **TILOS**
- **spoke → spoke (azonos hub alatti):** megengedett, de szigorú feltételekkel (lásd RÉSZ I – „Pontosítás: egydomaines spoke → spoke link")

---

## 🧠 Tartalmi hangnem

- tényszerű
- óvatos
- nem ígér
- nem marketing
- nem szolgáltatói

**Kulcsszóhasználat:**
- természetes
- szinonimákkal
- nincs halmozás

---

## 📐 Navigációs szabályok

- főmenü: max 5–6 elem
- minden oldalról elérhető az `/ajanlatkeres`
- nincs oldalsávos tartalom
- nincs mély menüstruktúra

---

## ✅ Niche QA ellenőrzőlista

- [ ] Oldalszám megfelel (5–9)
- [ ] Egyértelmű H1 minden oldalon
- [ ] Van CTA legalább 3 helyen
- [ ] Van költségszekció
- [ ] Van szereptisztázás
- [ ] Van FAQ
- [ ] Max 2 hub link
- [ ] Nincs szolgáltatói narratíva
- [ ] Egy search intent / oldal

---

## 🧭 Niche szabvány összefoglalás

> **A niche oldal nem tanít.**  
> **A niche oldal döntet.**

Ha a látogató nem tudja, mi legyen a következő lépés, akkor a niche oldal **nem tölti be a szerepét**.

---

# RÉSZ IV – AI ÉS SEARCH ENGINE KOMPATIBILITÁS

## 🎯 A szelvény célja

Ez a rész rögzíti azokat a **technikai és tartalmi szabályokat**, amelyek biztosítják, hogy a tudáshub és a niche oldalak nem csak hagyomannos Google-keresésben, hanem **AI-alapú keresési rendszerekben** is működnek és authoritative maradnak.

Ez **nem trendüldözés.** Az AI-rendszerek (Google AI Overviews, ChatGPT browsing, Perplexity, Claude stb.) 2025-től kezdve a döntési folyamat egyre korábbi szakaszában jelennek meg. A tudáshub-nak fel kell készülnie erre.

👉 A filozofiai alap: MASTER-01, Alapelv #8 (Időtállóság – AI-vonatkozás).

---

## 🧠 Mi az AI-barát tartalom?

Az AI-rendszerek **nem véletlenszerűen** választják ki a forrásokat. A pattern:

- **Strukturált, chunkolt tartalom** → könnyebben citálható
- **Egyértelmű Q&A format** → directly felhasználható válaszban
- **Tényszerű, óvatos hangnem** → bizalmatlanság nélkül idézhető
- **Kijelölt kontextus** (mikor érvényes, mikor nem) → AI nem ad veszélyes tanácsot belőle
- **Schema markup** → structured data parsing

👉 Ha a tartalom a MASTER-01 tartalmi alapelveit betartja, **automatikusan közelebb van** az AI-kompatibilishez. Ez a szelvény a **technikai implementation** szabályait rögzíti.

---

## 🧱 Kötelező structured data (schema.org)

Minden hub dokumentumhoz kötelező a következő schema markup:

### Hub dokumentum → Article schema
```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "[H1 szövege]",
  "description": "[YAML description mező]",
  "author": {
    "@type": "Organization",
    "name": "[Site neve]"
  },
  "datePublished": "[published_at]",
  "dateModified": "[updated_at]",
  "mainEntityOfPage": "[canonical URL]"
}
```

### Hub dokumentum → FAQ schema (ha van GYIK szekció)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Kérdés szövege]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Válasz szövege]"
      }
    }
  ]
}
```

### Niche oldal → FAQ schema + BreadcrumbList
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

**Szabályok:**
- A schema-t a HTML-ben kell kifejteni (JSON-LD `<script>` tag)
- Nem markdown-szinten, hanem a renderelt oldalon
- Minden FAQ szekció → kötelező FAQ schema
- Utility Hub oldalakra: **nem kötelező**, de ajánlott (SoftwareApplication schema)

---

## 📝 Chunkolt tartalom – AI-barát struktúra

Az AI-rendszerek a tartalmat **szelvényenként** dolgozzák fel, nem az egész oldalt egyszerre. Ez azt jelenti, hogy minden szelvénynek **önmagában is értelmezhető** kell legyen.

### Szabályok:

**Minden H2 szelvény:**
- Kezdőmondat: mi erről a szelvényről (context-setting)
- Önmagában zárt logic-egység
- Nem függ erősen a megelőző szelvénytől

**Tipikus hibák (nem AI-barát):**
- „Ahogy fentebb already bevezettem..." → a szelvény nem önálló
- Tbla nélküli összehasonlítás → AI nem tudja structured-ben citálni
- Kimondottan vague állítás kontextus nélkül → AI nem idézi meg

### Ajánlott format AI-nak:

```markdown
## [Konkrét téma – H2]

[1 mondat: mi ez a szelvény]

[Lényeg – rövid, tényszerű]

| [Ha releváns: structured comparison/data] |

> **Mikor releváns ez:** [kontextus]
> **Mikor nem elég:** [határok]
```

---

## 🔍 Featured snippet és AI Overview eligibility

Az AI Overview és a Featured Snippet **hasonló mintázatot** okoz: a tartalom egy rövid, konkrét válasz.

### Featured snippet eligibility – szabályok:

- **Kérdés-alapú H2/H3:** pl. „Mi az, hogy betonrepedés?" → eligibilis
- **Lépésről lépésre format:** numbered list → HowTo schema
- **Definíció + magyarázat:** 2-3 mondat max → eligibilis
- **Összehasonlítás:** structured table → eligibilis

### AI Overview eligibility – kiegészítő szabályok:

- A tartalom **tényszerű és citálható** (nem opinió)
- Van **forrás-hitelességi jelzőszám** (EEAT – a MASTER-01 alapelvei)
- A válasz **nem veszélyes** (nincs medical/legal/financial konkrét tanács → AI elkerüli)
- A tartalom **canonical URL-lel** rendelkezik (AI is a canonical-t citálja)

---

## 🔗 AI-barát belső link stratégia

Az AI-rendszerek a belső linkeket is feldolgozzák, de kevésbé erősen, mint a Google. A célja itt más: **a tartalom koherensege.**

### Szabályok:

- Minden belső link **leíró anchor texttel** → nem „itt" vagy „erre kattintva"
- A link **kontextuális** – a szöveg mondatban értelmes a link nélkül is
- Nem halmozunk: max 2-3 belső link/szelvény

---

## ✅ AI-kompatibilitás ellenőrzőlista (publikálás előtt)

- [ ] Van Article schema (JSON-LD)
- [ ] Van FAQ schema ha GYIK szekció van
- [ ] Minden H2 szelvény önmagában értelmes
- [ ] Nincs „ahogy fentebb" típusú szelvény-dependencia
- [ ] Kérdés-alapú H2/H3 van (legalább 3 db)
- [ ] Canonical URL helyes és canonical-ban van a schema is
- [ ] Belső linkek leíró anchor texttel
- [ ] Nincs konkrét medical/legal/financial tanács (szöveg-szinten)

---

## 🧭 AI-kompatibilitás összefoglalás

> **Az AI-barát tartalom nem különleges tartalom.**
> **Az AI-barát tartalom = döntési infrastruktúra + structured data + chunkolt szelvények.**

Ha a MASTER-01 alapelvei és a fenti technikai szabályok teljesülnek:
- a tartalom Google-nak is jó
- az AI-nak is citálható
- a rendszer jövőre is védhető marad

---

**LOCKED.**