# Cikk-tervezet – a referenciaanyagból még kiaknázandó témák

> Forrás: `docs-internal/referencia/` (87 oldalas STEICO-NATURHELD műszaki tartalom + árlisták + készültségi fok táblázat).
> Pozicionálás: márkasemleges, döntéstámogató keret (a technológia mint *kategória*, nem konkrét cég/márka).
> Minden cikk: MDX + hero SVG + min. 1 diagram + interaktív komponensek (InfoCard, ComparisonRow, ProConList, StepByStep, Checklist) + 3-5 szinkronizált FAQ + EEAT (esettanulmány, konkrét számok, "amit nem mondanak el", döntési keret).

---

## Már elkészült (12 cikk – referencia 1. kör)

| Cikk | Kategória |
|------|-----------|
| Készültségi fokok 2026 | koltsegek |
| Farost hőszigetelés | energia |
| Diffúziónyitott falszerkezet | energia |
| Talajcsavaros alapozás | telek |
| Fűtés-hűtés összehasonlítás | energia |
| Készház-szerződés buktatói | jog |
| Homlokzatburkolat könnyűszerkezetnél | kivitelezes |
| Tetőfedés választás | kivitelezes |
| Beépített vs nem beépített tetőtér | tervezes |
| Rekuperátor: központi vs egyhelyiséges | energia |
| Áfa a házépítésnél | koltsegek |
| CNC favázas készház | haztipusok |

+ új island: `KeszultsegiKalkulator` (készültségi fok ár-kalkulátor)

---

## Kiaknázandó témák (2. kör) – prioritás szerint

> ✅ **Elkészült (2026-05):** `kivitelezes/esztrich-szarazesztrich` és `kivitelezes/glettelesi-minoseg-q1-q4` (az alábbi 1. és 2. téma) – teljes csomaggal, kétirányú keresztlinkeléssel, sitemapbe regisztrálva.

### 🥇 Kiemelt – egyedi, mély, nagy keresési igény

#### 1. ✅ KÉSZ – Esztrich vs szárazesztrich – nedves vagy száraz padlóaljzat?
- **Slug:** `kivitelezes/esztrich-szarazesztrich` (vagy `koltsegek/`)
- **Típus:** cluster
- **Intent:** „milyen aljzat", „mennyi idő száradni az esztrich", „szárazesztrich vs beton"
- **Referencia tartalom:** beton esztrich (60-70 mm, szálerősített) vs födémpaneles szárazesztrich (2-3 réteg gipszlap, 24 órán belül burkolható); lépéshangszigetelés; száradási idők (hidegburkolat ~2 hét, melegburkolat ~6 hét); a kritikus **pára-csapda** (lezárt nyílászáró → repedés, penész, milliós kár); 10 °C alatti kötés; padlófűtés tilalom száradás közben.
- **Belső link:** keszhaz-szerzodes-buktatok, keszultsegi-fokok, belso-burkolatok
- **Miért erős:** valós technológiai tudás + a pára-kár "amit nem mondanak el" szál.

#### 2. ✅ KÉSZ – Glettelési minőségi osztályok (Q1–Q4) – meddig fizess a sima falért?
- **Slug:** `kivitelezes/glettelesi-minoseg-q1-q4`
- **Típus:** cluster
- **Intent:** „Q3 glettelés mit jelent", „milyen falfelület kell festéshez"
- **Referencia tartalom:** Q1 (burkolat alá) → Q2 (normál festés) → Q3 (sima, struktúrálatlan festék) → Q4 (prémium magasfény, design). Surlófény hatása, megengedett eltérések (0,5 mm Q3, 0,2-0,3 mm Q4). Mikor melyik kell, mennyivel drágább a magasabb osztály.
- **Belső link:** belso-burkolatok, kivitelezo-valasztas
- **Miért erős:** senki nem magyarázza el érthetően, pedig vita-forrás az átadásnál.

