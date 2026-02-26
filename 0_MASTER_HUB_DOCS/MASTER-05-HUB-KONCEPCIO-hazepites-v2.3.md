# HUB-KONCEPCIÓ-03: Házépítés Tudáshub
## Projekt-specifikus koncepció és tartalomjegyzék

---

## 🔐 Dokumentum státusz

Ez a dokumentum **PROJEKT-SPECIFIKUS KONCEPCIÓ** – nem MASTER, hanem annak alkalmazása.

**Függőségek:**
- MASTER-01: Filozófia és Alapelvek → tartalmi elvek forrása
- MASTER-02: Architektúra és Szabványok → hub-niche struktúra, linkelés
- MASTER-03: Projekt Playbook → validálás, checklistek
- MASTER-04: Szintaxis és Tartalmi Szabvány → minden oldal formátuma

**Verzió:** 2.3
**Frissítve:** 2026-02-22

**Változások v2.1 → v2.2:**
- Fájlformátum: `.md` → `.mdx` (interaktív komponensek miatt, ld. 0. rész)
- Képstratégia szekció hozzáadva (hero képek + diagramok, MASTER-04 §6.1 alapján)
- AI-gyanú csökkentési szabályok adaptálva a házépítés vertikálra
- Oldalon belüli keresztlinkelési térkép kiegészítve
- Írói stílus és hitelesség szekció hozzáadva

**Változások v2.2 → v2.3:**
- Domain csere: `hazepites-tudastar.hu` → `hazepitesikalauz.hu` (minden előfordulásban)
- Niche domain frissítve: `hazepites-kalkulator.hu` → `hazepitesikalkulator.hu`

---

# RÉSZ 0 – TECHNIKAI FORMÁTUM: MDX

## 📄 Fájlformátum: `.mdx` (nem `.md`)

A házépítés hub `.mdx` fájlformátumot használ a `.md` helyett.

**Miért MDX?**
- Interaktív kalkulátor komponensek (Preact/React islands) beágyazhatók közvetlenül a cikk szövegébe
- CTA blokkok mint `<CTABlokk />` komponens, nem markdown hack
- Kalkulátor eredmény kontextussal együtt jelenik meg a cikkben (nem külön oldalon)
- Háztípus-összehasonlító tábla (`<ComparisonTable />`) filterezhető, mobilon kártya nézet
- Fűtési rendszer döntési fa (`<DecisionTree />`) interaktív

**Amit a MASTER-04 `.md` szabályai közül az MDX-re is alkalmazunk (változatlanul):**
- YAML frontmatter: azonos szabályok (nincs tömb, nincs TAB, kötelező mezők)
- H1 a body-ban: **TILOS**
- Automatikus breadcrumb és TOC: **változatlan**
- Schema szintaxis: **azonos** (YAML frontmatterben, parser JSON-LD-vé alakítja)
- Belső link szabályok: **azonos** (csak content map slugra)
- FAQ 1:1 szinkron: **azonos**
- Kiemelő boxok szintaxisa: **azonos** (`> [tip]:`, `> [info]:`, `> [warn]:`)

**MDX-specifikus szabályok:**
- Komponens import az MDX fájl tetején (frontmatter UTÁN, body ELŐTT)
- Komponens props clean, nem inline JS logika
- Island komponensek: `client:load` direktíva (Astro)
- Egyszerű szöveges cikkeknél `.mdx` használható `.md` helyett is – nincs hátrány

**Példa MDX struktúra:**
```mdx
---
title: "Téglaház vs könnyűszerkezetes ház: melyiket válaszd?"
description: "..."
canonical: "https://hazepitesikalauz.hu/osszehasonlitas/teglahaz-vs-konnyuszerkezetes"
published_at: 2026-03-01T10:00:00.000Z
refreshed_at: 2026-03-01T10:00:00.000Z
articleSchema:
  ...
faqPageSchema:
  ...
---

import ComparisonTable from '@components/ComparisonTable.tsx';
import VerdictBox from '@components/VerdictBox.tsx';
import CTABlokk from '@components/CTABlokk.tsx';

## Melyik háztípus a jobb befektetés?

[cikk szöveg...]

<ComparisonTable
  headers={["Szempont", "Téglaház", "Könnyűszerkezetes", "Győztes"]}
  rows={[...]}
/>

[folytatás...]
```

---

# RÉSZ I – STRATÉGIAI POZICIONÁLÁS

## 🎯 Site identity

| Attribútum | Érték |
|------------|-------|
| **Domain** | hazepitesikalauz.hu |
| **Típus** | Tudáshub (Hub) |
| **Célcsoport** | Építkezni készülő családok, fiatal párok, első lakáshoz jutók, felújítók |
| **Monetizáció** | Lead generálás kivitelezőkhöz, kalkulátor-alapú email gyűjtés, affiliate (építőanyag) |
| **Pozicionálás** | „Döntéselőkészítés házépítéshez – nem tanácsadás, hanem értelmezési keret" |

## 🧠 Piaci helyzet és lehetőség

### Magyar piac jellemzői 2025-2026

