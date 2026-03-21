import { useState } from "preact/hooks";

/**
 * Lakáshitel kalkulátor – havi törlesztő, THM, teljes visszafizetés.
 * Piaci hitel + CSOK Plusz kedvezményes hitel összehasonlítás.
 */

interface HitelTermek {
  label: string;
  kamat: number;
  description: string;
}

const HITEL_TIPUSOK: Record<string, HitelTermek> = {
  piaci_fix10: {
    label: "Piaci hitel – 10 éves fix",
    kamat: 0.0699,
    description: "Átlagos piaci kamat, 10 évre fixált",
  },
  piaci_fix5: {
    label: "Piaci hitel – 5 éves fix",
    kamat: 0.0649,
    description: "Rövidebb fixálás, alacsonyabb induló kamat",
  },
  csok_plusz: {
    label: "CSOK Plusz – fix 3%",
    kamat: 0.03,
    description: "Kedvezményes kamat, gyerekvállalással",
  },
  zold_hitel: {
    label: "Zöld hitel – fix 0%",
    kamat: 0.0,
    description: "BB vagy jobb energetika, max 70M Ft",
  },
  babavaro: {
    label: "Babaváró – kamatmentes 5 évig",
    kamat: 0.0,
    description: "11M Ft, szabadfelhasználású, 20 éves futamidő",
  },
};

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M Ft`;
  return `${Math.round(n / 1000)} ezer Ft`;
}

function fmtExact(n: number): string {
  return Math.round(n).toLocaleString("hu-HU") + " Ft";
}

export default function HitelCalculator() {
  const [osszeg, setOsszeg] = useState(30_000_000);
  const [futamido, setFutamido] = useState(20);
  const [tipus, setTipus] = useState("piaci_fix10");
  const [showCompare, setShowCompare] = useState(false);

  const hitel = HITEL_TIPUSOK[tipus];
  const havi = monthlyPayment(osszeg, hitel.kamat, futamido);
  const teljes = havi * futamido * 12;
  const kamatTeher = teljes - osszeg;

  // CSOK Plusz összehasonlítás
  const csokHavi = monthlyPayment(osszeg, 0.03, futamido);
  const csokTeljes = csokHavi * futamido * 12;
  const csokKamatTeher = csokTeljes - osszeg;
  const megtakaritas = teljes - csokTeljes;

  // THM hozzávetőleges (kamat + ~0.5% díjak)
  const thm = (hitel.kamat + 0.005) * 100;

  return (
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8 border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100">
        Lakáshitel kalkulátor
      </h3>

      <div class="grid gap-5 md:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Hitelösszeg: <span class="text-primary-600 dark:text-primary-400 font-bold">{fmt(osszeg)}</span>
          </label>
          <input
            type="range"
            min="2000000"
            max="80000000"
            step="1000000"
            value={osszeg}
            onInput={(e) => setOsszeg(Number(e.currentTarget.value))}
            class="w-full accent-primary-600"
          />
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>2M Ft</span>
            <span>80M Ft</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Futamidő: <span class="text-primary-600 dark:text-primary-400 font-bold">{futamido} év</span>
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={futamido}
            onInput={(e) => setFutamido(Number(e.currentTarget.value))}
            class="w-full accent-primary-600"
          />
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>5 év</span>
            <span>30 év</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Hitel típusa
          </label>
          <select
            value={tipus}
            onChange={(e) => setTipus(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            {Object.entries(HITEL_TIPUSOK).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{hitel.description}</p>
        </div>
      </div>

      {/* Fő eredmények */}
      <div class="mt-6 grid gap-3 md:grid-cols-4">
        <div class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Havi törlesztő</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{fmtExact(havi)}</p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center border border-slate-200 dark:border-slate-600">
          <p class="text-sm text-slate-600 dark:text-slate-400">Teljes visszafizetés</p>
          <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{fmt(teljes)}</p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center border border-slate-200 dark:border-slate-600">
          <p class="text-sm text-slate-600 dark:text-slate-400">Kamatteher összesen</p>
          <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{fmt(kamatTeher)}</p>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center border border-slate-200 dark:border-slate-600">
          <p class="text-sm text-slate-600 dark:text-slate-400">THM (becsült)</p>
          <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{thm.toFixed(1)}%</p>
        </div>
      </div>

      {/* CSOK Plusz összehasonlítás toggle */}
      {tipus !== "csok_plusz" && tipus !== "zold_hitel" && tipus !== "babavaro" && (
        <div class="mt-4">
          <button
            onClick={() => setShowCompare(!showCompare)}
            class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            <svg class={`w-4 h-4 transition-transform ${showCompare ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Összehasonlítás CSOK Plusz-szal (3%)
          </button>

          {showCompare && (
            <div class="mt-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div class="grid gap-3 md:grid-cols-3 text-center">
                <div>
                  <p class="text-sm text-slate-600 dark:text-slate-400">CSOK Plusz havi</p>
                  <p class="text-xl font-bold text-emerald-700 dark:text-emerald-300">{fmtExact(csokHavi)}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600 dark:text-slate-400">CSOK Plusz kamatteher</p>
                  <p class="text-xl font-bold text-emerald-700 dark:text-emerald-300">{fmt(csokKamatTeher)}</p>
                </div>
                <div>
                  <p class="text-sm text-slate-600 dark:text-slate-400">Megtakarítás a futamidő alatt</p>
                  <p class="text-xl font-bold text-emerald-700 dark:text-emerald-300">{fmt(megtakaritas)}</p>
                </div>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                A CSOK Plusz-hoz házasság + gyerekvállalás szükséges
              </p>
            </div>
          )}
        </div>
      )}

      {/* Törlesztési táblázat - első 5 év */}
      <details class="mt-4">
        <summary class="text-sm font-medium text-primary-600 dark:text-primary-400 cursor-pointer hover:text-primary-700 dark:hover:text-primary-300">
          Törlesztési ütemezés (első 5 év)
        </summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="py-2 px-3 text-left text-slate-600 dark:text-slate-400">Év</th>
                <th class="py-2 px-3 text-right text-slate-600 dark:text-slate-400">Éves törlesztés</th>
                <th class="py-2 px-3 text-right text-slate-600 dark:text-slate-400">Ebből kamat</th>
                <th class="py-2 px-3 text-right text-slate-600 dark:text-slate-400">Ebből tőke</th>
                <th class="py-2 px-3 text-right text-slate-600 dark:text-slate-400">Fennálló tőke</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.min(5, futamido) }, (_, i) => {
                const r = hitel.kamat / 12;
                const n = futamido * 12;
                let remainingPrincipal = osszeg;
                // Calculate remaining principal at start of year i+1
                for (let m = 0; m < i * 12; m++) {
                  const interest = remainingPrincipal * r;
                  const principalPart = havi - interest;
                  remainingPrincipal -= principalPart;
                }
                let yearInterest = 0;
                let yearPrincipal = 0;
                const startPrincipal = remainingPrincipal;
                for (let m = 0; m < 12; m++) {
                  const interest = remainingPrincipal * r;
                  const principalPart = havi - interest;
                  yearInterest += interest;
                  yearPrincipal += principalPart;
                  remainingPrincipal -= principalPart;
                }
                return (
                  <tr key={i} class="border-b border-slate-100 dark:border-slate-800">
                    <td class="py-2 px-3 text-slate-800 dark:text-slate-200">{i + 1}. év</td>
                    <td class="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{fmt(havi * 12)}</td>
                    <td class="py-2 px-3 text-right text-amber-600 dark:text-amber-400">{fmt(yearInterest)}</td>
                    <td class="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">{fmt(yearPrincipal)}</td>
                    <td class="py-2 px-3 text-right font-medium text-slate-800 dark:text-slate-200">{fmt(Math.max(0, remainingPrincipal))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>

      <p class="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
        Tájékoztató becslés. A tényleges feltételeket a bank határozza meg az egyéni hitelelbírálás során.
      </p>
    </div>
  );
}
