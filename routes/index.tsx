import { page } from "fresh";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import { define } from "../utils/state.ts";
import { generateFullSchema } from "../utils/schema.ts";
import { CATEGORIES } from "../data/docs.ts";

// --- Dinamikus számok a tartalomjegyzékből (nem kézzel karbantartott) ---
const COUNT: Record<string, number> = {};
for (const c of CATEGORIES) COUNT[c.slug] = c.entries.length;

const CALC_COUNT = COUNT["eszkozok"] ?? 0;
const ARTICLE_COUNT = CATEGORIES
  .filter((c) => c.slug !== "eszkozok")
  .reduce((sum, c) => sum + c.entries.length, 0);
const TOPIC_COUNT = CATEGORIES.filter((c) => c.entries.length > 0).length;
const ARTICLE_ROUNDED = Math.floor(ARTICLE_COUNT / 10) * 10; // 81 -> 80

// --- FAQ a főoldalra (látható + schema, 1:1 szinkronban) ---
const HOME_FAQ = [
  {
    q: "Mennyibe kerül egy ház építése 2026-ban?",
    a:
      "Egy 100 m²-es, közepes kivitelezésű új ház 2026-ban nagyjából 42–58 millió forintba kerül, a háztípustól és a régiótól függően. A négyzetméterár téglaháznál 420–600 ezer Ft, könnyűszerkezetnél 380–520 ezer Ft körül mozog kulcsrakész szintig. Tervezz 15–20% tartalékkeretet, mert a túllépés nem kivétel, hanem szabály.",
  },
  {
    q: "Melyik a legolcsóbb háztípus?",
    a:
      "Belépő szinten a könnyűszerkezetes és a modulház a legkedvezőbb, gyorsabb építési idővel. Hosszú távon viszont a tégla tartósabb és jobb a hangszigetelése. A „legolcsóbb” mindig a te helyzetedtől függ: telek, beköltözési határidő, üzemeltetési költség és hitelképesség együtt dönt.",
  },
  {
    q: "Milyen állami támogatásokat vehetek igénybe 2026-ban?",
    a:
      "A legfontosabbak: CSOK Plusz (gyermekvállaláshoz kötött kamattámogatott hitel), Falusi CSOK preferált településeken, Babaváró hitel, valamint a zöld és energetikai hitelek. Ezek bizonyos feltételekkel kombinálhatók is. A pontos összeg a gyermekszámtól, a település típusától és a jövedelmi feltételektől függ.",
  },
  {
    q: "Kell műszaki ellenőr a házépítéshez?",
    a:
      "Engedélyköteles építkezésnél jogszabály írja elő, de generálkivitelezésnél magánemberként is erősen ajánlott. A műszaki ellenőr a te oldaladon áll: ellenőrzi a minőséget, igazolja a teljesítést és segít a pótmunka-vitákban. A díja (általában a kivitelezési összeg 1–3%-a) tipikusan sokszorosan megtérül.",
  },
  {
    q: "Mennyi idő egy házépítés a tervezéstől a beköltözésig?",
    a:
      "Reálisan 14–24 hónap: 3–6 hónap tervezés és engedélyeztetés, 8–14 hónap kivitelezés, plusz a használatbavétel. Könnyűszerkezetes és modulház gyorsabb lehet, a tégla lassabb a technológiai szünetek (kiszáradás) miatt. Az időjárás és az anyagbeszerzés is csúsztathat.",
  },
];

function generateHomeFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": HOME_FAQ.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };
}

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title = "Házépítési Kalauz | Független útmutató házépítőknek";
    ctx.state.description =
      "Készülsz házat építeni? Objektív összehasonlítások, költségkalkulátorok és szakértői útmutatók a legjobb döntéshez.";
    ctx.state.cleanUrl = "https://hazepitesikalauz.hu/";
    ctx.state.mainSchema = JSON.stringify(generateFullSchema(), null, 2).replace(/</g, "\\u003c");
    ctx.state.faqPageSchema = JSON.stringify(generateHomeFaqSchema(), null, 2).replace(/</g, "\\u003c");
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
    description: "Ft/m² tartományok, költségbecslések és régiós bontások — 2026-os adatokkal.",
  },
  {
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    title: "100% független",
    description: "Nem vagyunk kivitelező, ingatlaniroda vagy anyagkereskedő. Teljesen objektív.",
  },
];