| Faktor | Helyzet | Lehetőség |
|--------|---------|-----------|
| **Tartalomminőség** | Kivitelezők reklámszövegei, nincs objektív összehasonlítás | Független döntéstámogatás |
| **Kalkulátorok** | Félrevezetőek, nem magyarázzák meg az eredményt | Értelmező kalkulátorok + kontextus |
| **CSOK/támogatások** | Bonyolult, évente változik | Folyamatosan frissülő, világos struktúra |
| **Háztípus-választás** | Elfogult tartalom (gyártók, kivitelezők) | Kontextus-alapú összehasonlítás |
| **Árak** | 250-850e Ft/m² – hatalmas szórás, félreértések | Értelmezési keret, nem árlista |

### Versenytárs elemzés

| Versenytárs típus | Erősség | Gyengeség | Hogyan verjük? |
|-------------------|---------|-----------|----------------|
| Kivitelező oldalak | Portfólió, konkrét árak | Elfogult, önpromóciós | Független összehasonlítás |
| Építőanyag webshopok | SEO, árlista | Nincs döntéstámogatás | Kontextus + kalkulátor |
| Pénzügyi portálok | CSOK, hitel kalkulátorok | Nincs építési szakmai tartalom | Teljes döntési út lefedése |
| YouTube csatornák | Vizuális, népszerű | Nincs strukturált tudásbázis | Kereshető, dokumentált tartalom |

### Kulcsszó potenciál és CPC

| Kulcsszó kategória | Keresési volumen | CPC becsült | Tartalom típus |
|-------------------|------------------|-------------|----------------|
| „házépítés költség 2025" | 12.000/hó | 800-1500 Ft | Hub dokumentum |
| „téglaház vs könnyűszerkezetes" | 4.800/hó | 600-1200 Ft | Összehasonlító |
| „CSOK plusz feltételek" | 22.000/hó | 1500-3000 Ft | Hub + Niche |
| „hőszivattyú fűtés költség" | 8.400/hó | 1200-2500 Ft | Döntési keretrendszer |
| „építési engedély egyszerű bejelentés" | 6.600/hó | 400-800 Ft | Jogi összefoglaló |
| „kulcsrakész ház ár" | 9.200/hó | 1000-2000 Ft | Értelmező + kalkulátor |
| „passzívház építés" | 3.200/hó | 800-1500 Ft | Technológia összehasonlító |

---

## 🏗️ MASTER-01 megfeleltetés

### Filozófiai alapelvek alkalmazása

| MASTER-01 elv | Alkalmazás a Házépítés hubnál |
|---------------|-------------------------------|
| Keresleti infrastruktúra | Létező döntési helyzetekre építünk („milyen házat építsek?", „mennyi pénz kell?") |
| A lead a termék | Kalkulátor → email gyűjtés → kivitelező közvetítés |
| Egy probléma = egy fókusz | „Téglaház előnyei" ≠ „Téglaház vs könnyűszerkezetes" ≠ „Téglaház költségek" |
| Tudás ≠ Konverzió | Hub magyaráz, niche döntet (pl. konkrét kivitelező ajánlat) |
| Hub–Niche gondolkodás | hazepitesikalauz.hu (hub) → hazepitesikalkulator.hu (niche) |
| Dokumentáció, nem blog | Hierarchikus, tematikus, frissíthető tartalom |

### Tartalmi alapelvek alkalmazása

| MASTER-01 tartalmi elv | Házépítés tartalom példa |
|------------------------|--------------------------|
| Egy oldal = egy search intent | „Házépítés költségei" ≠ „m² árak értelmezése" ≠ „Költségtúllépés okai" |
| Kontextus mindenek felett | „A 600e Ft/m² átlag önmagában félrevezető, mert..." |
| Óvatos megfogalmazás | „Mikor kell szakértőt hívni" szekció minden cikkben |
| Példa, nem vélemény | Valós költségbontások, tipikus esetek |
| Tartalom hálózatban él | Belső linkelés: háztípus → költség → energetika → támogatás |

---

## 🔗 MASTER-02 megfeleltetés: Architektúra

### Hálózati struktúra

```
         HAZEPITESIKALAUZ.HU (Tudáshub)
        (autoritás, EEAT, döntéselőkészítés)
                     │
    ┌────────────────┼────────────────────┐
    │                │                    │
HAZEPITES       CSOK-KALKULATOR      KIVITELEZO
KALKULATOR.HU      .HU (niche)        LISTA.HU
  (niche)           (lead)            (niche)
    │                │                    │
Email lista    Bankközvetítők        Kivitelezők
```

### Entitás szerepek

| Entitás | Típus | Szerep |
|---------|-------|--------|
| hazepitesikalauz.hu | **Hub** | Szakmai autoritás, EEAT, döntési keret |
| hazepitesikalkulator.hu | **Niche** | Költségbecslés, email gyűjtés, lead |
| csok-kalkulator.hu | **Niche** | Támogatás kalkuláció, bankközvetítés |
| kivitelezo-lista.hu | **Niche** | Kivitelező közvetítés, lead |
| Kalkulátorok (hub belül) | **Utility** | Engagement, soft lead |

### Linkelési szabályok (MASTER-02 alapján)

| Irány | Szabály | Példa |
|-------|---------|-------|
| Hub → Niche | Kontextuális, „gyakorlati lépés" | „...költségbecsléshez: hazepitesikalkulator.hu" |
| Niche → Hub | Max 1-2 link/oldal, „szakmai háttér" | „Háztípusok összehasonlítása: hazepitesikalauz.hu" |
| Hub → Hub | Szabad, tematikus | Kategóriák közötti kereszthivatkozás |
| Niche → Niche | **TILOS** (különálló domain) | Nincs PBN-mintázat |

