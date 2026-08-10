/**
 * features.ts — feature flag-ek központi kezelése (jelenleg: Google AdSense).
 *
 * A mathSeo projekt mintájára: a hirdetés-réteg egyetlen env kapcsolóval
 * vezérelhető, a tényleges placement-et (hova kerüljön / hova NE hirdetés)
 * pedig az AdSense fiók **Auto Ads** beállításai szabályozzák — NEM a kód.
 * Így nincs kézi `<ins class="adsbygoogle">` slot a kódban; az oldalt csak
 * fel kell készíteni a script + CSP szintjén.
 *
 * Az env-et SZERVER oldalon olvassuk (`Deno.env`). Az island-ek (kliens) nem
 * látják az env-et — ha kliens-oldali döntés kell, props-ként kell átadni.
 *
 * Használat:
 *   import { getAdsenseConfig, isAdsenseEnabled } from "../utils/features.ts";
 */

/** Elfogadott AdSense publisher ID formátum (ca-pub-<10–20 számjegy>). */
const ADSENSE_CLIENT_RE = /^ca-pub-\d{10,20}$/;

/** Default publisher ID — egyezik a `static/ads.txt`-ben rögzítettel. */
const ADSENSE_DEFAULT_CLIENT = "ca-pub-9658786113006303";

export interface AdsenseConfig {
  /** Betöltsük-e az AdSense scriptet és nyissuk-e a CSP-t az ad-domainekre? */
  enabled: boolean;
  /** A `<script src>`-be kerülő publisher ID (ca-pub-…). */
  clientId: string;
}

/**
 * Google AdSense (Auto Ads) konfiguráció.
 *
 * **Alapértelmezés: BE.** Az oldal verifikált, a hirdetés mehet — a
 * site-oldali teendő ezzel kész. A be/kikapcsolást ezután az AdSense fiókban
 * (Auto Ads) intézed; a kódhoz nem kell hozzányúlni.
 *
 * Kézi kill switch (pl. lokál dev tiszta konzolhoz): `ADSENSE_ENABLED=false`
 * (vagy `0` / `off`). Bármi más / üres / nincs definiálva → BE.
 *
 * A script CSAK akkor töltődik be, ha a client ID érvényes `ca-pub-…`
 * formátumú (injection-guard, mert az érték a `<script src>`-be kerül).
 * Ha a kapcsoló OFF, a `_middleware.ts` a CSP-t is szűken hagyja (nem
 * whitelisteli az ad-domaineket).
 */
export function getAdsenseConfig(): AdsenseConfig {
  const flag = Deno.env.get("ADSENSE_ENABLED")?.trim().toLowerCase();
  // Default ON: csak explicit, egyértelműen kikapcsoló érték állítja le.
  const switchedOn = flag !== "false" && flag !== "0" && flag !== "off";

  const rawClient = Deno.env.get("ADSENSE_CLIENT_ID")?.trim();
  const clientId = rawClient && rawClient.length > 0
    ? rawClient
    : ADSENSE_DEFAULT_CLIENT;
  const valid = ADSENSE_CLIENT_RE.test(clientId);

  return { enabled: switchedOn && valid, clientId };
}

/** Gyors boolean — kell-e az AdSense-réteg (script + CSP whitelist)? */
export function isAdsenseEnabled(): boolean {
  return getAdsenseConfig().enabled;
}

// ── Umami Analytics (ÖNHOSZTOLT) ─────────────────────────────────────────────
//
// Privacy-first, cookie-mentes látogatásmérés. Ugyanaz a minta mint az
// AdSense-nél: egy env kapcsoló + egy loader-URL. Ha BE, a <head>-be bekerül a
// tracker (routes/_app.tsx) — inline bootstrap NINCS —, és a _middleware.ts a CSP-t a
// loader origin-jével whitelisteli (script-src + connect-src). Ha OFF: nem
// töltődik be tracker, a CSP szűk marad.

