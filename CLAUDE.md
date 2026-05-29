# CLAUDE.md – hazepitesikalauz.hu

## Projekt leírás

Magyar nyelvű házépítési tudáshub. Domain: **hazepitesikalauz.hu**. Framework: **Deno Fresh**. Nyelv: **magyar**.
120 tervezett cikk, 11 kategória. Cél: döntéselőkészítés házépítés előtt álló családoknak – nem tanácsadás, hanem értelmezési keret.

---

## ⚠️ Operatív tudás és helyesbítések (KÖTELEZŐ – ezek felülírják a lentebbi elavult részeket)

> Ezeket a 2026-os tartalomgenerálás során ellenőriztük a kódban. **Ezek az igazság**, ahol a lenti szöveg mást mond, ezek érvényesek.

### URL-séma – NINCS `/docs` prefix
- Az oldalak élő URL-je: `https://hazepitesikalauz.hu/{kategória}/{slug}` (pl. `/koltsegek/keszultsegi-fokok`).
- A route a **`routes/[...slug].tsx`** catch-all (NEM `routes/docs/[kategória]/[slug].tsx`).
- A frontmatter `canonical` és minden `articleSchema."@id"` / `mainEntityOfPage."@id"` **`/docs` nélkül** legyen.
- Belső linkek a body-ban: `[szöveg](/{kategória}/{slug})` – **`/docs` nélkül**.
- **Kivétel (a `/docs` HELYES marad):** statikus képek `image.url` → `https://hazepitesikalauz.hu/img/docs/{kat}/{slug}-hero.svg`, és diagram → `/diagrams/docs/{kat}/{slug}-diagram-1.svg` (mert a `static/` mappa így strukturált).

### Regisztráció KÖTELEZŐ – különben 404
Minden új cikket fel kell venni a **`content/toc.ts`** megfelelő kategória `pages` tömbjébe:
```ts
["page", "slug-neve", "Megjelenő cím"],
```
A `routes/[...slug].tsx` a `TABLE_OF_CONTENTS`-ben keresi a slugot; ha nincs benne → `HttpError(404)`, hiába létezik az `.mdx`.

### Elérhető MDX komponensek (import NÉLKÜL, auto-injektált)
`InfoCard`, `Accordion`, `CaseStudy`, `CostRange`, `ExpertQuote`, `ComparisonRow`, `ProConList`, `StepByStep`, `Checklist`, `Timeline`.
- **NINCS `ComparisonTable`** → táblázathoz markdown táblát használj, „X vs Y" döntéshez `ComparisonRow`-t (`left`, `right`, `leftHeader`, `rightHeader`, `leftItems`, `rightItems`).
- `StepByStep` **objektumtömböt** vár: `steps={[{ title: "...", desc: "..." }]}` (NEM stringtömböt).
- `InfoCard type`: `tip` | `info` | `warn` | `case`.

### Kalkulátor / island hozzáadása (3 lépés)
1. `islands/{Név}.tsx` – Preact island (`useState`, Tailwind, dark mode osztályok – minta: `CostCalculator.tsx`).
2. Regisztráció: `routes/[...slug].tsx` → import + `ISLAND_REGISTRY` bővítés.
3. A cikk frontmatterébe: `island: "{Név}"` (egy island / oldal, a tartalom alatt renderel).

### Idézőjel-csapda JSX propban (acorn) – csendes fallback forrása
JSX prop értékében (pl. `title="…"`, `label="…"`) **SOHA** ne legyen magyar `„` + egyenes `"` pár → az MDX compile elbukik, csendes markdown fallback lesz (a `::: faq` és a `<Komponens>` nyersen kiszivárog). Megoldás: a propban kerüld az idézőjelet, vagy `„…"` (U+201E + U+201D) párt használj. (Részletek a 18.5 szekcióban.)

### Ellenőrzés publikálás előtt (KÖTELEZŐ)
1. **MDX compile-check** minden új fájlra (acorn parse).
2. **Élő render:** `curl http://localhost:5173/{kat}/{slug}` → HTTP 200, és NINCS `::: faq` vagy `&lt;StepByStep`/`&lt;InfoCard` a kimenetben (az fallback-et jelez).
3. Minden hivatkozott hero + diagram SVG **létezik**.