---

# RÉSZ II – KATEGÓRIA STRUKTÚRA ÉS PRIORITÁS

## 📊 Kategória áttekintés

| # | Kategória | Slug prefix | Prioritás | CPC potenciál | Tervezett cikkek |
|---|-----------|-------------|-----------|---------------|------------------|
| 1 | Bevezetés és alapok | alapok | KÖZEPES | 300-600 Ft | 6 |
| 2 | Háztípusok | haztipusok | MAGAS | 600-1200 Ft | 14 |
| 3 | Háztípus összehasonlítások | osszehasonlitas | KIEMELT | 800-1500 Ft | 10 |
| 4 | Költségek és pénzügyek | koltsegek | KIEMELT | 1000-2000 Ft | 16 |
| 5 | Támogatások és finanszírozás | tamogatas | KIEMELT | 1500-3000 Ft | 14 |
| 6 | Energetika és üzemeltetés | energia | MAGAS | 1200-2500 Ft | 14 |
| 7 | Tervezés és előkészítés | tervezes | MAGAS | 500-1000 Ft | 10 |
| 8 | Jog és adminisztráció | jog | KÖZEPES | 400-800 Ft | 10 |
| 9 | Kivitelezés és szakemberek | kivitelezes | MAGAS | 600-1200 Ft | 8 |
| 10 | Telek és helyszín | telek | KÖZEPES | 500-1000 Ft | 6 |
| 11 | Gyakori kérdések | gyik | KÖZEPES | 300-600 Ft | 12 |
| **Összesen** | | | | | **120** |

---

# RÉSZ III – TELJES CONTENT MAP

## 📁 Site-szintű URL struktúra

A MASTER-04 Section 2 szerint: **belső link csak a content map-ben szereplő slugra mutathat**.

```
/
├── /alapok/
│   ├── hogyan-hasznald-ezt-az-utmutatot
│   ├── epites-vagy-vasarlas-dontesi-alapok
│   ├── mit-jelent-ma-a-hazepites-magyarorszagon
│   ├── hazepites-dontesi-fazisok
│   ├── tipikus-hibak-a-dontesi-szakaszban
│   └── hazepites-idovonal-mire-szamits
│
├── /haztipusok/
│   ├── teglahaz-mit-jelent-valojaban
│   ├── konnyuszerkezetes-haz-mitol-mas
│   ├── fahaz-mikor-elony-mikor-nem
│   ├── kontenerház-alternativa-vagy-kompromisszum
│   ├── passzivhaz-es-alacsony-energiaigenyu-hazak
│   ├── modularis-haz-elore-gyartott-megoldasok
│   ├── ytong-porobetonhaz-jellemzok
│   ├── vályogház-korszerusitett-technologia
│   ├── acelvazas-haz-elonyok-hatranyok
│   ├── sip-panel-haz-technologia
│   ├── ikerhaz-es-sorhaz-szempontok
│   ├── tobbszintes-csaladihaz-tervezesi-kerdesek
│   ├── lakopark-vs-egyedi-epites
│   └── haztipus-valaszto-interaktiv
│
├── /osszehasonlitas/
│   ├── teglahaz-vs-konnyuszerkezetes
│   ├── fahaz-vs-teglahaz
│   ├── kontenerház-vs-hagyomanyos-epites
│   ├── passzivhaz-vs-standard-haz
│   ├── modularis-vs-hagyomanyos-epites
│   ├── ytong-vs-tegla-falazat
│   ├── sip-panel-vs-konnyuszerkezetes
│   ├── melyik-haztipus-kinek-valo
│   ├── haztipusok-koltseg-osszehasonlitas
│   └── haztipusok-epites-ido-osszehasonlitas
│
├── /koltsegek/
│   ├── hazepites-koltsegei-mibol-all-ossze
│   ├── m2-arak-ertelmezes-mit-mutatnak-mit-nem
│   ├── kulcsrakesz-vs-szerkezetkesz-penzugyi-kulonbsegek
│   ├── koltsegtulelpes-tipikus-okai
│   ├── hazepites-rejtett-koltsegei
│   ├── telek-koltsegek-es-elokeszites
│   ├── kozmuvek-bekotesi-koltsegek
│   ├── tervezesi-es-engedelyezesi-dijak
│   ├── gepeszet-villanyszereles-koltsegek
│   ├── belso-kivitelezes-burkolatok-koltsegek
│   ├── kulso-munkak-tereprendezes-koltsegek
│   ├── tartalek-keretosszeg-mekkora-legyen
│   ├── hazepites-koltseg-regiok-szerint
│   ├── hazepites-koltseg-kalkulator-hasznalati-utmutato
│   ├── koltsegvetes-keszites-lepesrol-lepesre
│   └── hazepites-finanszirozasi-lehetosegek
│
├── /tamogatas/
│   ├── csok-plusz-2025-feltetelek-osszegek
│   ├── falusi-csok-2025-telepulesek-feltetelek
│   └── [további tamogatás slugok...]
│
├── /energia/
│   └── [energia slugok...]
│
├── /tervezes/
│   └── [tervezés slugok...]
│
├── /jog/
│   └── [jog slugok...]
│
├── /kivitelezes/
│   └── [kivitelezés slugok...]
│
├── /telek/
│   └── [telek slugok...]
│
├── /gyik/
│   └── [gyik slugok...]
│
└── /eszkozok/
    ├── hazepites-koltseg-kalkulator
    ├── csok-kalkulator
    ├── futes-koltseg-kalkulator
    ├── hoszivattyú-meretezo
    ├── napelem-megterules-kalkulator
    ├── haztipus-valaszto-teszt
    ├── epitesi-idovonal-tervezo
    └── energia-hatekonysag-kalkulator
```

