import { useState } from "preact/hooks";

/**
 * Energia-hatékonysági kalkulátor – épület energetikai besorolás becslő.
 * Megbecsüli az éves fajlagos energiaigényt (kWh/m²/év) és az energetikai osztályt.
 */

interface SzigetelesTipus {
  label: string;
  /** hőveszteség-szorzó (1.0 = rossz, 0.15 = passzív) */
  factor: number;
}

const SZIGETELES: Record<string, SzigetelesTipus> = {
  nincs: { label: "Nincs szigetelés (régi panel, vályog)", factor: 1.0 },
  regi: { label: "Régi, 5-8 cm EPS (2000-es évek)", factor: 0.65 },
  atlag: { label: "Átlagos, 10-15 cm EPS/grafit", factor: 0.42 },
  modern: { label: "Modern, 15-20 cm grafit EPS + hőhídmentes", factor: 0.28 },
  passziv: { label: "Passzívház, 25-30 cm + HRV + 3r üveg", factor: 0.15 },
};

interface NyilaszaroTipus {
  label: string;
  uValue: number;
}

const NYILASZARO: Record<string, NyilaszaroTipus> = {
  regi: { label: "Régi fa / egyszerű műanyag (U=2.5-3.0)", uValue: 2.8 },
  dupla: { label: "Kétrétegű üveg műanyag (U=1.1-1.4)", uValue: 1.2 },
  haromreteg: { label: "Háromrétegű üveg (U=0.6-0.8)", uValue: 0.7 },
  passziv: { label: "Passzívház minősítésű (U<0.6)", uValue: 0.5 },
};

interface FutesTipus {
  label: string;
  /** primer energia szorzó */
  primerFactor: number;
}

const FUTES: Record<string, FutesTipus> = {
  gaz_regi: { label: "Régi gázkazán + radiátor", primerFactor: 1.4 },
  gaz_kond: { label: "Kondenzációs gázkazán", primerFactor: 1.1 },
  hosziv_padlo: { label: "Hőszivattyú + padlófűtés", primerFactor: 0.55 },
  hosziv_rad: { label: "Hőszivattyú + radiátor", primerFactor: 0.75 },
  elektromos: { label: "Elektromos fűtés", primerFactor: 2.5 },
  vegyes: { label: "Vegyes (gáz + klíma)", primerFactor: 0.9 },
};

