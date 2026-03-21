import { useState } from "preact/hooks";

/**
 * CSOK Plusz + Falusi CSOK + Babaváró kombináció kalkulátor.
 * 2026-os adatok (2024. évi CXXXIII. törvény + 302/2023. Korm.r.)
 */

const CSOK_PLUSZ: Record<number, number> = {
  1: 15_000_000,
  2: 30_000_000,
  3: 50_000_000,
};

const FALUSI_CSOK_EPITES: Record<number, number> = {
  1: 1_000_000,
  2: 4_000_000,
  3: 15_000_000,
};

const FALUSI_CSOK_FELUJITAS: Record<number, number> = {
  1: 600_000,
  2: 2_000_000,
  3: 7_500_000,
};

const BABAVARO = 11_000_000;

function fmt(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)} M Ft`;
  }
  return `${(n / 1000).toFixed(0)} ezer Ft`;
}

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function TamogatasCalculator() {
  const [gyerekMeglevo, setGyerekMeglevo] = useState(0);
  const [gyerekVallalt, setGyerekVallalt] = useState(2);
  const [hazas, setHazas] = useState(true);
  const [falusiTelepules, setFalusiTelepules] = useState(false);
  const [cel, setCel] = useState<"epites" | "vasarlas" | "felujitas">("epites");
  const [babavaroIgeny, setBabavaroIgeny] = useState(true);
  const [futamido, setFutamido] = useState(25);

  const osszes = Math.min(gyerekMeglevo + gyerekVallalt, 3);
  const csokKulcs = osszes >= 3 ? 3 : osszes;

  // CSOK Plusz: kell házasság + min 1 vállalt
  const csokPluszJogosult = hazas && gyerekVallalt >= 1 && osszes >= 1;
  const csokPluszOsszeg = csokPluszJogosult ? (CSOK_PLUSZ[csokKulcs] || 0) : 0;

  // Tartozáselengedés: 2. gyerektől 10M/gyerek
  const tartozasElengedesGyerekSzam = Math.max(0, osszes - 1);
  const tartozasElengedesOsszeg = csokPluszJogosult
    ? tartozasElengedesGyerekSzam * 10_000_000
    : 0;

  // Falusi CSOK: preferált település szükséges
  const falusiJogosult = falusiTelepules && osszes >= 1;
  const falusiMap = cel === "felujitas" ? FALUSI_CSOK_FELUJITAS : FALUSI_CSOK_EPITES;
  const falusiOsszeg = falusiJogosult ? (falusiMap[csokKulcs] || 0) : 0;

  // Babaváró: házas + min 1 vállalt
  const babavaroJogosult = hazas && gyerekVallalt >= 1 && babavaroIgeny;
  const babavaroOsszeg = babavaroJogosult ? BABAVARO : 0;

  // Összesítés
  const osszesKedvezmeny = csokPluszOsszeg + falusiOsszeg + babavaroOsszeg;
  const osszesVNT = falusiOsszeg + tartozasElengedesOsszeg;

  // Havi törlesztő CSOK Plusz
  const haviCsokPlusz = csokPluszJogosult
    ? monthlyPayment(csokPluszOsszeg, 0.03, futamido)
    : 0;

  // Havi törlesztő Babaváró (kamatmentes 5 évig, utána ~6.5% 15 évre)
  const haviBabavaro5ev = babavaroJogosult
    ? monthlyPayment(BABAVARO, 0, 20)
    : 0;

  return (
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 my-8 border border-slate-200 dark:border-slate-700">
      <h3 class="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100">
        Támogatás kalkulátor – CSOK Plusz + Falusi CSOK + Babaváró
      </h3>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Családi helyzet */}
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Meglévő gyerekek
          </label>
          <select
            value={gyerekMeglevo}
            onChange={(e) => setGyerekMeglevo(Number(e.currentTarget.value))}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            <option value={0}>Nincs még</option>
            <option value={1}>1 gyerek</option>
            <option value={2}>2 gyerek</option>
            <option value={3}>3 vagy több</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Vállalt gyerekek
          </label>
          <select
            value={gyerekVallalt}
            onChange={(e) => setGyerekVallalt(Number(e.currentTarget.value))}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            <option value={0}>Nem vállalok</option>
            <option value={1}>1 gyereket</option>
            <option value={2}>2 gyereket</option>
            <option value={3}>3 vagy többet</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Családi állapot
          </label>
          <select
            value={hazas ? "hazas" : "nem"}
            onChange={(e) => setHazas(e.currentTarget.value === "hazas")}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            <option value="hazas">Házas</option>
            <option value="nem">Nem házas / Élettárs</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Cél
          </label>
          <select
            value={cel}
            onChange={(e) => setCel(e.currentTarget.value as "epites" | "vasarlas" | "felujitas")}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            <option value="epites">Új ház építése</option>
            <option value="vasarlas">Ház vásárlás</option>
            <option value="felujitas">Felújítás / korszerűsítés</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Preferált kistelepülés?
          </label>
          <select
            value={falusiTelepules ? "igen" : "nem"}
            onChange={(e) => setFalusiTelepules(e.currentTarget.value === "igen")}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            <option value="nem">Nem (város, nagyközség)</option>
            <option value="igen">Igen (5000 fő alatti)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Babaváró hitel?
          </label>
          <select
            value={babavaroIgeny ? "igen" : "nem"}
            onChange={(e) => setBabavaroIgeny(e.currentTarget.value === "igen")}
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
          >
            <option value="igen">Igen, igénylem</option>
            <option value="nem">Nem kérem</option>
          </select>
        </div>
      </div>

      {/* Futamidő slider */}
      <div class="mt-5">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          CSOK Plusz futamidő: <span class="text-primary-600 dark:text-primary-400 font-bold">{futamido} év</span>
        </label>
        <input
          type="range"
          min="10"
          max="25"
          value={futamido}
          onInput={(e) => setFutamido(Number(e.currentTarget.value))}
          class="w-full accent-primary-600"
        />
        <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>10 év</span>
          <span>25 év</span>
        </div>
      </div>

      {/* Figyelmeztetések */}
      {!hazas && (
        <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
          A CSOK Plusz és a Babaváró hitel csak házaspároknak jár. Élettársak nem jogosultak.
        </div>
      )}
      {gyerekVallalt === 0 && (
        <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300">
          A CSOK Plusz-hoz minimum 1 gyermekvállalás szükséges. Meglévő gyerekek önmagukban nem elégségesek.
        </div>
      )}

      {/* Eredmények */}
      <div class="mt-6 grid gap-3 md:grid-cols-2">
        {/* CSOK Plusz */}
        <div class={`p-4 rounded-lg border ${csokPluszJogosult ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60"}`}>
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">CSOK Plusz (kedvezményes hitel)</p>
          <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {csokPluszJogosult ? fmt(csokPluszOsszeg) : "Nem jogosult"}
          </p>
          {csokPluszJogosult && (
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              fix 3% kamat, havi ~{Math.round(haviCsokPlusz / 1000)} ezer Ft
            </p>
          )}
        </div>

        {/* Tartozáselengedés */}
        <div class={`p-4 rounded-lg border ${tartozasElengedesOsszeg > 0 ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60"}`}>
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Tartozáselengedés (VNT)</p>
          <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            {tartozasElengedesOsszeg > 0 ? fmt(tartozasElengedesOsszeg) : "0 Ft"}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            2. gyerektől 10M Ft/gyerek elengedés
          </p>
        </div>

        {/* Falusi CSOK */}
        <div class={`p-4 rounded-lg border ${falusiJogosult ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60"}`}>
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Falusi CSOK (vissza nem térítendő)</p>
          <p class="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {falusiJogosult ? fmt(falusiOsszeg) : "Nem jogosult"}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {falusiTelepules ? `${cel === "felujitas" ? "korszerűsítési" : "építési/vásárlási"} összeg` : "csak preferált kistelepülésen"}
          </p>
        </div>

        {/* Babaváró */}
        <div class={`p-4 rounded-lg border ${babavaroJogosult ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" : "bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60"}`}>
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Babaváró hitel</p>
          <p class="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {babavaroJogosult ? fmt(babavaroOsszeg) : "Nem jogosult"}
          </p>
          {babavaroJogosult && (
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              kamatmentes 5 évig, havi ~{Math.round(haviBabavaro5ev / 1000)} ezer Ft
            </p>
          )}
        </div>
      </div>

      {/* Összesítő */}
      <div class="mt-4 p-5 bg-primary-50 dark:bg-primary-900/30 rounded-lg text-center border border-primary-200 dark:border-primary-800">
        <p class="text-sm text-slate-600 dark:text-slate-400">Összes elérhető kedvezményes forrás</p>
        <p class="text-4xl font-bold text-primary-700 dark:text-primary-300 mt-1">
          {fmt(osszesKedvezmeny)}
        </p>
        {osszesVNT > 0 && (
          <p class="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
            Ebből vissza nem térítendő: {fmt(osszesVNT)}
          </p>
        )}
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Tájékoztató jellegű. A pontos jogosultságot a bank állapítja meg.
        </p>
      </div>
    </div>
  );
}
