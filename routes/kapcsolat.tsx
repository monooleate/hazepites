import { page } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { define } from "../utils/state.ts";
import ContactMe from "../islands/ContactMe.tsx";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Impresszum – Házépítési Kalauz";
    ctx.state.description =
      "A Házépítési Kalauz üzemeltetőjének adatai, elérhetőségek és jogi információk a magyar Ekertv. előírásai szerint.";
    ctx.state.cleanUrl = "https://hazepitesikalauz.hu/kapcsolat";
    return page({});
  },
});

export default define.page<typeof handler>(function KapcsolatPage() {
  return (
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main class="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Impresszum
        </h1>
        <div class="prose-custom">
          {/* --- Üzemeltető adatai (Ekertv. 4.§) --- */}
          <section class="mb-10">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Üzemeltető adatai
            </h2>
            <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-slate-700 dark:text-slate-300">
              <dt class="font-medium">Név:</dt>
              <dd>Mészáros János egyéni vállalkozó</dd>
              <dt class="font-medium">Székhely:</dt>
              <dd>Magyarország</dd>
              <dt class="font-medium">Email:</dt>
              <dd>
                <a href="mailto:info@hazepitesikalauz.hu" class="text-primary-600 dark:text-primary-400 hover:underline">
                  info@hazepitesikalauz.hu
                </a>
              </dd>
              <dt class="font-medium">Weboldal:</dt>
              <dd>
                <a href="https://hazepitesikalauz.hu" class="text-primary-600 dark:text-primary-400 hover:underline">
                  hazepitesikalauz.hu
                </a>
              </dd>
            </dl>
          </section>

          {/* --- Tárhelyszolgáltató --- */}
          <section class="mb-10">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Tárhelyszolgáltató
            </h2>
            <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-slate-700 dark:text-slate-300">
              <dt class="font-medium">Név:</dt>
              <dd>Cloudflare, Inc.</dd>
              <dt class="font-medium">Székhely:</dt>
              <dd>101 Townsend St, San Francisco, CA 94107, USA</dd>
              <dt class="font-medium">Weboldal:</dt>
              <dd>
                <a href="https://www.cloudflare.com" class="text-primary-600 dark:text-primary-400 hover:underline" rel="noopener noreferrer" target="_blank">
                  cloudflare.com
                </a>
              </dd>
            </dl>
          </section>

          {/* --- Szellemi tulajdon --- */}
          <section class="mb-10">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Szellemi tulajdon
            </h2>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed">
              A hazepitesikalauz.hu teljes tartalma (szövegek, grafikák, kalkulátorok, forráskód)
              szerzői jogi védelem alatt áll. A tartalom másolása, terjesztése vagy újrafelhasználása
              kizárólag az üzemeltető előzetes írásbeli engedélyével lehetséges.
            </p>
          </section>

          {/* --- Felelősségkizárás --- */}
          <section class="mb-10">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Felelősségkizárás
            </h2>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              A Házépítési Kalauz tájékoztató jellegű tartalmakat közöl. Az oldalon megjelenő
              információk nem minősülnek jogi, pénzügyi vagy műszaki tanácsadásnak.
            </p>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed">
              Az árak, támogatási feltételek és jogszabályi hivatkozások tájékoztató jellegűek,
              a pontos és aktuális feltételeket mindig az illetékes hatóságnál vagy pénzintézetnél
              ellenőrizd. A kalkulátorok becsléseket adnak, nem hivatalos árajánlatokat.
            </p>
          </section>

          {/* --- Kapcsolat --- */}
          <section class="mb-10">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Kapcsolat
            </h2>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
              Kapcsolódó oldalak:
              {" "}
              <a href="/adatvedelmi-nyilatkozat" class="text-primary-600 dark:text-primary-400 hover:underline">
                Adatvédelmi nyilatkozat
              </a>
            </p>
          </section>

          <ContactMe />
        </div>
      </main>
      <Footer />
    </div>
  );
});
