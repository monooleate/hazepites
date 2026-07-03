/**
 * erdeireka-ads.ts — az erdeireka.hu "házon belüli" (house ad) hirdetési
 * kreatívok katalógusa + méret-definíciók + UTM link-helper.
 *
 * Ez a fájl KLIENS-BIZTOS: nincs benne `Deno.env` vagy más szerver-only API,
 * ezért az island-ek (ErdeirekaAnchor, ErdeirekaInterstitial) is importálhatják.
 * A szerver-oldali kapcsoló + kreatív-választó a `utils/erdeireka.ts`-ben él.
 *
 * Minden kreatívnak van egy `format`-ja (IAB-szabvány méret) és:
 *   - opcionális `img` (static/erdeireka/...) → ha van, KÉP renderelődik,
 *   - `headline`/`subline`/`cta` szöveges fallback → ha nincs kép.
 * Így Réka kész bannerek nélkül is azonnal éles (szöveges banner), a képeket
 * pedig bármikor be lehet dobni a static/erdeireka/ alá.
 */

/** IAB-szabvány banner-formátumok, amiket a site használ. */
export type ErdeirekaFormat =
  | "leaderboard" // 728×90  — felső/alsó sticky (desktop), cikk-közép
  | "mobile-banner" // 320×100 — felső/alsó sticky (mobil)
  | "rectangle" // 300×250 — sidebar (rövid), cikk-közép (mobil)
  | "large-rectangle" // 336×280 — cikk vége, popup
  | "half-page" // 300×600 — sidebar (TOC alatt, desktop)
  | "billboard"; // 970×250 — homepage szekció

/** Formátum → pixel-méret. A fix doboz CLS=0-t garantál (foglalt hely). */
export const ERDEIREKA_DIM: Record<ErdeirekaFormat, { w: number; h: number }> = {
  "leaderboard": { w: 728, h: 90 },
  "mobile-banner": { w: 320, h: 100 },
  "rectangle": { w: 300, h: 250 },
  "large-rectangle": { w: 336, h: 280 },
  "half-page": { w: 300, h: 600 },
  "billboard": { w: 970, h: 250 },
};

export interface ErdeirekaCreative {
  /** Egyedi azonosító (analytics + key). */
  id: string;
  /** Banner méret/formátum. */
  format: ErdeirekaFormat;
  /**
   * Kép forrás (static/erdeireka/...). Ha hiányzik → szöveges fallback.
   * A static/erdeireka/-ben szállított képek Réka bannerei — cseréld/bővítsd
   * bármikor (akár azonos fájlnévvel, akár a katalógusban átírva).
   */
  img?: string;
  /** 2× retina kép (opcionális, srcset-be kerül). */
  img2x?: string;
  /** Alt szöveg / aria-label (kötelező a kép-eléréshez). */
  alt: string;
  /** Súly a rotációhoz (default 1). Több azonos formátumú kreatív → A/B váltás. */
  weight?: number;
  /** Szöveges fallback fő sora (ha nincs `img`). */
  headline?: string;
  /** Szöveges fallback alsó sora. */
  subline?: string;
  /** CTA gomb felirat (default "Tovább →"). */
  cta?: string;
  /** Háttér-gradient kezdő színe (hex) a szöveges fallbackhez. */
  bgFrom?: string;
  /** Háttér-gradient záró színe (hex). */
  bgTo?: string;
  /** Kiemelő szín (CTA háttér, hex). */
  accent?: string;
}

/**
 * Az erdeireka.hu kreatív-katalógus.
 *
 * Jelenleg minden formátumhoz 1 kreatív tartozik (kép + szöveges fallback).
 * Rotációhoz adj hozzá több azonos `format`-ú tételt különböző `weight`-tel —
 * a `pickErdeirekaCreative()` súlyozottan választ.
 */
