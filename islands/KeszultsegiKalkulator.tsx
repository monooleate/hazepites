import { useState } from "preact/hooks";

/**
 * Készültségi fok ár-kalkulátor
 * Favázas, természetes anyagú készház becsült ára a választott készültségi fok
 * és alapterület alapján (2026, bruttó alapterület, 5% áfa magánszemélynek).
 * A számok értelmezési keretek – a pontos árhoz egyedi árajánlat kell.
 */

interface Fok {
  key: string;
  label: string;
  minPerM2: number;
  maxPerM2: number;
  tartalmaz: string;
}

const FOKOK: Fok[] = [
  {
    key: "vazszerkezetkesz",
    label: "Vázszerkezetkész",
    minPerM2: 145_000,
    maxPerM2: 170_000,
    tartalmaz: "Falváz és tetőszerkezet felállítva, belső oldali lemezborítás.",
  },
  {
    key: "szerkezetkesz",
    label: "Szerkezetkész",
    minPerM2: 210_000,
    maxPerM2: 230_000,
    tartalmaz: "+ tetőfedés alatti farost, bádogozás, eresz, cseréplécezés. Nincs ablak, vakolat, belső munka.",
  },
  {
    key: "kulso-kulcsrakesz",
    label: "Külső kulcsrakész",
    minPerM2: 390_000,
    maxPerM2: 425_000,
    tartalmaz: "+ cserepezés, külső nyílászárók, külső vakolat, párkányok. Belül nyers.",
  },
  {
    key: "felkesz",
    label: "Félkész",
    minPerM2: 370_000,
    maxPerM2: 425_000,
    tartalmaz: "+ teljes befújt hőszigetelés, belső lemezelés. Nincs vakolat és gipszkarton.",
  },
  {
    key: "emelt-felkesz",
    label: "Emelt szintű félkész",
    minPerM2: 495_000,
    maxPerM2: 525_000,
    tartalmaz: "+ külső vakolat, gipszkartonozás, install szigetelés. Glettre, gépészetre kész.",
  },
  {
    key: "kulcsrakesz",
    label: "Kulcsrakész",
    minPerM2: 630_000,
    maxPerM2: 715_000,
    tartalmaz: "+ gépészet, villany, esztrich, burkolat, festés, hővisszanyerős szellőztetés. Beköltözésre kész.",
  },
];

const FOGADOSZINT_MIN = 80_000;
const FOGADOSZINT_MAX = 95_000;

function fmt(n: number): string {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toLocaleString("hu-HU", { maximumFractionDigits: 1 }) + " M Ft";
  }
  return Math.round(n).toLocaleString("hu-HU") + " Ft";
}

function fmtM2(n: number): string {
  return Math.round(n).toLocaleString("hu-HU") + " Ft/m²";
}

