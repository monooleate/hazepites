// content/toc.ts — Házépítési Kalauz tartalomjegyzék
// MASTER-05-HUB-KONCEPCIO-hazepites.md alapján
// Csak a kész (publikált) cikkek aktívak — a többi kikommentálva.

interface RawTableOfContents {
  label: string;
  content: Record<string, RawTableOfContentsEntry>;
}

interface RawTableOfContentsEntry {
  title: string;
  link?: string;
  pages?: Array<
    | [type: "page", id: string, title: string]
    | [type: "page", id: string, title: string, hidden: boolean]
    | [type: "subcategory", key: string]
  >;
  subcategories?: Record<string, RawTableOfContentsEntry>;
}

const toc: RawTableOfContents = {
  label: "hazepitesi-kalauz",
  content: {
    alapok: {
      title: "Alapok",
      pages: [
        // ["page", "miert-epitkezz", "Miért építkezz saját házat?"],
        // ["page", "hazepites-lepesrol-lepesre", "Házépítés lépésről lépésre"],
        // ["page", "hazepites-idovonal", "Házépítés időterv"],
        // ["page", "hazepites-gyik", "Házépítés GYIK"],
        // ["page", "hazepites-szotara", "Házépítés szótára"],
        // ["page", "hazepites-buktatoi", "Házépítés buktatói"],
        // ["page", "mdx-demo", "MDX Demo – Minden feature"],
      ],
    },
    haztipusok: {
      title: "Háztípusok",
      pages: [
        // ["page", "bevezetes", "Háztípusok bevezetés"],
        // ["page", "teglaepites", "Téglaépítés"],
        // ["page", "ytong-porotherm", "Ytong és Porotherm"],
        // ["page", "vasszerkezetes-haz", "Vázszerkezetes ház"],
        // ["page", "konnyuszerkezetes-haz", "Könnyűszerkezetes ház"],
        // ["page", "fahaz", "Faház"],
        // ["page", "passzivhaz", "Passzívház"],
        // ["page", "mobilhaz", "Mobilház"],
        // ["page", "modulhaz", "Modulház"],
        // ["page", "prefab-haz", "Prefab ház"],
        // ["page", "csaladihaztipusok", "Családi ház típusok"],
        // ["page", "tetofajtak", "Tetőfajták"],
        // ["page", "alapfajtak", "Alapozás típusai"],
        // ["page", "emeletessegek", "Szint- és emeletszám döntés"],
      ],
    },
    "haztipus-osszehasonlitasok": {
      title: "Háztípus összehasonlítások",
      pages: [
        ["page", "tegla-vs-ytong", "Tégla vs Ytong"],
        ["page", "tegla-vs-konnyuszerkezet", "Tégla vs könnyűszerkezet"],
        // ["page", "passzivhaz-vs-hagyomanyos", "Passzívház vs hagyományos"],
        // ["page", "fahaz-vs-tegla", "Faház vs tégla"],
        // ["page", "modulhaz-vs-hagyomanyos", "Modulház vs hagyományos"],
        // ["page", "prefab-vs-helyszini", "Prefab vs helyszíni építés"],
        // ["page", "egyszintes-vs-emeletes", "Egyszintes vs emeletes"],
        // ["page", "laposteto-vs-magasteto", "Lapostető vs magastető"],
        // ["page", "pince-vs-alaplemez", "Pince vs alaplemez"],
        // ["page", "kulcstarto-vs-generaleru", "Kulcsrakész vs generálkivitelezés"],
      ],
    },
    koltsegek: {
      title: "Költségek",
      pages: [
        ["page", "hazepites-koltseg-2026", "Házépítés költség 2026"],
        ["page", "negyzetmeter-ar", "Négyzetméter ár kalkuláció"],
        ["page", "alapozas-koltseg", "Alapozás költsége"],
        // ["page", "teto-koltseg", "Tető költsége"],
        // ["page", "gepeszet-koltseg", "Gépészet költsége"],
        // ["page", "villanyszereles-koltseg", "Villanyszerelés költsége"],
        // ["page", "belso-bururkolatok", "Belső burkolatok költsége"],
        // ["page", "kulso-burkolatok", "Külső burkolat és homlokzat"],
        ["page", "rejtett-koltsegek", "Rejtett költségek"],
        // ["page", "anyagarak", "Építőanyag árak"],
        // ["page", "munkadijterkep", "Munkadíj térkép"],
        // ["page", "arak-regiok-szerint", "Árak régiók szerint"],
        // ["page", "koltsegvetes-sablon", "Költségvetés sablon"],
        // ["page", "megtakaritas-tippek", "Megtakarítási tippek"],
        // ["page", "koltsegek-gyik", "Költségek GYIK"],
        // ["page", "ar-valtozasok", "Árváltozások és trendek"],
      ],
    },
    tamogatasok: {
      title: "Támogatások és finanszírozás",
      pages: [
        ["page", "csok-plusz", "CSOK Plusz"],
        ["page", "falusi-csok", "Falusi CSOK"],
        ["page", "babavaro-hitel", "Babaváró hitel"],
        // ["page", "zold-hitel", "Zöld hitel"],
        // ["page", "epitesi-hitel", "Építési hitel"],
        // ["page", "lakashitel-osszehasonlitas", "Lakáshitel összehasonlítás"],
        // ["page", "allami-tamogatasok", "Állami támogatások összefoglaló"],
        // ["page", "onkormanzati-tamogatasok", "Önkormányzati támogatások"],
        // ["page", "energetikai-palyazatok", "Energetikai pályázatok"],
        // ["page", "afa-visszaigenyeles", "ÁFA visszaigénylés"],
        // ["page", "hitelkalkulator", "Hitelkalkulátor"],
        // ["page", "tamogatas-kalkulator", "Támogatás kalkulátor"],
        // ["page", "finanszirozas-gyik", "Finanszírozás GYIK"],
        // ["page", "onero-szamitas", "Önerő számítás"],
      ],
    },
    energia: {
      title: "Energia és üzemeltetés",
      pages: [
        ["page", "hoszigeteles-tipusok", "Hőszigetelés típusok"],
        ["page", "futesrendszerek", "Fűtésrendszerek"],
        ["page", "napelem-rendszer", "Napelem rendszer"],
        // ["page", "hoszivattyuk", "Hőszivattyúk"],
        // ["page", "energetikai-tanusitvany", "Energetikai tanúsítvány"],
        // ["page", "okos-otthon", "Okos otthon megoldások"],
        // ["page", "nyilaszarok", "Nyílászárók választása"],
        // ["page", "szellozes", "Szellőzés és légtechnika"],
        // ["page", "vizgazdalkodas", "Vízgazdálkodás"],
        // ["page", "fenntarthato-anyagok", "Fenntartható anyagok"],
        // ["page", "rezsikoltseg-becsles", "Rezsiköltség becslés"],
        // ["page", "megujulo-energia-gyik", "Megújuló energia GYIK"],
        // ["page", "energia-megtakaritas", "Energia megtakarítás"],
        // ["page", "klima-es-hutesek", "Klíma és hűtés"],
      ],
    },
    tervezes: {
      title: "Tervezés",
      pages: [
        // ["page", "epitesz-valasztas", "Építész választás"],
        // ["page", "tervrajz-alapok", "Tervrajz alapok"],
        // ["page", "hazmeretezesi-utmutato", "Házméretezési útmutató"],
        // ["page", "alaprajz-tippek", "Alaprajz tippek"],
        // ["page", "telekvalasztas-hatasa", "Telek választás hatása a tervezésre"],
        // ["page", "engedely-folyamat", "Engedélyezési folyamat"],
        // ["page", "belsoepieszet", "Belsőépítészeti tervezés"],
        // ["page", "kert-es-kornyezet", "Kert és környezetrendezés"],
        // ["page", "tervezes-gyik", "Tervezés GYIK"],
        // ["page", "3d-tervezo-eszkozok", "3D tervező eszközök"],
      ],
    },
    jog: {
      title: "Jog és adminisztráció",
      pages: [
        // ["page", "epitesi-engedelyek", "Építési engedélyek"],
        // ["page", "egyszerusitett-bejelentes", "Egyszerűsített bejelentés"],
        // ["page", "epitesi-naplo", "Építési napló"],
        // ["page", "muhatosagi-ellenorzes", "Műhatósági ellenőrzés"],
        // ["page", "hasznalatbaveteli-engedly", "Használatbavételi engedély"],
        // ["page", "szomszedok-jogai", "Szomszédok jogai"],
        // ["page", "biztositas-epitkezeshez", "Biztosítás építkezéshez"],
        // ["page", "garancia-szavatossag", "Garancia és szavatosság"],
        // ["page", "jogszabalyok-gyik", "Jogszabályok GYIK"],
        // ["page", "szerzodes-mintak", "Szerződésminta útmutató"],
      ],
    },
    kivitelezes: {
      title: "Kivitelezés és szakemberek",
      pages: [
        ["page", "kivitelezo-valasztas", "Kivitelező választás"],
        ["page", "muszaki-ellenor", "Műszaki ellenőr"],
        // ["page", "generalkivitelezes", "Generálkivitelezés"],
        // ["page", "sajat-szervezesu-epites", "Saját szervezésű építés"],
        // ["page", "minosegellenorzes", "Minőségellenőrzés"],
        // ["page", "epitkezesi-hibalista", "Építkezési hibalista"],
        // ["page", "munkavédelem", "Munkavédelem"],
        // ["page", "kivitelezes-gyik", "Kivitelezés GYIK"],
      ],
    },
    telek: {
      title: "Telek és helyszín",
      pages: [
        ["page", "telekvalasztas", "Telekválasztás útmutató"],
        // ["page", "belterulet-kulterulet", "Belterület vs külterület"],
        // ["page", "kozmu-csatlakozas", "Közmű csatlakozás"],
        // ["page", "talajvizsgalat", "Talajvizsgálat"],
        // ["page", "telek-elokeszites", "Telek előkészítés"],
        // ["page", "telek-gyik", "Telek GYIK"],
      ],
    },
    gyik: {
      title: "Gyakori kérdések",
      pages: [
        // ["page", "mikor-kezdjek-epitkezni", "Mikor kezdjek építkezni?"],
        // ["page", "mennyi-ido-egy-hazepites", "Mennyi idő egy házépítés?"],
        // ["page", "mennyibe-kerul-2025-ben", "Mennyibe kerül 2025-ben?"],
        // ["page", "milyen-hazat-epitessek", "Milyen házat építtessek?"],
        // ["page", "epitkezem-vagy-vasarlok", "Építkezem vagy vásárlok?"],
        // ["page", "hogyan-valasszak-kivitelezot", "Hogyan válasszak kivitelezőt?"],
        // ["page", "kell-e-muszaki-ellenor", "Kell-e műszaki ellenőr?"],
        // ["page", "milyen-futesrendszert-valasszak", "Milyen fűtésrendszert válasszak?"],
        // ["page", "milyen-tamogatasokat-kaphatok", "Milyen támogatásokat kaphatok?"],
        // ["page", "energetikai-besorolas", "Energetikai besorolás mit jelent?"],
        // ["page", "epitesi-engedelyek-gyik", "Építési engedélyek GYIK"],
        // ["page", "garancia-kerdesek", "Garancia kérdések"],
      ],
    },
    eszkozok: {
      title: "Eszközök",
      pages: [
        // ["page", "hazepitesi-koltseg-kalkulator", "Házépítési költség kalkulátor"],
        // ["page", "hitel-kalkulator", "Hitelkalkulátor"],
        // ["page", "tamogatas-kalkulator", "Támogatás kalkulátor"],
        // ["page", "energia-kalkulator", "Energia kalkulátor"],
        // ["page", "negyzetmeter-ar-kalkulator", "Négyzetméter ár kalkulátor"],
        // ["page", "rezsi-kalkulator", "Rezsiköltség kalkulátor"],
        // ["page", "telekmeretezesi-kalkulator", "Telekméretezési kalkulátor"],
        // ["page", "megtakaritas-kalkulator", "Megtakarítás kalkulátor"],
      ],
    },
  },
};

export default toc;