/**
 * Elfogadott tracker loader-URL: https://<host>/<nev>.js
 * Injection-guard, mert az érték a `<script src>`-be kerül — nincs benne
 * idézőjel/szóköz/`>`. A host és a fájlnév változhat (a nevet szándékosan nem
 * `script.js`-nek hívjuk, mert azt az adblock-listák szűrik).
 */
const UMAMI_SRC_RE = /^https:\/\/[a-z0-9.-]+\/[A-Za-z0-9_.-]+\.js$/i;

/** Default loader — az ÖNHOSZTOLT Umami tracker (stats.jmeszaros.dev). A név nem a default
 *  `script.js`, mert azt az adblock-listák szűrik. */
const UMAMI_DEFAULT_SRC = "https://stats.jmeszaros.dev/sc.js";
/** A hazepitesikalauz.hu website-ja az Umamiban. */
const UMAMI_DEFAULT_WEBSITE_ID = "d05f5f5c-9fcb-44de-8882-24698affabbf";
/** Amely hostname-eken egyáltalán mérhet. A tracker PONTOS egyezést néz, ezért az apex
 *  MELLÉ a www is kell — különben a www-n némán nem mérnénk. */
const UMAMI_DEFAULT_DOMAINS = "hazepitesikalauz.hu,www.hazepitesikalauz.hu";

export interface UmamiConfig {
  /** Betöltsük-e a tracker scriptet és nyissuk-e a CSP-t a mérő-originre? */
  enabled: boolean;
  /** A `<script src>`-be kerülő loader URL. */
  src: string;
  /** A loader origin-je (CSP whitelisthez) — pl. https://stats.jmeszaros.dev */
  origin: string;
  /** Melyik Umami-website alá könyvelje a mérést. */
  websiteId: string;
  /** Vesszős hostname-lista (data-domains). */
  domains: string;
}

/**
 * Umami (ÖNHOSZTOLT, cookieless) analitika konfiguráció.
 *
 * **Alapértelmezés: BE.** Az oldal élesben mér — a site-oldali teendő ezzel
 * kész. Kézi kill switch (pl. lokál dev tiszta konzolhoz):
 * `UMAMI_ENABLED=false` (vagy `0` / `off`). Bármi más / üres / nincs → BE.
 *
 * A script CSAK akkor töltődik be, ha a loader-URL érvényes
 * `https://<host>/<nev>.js` formátumú (injection-guard). A CSP-be
 * kerülő origin ebből a URL-ből származik, így self-hosted / proxy domain
 * esetén is konzisztens marad.
 */
export function getUmamiConfig(): UmamiConfig {
  const flag = Deno.env.get("UMAMI_ENABLED")?.trim().toLowerCase();
  // Default ON: csak explicit, egyértelműen kikapcsoló érték állítja le.
  const switchedOn = flag !== "false" && flag !== "0" && flag !== "off";

  const rawSrc = Deno.env.get("UMAMI_SRC")?.trim();
  const src = rawSrc && rawSrc.length > 0 ? rawSrc : UMAMI_DEFAULT_SRC;
  const valid = UMAMI_SRC_RE.test(src);

  // origin a validált src-ből — érvénytelen src-nél nincs whitelist (enabled=false).
  let origin = "";
  if (valid) {
    try {
      origin = new URL(src).origin;
    } catch {
      origin = "";
    }
  }

  const websiteId = Deno.env.get("UMAMI_WEBSITE_ID")?.trim() || UMAMI_DEFAULT_WEBSITE_ID;
  return {
    enabled: switchedOn && valid && origin !== "" && websiteId !== "",
    src,
    origin,
    websiteId,
    domains: UMAMI_DEFAULT_DOMAINS,
  };
}

/** Gyors boolean — kell-e a mérő-réteg (script + CSP whitelist)? */
export function isUmamiEnabled(): boolean {
  return getUmamiConfig().enabled;
}

/** A mérő loader origin-je, ha a réteg aktív — különben üres string. */
export function getUmamiOrigin(): string {
  const cfg = getUmamiConfig();
  return cfg.enabled ? cfg.origin : "";
}