#### 3. ✅ KÉSZ – Belső falak könnyűszerkezetnél – teherhordó vs válaszfal
- **Slug:** `haztipusok/belso-falak-konnyuszerkezet` (vagy `tervezes/`)
- **Típus:** cluster
- **Intent:** „könnyűszerkezetes válaszfal hangszigetelés", „lehet-e falat bontani"
- **Referencia tartalom:** extra teherhordó fal (210 mm, kétoldali OSB) vs normál teherhordó (148 mm) vs válaszfal; miért minden fal teherhordó az ultra prémium szerkezetben; hangszigetelés, tűzvédelem (tűzgátló gipszkarton); későbbi átépíthetőség (gyártmányterv jelöli, mit lehet bontani).
- **Belső link:** cnc-favazas-keszhaz, konnyuszerkezetes-haz, alaprajz-tippek
- **Miért erős:** a "lehet-e később falat bontani" kérdés gyakori, itt valódi válasz van.

#### 4. ✅ KÉSZ – Villamos hálózat házépítésnél – mennyi konnektor, milyen rendszer?
- **Slug:** `kivitelezes/villamos-halozat` (a meglévő `koltsegek/villanyszereles-koltseg` műszaki párja)
- **Típus:** cluster
- **Intent:** „hány konnektor szobánként", „csillagpontos villany", „mekkora elosztótábla"
- **Referencia tartalom:** csillagpontos MBCU rendszer (vs sorolt); konnektor/lámpa darabszám m² szerint; külön kiállás tűzhely/szagelszívó; FI-relé, földelés; elosztótábla méretezés (16-72 modul m² szerint); kábelkeresztmetszetek (1,5 / 2,5 / 4 mm²); CAT7 gyengeáram; vezérelt áramtarifa hőszivattyúhoz.
- **Belső link:** villanyszereles-koltseg, gepeszet-koltseg, okos-otthon
- **Miért erős:** konkrét, számszerű, tervezést segítő – kevés jó magyar forrás.

### 🥈 Erős másodlagos kör

#### 5. ✅ KÉSZ – Használati melegvíz (HMV) – bojler, hőszivattyús vízmelegítő vagy puffer?
- **Slug:** `energia/hasznalati-melegviz`
- **Intent:** „melyik a legjobb vízmelegítő", „hőszivattyús bojler megéri"
- **Referencia tartalom:** elektromos bojler (≤100 m²) → 2 bojler → levegő-víz hőszivattyús vízmelegítő (akár -65-70% energia) → központi hőszivattyú + puffertartály. A+ besorolás, COP, mikor melyik.
- **Belső link:** hoszivattyuk, futes-hutes-osszehasonlitas, futesrendszerek

#### 6. ✅ KÉSZ – Víz- és szennyvízrendszer – amit a falban nem látsz
- **Slug:** `kivitelezes/viz-szennyviz-rendszer`
- **Intent:** „osztó-gyűjtős vízvezeték", „szennyvíz lejtés", „nyomáspróba"
- **Referencia tartalom:** 5 rétegű kompozit cső, osztó-gyűjtős kivitel (nincs kötés a padlóban), nyomáspróba + jegyzőkönyv; szennyvíz 110/50/32 mm KGPVC, tokos kötés, 90 fok nélkül a dugulás ellen; födémpaneles vs betonos elvezetés.
- **Belső link:** gepeszet-koltseg, keszultsegi-fokok

#### 7. Nyílászáró-választás: műanyag (82 mm) vs fa-alu – Uw, üvegezés, sorolás
- **Slug:** `energia/nyilaszaro-osszehasonlitas` (a meglévő `energia/nyilaszarok` összehasonlító párja)
- **Intent:** „műanyag vagy fa ablak", „háromrétegű üveg Uw", „mekkora ablak éri meg"
- **Referencia tartalom:** 82 mm többkamrás műanyag (Uw ~0,8) vs ragasztott fa (100 mm, alu borítás opció); 3 rétegű argon, melegperem; méretválaszték; **nagy erkélyajtók sorolása** → akár 50% megtakarítás tolóajtóhoz képest.
- **Belső link:** nyilaszarok, hoszigeteles-tipusok

