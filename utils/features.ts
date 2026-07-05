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

// ── Plausible Analytics ──────────────────────────────────────────────────────
//
// Privacy-first, cookie-mentes látogatásmérés. Ugyanaz a minta mint az
// AdSense-nél: egy env kapcsoló + egy loader-URL. Ha BE, a <head>-be bekerül a
// Plausible loader + init (routes/_app.tsx), és a _middleware.ts a CSP-t a
// loader origin-jével whitelisteli (script-src + connect-src). Ha OFF: nem
// töltődik be tracker, a CSP szűk marad.

/**
 * Elfogadott Plausible loader-URL: https://<host>/js/pa-<token>.js
 * (az új, site-token-alapú script formátum). Injection-guard, mert az érték a
 * `<script src>`-be kerül — nincs benne idézőjel/szóköz/`>`. A host változhat
 * (plausible.io vagy self-hosted / proxy domain).
 */
const PLAUSIBLE_SRC_RE = /^https:\/\/[a-z0-9.-]+\/js\/pa-[A-Za-z0-9_-]+\.js$/i;

/** Default loader — a hazepitesikalauz.hu-hoz tartozó Plausible script. */
const PLAUSIBLE_DEFAULT_SRC =
  "https://plausible.io/js/pa-XXm1zRAIJOZ1Ywf8Z4GkW.js";

export interface PlausibleConfig {
  /** Betöltsük-e a Plausible scriptet és nyissuk-e a CSP-t a domainre? */
  enabled: boolean;
  /** A `<script src>`-be kerülő loader URL. */
  src: string;
  /** A loader origin-je (CSP whitelisthez) — pl. https://plausible.io */
  origin: string;
}

/**
 * Plausible Analytics konfiguráció.
 *
 * **Alapértelmezés: BE.** Az oldal élesben mér — a site-oldali teendő ezzel
 * kész. Kézi kill switch (pl. lokál dev tiszta konzolhoz):
 * `PLAUSIBLE_ENABLED=false` (vagy `0` / `off`). Bármi más / üres / nincs → BE.
 *
 * A script CSAK akkor töltődik be, ha a loader-URL érvényes
 * `https://<host>/js/pa-<token>.js` formátumú (injection-guard). A CSP-be
 * kerülő origin ebből a URL-ből származik, így self-hosted / proxy domain
 * esetén is konzisztens marad.
 */
export function getPlausibleConfig(): PlausibleConfig {
  const flag = Deno.env.get("PLAUSIBLE_ENABLED")?.trim().toLowerCase();
  // Default ON: csak explicit, egyértelműen kikapcsoló érték állítja le.
  const switchedOn = flag !== "false" && flag !== "0" && flag !== "off";

  const rawSrc = Deno.env.get("PLAUSIBLE_SRC")?.trim();
  const src = rawSrc && rawSrc.length > 0 ? rawSrc : PLAUSIBLE_DEFAULT_SRC;
  const valid = PLAUSIBLE_SRC_RE.test(src);

  // origin a validált src-ből — érvénytelen src-nél nincs whitelist (enabled=false).
  let origin = "";
  if (valid) {
    try {
      origin = new URL(src).origin;
    } catch {
      origin = "";
    }
  }

  return { enabled: switchedOn && valid && origin !== "", src, origin };
}

/** Gyors boolean — kell-e a Plausible-réteg (script + CSP whitelist)? */
export function isPlausibleEnabled(): boolean {
  return getPlausibleConfig().enabled;
}

/** A Plausible loader origin-je, ha a réteg aktív — különben üres string. */
export function getPlausibleOrigin(): string {
  const cfg = getPlausibleConfig();
  return cfg.enabled ? cfg.origin : "";
}
