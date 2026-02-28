import { page } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { define } from "../utils/state.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Köszönjük! – Házépítési Kalauz";
    ctx.state.description = "Üzeneted megkaptuk, hamarosan válaszolunk.";
    ctx.state.cleanUrl = "https://hazepitesikalauz.hu/koszonjuk";
    ctx.state.noIndex = true;
    return page({});
  },
});

export default define.page<typeof handler>(function KoszonjukPage() {
  return (
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main class="flex-1 flex items-center justify-center px-4 sm:px-6 py-20">
        <div class="max-w-md text-center">
          {/* Success icon */}
          <div class="w-20 h-20 mx-auto mb-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
            <svg class="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Köszönjük az üzeneted!
          </h1>

          <p class="text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Megkaptuk, és 1-2 munkanapon belül válaszolunk az megadott email címedre.
          </p>

          <p class="text-sm text-slate-500 dark:text-slate-500 mb-10">
            Addig is böngészd a cikkeinket — lehet, hogy pont megtalálod a választ.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/20 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Vissza a főoldalra
            </a>
            <a
              href="/koltsegek/hazepites-koltseg-2026"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
            >
              Mibe kerül egy ház?
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
});