---

# RÉSZ IV – KÉPSTRATÉGIA

## 🖼️ Hero képek (articleSchema.image)

A MASTER-04 §6.1 alapján minden oldalhoz kötelező hero kép az Article schema `image.url` mezőjébe.

**Elérési út konvenció:**
```
/img/docs/{category}/{slug}-hero.jpg
```

Ahol `{category}` a slug prefix (pl. `osszehasonlitas`, `koltsegek`, `haztipusok`).

**Méret:** 1200×630 px (Open Graph standard, 1.91:1 arány)

**Gyártási folyamat:**
1. SVG source készül (`/img/docs/{category}/{slug}-hero.svg`)
2. SVG exportálva JPG/PNG formátumba
3. Az `articleSchema.image.url` az exportált `.jpg` path-jára mutat

**Hero kép tartalma oldaltípusonként:**

| Oldaltípus | Hero kép tartalom |
|------------|-------------------|
| **Összehasonlító** (`/osszehasonlitas/`) | Bal: Háztípus A ikon/fotó, Jobb: Háztípus B ikon/fotó, Közép: „VS", Alul: hazepitesikalauz.hu |
| **Háztípus** (`/haztipusok/`) | Háztípus vizuális (stílusos illusztráció) + cím szöveg + site branding |
| **Költség** (`/koltsegek/`) | Pénzügyi/építési ikon, cím, kategória badge, site branding |
| **Támogatás** (`/tamogatas/`) | CSOK/állami szimbólum + cím + frissítési dátum badge |
| **Energia** (`/energia/`) | Energetikai ikon (hőszivattyú, napelem stb.) + cím + branding |
| **Kalkulátor** (`/eszkozok/`) | Kalkulátor UI mockup + eszköz neve + branding |

**TILOS:**
- Placeholder vagy üres `image.url` mező
- A schema `image` mezőjének elhagyása
- Publikáláskor nem létező képre hivatkozás

## 🎨 Diagram / illusztrációs képek (SVG)

Szöveg melletti vizuális gazdagításhoz, ahol a tartalom megkívánja.

**Elérési út:**
```
/diagrams/docs/{category}/{slug}-diagram-{N}.svg
```

**Mikor kell diagram a házépítés hubban:**
- Döntési fa: „Melyik háztípust válaszd?" → flowchart
- Költségbontás: „Miből áll a házépítés költsége?" → kördiagram / sávdiagram
- Összehasonlítás: Venn-diagram (közös/eltérő jellemzők)
- Folyamat: Építkezési fázisok idővonalon
- Szerkezeti rajz: Falszerkezet rétegfelépítése (tégla vs könnyűszerkezetes)

**Mikor NEM kell diagram:**
- Egyszerű táblázatos adat → markdown táblázat
- Szöveges magyarázat elég → nincs vizuális elem

**SVG stíluskövetelmény:**
- Clean, minimal design (nem marketing)
- Technikai/informatív stílus
- Jól olvasható feliratok, magyarázó labelek
- Sötét és világos mód kompatibilis (ha lehetséges)

**Body-ban hivatkozás:**
```markdown
![Házépítési költségbontás diagram](/diagrams/docs/koltsegek/hazepites-koltsegei-mibol-all-ossze-diagram-1.svg)
```

## 📋 Képgenerálási checklist (minden oldal publikálás előtt)

- [ ] Hero SVG legyártva: `/img/docs/{category}/{slug}-hero.svg`
- [ ] Hero SVG exportálva JPG-be: `/img/docs/{category}/{slug}-hero.jpg`
- [ ] `articleSchema.image.url` pontosan erre a path-ra mutat
- [ ] `articleSchema.image.width: 1200` és `height: 630` kitöltve
- [ ] Ha van diagram: `/diagrams/docs/{category}/{slug}-diagram-{N}.svg` létezik
- [ ] Minden kép alt szövege tényszerű (nem marketing)
- [ ] Kalkulátor oldalon: `softwareSchema` használatos (nem `articleSchema`)

---

# RÉSZ V – BELSŐ KERESZTLINKELÉSI TÉRKÉP

## 🔗 Kategóriaközi keresztlinkelés

A hub belső linkelése a tartalom hálózatos erejét épít. Minden H2 szekció max 2-3 belső linket tartalmazhat (MASTER-04 §13.3).

### Összehasonlítás → Háztípus (és vissza)

| Ha az összehasonlítóban szó esik erről... | Linkelj ide |
|-------------------------------------------|-------------|
| Téglaház jellemzők | `/haztipusok/teglahaz-mit-jelent-valojaban` |
| Könnyűszerkezetes jellemzők | `/haztipusok/konnyuszerkezetes-haz-mitol-mas` |
| Passzívház | `/haztipusok/passzivhaz-es-alacsony-energiaigenyu-hazak` |
| Ytong/porózus beton | `/haztipusok/ytong-porobetonhaz-jellemzok` |
| SIP panel | `/haztipusok/sip-panel-haz-technologia` |