interface CategoryCard {
  title: string;
  slug: string;
  href: string;
  description: string;
  bgLight: string;
  bgDark: string;
  textColor: string;
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    title: "Háztípusok",
    slug: "haztipusok",
    href: "/haztipusok",
    description: "Tégla, Ytong, könnyűszerkezet, passzívház, modul- és konténerház.",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-950/30",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Összehasonlítások",
    slug: "haztipus-osszehasonlitasok",
    href: "/haztipus-osszehasonlitasok",
    description: "Objektív párhuzamok háztípusok, technológiák és anyagok között.",
    bgLight: "bg-pink-50",
    bgDark: "dark:bg-pink-950/30",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  {
    title: "Költségek",
    slug: "koltsegek",
    href: "/koltsegek",
    description: "Négyzetméter árak, rejtett költségek, tételes bontás és kalkulátor.",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Támogatások",
    slug: "tamogatasok",
    href: "/tamogatasok",
    description: "CSOK Plusz, Falusi CSOK, zöld hitel, babaváró — minden egy helyen.",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-950/30",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Energia",
    slug: "energia",
    href: "/energia",
    description: "Hőszigetelés, fűtés, napelem, hőszivattyú és nyílászárók.",
    bgLight: "bg-orange-50",
    bgDark: "dark:bg-orange-950/30",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Kivitelezés",
    slug: "kivitelezes",
    href: "/kivitelezes",
    description: "Kivitelező választás, műszaki ellenőr, esztrich, gletteles, gépészet.",
    bgLight: "bg-teal-50",
    bgDark: "dark:bg-teal-950/30",
    textColor: "text-teal-600 dark:text-teal-400",
  },
  {
    title: "Tervezés",
    slug: "tervezes",
    href: "/tervezes",
    description: "Építész választás, alaprajz, tetőtér-beépítés — a tervezési szakasz.",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-950/30",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Telek",
    slug: "telek",
    href: "/telek",
    description: "Telekválasztás, közmű csatlakozás, talajvizsgálat és alapozás.",
    bgLight: "bg-sky-50",
    bgDark: "dark:bg-sky-950/30",
    textColor: "text-sky-600 dark:text-sky-400",
  },
  {
    title: "Jog",
    slug: "jog",
    href: "/jog",
    description: "Építési engedélyek, garancia, készház-szerződés buktatói.",
    bgLight: "bg-rose-50",
    bgDark: "dark:bg-rose-950/30",
    textColor: "text-rose-600 dark:text-rose-400",
  },
  {
    title: "Alapok",
    slug: "alapok",
    href: "/alapok",
    description: "Házépítés lépésről lépésre és a leggyakoribb buktatók.",
    bgLight: "bg-indigo-50",
    bgDark: "dark:bg-indigo-950/30",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Eszközök",
    slug: "eszkozok",
    href: "/eszkozok",
    description: "Költség-, hitel-, támogatás-, energia- és rezsikalkulátorok.",
    bgLight: "bg-cyan-50",
    bgDark: "dark:bg-cyan-950/30",
    textColor: "text-cyan-600 dark:text-cyan-400",
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Háztípusok": "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21",
  "Összehasonlítások": "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  "Költségek": "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "Támogatások": "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  "Energia": "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  "Kivitelezés": "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085",
  "Tervezés": "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10",
  "Telek": "M9 6.75V15m0-8.25a1.5 1.5 0 01-3 0V5.25a1.5 1.5 0 013 0m-3 0h12m-12 0a1.5 1.5 0 00-3 0V5.25a1.5 1.5 0 003 0m0 0V15m0 0a1.5 1.5 0 01-3 0V15a1.5 1.5 0 013 0m0 0v3.75m12-12V15m0-8.25a1.5 1.5 0 01-3 0V5.25a1.5 1.5 0 013 0m-3 0h0m3 0v3.75m0 0a1.5 1.5 0 01-3 0V11.25a1.5 1.5 0 013 0m0 0v3.75",
  "Jog": "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z",
  "Alapok": "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  "Eszközök": "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085",
};

const CALCULATORS = [
  {
    title: "Költségkalkulátor",
    description: "Becsüld meg a házad bekerülési költségét méret és háztípus alapján.",
    href: "/eszkozok/hazepitesi-koltseg-kalkulator",
    icon: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z",
  },
  {
    title: "Hitelkalkulátor",
    description: "Számold ki a havi törlesztőt és a teljes visszafizetést különböző hiteleknél.",
    href: "/eszkozok/hitel-kalkulator",
    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  },
  {
    title: "Támogatás kalkulátor",
    description: "Nézd meg, mekkora állami támogatásra lehetsz jogosult a helyzeted alapján.",
    href: "/eszkozok/tamogatas-kalkulator",
    icon: "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  },
  {
    title: "Energia kalkulátor",
    description: "Hasonlítsd össze a fűtési módok éves költségét és a megtérülésüket.",
    href: "/eszkozok/energia-kalkulator",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  {
    title: "Rezsikalkulátor",
    description: "Becsüld meg a havi üzemeltetési költséget szigetelés és fűtés szerint.",
    href: "/eszkozok/rezsi-kalkulator",
    icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
  },
];

const JOURNEY = [
  {
    label: "Még csak tervezek",
    description: "Hol kezdj? A folyamat lépésről lépésre, érthetően.",
    href: "/alapok/hazepites-lepesrol-lepesre",
    icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  },
  {
    label: "Háztípust választok",
    description: "Tégla, könnyűszerkezet, modul? Objektív összehasonlítások.",
    href: "/haztipus-osszehasonlitasok",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    label: "Költséget számolok",
    description: "Mibe kerül a te házad? Valós árak és kalkulátor.",
    href: "/koltsegek/hazepites-koltseg-2026",
    icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Kivitelezőt keresek",
    description: "Hogyan válassz megbízhatót? Mire figyelj a szerződésnél?",
    href: "/kivitelezes/kivitelezo-valasztas",
    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085",
  },
];

const FEATURED_ARTICLES = [
  {
    title: "Házépítés költség 2026",
    description: "Mennyibe kerül egy új ház 2026-ban? Négyzetméter árak, rejtett tételek, régiós különbségek — valós adatokkal.",
    href: "/koltsegek/hazepites-koltseg-2026",
    category: "Költségek",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  {
    title: "CSOK Plusz feltételek",
    description: "Ki jogosult, mennyit kaphatsz, milyen feltételekkel? A 2026-os CSOK Plusz minden részlete.",
    href: "/tamogatasok/csok-plusz",
    category: "Támogatások",
    categoryColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  {
    title: "Tégla vs könnyűszerkezet",
    description: "Tartós tégla vagy gyors könnyűszerkezet? Ár, hőszigetelés, hangszigetelés és építési idő szembeállítva.",
    href: "/haztipus-osszehasonlitasok/tegla-vs-konnyuszerkezet",
    category: "Összehasonlítás",
    categoryColor: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  },
  {
    title: "Hőszivattyúk",
    description: "Levegő-víz vagy talajszondás? Mekkora teljesítmény kell, mennyi a megtérülés napelemmel és anélkül?",
    href: "/energia/hoszivattyuk",
    category: "Energia",
    categoryColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  },
  {
    title: "Rejtett költségek",
    description: "Amit a kivitelezők nem mondanak el: váratlan tételek, pótmunkák és a 15-20%-os tartalék igazsága.",
    href: "/koltsegek/rejtett-koltsegek",
    category: "Költségek",
    categoryColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
  {
    title: "Kivitelező választás",
    description: "Hogyan találd meg a megbízható kivitelezőt? Mire figyelj a szerződésnél, milyen garanciákat kérj?",
    href: "/kivitelezes/kivitelezo-valasztas",
    category: "Kivitelezés",
    categoryColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
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
  { value: `${ARTICLE_ROUNDED}+`, label: "szakértői cikk" },
  { value: `${TOPIC_COUNT}`, label: "témakör" },
  { value: `${CALC_COUNT}`, label: "interaktív kalkulátor" },
  { value: "2026", label: "friss adatok" },
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
              {ARTICLE_ROUNDED}+ kutatott cikk, {CALC_COUNT} ingyenes kalkulátor és objektív
              összehasonlítások — hogy a legjobb döntést hozd az építkezésed minden lépésénél.
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
                href="/eszkozok/hazepitesi-koltseg-kalkulator"
                class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                </svg>
                Költségkalkulátor
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

      {/* Calculators */}
      <section class="py-20 bg-white dark:bg-slate-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-14">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Ingyenes kalkulátorok
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Számold ki a saját helyzetedre szabva — regisztráció nélkül, pár kattintással.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CALCULATORS.map((calc) => (
              <a
                key={calc.href}
                href={calc.href}
                class="group flex items-start gap-4 rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-slate-800/60 dark:to-slate-800/40 border border-primary-100 dark:border-slate-700/50 p-6 hover:border-primary-300 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-primary-100/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
              >
                <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-primary-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                  <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d={calc.icon} />
                  </svg>
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {calc.title}
                  </h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {calc.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / "Hol tartasz?" */}
      <section class="py-20 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-14">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Hol tartasz az építkezésben?
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Válaszd ki, hol állsz most — onnan indulunk tovább.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {JOURNEY.map((j, i) => (
              <a
                key={j.href}
                href={j.href}
                class="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
              >
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                    <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d={j.icon} />
                    </svg>
                  </div>
                  <span class="text-2xl font-extrabold text-slate-200 dark:text-slate-700">
                    {i + 1}
                  </span>
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {j.label}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {j.description}
                </p>
              </a>
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
              {TOPIC_COUNT} témakör, {ARTICLE_ROUNDED}+ cikk — a háztípusoktól a támogatásokig.
            </p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {CATEGORY_CARDS.map((cat) => (
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
                        {COUNT[cat.slug] ?? 0} cikk
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

      {/* FAQ */}
      <section class="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/50">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Gyakori kérdések
            </h2>
            <p class="text-lg text-slate-600 dark:text-slate-400">
              A leggyakrabban feltett kérdések — rövid, érthető válaszokkal.
            </p>
          </div>

          <div class="space-y-3">
            {HOME_FAQ.map((f) => (
              <details
                key={f.q}
                class="group rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 overflow-hidden"
              >
                <summary class="flex items-center justify-between gap-4 cursor-pointer px-6 py-4 font-semibold text-slate-900 dark:text-white list-none">
                  {f.q}
                  <svg class="w-5 h-5 shrink-0 text-primary-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div class="px-6 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.a}
                </div>
              </details>
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
