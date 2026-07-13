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

/**
 * Kampány-azonosító. Egy kampány = egy hirdető/landing + saját banner-készlet.
 *   - "utazas"   → Erdei Réka utazás/életmód (erdeireka.hu)
 *   - "ingatlan" → Dubai okos ingatlan-befektetés (erdeireka.hu/dubai-okos-befektetes)
 *
 * A kampányok 50-50 (súlyozottan) váltakoznak: a `_middleware.ts` / `getErdeirekaConfig()`
 * OLDALLETÖLTÉSENKÉNT EGYSZER sorsol kampányt, így egy oldalon minden slot
 * ugyanazt a hirdetőt mutatja (koherens), és a split pontosan tartható.
 * A súlyt/be-ki a data/erdeireka-config.json `campaigns` blokkja adja.
 */
export type ErdeirekaCampaignId = "utazas" | "ingatlan";

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
  /** Melyik kampányhoz tartozik (rotáció + cél-URL + UTM). */
  campaign: ErdeirekaCampaignId;
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
 * Az erdeireka.hu kreatív-katalógus — KAMPÁNYONKÉNT csoportosítva.
 *
 * Két kampány fut 50-50-ben (lásd `ErdeirekaCampaignId`):
 *   - "utazas"   → Erdei Réka (a 6 eredeti kreatív, kép: static/erdeireka/*.webp)
 *   - "ingatlan" → Dubai okos befektetés (6 kreatív, kép: static/erdeireka/ingatlan/*.webp)
 *
 * A `pickErdeirekaCreative(format, campaign)` formátum ÉS kampány szerint szűr;
 * a kampányt a `getErdeirekaConfig()` sorsolja oldalletöltésenként egyszer.
 * Egy kampányon belül több azonos `format`-ú tétel = súlyozott (`weight`) A/B váltás.
 */
export const ERDEIREKA_CREATIVES: ErdeirekaCreative[] = [
  // ── Kampány: utazas (Erdei Réka) ──────────────────────────────────────────
  {
    id: "erd-leaderboard-1",
    campaign: "utazas",
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
    campaign: "utazas",
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
    campaign: "utazas",
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
    campaign: "utazas",
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
    campaign: "utazas",
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
    campaign: "utazas",
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

  // ── Kampány: ingatlan (Dubai okos befektetés) ───────────────────────────────
  //
  // KÉPEK: a Dubai "A"-bannerek (SVG, vektoros) a static/erdeireka/ingatlan/-ban,
  // az `img` mezőkben bekötve. SVG → nincs @2x (végtelenül skálázódik). Ha az
  // `img`-et törlöd, a szöveges fallback (headline/subline/cta) lép vissza.
  {
    id: "erd-ingatlan-leaderboard-1",
    campaign: "ingatlan",
    format: "leaderboard",
    img: "/erdeireka/ingatlan/a-leaderboard-728x90.svg",
    alt: "Dubai okos ingatlan-befektetés – erdeireka.hu",
    headline: "Dubai okos befektetés",
    subline: "Ingatlan, ami dolgozik helyetted",
    cta: "Tudj meg többet →",
    bgFrom: "#0b3d5c",
    bgTo: "#c99a3f",
    accent: "#f0c674",
  },
  {
    id: "erd-ingatlan-mobile-1",
    campaign: "ingatlan",
    format: "mobile-banner",
    img: "/erdeireka/ingatlan/a-mobile-320x100.svg",
    alt: "Dubai okos ingatlan-befektetés – erdeireka.hu",
    headline: "Dubai befektetés",
    subline: "Okos ingatlan",
    cta: "Tudj meg többet →",
    bgFrom: "#0b3d5c",
    bgTo: "#c99a3f",
    accent: "#f0c674",
  },
  {
    id: "erd-ingatlan-rectangle-1",
    campaign: "ingatlan",
    format: "rectangle",
    img: "/erdeireka/ingatlan/a-rectangle-300x250.svg",
    alt: "Dubai okos ingatlan-befektetés – erdeireka.hu",
    headline: "Dubai okos befektetés",
    subline: "Ingatlan, ami dolgozik helyetted",
    cta: "Tudj meg többet →",
    bgFrom: "#0b3d5c",
    bgTo: "#c99a3f",
    accent: "#f0c674",
  },
  {
    id: "erd-ingatlan-large-rectangle-1",
    campaign: "ingatlan",
    format: "large-rectangle",
    img: "/erdeireka/ingatlan/a-largerect-336x280.svg",
    alt: "Dubai okos ingatlan-befektetés – erdeireka.hu",
    headline: "Dubai okos befektetés",
    subline: "Ingatlan, ami dolgozik helyetted",
    cta: "Tudj meg többet →",
    bgFrom: "#0b3d5c",
    bgTo: "#c99a3f",
    accent: "#f0c674",
  },
  {
    id: "erd-ingatlan-half-page-1",
    campaign: "ingatlan",
    format: "half-page",
    img: "/erdeireka/ingatlan/a-halfpage-300x600.svg",
    alt: "Dubai okos ingatlan-befektetés – erdeireka.hu",
    headline: "Dubai okos befektetés",
    subline: "Ingatlan, ami dolgozik helyetted",
    cta: "Tudj meg többet →",
    bgFrom: "#0b3d5c",
    bgTo: "#c99a3f",
    accent: "#f0c674",
  },
  {
    id: "erd-ingatlan-billboard-1",
    campaign: "ingatlan",
    format: "billboard",
    img: "/erdeireka/ingatlan/a-billboard-970x250.svg",
    alt: "Dubai okos ingatlan-befektetés – erdeireka.hu",
    headline: "Dubai okos befektetés",
    subline: "Ingatlan, ami dolgozik helyetted az Emírségekben",
    cta: "Tudj meg többet →",
    bgFrom: "#0b3d5c",
    bgTo: "#c99a3f",
    accent: "#f0c674",
  },
];

/**
 * UTM-paraméterekkel kiegészített cél-URL.
 * Pure függvény (nincs Deno) — island-ből is hívható.
 *
 * @param base     alap cél-URL (pl. https://erdeireka.hu)
 * @param source   placement-azonosító (utm_content), pl. "anchor-top"
 * @param campaign kampány-azonosító (utm_campaign = "erdeireka-<campaign>");
 *                 ha nincs megadva → "erdeireka" (back-compat)
 */
export function erdeirekaHref(
  base: string,
  source: string,
  campaign?: ErdeirekaCampaignId,
): string {
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    // Érvénytelen base → ne dőljön el, adjuk vissza nyersen
    return base;
  }
  url.searchParams.set("utm_source", "hazepitesikalauz.hu");
  url.searchParams.set("utm_medium", "banner");
  url.searchParams.set("utm_campaign", campaign ? `erdeireka-${campaign}` : "erdeireka");
  url.searchParams.set("utm_content", source);
  return url.toString();
}

/** Egy formátum vízszintes-e (rövid, széles)? → fallback layout döntés. */
export function isWideFormat(format: ErdeirekaFormat): boolean {
  const { w, h } = ERDEIREKA_DIM[format];
  return w / h >= 2.2;
}