### Összehasonlítás / Háztípus → Költségek

| Ha a cikkben szó esik erről... | Linkelj ide |
|-------------------------------|-------------|
| Építési ár, m² ár | `/koltsegek/m2-arak-ertelmezes-mit-mutatnak-mit-nem` |
| Kulcsrakész vs szerkezetkész | `/koltsegek/kulcsrakesz-vs-szerkezetkesz-penzugyi-kulonbsegek` |
| Rejtett költségek | `/koltsegek/hazepites-rejtett-koltsegei` |
| Tartalékkeret | `/koltsegek/tartalek-keretosszeg-mekkora-legyen` |
| Regionális árak | `/koltsegek/hazepites-koltseg-regiok-szerint` |

### Költségek → Támogatások és fordítva

| Ha a cikkben szó esik erről... | Linkelj ide |
|-------------------------------|-------------|
| CSOK Plusz feltételek | `/tamogatas/csok-plusz-2025-feltetelek-osszegek` |
| Falusi CSOK | `/tamogatas/falusi-csok-2025-telepulesek-feltetelek` |
| CSOK Plusz vs Falusi CSOK | `/tamogatas/csok-plusz-vs-falusi-csok-osszehasonlitas` |
| Finanszírozás általánosan | `/koltsegek/hazepites-finanszirozasi-lehetosegek` |

### Háztípus / Összehasonlítás → Energetika

| Ha a cikkben szó esik erről... | Linkelj ide |
|-------------------------------|-------------|
| Fűtési rendszer | `/energia/futesi-rendszerek-osszehasonlitas` |
| Hőszivattyú | `/energia/hoszivatyu-futesi-koltseg` |
| Napelem | `/energia/napelem-hazepitesnel` |
| Energiaminősítés | `/energia/energiaminiusites-epulet` |

### Bármely cikk → Kalkulátorok (soft CTA kontextusban)

| Kontextus | Kalkulátor link |
|-----------|----------------|
| Költségbecslés témánál | [Házépítési Költség Kalkulátor](/eszkozok/hazepites-koltseg-kalkulator) |
| CSOK, támogatás témánál | [CSOK Kalkulátor](/eszkozok/csok-kalkulator) |
| Fűtési rendszer témánál | [Fűtési Költség Kalkulátor](/eszkozok/futes-koltseg-kalkulator) |
| Háztípus döntésnél | [Háztípus-választó teszt](/eszkozok/haztipus-valaszto-teszt) |
| Napelem témánál | [Napelem Megtérülés Kalkulátor](/eszkozok/napelem-megterules-kalkulator) |

### Jog / Adminisztráció → Tervezés és fordítva

| Ha a cikkben szó esik erről... | Linkelj ide |
|-------------------------------|-------------|
| Engedélyezési folyamat | `/jog/epitesi-engedelyezesi-eljaras` |
| Egyszerű bejelentés | `/jog/egyszerusitett-bejelentes-szabalyok` |
| Tervezési folyamat | `/tervezes/hazterv-keszitese-lepesek` |
| Kiviteli terv | `/tervezes/kiviteli-terv-mit-tartalmaz` |

### Kalkulátor oldal → Elméleti cikk (kötelező, MASTER-04 §7)

Minden `/eszkozok/` oldal `softwareSchema.about` mezője az elméleti párjára mutat:

| Kalkulátor | Elméleti cikk |
|------------|---------------|
| `/eszkozok/hazepites-koltseg-kalkulator` | `/koltsegek/hazepites-koltsegei-mibol-all-ossze` |
| `/eszkozok/csok-kalkulator` | `/tamogatas/csok-plusz-2025-feltetelek-osszegek` |
| `/eszkozok/futes-koltseg-kalkulator` | `/energia/futesi-rendszerek-osszehasonlitas` |
| `/eszkozok/napelem-megterules-kalkulator` | `/energia/napelem-hazepitesnel` |

---

# RÉSZ VI – AI-GYANÚ CSÖKKENTÉSI SZABÁLYOK

## 🚫 Tiltott AI-szagú minták a házépítés vertikálon

Az alábbi minták **TILOSAK** minden cikkben. Ezek robotszerű, hitelesség nélküli szöveget eredményeznek.

| Tiltott minta | Miért rossz | Helyette |
|---|---|---|
| „Fontos megjegyezni, hogy..." | Semmitmondó bevezető | Írd le közvetlenül az állítást |
| „Összefoglalva elmondhatjuk..." | AI közhely | Hagyj el, vagy „Szóval:" |
| „Érdemes kiemelni, hogy..." | Felesleges töltelék | Töröld, a tartalom magáért beszél |
| „Ebben a cikkben megvizsgáljuk..." | AI meta-kommentár | Töröld teljesen |
| „A hazai piacon egyre fontosabbá válik..." | Passzív + töltelék | Töröld |
| „A házépítés egy komplex folyamat, amely..." | Mindenki tudja | Ugorj rá a lényegre |
| „Mindkét megoldásnak megvannak az előnyei és hátrányai" | Semleges semmitmondás mint végkövetkeztetés | Mondj határozott véleményt: kinek melyik jobb és miért |
| „Az Ön igényeitől függően..." | Felelősségkerülés | Adj konkrét döntési kritériumokat |
| „...átfogó megoldást nyújt..." | Semmitmondó | Mi pontosan az átfogó? Konkretizáld |
| Minden bekezdés azonos hosszú | Robot-szerű ismétlés | Variáld: rövid-hosszú, kérdés-állítás |

