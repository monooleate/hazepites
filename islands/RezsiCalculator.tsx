import { useState } from "preact/hooks";

/**
 * Rezsiköltség kalkulátor – fűtési rendszer + napelem összehasonlító.
 * 2026-os hatósági és piaci áradatok alapján.
 */

interface HeatingSystem {
  label: string;
  /** Ft / kWh hasznosenergia-költség */
  costPerKwh: number;
  /** beruházás Ft (120 m² referencia) */
  investMin: number;
  investMax: number;
  /** elektromos (hőszivattyú) → napelem releváns */
  electric: boolean;
}

const SYSTEMS: Record<string, HeatingSystem> = {
  gaz_radiator: {
    label: "Gázkazán + radiátor",
    costPerKwh: 28,
    investMin: 1_000_000,
    investMax: 2_000_000,
    electric: false,
  },
  gaz_padlo: {
    label: "Gázkazán + padlófűtés",
    costPerKwh: 28,
    investMin: 1_400_000,
    investMax: 2_500_000,
    electric: false,
  },
  hosziv_padlo: {
    label: "Hőszivattyú + padlófűtés",
    costPerKwh: 11,
    investMin: 3_000_000,
    investMax: 6_000_000,
    electric: true,
  },
  hosziv_radiator: {
    label: "Hőszivattyú + radiátor",
    costPerKwh: 16,
    investMin: 3_500_000,
    investMax: 6_500_000,
    electric: true,
  },
  elektromos: {
    label: "Elektromos fűtés (konvektor)",
    costPerKwh: 42,
    investMin: 300_000,
    investMax: 800_000,
    electric: true,
  },
};

