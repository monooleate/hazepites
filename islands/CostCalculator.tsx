import { useState } from "preact/hooks";

/**
 * Házépítési költség kalkulátor – részletes tételes bontással.
 * Technológia, méret, régió, minőségi szint és extra költségek.
 */

interface Technologia {
  label: string;
  minPerM2: number;
  maxPerM2: number;
  description: string;
}

const TECHNOLOGIAK: Record<string, Technologia> = {
  tegla: {
    label: "Tégla (B30 falazóblokk)",
    minPerM2: 400_000,
    maxPerM2: 500_000,
    description: "Hagyományos teherhordó falazat, legjobb hangszigetelés",
  },
  ytong: {
    label: "Ytong / Porotherm",
    minPerM2: 380_000,
    maxPerM2: 480_000,
    description: "Könnyebb falazat, jó hőszigetelés, gyorsabb építés",
  },
  fa: {
    label: "Könnyűszerkezetes (fa váz)",
    minPerM2: 350_000,
    maxPerM2: 450_000,
    description: "Száraz technológia, gyors felépítés, alacsonyabb tömeg",
  },
  passziv: {
    label: "Passzívház",
    minPerM2: 500_000,
    maxPerM2: 700_000,
    description: "Kiváló energetika, vastag szigetelés, hővisszanyerő szellőzés",
  },
  modul: {
    label: "Modulház (gyári előregyártás)",
    minPerM2: 300_000,
    maxPerM2: 400_000,
    description: "Gyárban készül, helyszínen összeáll, rövid kivitelezés",
  },
};

interface Regio {
  label: string;
  szorzo: number;
}

const REGIOK: Regio[] = [
  { label: "Budapest és agglomeráció", szorzo: 1.2 },
  { label: "Nyugat-Dunántúl (Győr, Sopron)", szorzo: 1.07 },
  { label: "Közép-Magyarország (alap)", szorzo: 1.0 },
  { label: "Közép-Dunántúl", szorzo: 0.95 },
  { label: "Kelet-Magyarország", szorzo: 0.9 },
  { label: "Dél-Alföld", szorzo: 0.87 },
];

interface ExtraKoltseg {
  label: string;
  minFt: number;
  maxFt: number;
  description: string;
  enabled: boolean;
}

