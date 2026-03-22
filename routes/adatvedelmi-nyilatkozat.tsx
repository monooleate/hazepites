import { page } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { define } from "../utils/state.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Adatvédelmi nyilatkozat – Házépítési Kalauz";
    ctx.state.description =
      "A Házépítési Kalauz adatvédelmi és adatkezelési tájékoztatója a GDPR és az Infotv. előírásai szerint.";
    ctx.state.cleanUrl = "https://hazepitesikalauz.hu/adatvedelmi-nyilatkozat";
    return page({});
  },
});

export default define.page<typeof handler>(function AdatvedelmiPage() {
  return (
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main class="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Adatvédelmi nyilatkozat
        </h1>
        <div class="prose-custom space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Hatályos: 2026. március 22.
          </p>

          {/* --- Adatkezelő --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              1. Adatkezelő
            </h2>
            <p>
              <strong>Név:</strong> Mészáros János egyéni vállalkozó<br />
              <strong>Email:</strong>{" "}
              <a href="mailto:info@hazepitesikalauz.hu" class="text-primary-600 dark:text-primary-400 hover:underline">
                info@hazepitesikalauz.hu
              </a><br />
              <strong>Weboldal:</strong> hazepitesikalauz.hu
            </p>
          </section>

          {/* --- Kezelt adatok --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              2. Kezelt személyes adatok és jogalapjuk
            </h2>

            <h3 class="text-lg font-medium text-slate-800 dark:text-slate-200 mt-4 mb-2">
              2.1. Kapcsolatfelvételi űrlap
            </h3>
            <p>
              Az oldal kapcsolati űrlapján az alábbi adatokat gyűjtjük:
            </p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Email cím</strong> — a válaszadáshoz</li>
              <li><strong>Tárgy és üzenet</strong> — a megkeresés feldolgozásához</li>
            </ul>
            <p class="mt-2">
              <strong>Jogalap:</strong> az érintett hozzájárulása (GDPR 6. cikk (1) a) pont).
              Az adatokat kizárólag a megkeresés megválaszolására használjuk,
              majd legkésőbb 1 éven belül töröljük.
            </p>

            <h3 class="text-lg font-medium text-slate-800 dark:text-slate-200 mt-4 mb-2">
              2.2. Szerver naplók
            </h3>
            <p>
              A tárhelyszolgáltató (Cloudflare) automatikusan rögzíti a látogatók IP-címét,
              böngésző típusát és a meglátogatott oldalakat. Ezek az adatok anonim statisztikai
              célokat szolgálnak és nem kapcsolhatók össze konkrét személyekkel.
            </p>
            <p class="mt-2">
              <strong>Jogalap:</strong> az adatkezelő jogos érdeke (GDPR 6. cikk (1) f) pont)
              — a weboldal biztonságos működtetése.
            </p>

            <h3 class="text-lg font-medium text-slate-800 dark:text-slate-200 mt-4 mb-2">
              2.3. Sütik (cookie-k)
            </h3>
            <p>
              Az oldal kizárólag technikai sütiket használ (témaválasztás: sötét/világos mód).
              Ezek nem tartalmaznak személyes adatot és nem igényelnek hozzájárulást.
              Harmadik féltől származó analitikai vagy marketing sütiket nem használunk.
            </p>
          </section>

          {/* --- Adattovábbítás --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              3. Adattovábbítás
            </h2>
            <p>
              A kapcsolati űrlapon megadott adatokat a Resend email szolgáltatáson keresztül
              dolgozzuk fel. A szerver naplókat a Cloudflare, mint tárhelyszolgáltató kezeli.
              Személyes adatokat harmadik félnek nem értékesítünk és marketing célra nem
              továbbítjuk.
            </p>
          </section>

          {/* --- Érintetti jogok --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              4. Az érintett jogai
            </h2>
            <p>A GDPR alapján az alábbi jogok illetnek meg:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Hozzáférés joga</strong> — tájékoztatást kérhetsz a kezelt adataidról</li>
              <li><strong>Helyesbítés joga</strong> — kérheted adataid javítását</li>
              <li><strong>Törlés joga</strong> — kérheted adataid törlését</li>
              <li><strong>Tiltakozás joga</strong> — tiltakozhatsz az adatkezelés ellen</li>
              <li><strong>Adathordozhatóság joga</strong> — kérheted adataid géppel olvasható formátumban</li>
            </ul>
            <p class="mt-2">
              Jogaid gyakorlásához írj az{" "}
              <a href="mailto:info@hazepitesikalauz.hu" class="text-primary-600 dark:text-primary-400 hover:underline">
                info@hazepitesikalauz.hu
              </a>{" "}
              címre. A kérelmedre 30 napon belül válaszolunk.
            </p>
          </section>

          {/* --- Jogorvoslat --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              5. Jogorvoslat
            </h2>
            <p>
              Ha úgy érzed, hogy adataid kezelése jogellenes, panaszt tehetsz a Nemzeti
              Adatvédelmi és Információszabadság Hatóságnál (NAIH):
            </p>
            <p class="mt-2">
              <strong>NAIH</strong><br />
              Székhely: 1055 Budapest, Falk Miksa utca 9-11.<br />
              Postacím: 1363 Budapest, Pf. 9.<br />
              Telefon: +36 (1) 391-1400<br />
              Email:{" "}
              <a href="mailto:ugyfelszolgalat@naih.hu" class="text-primary-600 dark:text-primary-400 hover:underline">
                ugyfelszolgalat@naih.hu
              </a><br />
              Weboldal:{" "}
              <a href="https://www.naih.hu" class="text-primary-600 dark:text-primary-400 hover:underline" rel="noopener noreferrer" target="_blank">
                naih.hu
              </a>
            </p>
          </section>

          {/* --- Módosítás --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              6. Nyilatkozat módosítása
            </h2>
            <p>
              Az adatvédelmi nyilatkozatot bármikor módosíthatjuk. A módosítások
              a weboldalon történő közzététellel lépnek hatályba. Az aktuális
              változat mindig ezen az oldalon érhető el.
            </p>
          </section>

          <p class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
            Visszalépés: <a href="/kapcsolat" class="text-primary-600 dark:text-primary-400 hover:underline">Impresszum</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
});
