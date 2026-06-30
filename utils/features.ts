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
