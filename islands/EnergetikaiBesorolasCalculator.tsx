import { useState } from "preact/hooks";

/**
 * Energetikai besorolás kalkulátor.
 *
 * Megbecsüli az épület fajlagos összesített (primer) energiaigényét
 * (kWh/m²/év), majd ezt a 7/2006. TNM rendelet szerinti, ma is használt
 * AA++…JJ betűskálára vetíti. A besorolás jogilag a viszonyítási alaphoz
 * (követelményértékhez) képesti százalék — új lakóépületnél a "közel nulla"
 * (BB) követelmény ~100 kWh/m²/év, ezt vesszük 100%-nak.
 *
 * A 9/2023. (V. 25.) ÉKM rendelet a tanúsítványokon az A+++…I egybetűs
 * jelölést vezette be, de a mögötte lévő kWh/m²/év sávok és a "közel nulla"
 * küszöb változatlanok — a becslés így mindkét jelölésre értelmezhető.
 */

// Új lakóépület "közel nulla" követelménye (viszonyítási alap) kWh/m²/év-ben.
const KOVETELMENY = 100;

interface Besorolas {
  code: string;
  /** felső határ a viszonyítási alap %-ában (a JJ-nél Infinity) */
  maxPct: number;
  label: string;
  color: string;
  bg: string;
  bar: string;
}

