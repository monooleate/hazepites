import { page } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { define } from "../utils/state.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Általános Szerződési Feltételek – Házépítési Kalauz";
    ctx.state.description =
      "A Házépítési Kalauz weboldal használatának általános szerződési feltételei (ÁSZF).";
    ctx.state.cleanUrl = "https://hazepitesikalauz.hu/aszf";
    return page({});
  },
});

export default define.page<typeof handler>(function AszfPage() {
  return (
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Header />
      <main class="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">
          Általános Szerződési Feltételek (ÁSZF)
        </h1>
        <div class="prose-custom space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Hatályos: 2026. március 22.
          </p>

          {/* --- 1. Szolgáltató --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              1. A szolgáltató
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

          {/* --- 2. A szolgáltatás --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              2. A szolgáltatás leírása
            </h2>
            <p>
              A hazepitesikalauz.hu (a továbbiakban: Weboldal) egy ingyenes, nyilvánosan
              elérhető tájékoztató portál, amely házépítéssel kapcsolatos ismereteket,
              összehasonlításokat, kalkulátorokat és döntéstámogató tartalmakat közöl
              magyar nyelven.
            </p>
            <p class="mt-2">
              A Weboldal használata ingyenes, regisztrációhoz nem kötött.
            </p>
          </section>

          {/* --- 3. Tartalom jellege --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              3. A tartalom jellege és korlátai
            </h2>
            <p>
              A Weboldalon megjelenő cikkek, kalkulátorok, összehasonlítások és egyéb
              tartalmak <strong>kizárólag tájékoztató jellegűek</strong>. Nem minősülnek:
            </p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>jogi tanácsadásnak,</li>
              <li>pénzügyi vagy befektetési tanácsadásnak,</li>
              <li>műszaki tervezésnek vagy szakvéleménynek,</li>
              <li>építési engedélyezési dokumentációnak.</li>
            </ul>
            <p class="mt-2">
              A kalkulátorok becsléseket adnak, nem hivatalos árajánlatokat.
              Az árak, támogatási feltételek és jogszabályi hivatkozások tájékoztató
              jellegűek — a pontos feltételeket mindig az illetékes hatóságnál,
              pénzintézetnél vagy szakembernél ellenőrizd.
            </p>
          </section>

          {/* --- 4. Felhasználási feltételek --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              4. Felhasználási feltételek
            </h2>
            <p>
              A Weboldal használatával elfogadod az alábbi feltételeket:
            </p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>A tartalmat kizárólag személyes, nem kereskedelmi célra használod.</li>
              <li>
                A tartalom másolása, terjesztése, újrapublikálása vagy módosítása
                kizárólag az üzemeltető előzetes írásbeli engedélyével lehetséges.
              </li>
              <li>
                A Weboldal tartalmát nem használod fel megtévesztő, jogellenes vagy
                harmadik felek jogait sértő célra.
              </li>
            </ul>
          </section>

          {/* --- 5. Szellemi tulajdon --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              5. Szellemi tulajdon
            </h2>
            <p>
              A Weboldalon megjelenő szövegek, grafikák, SVG illusztrációk,
              kalkulátorok forráskódja, design elemek és az oldal szerkezete
              szerzői jogi védelem alatt állnak. A szerzői jogok jogosultja
              Mészáros János.
            </p>
            <p class="mt-2">
              Rövid idézés (hivatkozással) megengedett újságírói és oktatási célra,
              a szerzői jogi törvény keretei között.
            </p>
          </section>

          {/* --- 6. Külső hivatkozások --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              6. Külső hivatkozások
            </h2>
            <p>
              A Weboldal harmadik felek weboldalaira mutató hivatkozásokat tartalmaz
              (jogszabályok, statisztikai hivatalok, szakmai szervezetek, pénzintézetek).
              Ezek a hivatkozások tájékoztató jellegűek — az üzemeltető nem felel
              a külső oldalak tartalmáért, elérhetőségéért vagy adatkezelési
              gyakorlatáért.
            </p>
          </section>

          {/* --- 7. Felelősségkorlátozás --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              7. Felelősségkorlátozás
            </h2>
            <p>
              Az üzemeltető mindent megtesz a tartalom pontosságáért, de nem vállal
              felelősséget:
            </p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>a tartalom teljességéért, pontosságáért vagy aktualitásáért,</li>
              <li>
                a kalkulátorok eredményei és a valós költségek közötti eltérésért,
              </li>
              <li>
                a tartalom felhasználásából eredő közvetlen vagy közvetett károkért,
              </li>
              <li>
                a Weboldal átmeneti vagy tartós elérhetetlenségéből eredő hátrányokért.
              </li>
            </ul>
          </section>

          {/* --- 8. Ajánlatkérés --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              8. Ajánlatkérés és kapcsolatfelvétel
            </h2>
            <p>
              A Weboldalon elérhető kapcsolatfelvételi űrlap kizárólag kérdések,
              javaslatok és együttműködési megkeresések küldésére szolgál.
              Az űrlap használatával tudomásul veszed, hogy az üzemeltető
              az{" "}
              <a href="/adatvedelmi-nyilatkozat" class="text-primary-600 dark:text-primary-400 hover:underline">
                Adatvédelmi nyilatkozatban
              </a>{" "}
              leírtak szerint kezeli a megadott adatokat.
            </p>
          </section>

          {/* --- 9. ÁSZF módosítása --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              9. Az ÁSZF módosítása
            </h2>
            <p>
              Az üzemeltető fenntartja a jogot az ÁSZF egyoldalú módosítására.
              A módosítások a Weboldalon történő közzététellel lépnek hatályba.
              A felhasználó a Weboldal további használatával elfogadja
              a módosított feltételeket.
            </p>
          </section>

          {/* --- 10. Irányadó jog --- */}
          <section>
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              10. Irányadó jog és jogviták
            </h2>
            <p>
              A jelen ÁSZF-re a magyar jog az irányadó. Jogvita esetén a felek
              elsődlegesen békés úton kísérlik meg a rendezést. Ennek sikertelensége
              esetén a magyar bíróságok rendelkeznek joghatósággal.
            </p>
          </section>

          <p class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
            Kapcsolódó oldalak:{" "}
            <a href="/kapcsolat" class="text-primary-600 dark:text-primary-400 hover:underline">Impresszum</a>
            {" · "}
            <a href="/adatvedelmi-nyilatkozat" class="text-primary-600 dark:text-primary-400 hover:underline">Adatvédelmi nyilatkozat</a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
});