### Márkasemlegesség (KÖTELEZŐ)
**TILOS** cégnév vagy márkanév a publikus tartalomban (pl. KP Sales House, STEICO, Naturheld, Terrán, Hisense, Kensol, Thermory, Eternit, HERCULIT, SIKA stb.). A technológiát mint **kategóriát** írd le (pl. „farost szigetelés", „betoncserép", „korcolt fémlemez prémium bevonattal"). A referenciaanyag (`docs-internal/referencia/`) belső forrás – soha ne kerüljön be cégnév a cikkbe.

---

## 📋 Tartalom státusz – kész és tervezett cikkek

### Elkészült (referencia 1. kör, 2026-05) – 12 cikk
`koltsegek/keszultsegi-fokok` (+ `KeszultsegiKalkulator` island), `koltsegek/afa-hazepites`, `energia/farost-szigeteles`, `energia/diffuzio-nyitott-falszerkezet`, `energia/futes-hutes-osszehasonlitas`, `energia/rekuperator-kozponti-vs-egyhelyiseges`, `telek/talajcsavaros-alapozas`, `jog/keszhaz-szerzodes-buktatok`, `kivitelezes/homlokzatburkolat-konnyuszerkezet`, `kivitelezes/tetofedes-valasztas`, `tervezes/tetoter-beepites`, `haztipusok/cnc-favazas-keszhaz`.

### Tervezett (referencia 2. kör) – részletes terv külön fájlban
A hátralévő és tervezett cikkek (12 téma + 4 új kalkulátor ötlet, prioritással, slug/kategória/forrás-tartalom bontásban):
**→ `internal-docs/CIKK-TERVEZET-referencia-temak.md`**

Röviden a 2. kör témái: esztrich vs szárazesztrich, glettelési minőség (Q1–Q4), villamos hálózat (MBCU csillagpont), belső falak könnyűszerkezetnél, használati melegvíz (HMV), víz- és szennyvízrendszer, nyílászáró-összehasonlítás (műanyag vs fa-alu), bejárati ajtó (biztonság/Rw dB), természetes építőanyagok + EPBD 2030, lapostető szigetelés, időjárás és építkezés, munkaterület-átadás és kitűzés.

---

## Kötelező referenciák

Minden tartalomgenerálás előtt **OLVASD EL** ezeket a fájlokat:

| Fájl | Mi van benne | Mikor kell |
|------|-------------|------------|
| `internal-docs/MASTER-04-Szintaxis.md` | YAML frontmatter, schema szabályok, body szintaxis, tiltások | **MINDIG** – ez az abszolút szabályrendszer |
| `internal-docs/HUB-KONCEPCIO-03-hazepites.md` | Content map, 120 cikk slug/title/intent/CPC, kategóriák, linkelési térkép, lead stratégia | **MINDIG** – ebből tudod mit kell írni |
| `internal-docs/MASTER-01-philosophy.md` | Filozófia, pozicionálás, EEAT elvek | Első olvasásnál, utána elég fejben tartani |
| `internal-docs/MASTER-02-architecture.md` | Hub-niche struktúra, linkelési irányok, cross-link szabályok | Belső linkelésnél |
| `internal-docs/MASTER-03-playbook.md` | Projekt playbook, validálás, checklistek | Audit és batch validálásnál |

---

## Technikai környezet

- **Framework:** Deno Fresh
- **Content helye:** `static/content/docs/{kategória}/{slug}.mdx` – minden tartalom MDX formátumban
- **Route:** `routes/docs/[kategória]/[slug].tsx` – automatikusan renderel minden .mdx fájlt a content mappából, kezeli a Preact island-eket
- **Islands:** `islands/` – Preact komponensek kalkulátorokhoz, interaktív eszközökhöz
- **SVG hero képek:** `static/img/docs/{kategória}/{slug}-hero.svg`
- **SVG magyarázó ábrák:** `static/diagrams/docs/{kategória}/{slug}-diagram-{N}.svg`

---

## Cikk generálási szabályok

### Nyelvi szabályok
- Nyelv: **magyar**, közérthető de szakmai hangvétel
- Tegező stílus (informális-szakértő)
- **TILOS** angol szavak (kivéve bevett szakkifejezések: SEO, CPC, URL, schema, CSOK)

### Anti-AI-szag szabályrendszer

**Ez a legfontosabb szekció.** Ha a tartalom AI-szagú, az olvasó 3 másodperc után továbblép. A Google is bünteti. Az alábbi szabályok betartása KÖTELEZŐ.

**TILTOTT kifejezések és fordulatok – SOHA ne használd ezeket:**

```
TILOS lista:
- "fontos megjegyezni" / "érdemes megjegyezni" / "érdemes kiemelni"
- "összefoglalva" / "összegezve" / "végeredményben"
- "nem elhanyagolható" / "nem elhanyagolható tényező"
- "kulcsfontosságú" / "elengedhetetlen" / "nélkülözhetetlen"
- "érdemes figyelembe venni" / "érdemes szem előtt tartani"
- "napjainkban egyre inkább" / "a modern korban"
- "számos előnnyel rendelkezik" / "számos tényező befolyásolja"
- "komplex" / "komplexitás" (használd helyette: összetett, bonyolult)
- "optimális" / "optimalizálás" (használd: legjobb, legmegfelelőbb, hangolás)
- "szignifikáns" / "szignifikánsan" (használd: jelentős, érezhetően)
- "implementálás" / "implementáció" (használd: megvalósítás, bevezetés)
- "a fentiek alapján" / "a fentiekből következik"
- "mindezek fényében" / "mindezeket figyelembe véve"
- "átfogó" képet kapunk / "holisztikus" megközelítés
- "Ebben a cikkben megvizsgáljuk..." / "Nézzük meg közelebbről..."
- "Mint azt korábban említettük..." / "Ahogy azt fentebb láttuk..."
- "Végezetül..." / "Befejezésképpen..."
- "Reméljük, hogy..." / "Bízunk benne, hogy..."
- BÁRMILYEN mondat ami "Fontos, hogy..." -val kezdődik
- BÁRMILYEN mondat ami "Érdemes..." -sel kezdődik (kivéve ha tényleg kalkulációról van szó)
```

**TILTOTT struktúrák:**

```
TILOS:
- Bevezető bekezdés ami elmondja miről fog szólni a cikk
  ("Ebben a cikkben bemutatjuk a házépítés költségeit...")
- Összefoglaló bekezdés ami megismétli amit már leírtunk
- Általános közhely-nyitás ("A házépítés az élet egyik legnagyobb döntése...")
- Felsorolás utáni "Mint láthatjuk..." összekötő
- Minden H2 szekció végén összefoglaló mondat
- Üres átvezetések szekciók között ("Térjünk rá a következő témára...")
```

**HELYETTE – hogyan írj természetesen:**

1. **Kezdj konkrétummal, ne általánossággal:**
   - ❌ "A házépítés költségei számos tényezőtől függnek..."
   - ✅ "Egy 100 m²-es téglaház Pest megyében 2026-ban 42-58 millió forintba kerül, a kivitelezés szintjétől függően."

2. **Használj konkrét számokat, ne kerekíts:**
   - ❌ "A hőszivattyú megtérülési ideje általában 5-10 év."
   - ✅ "Egy 12 kW-os levegő-víz hőszivattyú (bruttó 2,8-3,5M Ft) évi 180-240 ezer forint gázköltséget vált ki – ez 12-18 éves megtérülést jelent, hacsak nem kombinálod napelemmel."

3. **Írj úgy mintha egy barátodnak magyaráznád aki épít:**
   - ❌ "A CSOK Plusz igénybevételéhez az alábbi feltételeknek kell megfelelni..."
   - ✅ "A CSOK Plusz-hoz három dolgod kell: magyar állampolgárság, TB jogviszony, és gyerekvállalás. De a részletek számítanak – nézzük sorban."

4. **Légy őszinte a bizonytalanságokkal:**
   - ❌ "A precíz költségvetés az építkezés sikerének kulcsa."
   - ✅ "Nincs olyan költségvetés ami pontos. A kérdés nem az, hogy lesz-e túllépés, hanem hogy mekkora. A 15-20%-os tartalék nem paranoia, hanem realitás."

5. **Használj rövid mondatokat hosszúak között:**
   - "A teherhordó fal rendszer az alaptól a tetőszerkezetig egységes terhet visel. Ez drágább. De tartósabb. A vázszerkezetes megoldásnál a fal csak kitöltő elem – a vázra nehezedik minden. Olcsóbb, gyorsabb, de a hangszigetelése gyengébb."

6. **Mondj ellent a közvélekedésnek ha van rá alapod:**
   - "Sokan mondják, hogy a konténerház olcsóbb. Ez 2020-ban igaz volt. 2026-ban egy normálisan szigetelt, engedélyezett konténerház négyzetméterára megközelíti a könnyűszerkezetes házét."

7. **Személyes hangvétel, de nem erőltetett:**
   - Mintha egy építészeti szakújságíró írná aki 10 éve járja az építkezéseket
   - Van véleménye, de megindokolja
   - Nem fél kimondani ha valami rossz ötlet – de megmondja a kontextust is

**Mondathossz és ritmus:**
- Váltogasd a rövid (5-8 szó) és hosszú (15-25 szó) mondatokat
- Három hosszú mondat után MINDIG jöjjön egy rövid
- Az egész oldal ritmusa ne legyen monoton – legyen benne feszültség
- Használj kérdéseket a szövegben (nem csak H2-ben) – "De mi van ha...?", "Megéri ez?"

### Fájl formátum – MDX az alapértelmezett

**Minden cikk `.mdx` formátumban készül.** Az MDX lehetővé teszi:
- Preact island komponensek inline használatát (kalkulátorok, interaktív összehasonlítók, táblázatok)
- Gazdagabb, vizuálisabb oldalakat (ne legyen száraz szövegfal)
- Képek, SVG illusztrációk, diagramok beágyazását
- Összecsukható szekciók, tabbed tartalom, interaktív elemek

**Az `.mdx` fájlban a YAML frontmatter és body szintaxis ugyanaz mint `.md`-nél** – a különbség, hogy az MDX-ben JSX komponenseket is használhatsz a markdown között.

**⚠️ KRITIKUS – Magyar idézőjelek JSX-ben:** Az MDX compiler (acorn) a `{...}` zárójeleken belüli tartalmat JavaScript-ként értelmezi. Ha magyar `„` (U+201E) nyitó idézőjelet egyenes `"` (U+0022) zár a JSX prop-ban, az acorn a `"`-t string-lezárónak veszi → **parse error** → csendes markdown fallback → komponensek eltűnnek. **Mindig `„…"` (U+201E + U+201D) párt használj!** Részletek: `MASTER-04-Szintaxis-STANDARD.md` szekció 18.5.

**MDX import és használat minta:**
```mdx
---
title: "CSOK Plusz feltételek 2026"
description: "..."
# ... teljes YAML frontmatter ...
---

import CsokCalculator from '../../islands/CsokCalculator.tsx'
import ComparisonTable from '../../islands/ComparisonTable.tsx'
import InfoCard from '../../islands/InfoCard.tsx'
import ImageFigure from '../../islands/ImageFigure.tsx'

## Ki jogosult a CSOK Plusz-ra?

A támogatás igénybevételéhez több feltételnek kell megfelelned...

<InfoCard type="tip" title="Tudtad?">
  A CSOK Plusz és a Babaváró hitel kombinálható – ez akár 25-30 millió forint kedvezményes forrást jelenthet.
</InfoCard>

## Mennyit kaphatsz? – Kalkulátor

<CsokCalculator />

## Támogatási összegek összehasonlítása

<ComparisonTable
  headers={["Támogatás", "Max összeg", "Feltétel", "Visszafizetés"]}
  rows={[
    ["CSOK Plusz", "15M Ft", "3+ gyerek", "Nem kell"],
    ["Babaváró", "11M Ft", "Házasság", "Kamatmentes 5 évig"],
    ["Falusi CSOK", "10M Ft + 5M felújítás", "Preferált település", "Nem kell"]
  ]}
/>
```

**Megjegyzés a route-ról:** A Deno Fresh route (`routes/docs/[kategória]/[slug].tsx`) az `.mdx` fájlokat is kezeli – a route betölti a fájlt, parse-olja a YAML frontmattert, és rendereli a tartalom + island komponenseket. Az island-ek a Deno Fresh standard `islands/` mappából töltődnek be, a hydration automatikus.

### Mikor TILOS `.md` (sima markdown)?

**Sima `.md`-t NE használj új oldalakhoz** – minden új oldal `.mdx` legyen. Ennek okai:
- Egységes pipeline (nem kell kétféle parsert karbantartani)
- Bármikor hozzáadhatsz interaktív elemet refactor nélkül
- A képek, info boxok is komponensként kezelhetők (konzisztens design)
- Az MDX visszafelé kompatibilis: ha nincs benne import, ugyanúgy renderel mint egy sima MD

**Meglévő `.md` oldalak:** nem kell azonnal átírni – elég átnevezni `.md` → `.mdx` és működnek változtatás nélkül. Amikor tartalmilag frissítesz egy régi oldalt, akkor add hozzá a komponenseket is.

**Minimum interaktivitás minden oldalon:** még ha egy cikk "csak" információs, akkor is használj legalább:
- 1-2 db `<InfoCard>` (tip, info, warn, case)
- 1 db `<ExpertQuote>` vagy `<CaseStudy>` az EEAT-hez
- Ahol összehasonlítás van: `<ComparisonTable>` vagy `<ProConList>`
- Ahol költség van: `<CostRange>`

Ez minimális extra munka, de drámaian javítja az olvasói élményt és az oldalon töltött időt.

### YAML frontmatter (MASTER-04 Section 1, 4, 5, 6 alapján)

**Kötelező mezők minden cikkhez:**
```yaml
---
title: "Cikk címe – egyedi, nem duplikált"
description: "120-160 karakter meta description"
canonical: "https://hazepitesikalauz.hu/docs/{kategória}/{slug}"
published_at: "2026-02-13"
refreshed_at: "2026-02-13"
articleSchema:
  "@context": "https://schema.org"
  "@type": "Article"
  "@id": "https://hazepitesikalauz.hu/docs/{kategória}/{slug}"
  "headline": "Cikk címe"
  "description": "Cikk leírása"
  "image":
    "@type": "ImageObject"
    "url": "https://hazepitesikalauz.hu/img/docs/{kategória}/{slug}-hero.svg"
    "width": 1200
    "height": 630
  "datePublished": "2026-02-13"
  "dateModified": "2026-02-13"
  "inLanguage": "hu"
  "author":
    "@type": "Organization"
    "name": "Házépítési Kalauz"
    "url": "https://hazepitesikalauz.hu"
  "publisher":
    "@type": "Organization"
    "name": "Házépítési Kalauz"
    "url": "https://hazepitesikalauz.hu"
  "mainEntityOfPage":
    "@type": "WebPage"
    "@id": "https://hazepitesikalauz.hu/docs/{kategória}/{slug}"
faqPageSchema:
  "@context": "https://schema.org"
  "@type": "FAQPage"
  "question1": "Első kérdés?"
  "answer1": "Első válasz."
  "question2": "Második kérdés?"
  "answer2": "Második válasz."
  "question3": "Harmadik kérdés?"
  "answer3": "Harmadik válasz."
---
```

**Kalkulátor/eszköz oldalaknál** az `articleSchema` helyett `softwareSchema`:
```yaml
softwareSchema:
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  "@id": "https://hazepitesikalauz.hu/docs/{kategória}/{slug}#app"
  "name": "Eszköz neve"
  "applicationCategory": "UtilityApplication"
  "operatingSystem": "Web"
  "browserRequirements": "Requires JavaScript"
  "description": "Eszköz leírása"
  "image":
    "@type": "ImageObject"
    "url": "https://hazepitesikalauz.hu/img/docs/{kategória}/{slug}-hero.svg"
    "width": 1200
    "height": 630
  "softwareVersion": "1.0"
  "publisher":
    "@type": "Organization"
    "name": "Házépítési Kalauz"
    "url": "https://hazepitesikalauz.hu"
  "offers":
    "@type": "Offer"
    "price": "0"
    "priceCurrency": "HUF"
    "availability": "https://schema.org/InStock"
```

### YAML tiltások (MASTER-04 Section 4.5)
- **TILOS:** YAML tömbök (`- item`)
- **TILOS:** TAB karakter (csak szóközök)
- **TILOS:** üres string mezők
- **TILOS:** duplikált kulcsok
- Nested object (pl. `articleSchema:` alatti struktúra) **megengedett**

### Body szintaxis (MASTER-04 Section 3)
- **H1 TILOS** a body-ban – a `title` a YAML-ből jön, a layout rendereli
- Body **H2-vel indul**
- Minden H2 szekció önálló logikai egység
- Minimum **3 kérdés-alapú H2** a cikkben (pl. "Mennyibe kerül...?", "Mikor érdemes...?")
- H3 megengedett H2 alatt, H4 **TILOS**

### Kiemelő boxok
```markdown
> [tip]: 💡 **Tipp címe**
> Tipp tartalma.

> [info]: ℹ️ **Info címe**
> Info tartalma.

> [warn]: ⚠️ **Figyelmeztetés címe**
> Figyelmeztetés tartalma.
```

### FAQ blokkok (MASTER-04 Section 9)
- Minimum 3, maximum 7 FAQ a cikk végén
- A `::: faq` blokkok **1:1 szinkronban** a YAML `faqPageSchema` kérdéseivel
- Formátum:
```markdown
::: faq
### Kérdés szövege?
Válasz szövege.
:::
```

### Belső linkek (MASTER-04 Section 13)
- **CSAK** a HUB-KONCEPCIO-03 content map-ben szereplő slugokra
- Maximum 2-3 belső link H2 szekciónként
- Kontextuális anchor text – **TILOS** "itt", "erre kattintva"
- Formátum: `[leíró szöveg](/docs/{kategória}/{slug})`

### Külső hivatkozások és kutatás

**Minden cikk szakmailag megalapozott, kutatott tartalom legyen.** A bot NEM ír felszínes, általános szöveget – hanem **mélyül el az adott témában** és hazai/külföldi szaksajtóból, hivatalos forrásokból merít.

**Kötelező kutatási lépések cikkírás előtt:**
1. Keress releváns **magyar** forrásokat először (szakmai portálok, jogszabályok, statisztikák)
2. Keress külföldi referenciákat ahol releváns (EU irányelvek, nemzetközi szabványok, építőipari tanulmányok)
3. Keress **valós esettanulmányokat, példákat, tapasztalatbeszámolókat** a témához
4. Keress friss statisztikákat és adatokat (KSH, Eurostat, MNB, NAHB)

**Külső hivatkozások beágyazása a szövegbe:**
- A hivatkozások **a szövegbe ágyazottak**, nem lábjegyzetben vagy a cikk végén
- Magyar és külföldi forrásokra egyaránt hivatkozhatsz
- Kontextuális, természetes beillesztés
- Formátum: `[forrás neve](URL)` – a szöveg folyamatában

**Példa helyes beágyazásra:**
```markdown
A Magyar Nemzeti Bank [lakáspiaci jelentése](https://www.mnb.hu/...) szerint 2025 első
félévében az átlagos építési költség 15%-kal emelkedett az előző évhez képest. Ez összhangban
van az [Építési Vállalkozók Országos Szakszövetségének](https://www.evosz.hu/...) becslésével,
amely az alapanyagárak tartós emelkedésére vezeti vissza a drágulást.

Az Európai Bizottság [épületenergetikai irányelve](https://ec.europa.eu/...) szerint 2030-tól
minden új épületnek közel nulla energiaigényűnek kell lennie. A magyar szabályozás ezt a
[7/2006. TNM rendelet](https://net.jogtar.hu/...) módosításával követi.
```

**Elfogadott magyar források (PRIORITÁS):**
- Jogszabályok: net.jogtar.hu, epitesijog.hu
- Kormányzati: kormany.hu, energiahivatal.hu, katasztrofavedelem.hu
- Pénzügyi: mnb.hu, bankmonitor.hu, money.hu
- Szakmai szervezetek: ÉVOSZ, MÉASZ, ÉMI, MMK
- Szakportálok: epiteszforum.hu, hazaipalya.hu, lakaskultura.hu, otthonterkep.hu
- Statisztika: ksh.hu
- Ingatlan/építőipar: ingatlan.com, portfolio.hu/ingatlan, mfor.hu

**Elfogadott külföldi források:**
- EU/szabvány: EUR-Lex, Passivhaus Institut, Building Research Establishment
- Statisztika: Eurostat, NAHB (National Association of Home Builders)
- Szakmai: archdaily.com, buildingreen.com, energysage.com
- Kutatás: egyetemi publikációk, peer-reviewed tanulmányok

**TILOS forrásként:**
- Fórum hozzászólások (gyakorikerdesek.hu, hasznaltauto kommentek stb.)
- Social media posztok
- Gyártói reklámanyagok (kivéve műszaki adatlapok)
- Más AI által generált tartalom
- Elavult (3+ éves) jogszabályi hivatkozások frissítés nélkül

---

### EEAT növelés – Tapasztalat, Szakértelem, Hitelesség, Megbízhatóság

A tartalom **ne legyen AI-szagú**. Minden cikknek úgy kell szólnia, mintha egy tapasztalt építőipari szakújságíró írta volna aki ténylegesen járt már építkezésen, beszélt kivitelezőkkel, és valós tapasztalatai vannak.

**Kötelező EEAT elemek minden cikkben:**

**1. Esettanulmányok és valós példák**
- Minimum **1 esettanulmány vagy valós példa** minden cikkben
- Lehet: anonim építtető története, konkrét számokkal; régiós árpélda; döntési szituáció bemutatása
- Az esettanulmány **ne legyen kitalált** – a kutatásból származzon (fórum-tapasztalatok összegzése, szakportál cikkekből vett példák, statisztikai adatokból összerakott reális szcenárió)
- MDX-ben InfoCard vagy dedikált CaseStudy komponenssel kiemelve

**Esettanulmány minta:**
```mdx
<InfoCard type="case" title="Péter és Kata története – Pest megye, 2025">
  120 m²-es téglaházat építettek Budaörsön. Az eredeti költségvetés 48 millió Ft volt,
  a végösszeg 57 millió Ft lett (+19%). A legnagyobb túllépések: földmunka (váratlan
  sziklás talaj, +2,1M Ft), nyílászárók (háromrétegű üveg felárra váltottak, +1,8M Ft),
  és a generálkivitelező pótmunka-igényei (+3,2M Ft). Tanulság: a 10%-os tartalékkeret
  kevés volt, 15-20% reálisabb.
</InfoCard>
```

**2. Konkrét számok és tartományok**
- Ne írj "nagyjából ennyi-annyi" – adj **konkrét Ft/m² tartományokat**, évszámmal
- Hivatkozz rá honnan jön az adat (KSH, ÉVOSZ, bankmonitor.hu)
- Használd a `<CostRange>` komponenst a vizuális megjelenítéshez

**3. Szakértői idézetek és vélemények**
- Ha a kutatás során találsz szakértői nyilatkozatot (építész, energetikus, kivitelező), idézd be
- Formátum: `> „Idézet szövege" – Név, beosztás ([Forrás neve](URL))`
- Ez drámaian növeli az EEAT-et

**4. „Amit nem mondanak el" szekciók**
- Minden cikkben legyen legalább **1 szekció** ami a rejtett buktatókat, gyakori csalódásokat tárja fel
- Ez az, amit a versenytársak NEM írnak meg (mert ők eladni akarnak, mi döntést támogatunk)
- Példa H2-k: "Amit a kivitelezők nem mondanak el", "Rejtett költségek amiket a kalkulátorok kihagynak", "A leggyakoribb hiba amit kezdő építtetők elkövetnek"

**5. Döntési keretrendszerek**
- Ne mondd meg mit csináljon az olvasó – adj **döntési keretet**
- "Ha X a helyzeted → Y megoldás illik jobban, mert Z"
- Használd a `<ComparisonTable>` és `<ProConList>` komponenseket
- Ez a pozicionálásunk lényege: nem tanácsadunk, hanem **döntési kompetenciát** adunk

**6. Régió-specifikus információk**
- Ahol releváns, adj **regionális bontást** (Budapest vs. vidék, Dunántúl vs. Alföld)
- Telekárak, munkaerő-költségek, támogatási feltételek mind régió-függők
- Ez az a szint amit az AI-szagú tartalom SOHA nem ér el

### CTA blokk (lead generálás)
**Kötelező** ha a cikk címe tartalmazza: ár, költség, mennyibe kerül, kalkulátor, összehasonlítás, kivitelező, építés.

```markdown
## Személyre szabott árajánlat kell?

Minden építkezés egyedi. Ha pontos költségbecslést szeretnél a te terveidhez, kérj ingyenes, kötelezettségmentes árajánlatot helyi kivitelezőktől.

[Ingyenes árajánlatot kérek →](/ajanlatkeres)
```

---

## Hero SVG generálás

**Minden cikkhez és kalkulátor oldalhoz kötelező egy hero SVG.**

- Méret: 1200×630 (OG image arány)
- Helye: `static/img/docs/{kategória}/{slug}-hero.svg`
- Stílus: egyszerű, branded, illusztratív – a cikk témájához illő ikon/ábra háttérszínnel
- A YAML schema `image.url` erre a fájlra mutat
- Szöveg az SVG-ben: a cikk H1 címe vagy rövidített változata
- Színpaletta: konzisztens az oldal design rendszerével

**SVG hero sablon struktúra:**
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#[háttérszín]" rx="0"/>
  <!-- Illusztratív ikon/ábra a témához -->
  <!-- Cikk címe szövegként -->
  <text x="600" y="350" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="bold" fill="#[szövegszín]">Cikk címe</text>
  <!-- Brand: hazepitesikalauz.hu -->
  <text x="600" y="590" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#[brand szín]">hazepitesikalauz.hu</text>
</svg>
```

---

## Magyarázó SVG diagramok

Ha a cikk témája megkívánja (folyamatábra, összehasonlítás, döntési fa):
- Helye: `static/diagrams/docs/{kategória}/{slug}-diagram-{N}.svg`
- A body-ban hivatkozás: `![Diagram leírása](/diagrams/docs/{kategória}/{slug}-diagram-1.svg)`

---

## Deliverables – mit kell legyártani cikkenként

### Minden cikkhez (kötelező):
1. `static/content/docs/{kategória}/{slug}.mdx` – teljes cikk MDX formátumban
2. `static/img/docs/{kategória}/{slug}-hero.svg` – hero kép (1200×630)
3. Minimum **1 SVG magyarázó diagram vagy illusztráció** a cikk body-jában: `static/diagrams/docs/{kategória}/{slug}-diagram-{N}.svg`

### Kalkulátor / eszköz oldalakhoz (a fentieken felül):
4. `islands/{EszközNév}.tsx` – Preact interaktív komponens

### Vizuálisan gazdag tartalom – ne legyen száraz szövegfal!

**Minden cikkben legyen vizuális elem.** A cél az, hogy az oldal **ne nézzen ki mint egy Wikipedia szócikk**, hanem legyen modern, vizuális, interaktív.

**Kötelező vizuális elemek típusonként:**

| Cikk típus | Minimum vizuális tartalom |
|------------|---------------------------|
| Információs | 1 hero SVG + 1 magyarázó diagram + info/tip boxok |
| Összehasonlító | 1 hero SVG + interaktív ComparisonTable komponens + 1 diagram |
| How-to | 1 hero SVG + lépésenkénti illusztráció VAGY folyamatábra diagram |
| Kalkulátor | 1 hero SVG + island kalkulátor + eredmény vizualizáció |
| GYIK | 1 hero SVG + összecsukható FAQ komponens |

**Újrahasznosítható island komponensek** (ezeket egyszer megírjuk, minden cikkben használhatók):

| Komponens | Mire jó | Használat |
|-----------|---------|-----------|
| `ComparisonTable` | Háztípusok, anyagok, támogatások összehasonlítása | `<ComparisonTable headers={[...]} rows={[...]} />` |
| `InfoCard` | Tip/info/warn/case kiemelő dobozok szebb megjelenéssel | `<InfoCard type="tip" title="...">szöveg</InfoCard>` |
| `ImageFigure` | Képek felirattal, forrás hivatkozással | `<ImageFigure src="..." alt="..." caption="..." />` |
| `Accordion` | Összecsukható szekciók (FAQ, részletek) | `<Accordion items={[{q: "...", a: "..."}]} />` |
| `StepByStep` | Lépésenkénti folyamat vizualizáció | `<StepByStep steps={[...]} />` |
| `CostRange` | Költségtartomány vizuális kijelző | `<CostRange min={250000} max={850000} unit="Ft/m²" label="Téglaház, 2026" />` |
| `ProConList` | Előnyök-hátrányok két oszlopban | `<ProConList pros={[...]} cons={[...]} />` |
| `CaseStudy` | Esettanulmány kiemelő kártya | `<CaseStudy name="Péter és Kata" location="Budaörs" year={2025}>történet</CaseStudy>` |
| `RegionCompare` | Régiós összehasonlítás (árak, feltételek) | `<RegionCompare regions={[{name: "Budapest", value: "..."}, ...]} />` |
| `ExpertQuote` | Szakértői idézet kiemelés | `<ExpertQuote name="Dr. Kiss János" role="energetikus" source="...">idézet</ExpertQuote>` |

---

## Kategóriák és slug prefixek

| # | Kategória | Slug prefix | Prioritás |
|---|-----------|-------------|-----------|
| 1 | Bevezetés és alapok | `alapok` | KÖZEPES |
| 2 | Háztípusok | `haztipusok` | MAGAS |
| 3 | Háztípus összehasonlítások | `osszehasonlitas` | KIEMELT |
| 4 | Költségek és pénzügyek | `koltsegek` | KIEMELT |
| 5 | Támogatások és finanszírozás | `tamogatas` | KIEMELT |
| 6 | Energetika és üzemeltetés | `energia` | MAGAS |
| 7 | Tervezés és előkészítés | `tervezes` | MAGAS |
| 8 | Jog és adminisztráció | `jog` | KÖZEPES |
| 9 | Kivitelezés és szakemberek | `kivitelezes` | MAGAS |
| 10 | Telek és helyszín | `telek` | KÖZEPES |
| 11 | Gyakori kérdések | `gyik` | KÖZEPES |

A pontos cikklista (slug, title, intent, CPC) a `internal-docs/HUB-KONCEPCIO-03-hazepites.md` Content Map részében található.

---

## Minőségi checklist (minden cikk után futtasd!)

### Frontmatter
- [ ] `title` egyedi, nem duplikált más cikkekkel
- [ ] `description` 120-160 karakter
- [ ] `canonical` URL helyes
- [ ] `articleSchema` vagy `softwareSchema` kitöltve
- [ ] `articleSchema.image.url` mutat a hero SVG-re
- [ ] `faqPageSchema` minimum 3 kérdéssel
- [ ] Nincsenek YAML tömbök
- [ ] Nincsenek TAB-ok, csak szóközök

### Body
- [ ] Nincs H1 a body-ban
- [ ] H2-vel indul
- [ ] Minimum 3 kérdés-alapú H2
- [ ] Nincs H4
- [ ] Kiemelő boxok helyes szintaxissal (`> [tip]:`, `> [info]:`, `> [warn]:`)
- [ ] FAQ blokkok `::: faq` szintaxissal
- [ ] FAQ-k 1:1 szinkronban a YAML-lel
- [ ] Belső linkek CSAK a content map-ben létező slugokra mutatnak
- [ ] Maximum 2-3 belső link H2 szekciónként
- [ ] CTA blokk (ha a cím tartalmaz: ár, költség, kalkulátor, összehasonlítás, kivitelező, építés)
- [ ] Nincs placeholder szöveg
- [ ] Nincs AI-jellegű frázis

### Fájlok
- [ ] `.mdx` mentve: `static/content/docs/{kategória}/{slug}.mdx`
- [ ] Hero SVG mentve: `static/img/docs/{kategória}/{slug}-hero.svg`
- [ ] Minimum 1 magyarázó diagram/illusztráció SVG mentve
- [ ] (Ha kalkulátor) Island TSX mentve: `islands/{EszközNév}.tsx`
- [ ] Újrahasznosítható komponensek importálva az MDX-ben (ComparisonTable, InfoCard stb.)

### Vizuális gazdagság
- [ ] Az oldal NEM száraz szövegfal – van vizuális elem minden 2-3 H2 szekción belül
- [ ] Interaktív komponens használva ahol releváns (összehasonlítás, kalkulátor, pro/con)
- [ ] Képek/diagramok felirattal és alt szöveggel

### Kutatás, források és EEAT
- [ ] Minimum 2-3 külső hivatkozás a szövegbe ágyazva (magyar és/vagy külföldi)
- [ ] Források ellenőrizhetők (nem 404, nem fórum, nem reklám)
- [ ] Jogszabályi hivatkozások frissek és pontosak
- [ ] Minimum 1 esettanulmány vagy valós példa (konkrét számokkal)
- [ ] Van "amit nem mondanak el" / rejtett buktató szekció
- [ ] Konkrét Ft/m² tartományok évszámmal és forráshivatkozással
- [ ] Régió-specifikus bontás ahol releváns
- [ ] Döntési keret adott (nem tanácsot ad, hanem keretet)
- [ ] Nem AI-szagú: nincs generikus töltelékszöveg, van valós tapasztalati réteg

### Szószám
- [ ] Pillar cikk: minimum 2000 szó
- [ ] Cluster cikk: minimum 1200 szó

---

## Tiltások – összefoglaló

| Mit | Miért |
|-----|-------|
| H1 a body-ban | Layout rendereli a YAML title-ből |
| H4 | Túl mély hierarchia, nincs SEO értéke |
| YAML tömbök | Parser nem kezeli |
| TAB | YAML szintaxis hiba |
| Belső link content map-en kívüli slugra | 404-et okoz, PBN-gyanú |
| Angol szavak (kivéve szakkifejezések) | Magyar célcsoport |
| AI frázisok | Hiteltelen, unalmas |
| Placeholder szöveg | Publikálásra kész tartalmat várunk |
| `breadcrumbSchema` kézzel | A parser automatikusan generálja slug alapján |
| Niche → Niche keresztlink (eltérő domain) | MASTER-02 tiltja, PBN-mintázat |
| Magyar `„` + egyenes `"` (U+0022) záró pár JSX-ben | Acorn parser megtörik → csendes MDX fallback → komponensek nem renderelnek. Mindig `„…"` (U+201E + U+201D) |

---

## Batch generálás workflow

### Egy cikk generálása:
1. Keresd meg a cikket a `internal-docs/HUB-KONCEPCIO-03-hazepites.md` content map-ben
2. Olvasd el a slug, title, intent, CPC, search volume adatokat
3. **KUTASS:** keress 3-5 releváns forrást a témához (külföldi szaksajtó, jogszabály, statisztika, szakmai szervezet)
4. Nézd meg a belső link célokat (milyen más cikkekre kell linkelni)
5. Generáld a `.mdx` fájlt a fenti szabályok szerint – a kutatott forrásokat ágyazd a szövegbe
6. Generáld a hero SVG-t
7. Generáld a magyarázó diagram SVG-t (minimum 1)
8. Döntsd el milyen újrahasznosítható komponensek kellenek (ComparisonTable, ProConList, stb.)
9. Futtasd a checklistet
10. Mentsd a megfelelő helyre

### Egy kategória generálása:
1. A content map-ből gyűjtsd ki az adott kategória összes cikkét
2. Sorrendben generáld: először a pillar cikkeket, utána a cluster cikkeket
3. A belső linkek a kategórián belül már az első batch után működjenek
4. Kategória végén: cross-check az összes belső linket

### Audit:
1. Gyűjtsd ki az összes `.md` fájlt a `static/content/docs/` alól
2. Ellenőrizd: minden belső link létező fájlra mutat-e
3. Ellenőrizd: minden hero SVG létezik-e
4. Ellenőrizd: van-e árva cikk (amire senki nem linkel)
5. Adj riportot

---

## Fontos kontextus a tartalomhoz

### Pozicionálás
- **Nem** vagyunk kivitelezők, építőanyag kereskedők, vagy ingatlanosok
- **Nem** adunk tanácsot, hanem **döntési kereteket** adunk
- Minden összehasonlítás **kontextus-alapú** (nem "X jobb mint Y", hanem "ha Z a helyzeted, X illik jobban")
- Az árak **értelmezési keretek** (nem árlista, hanem "mire számíts" tartomány)

### Célcsoport
- Építkezni készülő családok (25-45 év)
- Fiatal párok első lakáshoz
- Felújítók
- Technikai szint: laikus, de motivált – keresi az információt

### Monetizáció
- Lead generálás: kivitelezői ajánlatkérés
- Kalkulátor-alapú email gyűjtés
- Affiliate: építőanyag (Leroy Merlin, OBI, Praktiker linkek)