// AA++…JJ — sávok a viszonyítási alap %-ában (7/2006. TNM 3. melléklet logika).
const SKALA: Besorolas[] = [
  { code: "AA++", maxPct: 40, label: "Minimális energiaigényű", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700", bar: "#059669" },
  { code: "AA+", maxPct: 60, label: "Kiemelkedően nagy energiahatékonyságú", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800", bar: "#10b981" },
  { code: "AA", maxPct: 80, label: "Közel nulla követelménynél jobb", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800", bar: "#22c55e" },
  { code: "BB", maxPct: 100, label: "Közel nulla energiaigényű – 2024-es követelmény", color: "text-lime-700 dark:text-lime-300", bg: "bg-lime-50 dark:bg-lime-900/30 border-lime-300 dark:border-lime-800", bar: "#84cc16" },
  { code: "CC", maxPct: 130, label: "Korszerű", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800", bar: "#eab308" },
  { code: "DD", maxPct: 160, label: "Korszerűt megközelítő", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800", bar: "#f59e0b" },
  { code: "EE", maxPct: 200, label: "Átlagosnál jobb", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800", bar: "#f97316" },
  { code: "FF", maxPct: 250, label: "Átlagos", color: "text-orange-700 dark:text-orange-300", bg: "bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700", bar: "#ea580c" },
  { code: "GG", maxPct: 310, label: "Átlagost megközelítő", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800", bar: "#ef4444" },
  { code: "HH", maxPct: 400, label: "Gyenge", color: "text-red-700 dark:text-red-300", bg: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700", bar: "#dc2626" },
  { code: "II", maxPct: 500, label: "Rossz", color: "text-red-800 dark:text-red-200", bg: "bg-red-200 dark:bg-red-900/50 border-red-400 dark:border-red-700", bar: "#b91c1c" },
  { code: "JJ", maxPct: Infinity, label: "Kiemelkedően rossz", color: "text-red-900 dark:text-red-100", bg: "bg-red-300 dark:bg-red-900/60 border-red-500 dark:border-red-600", bar: "#991b1b" },
];

function besorolasSzazalekbol(pct: number): Besorolas {
  return SKALA.find((s) => pct <= s.maxPct) ?? SKALA[SKALA.length - 1];
}

// ── Bemeneti opciók ──

const SZIGETELES: Record<string, { label: string; factor: number }> = {
  nincs: { label: "Nincs / vályog, tömör tégla vakolva", factor: 1.0 },
  regi: { label: "Régi, 5–8 cm EPS (2000-es évek)", factor: 0.64 },
  atlag: { label: "Átlagos, 10–14 cm EPS / grafit", factor: 0.44 },
  jo: { label: "Jó, 15–20 cm grafit EPS, hőhídmentes", factor: 0.30 },
  passziv: { label: "Passzív szint, 25–30 cm + tokbeépítés", factor: 0.18 },
};

const NYILASZARO: Record<string, { label: string; uValue: number }> = {
  regi: { label: "Régi fa / egyszerű üveg (U≈2,8)", uValue: 2.8 },
  dupla: { label: "Kétrétegű üveg, műanyag (U≈1,2)", uValue: 1.2 },
  harom: { label: "Háromrétegű üveg (U≈0,8)", uValue: 0.8 },
  passziv: { label: "Passzívház-minősítésű (U≈0,6)", uValue: 0.6 },
};

const FUTES: Record<string, { label: string; primer: number }> = {
  gaz_regi: { label: "Régi gázkazán + radiátor", primer: 1.35 },
  gaz_kond: { label: "Kondenzációs gázkazán", primer: 1.05 },
  hosziv_rad: { label: "Hőszivattyú + radiátor", primer: 0.72 },
  hosziv_padlo: { label: "Hőszivattyú + padlófűtés", primer: 0.52 },
  elektromos: { label: "Közvetlen elektromos fűtés", primer: 2.4 },
  vegyes: { label: "Vegyes (gáz + split klíma)", primer: 0.88 },
};

const HMV: Record<string, { label: string; energia: number }> = {
  gaz: { label: "Gázkazán / villanybojler", energia: 22 },
  hosziv: { label: "Hőszivattyú (HMV)", energia: 8 },
  napkollektor: { label: "Napkollektor + rásegítés", energia: 6 },
};

const SZELLOZES: Record<string, { label: string; factor: number }> = {
  termeszetes: { label: "Természetes (ablaknyitás, résszellőzés)", factor: 1.0 },
  elszivas: { label: "Gépi elszívás (rásegítés nélkül)", factor: 0.95 },
  rekuperator: { label: "Hővisszanyerős szellőzés (rekuperátor)", factor: 0.78 },
};

export default function EnergetikaiBesorolasCalculator() {
  const [area, setArea] = useState(120);
  const [szigeteles, setSzigeteles] = useState("atlag");
  const [nyilaszaro, setNyilaszaro] = useState("dupla");
  const [futes, setFutes] = useState("gaz_kond");
  const [hmv, setHmv] = useState("gaz");
  const [szellozes, setSzellozes] = useState("termeszetes");
  const [napelemKw, setNapelemKw] = useState(0);

  const szig = SZIGETELES[szigeteles];
  const nyil = NYILASZARO[nyilaszaro];
  const fut = FUTES[futes];

  // Fűtési nettó hőigény (kWh/m²/év). Szigeteletlen referencia ≈ 230.
  const bazisHoigeny = 230 * szig.factor;
  // Nyílászáró-korrekció: U=2,8 a referencia; minden 0,1 U-csökkenés ~2,8% megtakarítás.
  const nyilKorrekcio = 1 - (2.8 - nyil.uValue) * 0.028;
  // Szellőzési hőveszteség (rekuperátor jelentősen csökkenti).
  const hoigeny = bazisHoigeny * nyilKorrekcio * SZELLOZES[szellozes].factor;

  // Primer energiaigény összetevői (kWh/m²/év).
  const futesPrimer = hoigeny * fut.primer;
  const hmvPrimer = HMV[hmv].energia;
  const egyebPrimer = 18; // szivattyúk, szellőztetők, világítás segédenergia
  const napelemPrimer = (napelemKw * 1100) / area; // ~1100 kWh/kWp/év Magyarországon

  const osszesPrimer = Math.max(0, futesPrimer + hmvPrimer + egyebPrimer - napelemPrimer);
  const szazalek = (osszesPrimer / KOVETELMENY) * 100;
  const besorolas = besorolasSzazalekbol(szazalek);
  const megfelel = osszesPrimer <= KOVETELMENY; // BB vagy jobb

  // Skálamutató pozíció (0–450 kWh/m²/év vizuális tartomány).
  const scalePercent = Math.min(100, (osszesPrimer / 450) * 100);

  return (
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8 border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-1 text-slate-800 dark:text-slate-100">
        Energetikai besorolás kalkulátor
      </h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Add meg a ház jellemzőit, és megbecsüljük a fajlagos primerenergia-igényt és az AA++…JJ besorolást.
      </p>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Fűtött alapterület: <span class="text-primary-600 dark:text-primary-400 font-bold">{area} m²</span>
          </label>
          <input
            type="range"
            min="50"
            max="300"
            step="5"
            value={area}
            onInput={(e) => setArea(Number(e.currentTarget.value))}
            class="w-full accent-primary-600"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Hőszigetelés
          </label>
          <select
            value={szigeteles}
            onChange={(e) => setSzigeteles(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 text-sm"
          >
            {Object.entries(SZIGETELES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nyílászárók
          </label>
          <select
            value={nyilaszaro}
            onChange={(e) => setNyilaszaro(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 text-sm"
          >
            {Object.entries(NYILASZARO).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Fűtési rendszer
          </label>
          <select
            value={futes}
            onChange={(e) => setFutes(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 text-sm"
          >
            {Object.entries(FUTES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Melegvíz (HMV)
          </label>
          <select
            value={hmv}
            onChange={(e) => setHmv(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 text-sm"
          >
            {Object.entries(HMV).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Szellőzés
          </label>
          <select
            value={szellozes}
            onChange={(e) => setSzellozes(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 text-sm"
          >
            {Object.entries(SZELLOZES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div class="md:col-span-2 lg:col-span-3">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Napelem: <span class="text-primary-600 dark:text-primary-400 font-bold">{napelemKw === 0 ? "nincs" : `${napelemKw} kWp`}</span>
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={napelemKw}
            onInput={(e) => setNapelemKw(Number(e.currentTarget.value))}
            class="w-full accent-primary-600"
          />
        </div>
      </div>

      {/* Eredmény skála */}
      <div class="mt-6">
        <div class="relative h-10 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 via-yellow-400 via-orange-500 to-red-700">
          <div
            class="absolute -top-0.5 transition-all duration-500"
            style={{ left: `calc(${scalePercent}% - 12px)` }}
          >
            <div class="w-6 h-11 border-2 border-white rounded-sm bg-slate-900/60 shadow-lg" />
          </div>
        </div>
        <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1 px-1">
          <span>AA++</span>
          <span>BB (100)</span>
          <span>DD (160)</span>
          <span>GG (310)</span>
          <span>JJ (450+)</span>
        </div>
      </div>

      {/* Főszámok */}
      <div class="mt-5 grid gap-3 md:grid-cols-3">
        <div class={`p-5 rounded-lg text-center border ${besorolas.bg}`}>
          <p class="text-sm text-slate-600 dark:text-slate-400">Becsült besorolás</p>
          <p class={`text-4xl font-black ${besorolas.color}`}>{besorolas.code}</p>
          <p class={`text-xs mt-1 ${besorolas.color}`}>{besorolas.label}</p>
        </div>
        <div class="p-5 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Fajlagos primerenergia</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{Math.round(osszesPrimer)} kWh/m²/év</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">a követelmény {Math.round(szazalek)}%-a</p>
        </div>
        <div class="p-5 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Éves összenergia-igény</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{Math.round(osszesPrimer * area).toLocaleString("hu")} kWh</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{area} m²-re vetítve</p>
        </div>
      </div>

      {/* Teljes betűskála */}
      <div class="mt-5">
        <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hol áll a házad a skálán?</p>
        <div class="space-y-1">
          {SKALA.map((s, i) => {
            const also = i === 0 ? 0 : SKALA[i - 1].maxPct;
            const felsoKwh = s.maxPct === Infinity ? null : Math.round((s.maxPct / 100) * KOVETELMENY);
            const alsoKwh = Math.round((also / 100) * KOVETELMENY);
            const aktiv = s.code === besorolas.code;
            const tartomany = felsoKwh === null ? `${alsoKwh}+ kWh/m²/év` : `${alsoKwh}–${felsoKwh} kWh/m²/év`;
            return (
              <div
                key={s.code}
                class={`flex items-center gap-3 rounded-lg px-3 py-1.5 border ${aktiv ? s.bg : "border-transparent"}`}
              >
                <span
                  class="inline-flex items-center justify-center w-11 shrink-0 rounded text-xs font-bold text-white py-1"
                  style={{ backgroundColor: s.bar }}
                >
                  {s.code}
                </span>
                <span class={`text-sm flex-1 ${aktiv ? "font-semibold " + s.color : "text-slate-600 dark:text-slate-400"}`}>
                  {s.label}
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">{tartomany}</span>
                {aktiv && (
                  <span class={`text-xs font-bold shrink-0 ${s.color}`}>← itt</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bontás */}
      <div class="mt-5 space-y-1">
        <div class="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-sm">
          <span class="text-slate-700 dark:text-slate-300">Fűtés (primer)</span>
          <span class="font-medium text-slate-800 dark:text-slate-100">{Math.round(futesPrimer)} kWh/m²/év</span>
        </div>
        <div class="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-sm">
          <span class="text-slate-700 dark:text-slate-300">Melegvíz</span>
          <span class="font-medium text-slate-800 dark:text-slate-100">{Math.round(hmvPrimer)} kWh/m²/év</span>
        </div>
        <div class="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-sm">
          <span class="text-slate-700 dark:text-slate-300">Segédenergia (szivattyú, szellőztetés, világítás)</span>
          <span class="font-medium text-slate-800 dark:text-slate-100">{egyebPrimer} kWh/m²/év</span>
        </div>
        {napelemKw > 0 && (
          <div class="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-sm">
            <span class="text-emerald-700 dark:text-emerald-300">Napelem beszámítása</span>
            <span class="font-medium text-emerald-700 dark:text-emerald-300">−{Math.round(napelemPrimer)} kWh/m²/év</span>
          </div>
        )}
      </div>

      {/* Megfelelőség */}
      <div class={`mt-4 p-3 rounded-lg text-sm text-center ${megfelel ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"}`}>
        {megfelel
          ? `Megfelel az új építésre előírt BB (≤100 kWh/m²/év) követelménynek – ${besorolas.code} besorolással.`
          : `Nem éri el az új építésre előírt BB szintet (≤100 kWh/m²/év kell). Jelenleg ${Math.round(osszesPrimer)} kWh/m²/év, ${besorolas.code} besorolás.`}
      </div>

      <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
        Tájékoztató becslés a viszonyítási alap (~100 kWh/m²/év, új lakóépület) alapján. A hivatalos, jogosultsággal
        rendelkező energetikai tanúsító számítása ettől 10–20%-kal eltérhet.
      </p>
    </div>
  );
}