## ✅ Hangvétel és hitelesség – házépítés specifikus szabályok

**ALAPELV:** Az összehasonlító és döntéstámogató cikkek akkor hitelesek, ha az olvasó érzi, hogy valaki tényleg végigment ezen a folyamaton, vagy legalábbis valóban utánanézett. Nem marketingszöveg kell, hanem szakértői vélemény – úgy, mintha egy mérnök barát mesélne kávézóban, de számokkal alátámasztva.

**Hangvétel:**
- Tegezős, de nem haverkodós
- Határozott vélemények – ne kerülgesd a forró kását
- Ha valami drága, kockázatos vagy problémás, írd le pontosan miért
- Humor megengedett, de ne erőltetett
- Az olvasó komoly döntés előtt áll → tiszteld az idejét

**Minden összehasonlító és döntési szekció (H2) tartalmazzon legalább egyet ezek közül:**

**1. Konkrét számszerű adat kontextussal:**
```
Tesztként megnéztük az elérhető kivitelezői ajánlatokat a Gigawood hálózatán keresztül
2026 elején: a téglaházas árajánlatok 520-680e Ft/m² körül mozogtak, míg a
könnyűszerkezetes ajánlatok 420-560e Ft/m² tartományban érkeztek ugyanolyan
alapterületre. A különbség az alapozásnál és a befejező munkáknál olvad el.
```

**2. Saját tapasztalat / vélemény – konkrét és szubjektív:**
```
A CSOK Plusz adminisztrációja az első látásra egyszerűnek tűnik, de a részletek
a bankfiókban derülnek ki. A három leggyakoribb akadály amit látunk: a telek
már korábban volt forgalomképtelen, a kivitelező nem fogad el bankgaranciát,
vagy az energetikai tanúsítvány nem felel meg a szükséges osztálynak.
```

**3. „Amit nem mondanak el" bekezdés – korlátok, rejtett tételek:**
```
Amit a legtöbb könnyűszerkezetes gyártó nem mond el: a 25-30 éves tartósság
garancia csak akkor érvényes, ha évente elvégzik a kötelező karbantartást
(páraelvezetés ellenőrzés, tömítőanyag csere). Az ezzel kapcsolatos éves
költség 80-150e Ft körül van, amit az összköltsége-számítóba ritkán számítanak bele.
```

**4. Mini-esettanulmány (`> [info]:` box-ban, 3-5 mondat):**
```markdown
> [info]: ℹ️ **Eset: Téglaház vs könnyűszerkezetes – egy pécsi pár döntése**
> Egy 140 m²-es ház esetén a téglaházas ajánlat 74 millió, a könnyűszerkezetes
> 62 millió Ft volt. A 12 milliós különbséget végül az döntötte el, hogy az
> energetikai megtakarítás (passzívház szintű szigetelés a könnyűszerkezetesnél)
> 20 év alatt kb. 8-9 millió Ft – így a könnyűszerkezetes megoldás lett a nyertes.
```

**5. Határozott végkövetkeztetés – nem „mindkettő jó":**
```
Ha az épületed fő célja hosszú élettartam, tömegépítési tapasztalat és
értéktartás, válaszd a téglaházat. Ha gyors építés, jó hőszigetelés és
rugalmas alaprajz a prioritás, a könnyűszerkezetes jobb választás. A kettő közötti
döntés 80%-ban a cost/m² és az építkezési időn múlik – a „melyik jobb" kérdés
így szinte mindig értelmetlenné válik.
```

## 📐 Struktúra variálás – KÖTELEZŐ

Ne legyen minden H2 szekció azonos felépítésű. Variáld ezek között:
- Rövid verdikt → részletes kifejtés → adat
- Kérdés → válasz → bizonyíték
- Sztori → tanulság → ajánlás
- Adat → értelmezés → gyakorlati következtetés
- Probléma → tesztelés → eredmény

**Bekezdéshossz variálás:**
- Egy 1 mondatos bekezdés hatásos kiemelés
- 3-4 mondatos bekezdés az ideális alap
- 6+ mondatos bekezdés csak indokoltan (komplex okfejtés)
- Ne legyen 5 egymást követő azonos hosszúságú bekezdés

---

# RÉSZ VII – KONVERZIÓ ÉS CTA STRATÉGIA

## 📍 CTA elhelyezési szabály

| Pozíció | Típus | Megjegyzés |
|---------|-------|------------|
| **Cikk eleje** (20% után) | Soft CTA | „Ha egyedi árajánlatra van szükséged..." |
| **Cikk közepe** (50%) | Inline CTA | Kontextusban, a témához illeszkedő |
| **Cikk vége** (100%) | Erős CTA blokk | Teljes form vagy CTA gomb |

---

## 🎨 CTA blokk template (cikk végére)

### Kötelező CTA blokk – minden konverziós cikknél

```mdx
<CTABlokk
  title="Következő lépés: Egyedi árajánlat"
  cta="Visszahívást kérek"
  href="/ajanlatkeres"
  items={[
    "Kötelezettségmentes egyeztetés",
    "Személyre szabott költségbecslés",
    "Válasz 48 órán belül"
  ]}
/>
```

### CTA szövegezési szabályok