function getEnergyClass(kwhPerSqm: number): { label: string; color: string; bgColor: string } {
  if (kwhPerSqm <= 40) return { label: "AA++", color: "text-emerald-700 dark:text-emerald-300", bgColor: "bg-emerald-100 dark:bg-emerald-900/40" };
  if (kwhPerSqm <= 60) return { label: "AA+", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-900/30" };
  if (kwhPerSqm <= 80) return { label: "AA", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-50 dark:bg-green-900/30" };
  if (kwhPerSqm <= 100) return { label: "BB", color: "text-lime-600 dark:text-lime-400", bgColor: "bg-lime-50 dark:bg-lime-900/30" };
  if (kwhPerSqm <= 130) return { label: "CC", color: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-50 dark:bg-yellow-900/30" };
  if (kwhPerSqm <= 160) return { label: "DD", color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-50 dark:bg-orange-900/30" };
  if (kwhPerSqm <= 200) return { label: "EE", color: "text-red-500 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-900/30" };
  if (kwhPerSqm <= 250) return { label: "FF", color: "text-red-600 dark:text-red-300", bgColor: "bg-red-100 dark:bg-red-900/40" };
  if (kwhPerSqm <= 310) return { label: "GG", color: "text-red-700 dark:text-red-300", bgColor: "bg-red-200 dark:bg-red-900/50" };
  if (kwhPerSqm <= 400) return { label: "HH", color: "text-red-800 dark:text-red-200", bgColor: "bg-red-300 dark:bg-red-900/60" };
  return { label: "II", color: "text-red-900 dark:text-red-100", bgColor: "bg-red-400 dark:bg-red-900/70" };
}

export default function EnergiaCalculator() {
  const [area, setArea] = useState(120);
  const [szigeteles, setSzigeteles] = useState("atlag");
  const [nyilaszaro, setNyilaszaro] = useState("dupla");
  const [futes, setFutes] = useState("gaz_kond");
  const [napelem, setNapelem] = useState(false);
  const [napelemKw, setNapelemKw] = useState(6);
  const [hmv, setHmv] = useState<"gaz" | "hosziv" | "napkollektor">("gaz");

  const szig = SZIGETELES[szigeteles];
  const nyil = NYILASZARO[nyilaszaro];
  const fut = FUTES[futes];

  // Bázis fűtési hőigény (kWh/m²/év) – referencia: 250 kWh/m²/év szigeteletlen
  const bazisHoigeny = 250 * szig.factor;

  // Nyílászáró korrekció (referencia U=2.8, minden 0.1 U csökkenés ~3% megtakarítás)
  const nyilKorrekcio = 1 - (2.8 - nyil.uValue) * 0.03;
  const hoigeny = bazisHoigeny * nyilKorrekcio;

  // Primer energiaigény (fűtés)
  const futesEnergia = hoigeny * fut.primerFactor;

  // HMV energiaigény (kWh/m²/év)
  let hmvEnergia: number;
  if (hmv === "hosziv") hmvEnergia = 8;
  else if (hmv === "napkollektor") hmvEnergia = 5;
  else hmvEnergia = 20;

  // Világítás + háztartási gépek (~15-25 kWh/m²/év)
  const egyebEnergia = 20;

  // Napelem kompenzáció (kWh/m²/év)
  const napelemTermeles = napelem ? (napelemKw * 1100) / area : 0;

  // Összesített primer energiaigény
  const osszesEnergia = Math.max(0, futesEnergia + hmvEnergia + egyebEnergia - napelemTermeles);

  const energyClass = getEnergyClass(osszesEnergia);

  // Skála pozíció (0-400 kWh/m²/év)
  const scalePercent = Math.min(100, (osszesEnergia / 400) * 100);

  // 2024-es követelmény: BB (≤100 kWh/m²/év)
  const megfelel = osszesEnergia <= 100;

  return (
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8 border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100">
        Energia-hatékonysági kalkulátor
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
            Melegvíz készítés
          </label>
          <select
            value={hmv}
            onChange={(e) => setHmv(e.currentTarget.value as "gaz" | "hosziv" | "napkollektor")}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 text-sm"
          >
            <option value="gaz">Gázkazán / villanyboiler</option>
            <option value="hosziv">Hőszivattyúval</option>
            <option value="napkollektor">Napkollektorral</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Napelem
          </label>
          <select
            value={napelem ? "igen" : "nem"}
            onChange={(e) => setNapelem(e.currentTarget.value === "igen")}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100 text-sm"
          >
            <option value="nem">Nincs napelem</option>
            <option value="igen">Van napelem</option>
          </select>
        </div>

        {napelem && (
          <div class="md:col-span-2 lg:col-span-3">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Napelem méret: <span class="text-primary-600 dark:text-primary-400 font-bold">{napelemKw} kWp</span>
            </label>
            <input
              type="range"
              min="3"
              max="20"
              value={napelemKw}
              onInput={(e) => setNapelemKw(Number(e.currentTarget.value))}
              class="w-full accent-primary-600"
            />
          </div>
        )}
      </div>

      {/* Energetikai besorolás */}
      <div class="mt-6">
        {/* Energia skála */}
        <div class="relative h-10 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 via-yellow-400 via-orange-500 to-red-600">
          <div
            class="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500"
            style={{ left: `${scalePercent}%` }}
          />
          <div
            class="absolute -top-0.5 transition-all duration-500"
            style={{ left: `calc(${scalePercent}% - 12px)` }}
          >
            <div class="w-6 h-11 border-2 border-white rounded-sm bg-slate-900/50" />
          </div>
        </div>
        <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1 px-1">
          <span>AA++ (0)</span>
          <span>BB (100)</span>
          <span>DD (160)</span>
          <span>GG (310)</span>
          <span>II (400+)</span>
        </div>
      </div>

      {/* Főszámok */}
      <div class="mt-5 grid gap-3 md:grid-cols-3">
        <div class={`p-5 rounded-lg text-center border ${energyClass.bgColor}`}>
          <p class="text-sm text-slate-600 dark:text-slate-400">Energetikai besorolás</p>
          <p class={`text-4xl font-black ${energyClass.color}`}>{energyClass.label}</p>
        </div>
        <div class="p-5 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Fajlagos energiaigény</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{Math.round(osszesEnergia)} kWh/m²/év</p>
        </div>
        <div class="p-5 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
          <p class="text-sm text-slate-600 dark:text-slate-400">Éves összenergia-igény</p>
          <p class="text-2xl font-bold text-primary-700 dark:text-primary-300">{Math.round(osszesEnergia * area).toLocaleString("hu")} kWh</p>
        </div>
      </div>

      {/* Bontás */}
      <div class="mt-4 space-y-1">
        <div class="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-sm">
          <span class="text-slate-700 dark:text-slate-300">Fűtés</span>
          <span class="font-medium text-slate-800 dark:text-slate-100">{Math.round(futesEnergia)} kWh/m²/év</span>
        </div>
        <div class="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-sm">
          <span class="text-slate-700 dark:text-slate-300">Melegvíz</span>
          <span class="font-medium text-slate-800 dark:text-slate-100">{Math.round(hmvEnergia)} kWh/m²/év</span>
        </div>
        <div class="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-sm">
          <span class="text-slate-700 dark:text-slate-300">Világítás + gépek</span>
          <span class="font-medium text-slate-800 dark:text-slate-100">{egyebEnergia} kWh/m²/év</span>
        </div>
        {napelem && (
          <div class="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded text-sm">
            <span class="text-emerald-700 dark:text-emerald-300">Napelem kompenzáció</span>
            <span class="font-medium text-emerald-700 dark:text-emerald-300">-{Math.round(napelemTermeles)} kWh/m²/év</span>
          </div>
        )}
      </div>

      {/* Megfelelőség */}
      <div class={`mt-4 p-3 rounded-lg text-sm text-center ${megfelel ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"}`}>
        {megfelel
          ? "Megfelel a 7/2006. TNM rendelet 2024-es követelményének (BB vagy jobb)"
          : `Nem felel meg a jelenlegi előírásnak (BB ≤ 100 kWh/m²/év szükséges, jelenleg: ${Math.round(osszesEnergia)} kWh/m²/év)`}
      </div>

      <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center">
        Tájékoztató becslés. A hivatalos energetikai tanúsítványt független energetikus készíti.
      </p>
    </div>
  );
}
