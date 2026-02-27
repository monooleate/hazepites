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
    title: "Kutatott tartalom",
    description: "Szakértői cikkek valós adatokkal, forráshivatkozásokkal és esettanulmányokkal.",
  },
  {
    icon: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z",
    title: "Konkrét számok",
    description: "Ft/m\u00B2 tartományok, költségbecslések és régiós bontások — 2026-os adatokkal.",
  },
  {
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    title: "100% független",
    description: "Nem vagyunk kivitelező, ingatlaniroda vagy anyagkereskedő. Teljesen objektív.",
  },
];

const CATEGORIES = [
  {
    title: "Háztípusok",
    href: "/haztipusok",
    description: "Tégla, Ytong, könnyűszerkezet, passzívház és modulház részletesen.",
    color: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-950/30",
    textColor: "text-violet-600 dark:text-violet-400",
    articles: 1,
  },
  {
    title: "Összehasonlítások",
    href: "/haztipus-osszehasonlitasok",
    description: "Objektív párhuzamok háztípusok, technológiák és anyagok között.",
    color: "from-pink-500 to-pink-600",
    bgLight: "bg-pink-50",
    bgDark: "dark:bg-pink-950/30",
    textColor: "text-pink-600 dark:text-pink-400",
    articles: 2,
  },
  {
    title: "Költségek",
    href: "/koltsegek",
    description: "Négyzetméter árak, rejtett költségek, tételes bontás és kalkulátor.",
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
    articles: 5,
  },
  {
    title: "Támogatások",
    href: "/tamogatasok",
    description: "CSOK Plusz, Falusi CSOK, zöld hitel, babaváró — minden egy helyen.",
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-950/30",
    textColor: "text-amber-600 dark:text-amber-400",
    articles: 3,
  },
  {
    title: "Energia",
    href: "/energia",
    description: "Hőszigetelés, fűtésrendszer, napelem és hőszivattyú.",
    color: "from-orange-500 to-orange-600",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/30",
    textColor: "text-orange-600 dark:text-orange-400",
    articles: 3,
  },
  {
    title: "Kivitelezés",
    href: "/kivitelezes",
    description: "Kivitelező választás, műszaki ellenőr, minőségellenőrzés.",
    color: "from-teal-500 to-teal-600",
    bgLight: "bg-teal-50",
    bgDark: "dark:bg-teal-950/30",
    textColor: "text-teal-600 dark:text-teal-400",
    articles: 2,
  },
  {
    title: "Telek",
    href: "/telek",
    description: "Telekválasztás, belterület vs külterület, közmű csatlakozás.",
    color: "from-sky-500 to-sky-600",
    bgLight: "bg-sky-50",
    bgDark: "dark:bg-sky-950/30",
    textColor: "text-sky-600 dark:text-sky-400",
    articles: 1,
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Háztípusok": "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  "Összehasonlítások": "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  "Költségek": "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "Támogatások": "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  "Energia": "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  "Kivitelezés": "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085",
  "Telek": "M9 6.75V15m0-8.25a1.5 1.5 0 01-3 0V5.25a1.5 1.5 0 013 0m-3 0h12m-12 0a1.5 1.5 0 00-3 0V5.25a1.5 1.5 0 003 0m0 0V15m0 0a1.5 1.5 0 01-3 0V15a1.5 1.5 0 013 0m0 0v3.75m12-12V15m0-8.25a1.5 1.5 0 01-3 0V5.25a1.5 1.5 0 013 0m-3 0h0m3 0v3.75m0 0a1.5 1.5 0 01-3 0V11.25a1.5 1.5 0 013 0m0 0v3.75",
};

const FEATURED_ARTICLES = [
  {
    title: "Házépítés költség 2026",
    description: "Mennyibe kerül egy új ház 2026-ban? Négyzetméter árak, rejtett tételek, régiós különbségek — valós adatokkal.",
    href: "/koltsegek/hazepites-koltseg-2026",
    category: "Költségek",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  },
  {
    title: "CSOK Plusz feltételek",
    description: "Ki jogosult, mennyit kaphatsz, milyen feltételekkel? A 2026-os CSOK Plusz minden részlete.",
    href: "/tamogatasok/csok-plusz",
    category: "Támogatások",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    icon: "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  },
  {
    title: "Tégla vs Ytong",
    description: "Melyik falazat a jobb választás? Ár, hőszigetelés, tartósság és építési idő összehasonlítása.",
    href: "/haztipus-osszehasonlitasok/tegla-vs-ytong",
    category: "Összehasonlítás",
    categoryColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z",
  },
  {
    title: "Hőszigetelés típusok",
    description: "EPS, grafit EPS, kőzetgyapot, PIR — melyik a legjobb választás és mennyibe kerül?",
    href: "/energia/hoszigeteles-tipusok",
    category: "Energia",
    categoryColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  {
    title: "Rejtett költségek",
    description: "Amit a kivitelezők nem mondanak el: váratlan tételek, pótmunkák és a 15-20%-os tartalék igazsága.",
    href: "/koltsegek/rejtett-koltsegek",
    category: "Költségek",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    icon: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  },
  {
    title: "Kivitelező választás",
    description: "Hogyan találd meg a megbízható kivitelezőt? Mire figyelj a szerződésnél, milyen garanciákat kérj?",
    href: "/kivitelezes/kivitelezo-valasztas",
    category: "Kivitelezés",
    categoryColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Tájékozódj",
    description: "Olvasd el a háztípusok, költségek és támogatások cikkeit — építs döntési keretet.",
    icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  {
    number: "02",
    title: "Hasonlítsd össze",
    description: "Használd az összehasonlító cikkeinket és kalkulátorainkat, hogy a saját helyzetedre szabd.",
    icon: "M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  },
  {
    number: "03",
    title: "Dönts magabiztosan",
    description: "Válaszd ki a neked legjobb megoldást — az összehasonlítás, nem a reklám alapján.",
    icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
];

const STATS = [
  { value: "17+", label: "szakértői cikk" },
  { value: "7", label: "témakör" },
  { value: "2026", label: "friss adatok" },
  { value: "0 Ft", label: "teljesen ingyenes" },
];

export default define.page<typeof handler>(function HomePage() {
  return (
    <div class="min-h-screen flex flex-col">
      <Header active="/" />

      {/* Hero */}
      <section class="relative overflow-hidden">
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
                href="/koltsegek/hazepites-koltseg-2026"
                class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all"
              >
                Mibe kerül egy ház 2026-ban?
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a
                href="/koltsegek"
                class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Összes költség cikk
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust features */}
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

      {/* Stats bar */}
      <section class="py-12 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} class="text-center">
                <div class="text-3xl sm:text-4xl font-extrabold text-white mb-1">{s.value}</div>
                <div class="text-sm text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured articles */}
      <section class="py-20 bg-white dark:bg-slate-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-14">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Népszerű cikkek
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A legkeresettebb témák — valós adatokkal, esettanulmányokkal és szakértői elemzéssel.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_ARTICLES.map((article) => (
              <a
                key={article.href}
                href={article.href}
                class="group flex flex-col rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
              >
                {/* Top color bar */}
                <div class="h-1.5 bg-gradient-to-r from-primary-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                <div class="flex flex-col flex-1 p-6">
                  <div class="flex items-center gap-2 mb-3">
                    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${article.categoryColor}`}>
                      {article.category}
                    </span>
                  </div>
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {article.title}
                  </h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                    {article.description}
                  </p>
                  <div class="mt-4 flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                    Olvasd el
                    <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section class="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-14">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Hogyan segítünk?
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Nem mondunk meg mit csinálj — döntési keretet adunk, hogy magad tudd eldönteni.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map((step, i) => (
              <div key={step.number} class="relative text-center">
                {/* Connection line (desktop only) */}
                {i < STEPS.length - 1 && (
                  <div class="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-300 to-transparent dark:from-primary-700" />
                )}
                <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-primary-200 dark:border-primary-800 flex items-center justify-center shadow-sm">
                  <svg class="w-9 h-9 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d={step.icon} />
                  </svg>
                </div>
                <div class="text-xs font-bold text-primary-500 dark:text-primary-400 uppercase tracking-wider mb-2">
                  {step.number}. lépés
                </div>
                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section class="py-20 bg-white dark:bg-slate-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-14">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Fedezd fel a témákat
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              7 témakör, folyamatosan bővülő tartalom — a háztípusoktól a támogatásokig.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.title}
                href={cat.href}
                class="group relative overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <div class={`w-11 h-11 rounded-xl ${cat.bgLight} ${cat.bgDark} flex items-center justify-center shrink-0`}>
                    <svg class={`w-5.5 h-5.5 ${cat.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d={CATEGORY_ICONS[cat.title] || ""} />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {cat.title}
                      </h3>
                      <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {cat.articles} cikk
                      </span>
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
            Nézd meg, mennyibe kerül egy ház 2026-ban — és milyen támogatásokat kaphatsz hozzá.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/koltsegek/hazepites-koltseg-2026"
              class="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-xl"
            >
              Házépítés költségek 2026
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <a
              href="/tamogatasok/csok-plusz"
              class="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-500/20 text-white rounded-xl font-semibold hover:bg-primary-500/30 transition-colors border border-white/20"
            >
              CSOK Plusz feltételek
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
});