#### 8. Bejárati ajtó – biztonság és hangszigetelés (Rw dB)
- **Slug:** `jog/bejarati-ajto-biztonsag` (vagy `haztipusok/`)
- **Intent:** „biztonsági bejárati ajtó", „hangszigetelt ajtó dB"
- **Referencia tartalom:** acél/alu szerkezet, többpontos zár, betörésvédelem; hangszigetelés Rw 27-30 dB alap, 40-47 dB prémium; okosotthon integráció (ujjlenyomat, kód).
- **Belső link:** okos-otthon, nyilaszaro-osszehasonlitas

### 🥉 Kiegészítő / témabővítő kör

#### 9. Természetes építőanyagok és épületbiológia (EPBD 2030)
- **Slug:** `energia/termeszetes-epitoanyagok` (a tervezett `fenntarthato-anyagok` helyett/mellett)
- **Tartalom:** fa, kender, vályog, cellulóz, nád, mész; karbonsemleges / CO2-negatív LCA; EPBD 2024/1275 → 2030 zéró kibocsátású épület; mit jelent ez az építtetőnek már most.
- **Belső link:** farost-szigeteles, diffuzio-nyitott-falszerkezet

#### 10. Lapostető műszaki mélymerülés – PVC lemezszigetelés
- **Slug:** `kivitelezes/laposteto-szigeteles` (a `laposteto-vs-magasteto` műszaki párja)
- **Tartalom:** UV-álló lágyított PVC lemez, mechanikus rögzítés, hőléghegesztés, gyökérállóság, fóliabádog szél, áttörések gallérozása, lejtésadás.
- **Belső link:** laposteto-vs-magasteto, tetofedes-valasztas

#### 11. Időjárás és építkezés – mikor mit nem szabad
- **Slug:** `kivitelezes/idojaras-epitkezes` (vagy `alapok/`)
- **Tartalom:** betonozás fagyban/esőben tilos; jeges/havas tetőn munka tilos; esztrich száradás hidegben; vis maior és kötbér; téli építkezés realitása (talajcsavar előny).
- **Belső link:** keszhaz-szerzodes-buktatok, talajcsavaros-alapozas

#### 12. Munkaterület-átadás és kitűzés – a megrendelő kötelességei a kezdés előtt
- **Slug:** `telek/munkaterulet-atadas` (vagy `kivitelezes/`)
- **Tartalom:** talajvizsgálat + szintvonalas térkép átadása; földmérő kitűzés (jogi határ a megrendelőé, épület sarokpontok a vállalkozóé); ±0,00 referenciapont; munkaterület-átadás min. 10 nappal, írásos jegyzőkönyv; megközelíthetőség (kamion, daru).
- **Belső link:** keszhaz-szerzodes-buktatok, talajvizsgalat, telekvalasztas

---

## Lehetséges új kalkulátorok (island)

| Kalkulátor | Mit számol | Melyik cikkbe |
|------------|------------|---------------|
| **Áfa-kalkulátor** | lakórész 5% + garázs 27% bontás, bruttó/nettó | afa-hazepites |
| **Esztrich száradás-idő** | burkolhatóság becslés hőmérséklet/típus szerint | esztrich-szarazesztrich |
| **Villamos kiépítés-becslő** | konnektor/lámpa/modul darabszám m² alapján | villamos-halozat |
| **Nyílászáró Uw / sorolás-megtakarítás** | tolóajtó vs sorolt ajtó költségkülönbség | nyilaszaro-osszehasonlitas |

---

## Javasolt sorrend (2. kör batch)

1. Esztrich vs szárazesztrich  *(+ száradás-idő kalkulátor)*
2. Glettelési minőség Q1–Q4
3. Villamos hálózat  *(+ kiépítés-becslő kalkulátor)*
4. Belső falak könnyűszerkezetnél
5. Használati melegvíz (HMV)
6. Víz- és szennyvízrendszer
7. Nyílászáró-összehasonlítás  *(+ sorolás kalkulátor)*
8. Bejárati ajtó biztonság
9. Természetes építőanyagok / EPBD 2030
10. Lapostető szigetelés
11. Időjárás és építkezés
12. Munkaterület-átadás és kitűzés

> Megjegyzés: minden témát a meglévő 12 cikkhez kell belső linkekkel kötni, és a `content/toc.ts`-be regisztrálni (különben 404). Az URL-séma `/docs` prefix **nélkül** működik (`/kategoria/slug`).
