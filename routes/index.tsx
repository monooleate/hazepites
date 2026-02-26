import { page } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { define } from "../utils/state.ts";
import { generateFullSchema } from "../utils/schema.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Házépítési Kalauz | Független útmutató házépítőknek";
    ctx.state.description =
      "Készülsz házat építeni? Objektív összehasonlítások, költségkalkulátorok és szakértői útmutatók a legjobb döntéshez.";
    ctx.state.cleanUrl = "https://hazepitesikalauz.hu/";
    ctx.state.mainSchema = JSON.stringify(generateFullSchema(), null, 2).replace(/</g, "\\u003c");
    return page({});
  },
});

const FEATURES = [
  {
    icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5",
    title: "Szakértői tudás",
    description: "120+ cikk, objektív elemzésekkel és gyakorlati tanácsokkal házépítőknek.",
  },
  {
    icon: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z",
    title: "Interaktív eszközök",
    description: "Kalkulátorok költség-, hitel- és energiahatékonysági számításokhoz.",
  },
  {
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    title: "100% független",
    description: "Nem vagyunk kivitelező, ingatlaniroda vagy anyagkereskedő. Teljesen objektív.",
  },
];

const CATEGORIES = [
  {
    title: "Alapok",
    href: "/alapok/hazepites-lepesrol-lepesre",
    description: "Házépítés lépésről lépésre — a döntéstől a kulcsátadásig.",
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-950/30",
    textColor: "text-blue-600 dark:text-blue-400",
    articles: 6,
    icon: "M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  },
  {
    title: "Háztípusok",
    href: "/haztipusok/bevezetes",
    description: "Tégla, Ytong, könnyűszerkezet, passzívház és modulház részletesen.",
    color: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-950/30",
    textColor: "text-violet-600 dark:text-violet-400",
    articles: 14,
    icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  },
  {
    title: "Összehasonlítások",
    href: "/haztipus-osszehasonlitasok/tegla-vs-ytong",
    description: "Objektív párhuzamok háztípusok, technológiák és anyagok között.",
    color: "from-pink-500 to-pink-600",
    bgLight: "bg-pink-50",
    bgDark: "dark:bg-pink-950/30",
    textColor: "text-pink-600 dark:text-pink-400",
    articles: 10,
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    title: "Költségek",
    href: "/koltsegek/hazepites-koltseg-2025",
    description: "Négyzetméter árak, rejtett költségek, tételes bontás és kalkulátor.",
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    articles: 16,
    icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Támogatások",
    href: "/tamogatasok/csok-plusz",
    description: "CSOK Plusz, Falusi CSOK, zöld hitel, babaváró — minden egy helyen.",
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-950/30",
    textColor: "text-amber-600 dark:text-amber-400",
    articles: 14,
    icon: "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  },
  {
    title: "Energia",
    href: "/energia/hoszigeteles-tipusok",
    description: "Hőszigetelés, fűtésrendszer, napelem és hőszivattyú.",
    color: "from-orange-500 to-orange-600",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/30",
    textColor: "text-orange-600 dark:text-orange-400",
    articles: 14,
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  {
    title: "Tervezés",
    href: "/tervezes/epitesz-valasztas",
    description: "Építész választás, alaprajz tervezés, engedélyezési folyamat.",
    color: "from-cyan-500 to-cyan-600",
    bgLight: "bg-cyan-50",
    bgDark: "dark:bg-cyan-950/30",
    textColor: "text-cyan-600 dark:text-cyan-400",
    articles: 10,
    icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z",
  },
  {
    title: "Jog",
    href: "/jog/epitesi-engedelyek",
    description: "Építési engedélyek, hatóságok, bejelentések és biztosítás.",
    color: "from-slate-500 to-slate-600",
    bgLight: "bg-slate-50",
    bgDark: "dark:bg-slate-800/50",
    textColor: "text-slate-600 dark:text-slate-400",
    articles: 10,
    icon: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z",
  },
  {
    title: "Eszközök",
    href: "/eszkozok/hazepitesi-koltseg-kalkulator",
    description: "Interaktív kalkulátorok: költség, hitel, energia, támogatás.",
    color: "from-indigo-500 to-indigo-600",
    bgLight: "bg-indigo-50",
    bgDark: "dark:bg-indigo-950/30",
    textColor: "text-indigo-600 dark:text-indigo-400",
    articles: 8,
    icon: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z",
  },
];

export default define.page<typeof handler>(function HomePage() {
  return (
    <div class="min-h-screen flex flex-col">
      <Header active="/" />

      {/* Hero */}
      <section class="relative overflow-hidden">
        {/* Background decoration */}
        <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary-400/10 to-transparent rounded-full blur-3xl" />
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-400/10 to-transparent rounded-full blur-3xl" />

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div class="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 mb-8">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span class="text-sm font-medium text-primary-700 dark:text-primary-300">Független tudástár magyar családoknak</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
              Építsd meg otthonod{" "}
              <span class="hero-gradient-text">magabiztosan</span>
            </h1>

            <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
              Objektív összehasonlítások, költségkalkulátorok és szakértői útmutatók
              — hogy a legjobb döntést hozd az építkezésed minden lépésénél.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/alapok/hazepites-lepesrol-lepesre"
                class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
              >
                Kezdd itt az útmutatót
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="/eszkozok/hazepitesi-koltseg-kalkulator"
                class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6z" />
                </svg>
                Költségkalkulátor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section class="relative py-20 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} class="text-center px-6">
                <div class="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-950/50 dark:to-emerald-950/50 border border-primary-100 dark:border-primary-900/50 flex items-center justify-center">
                  <svg class="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section class="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-14">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Fedezd fel a témákat
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              11 kategória, 120+ cikk — az alapoktól a kulcsátadásig minden, amit tudnod kell.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.title}
                href={cat.href}
                class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <div class={`w-11 h-11 rounded-xl ${cat.bgLight} ${cat.bgDark} flex items-center justify-center shrink-0`}>
                    <svg class={`w-5.5 h-5.5 ${cat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d={cat.icon} />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {cat.title}
                      </h3>
                      <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">{cat.articles} cikk</span>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Hover arrow */}
                <div class="absolute top-6 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="relative py-20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-900 dark:to-slate-900" />
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoNnptMC0zMHY2aC02VjRoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />

        <div class="relative max-w-3xl mx-auto text-center px-4 sm:px-6">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Nem tudod, hol kezdd?
          </h2>
          <p class="text-lg text-primary-100 mb-10 max-w-xl mx-auto">
            Az útmutatónk lépésről lépésre végigvezet a teljes házépítési folyamaton — az első ötlettől a kulcsátadásig.
          </p>
          <a
            href="/alapok/hazepites-lepesrol-lepesre"
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-xl"
          >
            Indulás az első lépéssel
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
});