const EXTRA_DEFAULTS: ExtraKoltseg[] = [
  { label: "Tervezési díjak", minFt: 800_000, maxFt: 2_500_000, description: "Építész + statikus + gépész tervek", enabled: true },
  { label: "Engedélyezés", minFt: 200_000, maxFt: 500_000, description: "Építési engedély, hatósági díjak", enabled: true },
  { label: "Közmű csatlakozás", minFt: 500_000, maxFt: 2_000_000, description: "Víz, csatorna, gáz, villany bekötés", enabled: true },
  { label: "Műszaki ellenőr", minFt: 300_000, maxFt: 800_000, description: "Független ellenőrzés az építkezésen", enabled: true },
  { label: "Kerítés + kapu", minFt: 500_000, maxFt: 1_500_000, description: "Telekhatár lezárása", enabled: false },
  { label: "Kert, térburkolat", minFt: 400_000, maxFt: 1_200_000, description: "Járda, parkoló, fűmagvetés", enabled: false },
  { label: "Konyhabútor", minFt: 600_000, maxFt: 2_500_000, description: "Beépített konyha teljes felszereléssel", enabled: false },
];

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M Ft`;
  return `${Math.round(n / 1000)} ezer Ft`;
}

function fmtExact(n: number): string {
  return Math.round(n).toLocaleString("hu-HU") + " Ft";
}

export default function CostCalculator() {
  const [terulet, setTerulet] = useState(120);
  const [tech, setTech] = useState("tegla");
  const [regioIdx, setRegioIdx] = useState(2); // Közép-Mo
  const [minoseg, setMinoseg] = useState(0.5); // 0=alap, 0.5=közép, 1=prémium
  const [extras, setExtras] = useState<ExtraKoltseg[]>(EXTRA_DEFAULTS);
  const [showExtras, setShowExtras] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const selected = TECHNOLOGIAK[tech];
  const regio = REGIOK[regioIdx];

  // Költség számítás: alap + minőségi felár + régió szorzó
  const baseMin = selected.minPerM2;
  const baseMax = selected.maxPerM2;
  const minosegSzorzo = 1 + minoseg * 0.3; // 1.0 - 1.3
  const effMin = baseMin * minosegSzorzo * regio.szorzo;
  const effMax = baseMax * minosegSzorzo * regio.szorzo;

  const epitesMinkostseg = Math.round(terulet * effMin);
  const epitesMaxkoltseg = Math.round(terulet * effMax);

  // Extra költségek
  const extraMinTotal = extras.filter((e) => e.enabled).reduce((s, e) => s + e.minFt, 0);
  const extraMaxTotal = extras.filter((e) => e.enabled).reduce((s, e) => s + e.maxFt, 0);

  // Tartalékkeret (15%)
  const tartalekMin = Math.round(epitesMinkostseg * 0.15);
  const tartalekMax = Math.round(epitesMaxkoltseg * 0.15);

  // Összesen
  const totalMin = epitesMinkostseg + extraMinTotal + tartalekMin;
  const totalMax = epitesMaxkoltseg + extraMaxTotal + tartalekMax;

  // Négyzetméter árak
  const m2arMin = Math.round(effMin);
  const m2arMax = Math.round(effMax);

  const minosegLabel = minoseg <= 0.33 ? "Alapszintű" : minoseg <= 0.66 ? "Középkategória" : "Prémium";

  // Tételes bontás (becsült arányok)
  const epitesKozep = (epitesMinkostseg + epitesMaxkoltseg) / 2;
  const tetelek = [
    { nev: "Alap + földmunka", arany: 0.12 },
    { nev: "Falazat + szerkezet", arany: 0.25 },
    { nev: "Tetőszerkezet + fedés", arany: 0.13 },
    { nev: "Nyílászárók", arany: 0.1 },
    { nev: "Gépészet (fűtés, víz, villany)", arany: 0.18 },
    { nev: "Belső burkolat + festés", arany: 0.12 },
    { nev: "Homlokzat + hőszigetelés", arany: 0.1 },
  ];

  function toggleExtra(index: number) {
    setExtras(extras.map((e, i) => i === index ? { ...e, enabled: !e.enabled } : e));
  }

  return (
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8 border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100">
        Házépítési költség kalkulátor
      </h3>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {/* Alapterület */}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Alapterület: <span class="text-primary-600 dark:text-primary-400 font-bold">{terulet} m²</span>
          </label>
          <input
            type="range"
            min="60"
            max="300"
            step="5"
            value={terulet}
            onInput={(e) => setTerulet(Number(e.currentTarget.value))}
            class="w-full accent-primary-600"
          />
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>60 m²</span>
            <span>300 m²</span>
          </div>
        </div>

        {/* Technológia */}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Építési technológia
          </label>
          <select
            value={tech}
            onChange={(e) => setTech(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            {Object.entries(TECHNOLOGIAK).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{selected.description}</p>
        </div>

        {/* Régió */}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Régió
          </label>
          <select
            value={regioIdx}
            onChange={(e) => setRegioIdx(Number(e.currentTarget.value))}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            {REGIOK.map((r, i) => (
              <option key={i} value={i}>{r.label} ({r.szorzo > 1 ? "+" : ""}{Math.round((r.szorzo - 1) * 100)}%)</option>
            ))}
          </select>
        </div>

        {/* Minőségi szint */}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Kivitelezés szintje: <span class="text-primary-600 dark:text-primary-400 font-bold">{minosegLabel}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={minoseg}
            onInput={(e) => setMinoseg(Number(e.currentTarget.value))}
            class="w-full accent-primary-600"
          />
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Alap</span>
            <span>Közép</span>
            <span>Prémium</span>
          </div>
        </div>
      </div>

      {/* Fő eredmények */}
      <div class="mt-6 grid gap-3 md:grid-cols-4">
        <div class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800 md:col-span-2">
          <p class="text-sm text-slate-600 dark:text-slate-400">Becsült teljes költség</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">
            {fmt(totalMin)} – {fmt(totalMax)}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">építés + extra költségek + 15% tartalék</p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center border border-slate-200 dark:border-slate-600">
          <p class="text-sm text-slate-600 dark:text-slate-400">Négyzetméter ár</p>
          <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{fmtExact(m2arMin)}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">– {fmtExact(m2arMax)} /m²</p>
        </div>
        <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center border border-amber-200 dark:border-amber-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Tartalékkeret (15%)</p>
          <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{fmt(tartalekMin)}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">– {fmt(tartalekMax)}</p>
        </div>
      </div>

      {/* Extra költségek toggle */}
      <div class="mt-4">
        <button
          onClick={() => setShowExtras(!showExtras)}
          class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
        >
          <svg class={`w-4 h-4 transition-transform ${showExtras ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          Extra költségek testreszabása ({extras.filter(e => e.enabled).length}/{extras.length} aktív)
        </button>

        {showExtras && (
          <div class="mt-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <div class="space-y-2">
              {extras.map((extra, i) => (
                <label key={i} class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extra.enabled}
                    onChange={() => toggleExtra(i)}
                    class="mt-1 accent-primary-600"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center">
                      <span class={`text-sm font-medium ${extra.enabled ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>
                        {extra.label}
                      </span>
                      <span class={`text-sm ${extra.enabled ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
                        {fmt(extra.minFt)} – {fmt(extra.maxFt)}
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">{extra.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600 flex justify-between text-sm font-medium">
              <span class="text-slate-700 dark:text-slate-300">Extra összesen:</span>
              <span class="text-slate-800 dark:text-slate-200">{fmt(extraMinTotal)} – {fmt(extraMaxTotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tételes bontás */}
      <details class="mt-4">
        <summary class="text-sm font-medium text-primary-600 dark:text-primary-400 cursor-pointer hover:text-primary-700 dark:hover:text-primary-300">
          Tételes költségbontás (építés)
        </summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="py-2 px-3 text-left text-slate-600 dark:text-slate-400">Munkanem</th>
                <th class="py-2 px-3 text-right text-slate-600 dark:text-slate-400">Arány</th>
                <th class="py-2 px-3 text-right text-slate-600 dark:text-slate-400">Becsült összeg</th>
              </tr>
            </thead>
            <tbody>
              {tetelek.map((t) => (
                <tr key={t.nev} class="border-b border-slate-100 dark:border-slate-800">
                  <td class="py-2 px-3 text-slate-800 dark:text-slate-200">{t.nev}</td>
                  <td class="py-2 px-3 text-right text-slate-600 dark:text-slate-400">{Math.round(t.arany * 100)}%</td>
                  <td class="py-2 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                    {fmt(epitesKozep * t.arany)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr class="border-t-2 border-slate-300 dark:border-slate-600">
                <td class="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">Építés összesen</td>
                <td class="py-2 px-3 text-right font-bold text-slate-800 dark:text-slate-200">100%</td>
                <td class="py-2 px-3 text-right font-bold text-primary-700 dark:text-primary-300">
                  {fmt(epitesMinkostseg)} – {fmt(epitesMaxkoltseg)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>

      <p class="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
        Tájékoztató becslés, 2026-os átlagárakon. A pontos árat 3 kivitelezői ajánlat átlaga adja.
      </p>
    </div>
  );
}
