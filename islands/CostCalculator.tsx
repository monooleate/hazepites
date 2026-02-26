import { useState } from "preact/hooks";

const PRICES: Record<string, { label: string; min: number; max: number }> = {
  tegla: { label: "Tégla (B30)", min: 400000, max: 500000 },
  ytong: { label: "Ytong / Porotherm", min: 380000, max: 480000 },
  fa: { label: "Könnyűszerkezet (fa)", min: 350000, max: 450000 },
  passziv: { label: "Passzívház", min: 500000, max: 700000 },
  modul: { label: "Modulház (gyári)", min: 300000, max: 400000 },
};

export default function CostCalculator() {
  const [area, setArea] = useState(100);
  const [tech, setTech] = useState("tegla");
  const [region, setRegion] = useState(1.0);

  const selected = PRICES[tech];
  const minCost = Math.round((area * selected.min * region) / 1000000);
  const maxCost = Math.round((area * selected.max * region) / 1000000);

  return (
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8 border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
        Költségbecslő
      </h3>

      <div class="grid gap-4 md:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Alapterület (m²)
          </label>
          <input
            type="range"
            min="60"
            max="300"
            value={area}
            onInput={(e) => setArea(Number(e.currentTarget.value))}
            class="w-full accent-primary-600"
          />
          <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">
            {area} m²
          </span>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Építési technológia
          </label>
          <select
            value={tech}
            onChange={(e) => setTech(e.currentTarget.value)}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            {Object.entries(PRICES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Régió
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(Number(e.currentTarget.value))}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            <option value={1.2}>Budapest és agglomeráció (+20%)</option>
            <option value={1.07}>Nyugat-Dunántúl (+7%)</option>
            <option value={1.0}>Közép-Magyarország (alap)</option>
            <option value={0.9}>Kelet-Magyarország (-10%)</option>
            <option value={0.87}>Dél-Alföld (-13%)</option>
          </select>
        </div>
      </div>

      <div class="mt-6 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Becsült kulcsrakész költség
        </p>
        <p class="text-3xl font-bold text-primary-700 dark:text-primary-300">
          {minCost} – {maxCost} M Ft
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          + 15-25% rejtett költségek (közművek, tervezés, engedélyek)
        </p>
      </div>
    </div>
  );
}