export const ERDEIREKA_CREATIVES: ErdeirekaCreative[] = [
  {
    id: "erd-leaderboard-1",
    format: "leaderboard",
    img: "/erdeireka/leaderboard-728x90.webp",
    img2x: "/erdeireka/leaderboard-728x90@2x.webp",
    alt: "Erdei Réka – erdeireka.hu",
    headline: "Erdei Réka",
    subline: "Fedezd fel a világom az erdeireka.hu-n",
    cta: "Látogass el →",
    bgFrom: "#6d28d9",
    bgTo: "#db2777",
    accent: "#f59e0b",
  },
  {
    id: "erd-mobile-1",
    format: "mobile-banner",
    img: "/erdeireka/mobile-320x100.webp",
    img2x: "/erdeireka/mobile-320x100@2x.webp",
    alt: "Erdei Réka – erdeireka.hu",
    headline: "Erdei Réka",
    subline: "erdeireka.hu",
    cta: "Tovább →",
    bgFrom: "#6d28d9",
    bgTo: "#db2777",
    accent: "#f59e0b",
  },
  {
    id: "erd-rectangle-1",
    format: "rectangle",
    img: "/erdeireka/rectangle-300x250.webp",
    img2x: "/erdeireka/rectangle-300x250@2x.webp",
    alt: "Erdei Réka – erdeireka.hu",
    headline: "Erdei Réka",
    subline: "Fedezd fel a világom",
    cta: "Látogass el →",
    bgFrom: "#6d28d9",
    bgTo: "#db2777",
    accent: "#f59e0b",
  },
  {
    id: "erd-large-rectangle-1",
    format: "large-rectangle",
    img: "/erdeireka/large-rectangle-336x280.webp",
    img2x: "/erdeireka/large-rectangle-336x280@2x.webp",
    alt: "Erdei Réka – erdeireka.hu",
    headline: "Erdei Réka",
    subline: "Fedezd fel a világom az erdeireka.hu-n",
    cta: "Látogass el →",
    bgFrom: "#6d28d9",
    bgTo: "#db2777",
    accent: "#f59e0b",
  },
  {
    id: "erd-half-page-1",
    format: "half-page",
    img: "/erdeireka/half-page-300x600.webp",
    img2x: "/erdeireka/half-page-300x600@2x.webp",
    alt: "Erdei Réka – erdeireka.hu",
    headline: "Erdei Réka",
    subline: "Fedezd fel a világom az erdeireka.hu-n",
    cta: "Látogass el →",
    bgFrom: "#6d28d9",
    bgTo: "#db2777",
    accent: "#f59e0b",
  },
  {
    id: "erd-billboard-1",
    format: "billboard",
    img: "/erdeireka/billboard-970x250.webp",
    img2x: "/erdeireka/billboard-970x250@2x.webp",
    alt: "Erdei Réka – erdeireka.hu",
    headline: "Erdei Réka",
    subline: "Fedezd fel a világom az erdeireka.hu-n",
    cta: "Látogass el →",
    bgFrom: "#6d28d9",
    bgTo: "#db2777",
    accent: "#f59e0b",
  },
];

/**
 * UTM-paraméterekkel kiegészített cél-URL.
 * Pure függvény (nincs Deno) — island-ből is hívható.
 *
 * @param base   alap cél-URL (pl. https://erdeireka.hu)
 * @param source placement-azonosító (utm_content), pl. "anchor-top"
 */
export function erdeirekaHref(base: string, source: string): string {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    // Érvénytelen base → ne dőljön el, adjuk vissza nyersen
    return base;
  }
  url.searchParams.set("utm_source", "hazepitesikalauz.hu");
  url.searchParams.set("utm_medium", "banner");
  url.searchParams.set("utm_campaign", "erdeireka");
  url.searchParams.set("utm_content", source);
  return url.toString();
}

/** Egy formátum vízszintes-e (rövid, széles)? → fallback layout döntés. */
export function isWideFormat(format: ErdeirekaFormat): boolean {
  const { w, h } = ERDEIREKA_DIM[format];
  return w / h >= 2.2;
}