| ✅ HELYES | ❌ HELYTELEN |
|-----------|-------------|
| „Kérj ingyenes konzultációt" | „Rendelj most!" |
| „Kötelezettség nélkül" | „Ne habozz!" |
| „Segítünk eligazodni" | „Legjobb árak garantálva" |
| „Egyedi kalkuláció" | „Akciós ajánlat" |
| „Szakértő tanácsadás" | „Limitált ideig!" |

**Hangnem:** Szakmai, segítőkész, bizalomépítő – **NEM agresszív sales**

---

## 📊 Lead kategóriák és célok

### Lead típusok

| Lead típus | Forrás | Érték | Cél (12 hó) |
|------------|--------|-------|-------------|
| **Kivitelező ajánlatkérés** | Cikk CTA, form | Magas | 500/hó |
| **Kalkulátor lead** | Kalkulátor → email | Közepes | 2000/hó |
| **Konzultáció** | Főoldal form | Magas | 200/hó |
| **Hírlevél** | Popup, sidebar | Alacsony | 3000/hó |

### Konverziós útvonalak

```
CIKK OLVASÓ
    │
    ├──▶ Kalkulátor használat ──▶ Email cserébe ──▶ Nurturing ──▶ Ajánlatkérés
    │
    ├──▶ CTA kattintás ──▶ Form kitöltés ──▶ LEAD
    │
    └──▶ Hírlevél feliratkozás ──▶ Email sorozat ──▶ Ajánlatkérés
```

---

# RÉSZ VIII – MVP SCOPE ÉS ÜTEMEZÉS

## 📋 Fázis 1: MVP (10 hét, 30 cikk)

### Hét 1-2: Alapok és KIEMELT támogatások
- [ ] 3 db /alapok/ cikk
- [ ] 3 db /tamogatas/ cikk (CSOK Plusz, Falusi CSOK, Babaváró)
- [ ] Site alap beállítás, schema implementáció
- [ ] Hero képek: mind a 6 cikkhez legyártva

### Hét 3-4: Költségek és összehasonlítások
- [ ] 4 db /koltsegek/ cikk (házépítés költségei, m² árak, kulcsrakész vs szerkezetkész)
- [ ] 3 db /osszehasonlitas/ cikk (tégla vs könnyűszerkezetes, háztípusok költség)
- [ ] Hero képek: mind a 7 cikkhez legyártva

### Hét 5-6: Energetika
- [ ] 4 db /energia/ cikk (hőszivattyú vs gázkazán, napelem, fűtési rendszerek)
- [ ] 2 db kalkulátor (költség, CSOK) `.mdx` formátumban island komponenssel

### Hét 7-8: Háztípusok és jog
- [ ] 4 db /haztipusok/ cikk (téglaház, könnyűszerkezetes, passzívház)
- [ ] 3 db /jog/ cikk (építési engedély, egyszerű bejelentés)

### Hét 9-10: Tervezés és GYIK
- [ ] 3 db /tervezes/ cikk
- [ ] 4 db /gyik/ cikk
- [ ] Belső linkelés véglegesítése (keresztlinkek minden cikknél a Rész V térkép alapján)
- [ ] Schema validálás (Google Rich Results Test)

## 📊 Fázis 2: Bővítés (16 hét, 50 cikk)
- Minden kategória teljessé tétele
- Niche oldalak előkészítése (kalkulator, kivitelező lista)
- További kalkulátorok

## 📊 Fázis 3: Folyamatos (4-6 cikk/hó)
- Frissítések (CSOK változások, árak)
- Niche oldalak indítása
- Lead rendszer finomhangolás

---

# RÉSZ IX – KPI-K ÉS MÉRÉS

## 📈 Hub sikermetrikák

| Metrika | 6 hónap cél | 12 hónap cél |
|---------|-------------|--------------|
| Organikus impresszió | 500.000/hó | 2.000.000/hó |
| Organikus látogatók | 40.000/hó | 150.000/hó |
| Hub átlagos pozíció | Top 12 | Top 5 |
| Featured snippet | 15 db | 50+ db |
| Backlink (DR50+) | 20 db | 80+ db |

## 📈 Konverziós metrikák

| Metrika | 6 hónap cél | 12 hónap cél |
|---------|-------------|--------------|
| Kalkulátor használat | 5.000/hó | 20.000/hó |
| Email feliratkozás | 500/hó | 2.000/hó |
| Kivitelező lead | 100/hó | 500/hó |
| Hub → Niche átmenet | 4% | 8% |

## 📈 Tartalmi metrikák

| Metrika | Cél |
|---------|-----|
| Cikk hossz átlag | 2000-3500 szó |
| FAQ/cikk | 5-8 kérdés |
| Belső link/cikk | 6-10 db |
| Schema coverage | 100% |

---

# RÉSZ X – TELJES GYÁRTÁSI CHECKLIST

**YAML & Schema:**
- [ ] YAML frontmatter MASTER-04 kompatibilis (nincs tömb, nincs TAB)
- [ ] `articleSchema` kitöltve (type, headline, image, dates)
- [ ] `articleSchema.image.url` path helyes ÉS a hero JPG fájl **létezik**
- [ ] `articleSchema.image.width: 1200`, `height: 630` kitöltve
- [ ] `articleSchema.publisher.logo` kitöltve (600×60 px)
- [ ] `faqPageSchema` question1/answer1 formátumban (nem array)
- [ ] Kalkulátor oldalon: `softwareSchema` (nem `articleSchema`) + `softwareSchema.about` az elméleti cikkre mutat