/** kWh/m²/év fűtési hőigény szigetelés szintje szerint */
const INSULATION: Record<string, { label: string; kwhPerSqm: number }> = {
  regi: { label: "Régi, szigeteletlen (200+ kWh/m²/év)", kwhPerSqm: 220 },
  atlagos: { label: "Átlagos szigetelés (100-150 kWh/m²/év)", kwhPerSqm: 125 },
  jo: { label: "Jól szigetelt, nZEB (50-80 kWh/m²/év)", kwhPerSqm: 65 },
  passziv: { label: "Passzívház (< 15 kWh/m²/év)", kwhPerSqm: 15 },
};

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M Ft`;
  if (n >= 1000) return `${Math.round(n / 1000)} ezer Ft`;
  return `${Math.round(n)} Ft`;
}

export default function RezsiCalculator() {
  const [area, setArea] = useState(120);
  const [insulation, setInsulation] = useState("jo");
  const [system, setSystem] = useState("hosziv_padlo");
  const [napelem, setNapelem] = useState(false);
  const [napelemKw, setNapelemKw] = useState(6);

  const ins = INSULATION[insulation];
  const sys = SYSTEMS[system];

  // Éves fűtési hőigény kWh
  const evesHoigeny = area * ins.kwhPerSqm;

  // Éves fűtési költség
  const evesFutesKoltseg = evesHoigeny * sys.costPerKwh;

  // HMV (melegvíz) – kb. 2500 kWh/év/család × költség
  const hmvKwh = 2500;
  const hmvKoltseg = hmvKwh * sys.costPerKwh;

  // Háztartási áram (világítás, gépek) – kb 3000 kWh/év @ 42 Ft/kWh
  const haztartasiAramKoltseg = 3000 * 42;

  // Víz + csatorna kb. 60-80e/év
  const vizKoltseg = 72_000;

  // Napelem megtakarítás (csak elektromos rendszereknél számít a fűtésre is)
  const napelemTermeles = napelem ? napelemKw * 1100 : 0; // kWh/kWp/év átlag Mo.
  let napelemMegtakaritas = 0;
  if (napelem) {
    // Háztartási áramból mindenképp levon
    const aramMegtakaritas = Math.min(napelemTermeles * 42, haztartasiAramKoltseg);
    // Ha elektromos rendszer, a maradék a fűtésre is megy
    if (sys.electric) {
      const maradekKwh = Math.max(0, napelemTermeles - 3000);
      const futesMegtakaritas = Math.min(maradekKwh * sys.costPerKwh, evesFutesKoltseg + hmvKoltseg);
      napelemMegtakaritas = aramMegtakaritas + futesMegtakaritas;
    } else {
      napelemMegtakaritas = aramMegtakaritas;
    }
  }

  const osszesRezsi = evesFutesKoltseg + hmvKoltseg + haztartasiAramKoltseg + vizKoltseg - napelemMegtakaritas;
  const haviRezsi = osszesRezsi / 12;

  // Beruházás arányos méretezése (referencia 120 m²)
  const investMultiplier = area / 120;
  const investMin = Math.round(sys.investMin * investMultiplier);
  const investMax = Math.round(sys.investMax * investMultiplier);
  const napelemInvest = napelem ? napelemKw * 350_000 : 0;

  // Összehasonlítás gázkazánnal
  const gazRef = evesHoigeny * SYSTEMS.gaz_radiator.costPerKwh + hmvKwh * SYSTEMS.gaz_radiator.costPerKwh + haztartasiAramKoltseg + vizKoltseg;
  const evesKulonbseg = gazRef - osszesRezsi;

  return (
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8 border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100">
        Rezsiköltség kalkulátor – fűtés + napelem
      </h3>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Alapterület: <span class="text-primary-600 dark:text-primary-400 font-bold">{area} m²</span>
          </label>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={area}
            onInput={(e) => setArea(Number(e.currentTarget.value))}
            class="w-full accent-primary-600"
          />
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>50 m²</span>
            <span>300 m²</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Szigetelés szintje
          </label>
          <select
            value={insulation}
            onChange={(e) => setInsulation(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            {Object.entries(INSULATION).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Fűtési rendszer
          </label>
          <select
            value={system}
            onChange={(e) => setSystem(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            {Object.entries(SYSTEMS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Napelem?
          </label>
          <select
            value={napelem ? "igen" : "nem"}
            onChange={(e) => setNapelem(e.currentTarget.value === "igen")}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            <option value="nem">Nincs napelem</option>
            <option value="igen">Van napelem</option>
          </select>
        </div>

        {napelem && (
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Napelem méret: <span class="text-primary-600 dark:text-primary-400 font-bold">{napelemKw} kWp</span>
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={napelemKw}
              onInput={(e) => setNapelemKw(Number(e.currentTarget.value))}
              class="w-full accent-primary-600"
            />
            <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>3 kWp</span>
              <span>15 kWp</span>
            </div>
          </div>
        )}
      </div>

      {/* Költség bontás */}
      <div class="mt-6 space-y-2">
        <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <span class="text-sm text-slate-700 dark:text-slate-300">Fűtés ({Math.round(evesHoigeny).toLocaleString("hu")} kWh/év)</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100">{fmt(evesFutesKoltseg)} / év</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <span class="text-sm text-slate-700 dark:text-slate-300">Melegvíz</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100">{fmt(hmvKoltseg)} / év</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <span class="text-sm text-slate-700 dark:text-slate-300">Háztartási áram</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100">{fmt(haztartasiAramKoltseg)} / év</span>
        </div>
        <div class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <span class="text-sm text-slate-700 dark:text-slate-300">Víz + csatorna</span>
          <span class="font-semibold text-slate-800 dark:text-slate-100">{fmt(vizKoltseg)} / év</span>
        </div>
        {napelem && napelemMegtakaritas > 0 && (
          <div class="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <span class="text-sm text-emerald-700 dark:text-emerald-300">Napelem megtakarítás ({napelemKw} kWp)</span>
            <span class="font-semibold text-emerald-700 dark:text-emerald-300">-{fmt(napelemMegtakaritas)} / év</span>
          </div>
        )}
      </div>

      {/* Főszámok */}
      <div class="mt-5 grid gap-3 md:grid-cols-3">
        <div class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Éves rezsi összesen</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{fmt(osszesRezsi)}</p>
        </div>
        <div class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Havi átlag</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{fmt(Math.round(haviRezsi))}</p>
        </div>
        <div class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Fűtésrendszer beruházás</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{fmt(investMin)} – {fmt(investMax)}</p>
          {napelem && <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">+ napelem: ~{fmt(napelemInvest)}</p>}
        </div>
      </div>

      {/* Gáz referencia összehasonlítás */}
      {system !== "gaz_radiator" && (
        <div class={`mt-3 p-3 rounded-lg text-sm text-center ${evesKulonbseg > 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"}`}>
          {evesKulonbseg > 0
            ? `Évi ~${fmt(evesKulonbseg)}-tal kevesebb rezsi a gáz+radiátor referenciához képest`
            : `Évi ~${fmt(Math.abs(evesKulonbseg))}-tal több a gáz+radiátor referenciához képest`}
        </div>
      )}

      <p class="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
        Tájékoztató jellegű becslés. A tényleges rezsi függ a használati szokásoktól, tarifáktól és az időjárástól.
      </p>
    </div>
  );
}