export default function KeszultsegiKalkulator() {
  const [terulet, setTerulet] = useState(120);
  const [fokKey, setFokKey] = useState("kulcsrakesz");
  const [fogadoszint, setFogadoszint] = useState(true);

  const fok = FOKOK.find((f) => f.key === fokKey)!;

  // Fajlagos korrekció: kisebb ház magasabb, nagyobb ház alacsonyabb fajlagos áron
  const faktor = terulet < 90 ? 1.08 : terulet > 180 ? 0.94 : 1.0;

  const epitesMin = fok.minPerM2 * faktor * terulet;
  const epitesMax = fok.maxPerM2 * faktor * terulet;

  const alapMin = fogadoszint ? FOGADOSZINT_MIN * terulet : 0;
  const alapMax = fogadoszint ? FOGADOSZINT_MAX * terulet : 0;

  const totalMin = epitesMin + alapMin;
  const totalMax = epitesMax + alapMax;

  const fajlagosMin = totalMin / terulet;
  const fajlagosMax = totalMax / terulet;

  return (
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8 border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-1 text-slate-800 dark:text-slate-100">
        Készültségi fok ár-kalkulátor
      </h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">
        Favázas, természetes anyagú készház becsült ára 2026-ban, bruttó alapterületre, 5% áfával.
      </p>

      <div class="grid gap-5 md:grid-cols-3">
        {/* Alapterület */}
        <div class="md:col-span-1">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Alapterület: <span class="text-primary-600 dark:text-primary-400 font-bold">{terulet} m²</span>
          </label>
          <input
            type="range"
            min={60}
            max={250}
            step={5}
            value={terulet}
            onInput={(e) => setTerulet(parseInt((e.target as HTMLInputElement).value))}
            class="w-full accent-primary-600"
          />
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>60 m²</span>
            <span>250 m²</span>
          </div>
        </div>

        {/* Készültségi fok */}
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Készültségi fok
          </label>
          <select
            value={fokKey}
            onChange={(e) => setFokKey((e.target as HTMLSelectElement).value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            {FOKOK.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label} ({Math.round(f.minPerM2 / 1000)}–{Math.round(f.maxPerM2 / 1000)}e Ft/m²)
              </option>
            ))}
          </select>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{fok.tartalmaz}</p>
        </div>
      </div>

      {/* Fogadószint */}
      <label class="flex items-center gap-3 mt-4 cursor-pointer">
        <input
          type="checkbox"
          checked={fogadoszint}
          onChange={() => setFogadoszint(!fogadoszint)}
          class="accent-primary-600"
        />
        <span class="text-sm text-slate-700 dark:text-slate-300">
          Fogadószint (alapozás) hozzáadása – <span class="font-medium">80–95e Ft/m²</span>
        </span>
      </label>

      {/* Eredmények */}
      <div class="mt-6 grid gap-3 md:grid-cols-3">
        <div class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800 md:col-span-2">
          <p class="text-sm text-slate-600 dark:text-slate-400">Becsült teljes ár</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">
            {fmt(totalMin)} – {fmt(totalMax)}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {fok.label}{fogadoszint ? " + fogadószint" : ""}, {terulet} m²
          </p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center border border-slate-200 dark:border-slate-600">
          <p class="text-sm text-slate-600 dark:text-slate-400">Fajlagos ár</p>
          <p class="text-xl font-bold text-slate-800 dark:text-slate-100">{fmtM2(fajlagosMin)}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">– {fmtM2(fajlagosMax)}</p>
        </div>
      </div>

      {/* Bontás */}
      <details class="mt-4">
        <summary class="text-sm font-medium text-primary-600 dark:text-primary-400 cursor-pointer hover:text-primary-700 dark:hover:text-primary-300">
          Részletes bontás
        </summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b border-slate-100 dark:border-slate-800">
                <td class="py-2 px-3 text-slate-800 dark:text-slate-200">Épület ({fok.label})</td>
                <td class="py-2 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                  {fmt(epitesMin)} – {fmt(epitesMax)}
                </td>
              </tr>
              {fogadoszint && (
                <tr class="border-b border-slate-100 dark:border-slate-800">
                  <td class="py-2 px-3 text-slate-800 dark:text-slate-200">Fogadószint (alapozás)</td>
                  <td class="py-2 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                    {fmt(alapMin)} – {fmt(alapMax)}
                  </td>
                </tr>
              )}
              <tr>
                <td class="py-2 px-3 font-bold text-slate-900 dark:text-slate-100">Összesen</td>
                <td class="py-2 px-3 text-right font-bold text-primary-700 dark:text-primary-300">
                  {fmt(totalMin)} – {fmt(totalMax)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <p class="text-xs text-amber-800 dark:text-amber-300">
          <strong>Figyelem:</strong> Ez értelmezési keret, nem árajánlat. NEM tartalmazza a közműbekötést,
          kerítést, járdát, teraszt, kocsibeállót és a telken kívüli munkákat. Kisebb háznál magasabb, nagyobb
          háznál alacsonyabb a fajlagos ár. A pontos árhoz egyedi árajánlat szükséges.
        </p>
      </div>
    </div>
  );
}