**Képek:**
- [ ] Hero SVG legyártva: `/img/docs/{category}/{slug}-hero.svg`
- [ ] Hero JPG exportálva: `/img/docs/{category}/{slug}-hero.jpg` (1200×630)
- [ ] Ha van magyarázó ábra: `/diagrams/docs/{category}/{slug}-diagram-{N}.svg` létezik
- [ ] Minden kép alt szövege tényszerű, nem marketing

**Body & Tartalom:**
- [ ] `.mdx` fájlformátum (nem `.md`)
- [ ] MDX import-ok a frontmatter UTÁN, a body ELŐTT vannak
- [ ] Body H2-vel indul, nincs H1
- [ ] Minimum 3 kérdés-alapú H2 (featured snippet eligibility)
- [ ] `::: faq` blokkok 1:1 szinkronban a YAML faqPageSchema-val
- [ ] Nincs `---` a body-ban
- [ ] Belső linkek csak content map-ben szereplő slugokra mutatnak
- [ ] Belső linkek leíró anchor texttel (nem „katt ide", nem „itt")
- [ ] Max 2-3 belső link szelvényenként
- [ ] Maximum 2-3 külső hivatkozás, mind `rel="nofollow"` vagy `rel="noopener"`, csak autoritatív forrásra
- [ ] Minden H2 önmagában értelmes (nincs „ahogy fentebb" szelvény-dependencia)

**Hitelesség & AI-gyanú csökkentés (Rész VI alapján):**
- [ ] Nincs AI-jellegű frázis a tiltott minták táblázatából
- [ ] Minimum 1 konkrét számszerű adat kontextussal (nem csak általánosság)
- [ ] Minimum 1 „amit nem mondanak el" bekezdés (rejtett költség/korlát/probléma)
- [ ] Minimum 1 esettanulmány (`> [info]:` box-ban, 3-5 mondat)
- [ ] Határozott végkövetkeztetés (nem „mindkettő jó a maga módján")
- [ ] Bekezdéshosszak variálnak (nincs 5+ azonos hosszúságú egymás után)
- [ ] H2 szekciók struktúrája variál

**Keresztlinkelés (Rész V térkép alapján):**
- [ ] Összehasonlító cikknél: link a releváns háztípus oldalakra
- [ ] Háztípus / Összehasonlító cikknél: link a releváns költség és energia oldalakra
- [ ] Minden konverziós témájú cikknél: soft CTA link a releváns kalkulátorra
- [ ] Kalkulátor oldalnál: `softwareSchema.about` elméleti cikkre mutat

**CTA:**
- [ ] Van CTA blokk a cikk végén (`<CTABlokk />` MDX komponens)
- [ ] Van legalább 1 soft CTA a cikk közepén
- [ ] CTA szöveg szakmai és segítőkész (nem sales, nem agresszív)
- [ ] Nem konverziós cikknél: nincs erős CTA, csak soft link a kapcsolódó konverziós cikkhez

**Validáció:**
- [ ] Google Rich Results Test: Article/FAQ snippet megjelenik
- [ ] Kalkulátor oldalon: SoftwareApplication snippet megjelenik
- [ ] Nincs JSON-LD warning vagy error
- [ ] Canonical URL helyes
- [ ] Mobilon az MDX komponensek is megfelelően renderelnek

---

# RÉSZ XI – ÖSSZEFOGLALÓ STATISZTIKA

| Paraméter | Érték |
|-----------|-------|
| **Összes kategória** | 11 |
| **Összes tervezett cikk** | 120 |
| **Fájlformátum** | `.mdx` |
| **Átlagos search volume/cikk** | ~2500/hó |
| **Becsült összes havi keresés** | 300.000/hó |
| **Becsült havi forgalom (8% CTR)** | 24.000/hó (MVP) → 150.000/hó (12 hó) |
| **Súlyozott átlag CPC** | ~900 Ft |
| **Kiemelt prioritású kategória** | 3 (költségek, támogatások, összehasonlítások) |
| **Magas prioritású kategória** | 4 |
| **Közepes prioritású kategória** | 4 |
| **Tervezett niche oldalak** | 3+ |
| **Utility Hub eszközök** | 8 |
| **Hero képek száma (MVP)** | 30 (1 db/cikk) |

---

## 🧭 Záró megjegyzés

Ez a dokumentum a **MASTER rendszer alkalmazása** a Házépítés vertikálra.

**v2.2 kulcsdöntések:**
- `.mdx` formátum az interaktív komponensek miatt (kalkulátorok, összehasonlító táblák, CTA blokkok)
- Képstratégia: minden oldalhoz kötelező hero kép + opcionális magyarázó SVG diagramok
- AI-gyanú csökkentés: konkrét számadatok, esettanulmányok, határozott végkövetkeztetések minden összehasonlítóban
- Oldalon belüli keresztlinkelési térkép: kategóriák közötti kapcsolatok explicit módon dokumentálva

**Nem módosítja a MASTER dokumentumokat**, csak alkalmazza és kiegészíti a projekt-specifikus elemekkel.

---

**PROJEKT-SPECIFIKUS KONCEPCIÓ. FRISSÍTHETŐ.**
**Verzió: 2.3**
**Dátum: 2026-02-22**
