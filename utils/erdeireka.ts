/**
 * erdeireka.ts — az erdeireka.hu house-ad réteg SZERVER-oldali vezérlése.
 *
 * Mintája a `utils/features.ts` (AdSense kapcsoló): egyetlen env-flag dönti el,
 * megjelenhet-e Réka hirdetése, és egy opcionális env adja a cél-URL-t. A
 * route-komponensek (`_app.tsx`, `[...slug].tsx`, `index.tsx`) SSR közben
 * hívják a `getErdeirekaConfig()` / `getErdeirekaSettings()` függvényeket, és a
 * kiválasztott kreatívot propként adják az island-eknek.
 *
 * Biztonsági alapértelmezés: ha `ERDEIREKA_ADS_ENABLED` nincs "true", minden
 * Réka-banner REJTVE marad (ugyanaz a "csendben kikapcsolt" elv, mint az
 * AdSense flagnél).
 *
 * FONTOS: ez a modul `Deno.env`-et olvas (függvényen belül), ezért NE importáld
 * island-ből. Az island-ek a kliens-biztos `data/erdeireka-ads.ts`-t használják
 * (típusok + `erdeirekaHref`), a kreatívot pedig propként kapják a szervertől.
 */

import {
  ERDEIREKA_CREATIVES,
  type ErdeirekaCreative,
  type ErdeirekaFormat,
} from "../data/erdeireka-ads.ts";
import erdeirekaConfigRaw from "../data/erdeireka-config.json" with {
  type: "json",
};

const DEFAULT_TARGET_URL = "https://erdeireka.hu";

export interface ErdeirekaConfig {
  /** Megjelenhetnek-e Réka hirdetései? (ERDEIREKA_ADS_ENABLED === "true") */
  enabled: boolean;
  /** Kattintási cél-URL (UTM nélkül; a `erdeirekaHref` teszi rá az UTM-et). */
  targetUrl: string;
}

/**
 * Az erdeireka.hu hirdetés-config kiolvasása az env-ből.
 *
 *   - ERDEIREKA_ADS_ENABLED === "true"  → bekapcsolva
 *   - ERDEIREKA_TARGET_URL              → cél-URL (default https://erdeireka.hu);
 *     csak http(s) URL-t fogadunk el (injection-guard, mert href-be kerül)
 */
export function getErdeirekaConfig(): ErdeirekaConfig {
  const enabled = Deno.env.get("ERDEIREKA_ADS_ENABLED") === "true";
  const raw = Deno.env.get("ERDEIREKA_TARGET_URL")?.trim();
  let targetUrl = DEFAULT_TARGET_URL;
  if (raw) {
    try {
      const u = new URL(raw);
      if (u.protocol === "https:" || u.protocol === "http:") {
        targetUrl = raw;
      }
    } catch {
      // érvénytelen URL → marad a default
    }
  }
  return { enabled, targetUrl };
}

/** Gyors boolean — kell-e a Réka-réteg? */
export function isErdeirekaAdsEnabled(): boolean {
  return getErdeirekaConfig().enabled;
}

/**
 * Egy adott formátumú kreatív kiválasztása (súlyozott rotációval).
 *
 * Több azonos formátumú tétel esetén a `weight` szerint választ; ha csak egy
 * van, azt adja. Ha nincs ilyen formátumú kreatív → null.
 *
 * SSR-ben fut: a kiválasztott kreatívot a szerver propként adja át az
 * island-eknek, így nincs kliens-oldali random → nincs hydration-mismatch.
 */
export function pickErdeirekaCreative(
  format: ErdeirekaFormat,
): ErdeirekaCreative | null {
  const pool = ERDEIREKA_CREATIVES.filter((c) => c.format === format);
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0];

  const totalWeight = pool.reduce((sum, c) => sum + (c.weight ?? 1), 0);
  let r = Math.random() * totalWeight;
  for (const c of pool) {
    r -= c.weight ?? 1;
    if (r <= 0) return c;
  }
  return pool[pool.length - 1];
}

/**
 * Megjelenés-beállítások (SSOT: data/erdeireka-config.json).
 * Mely felület jelenjen meg + időzítések.
 */
export interface ErdeirekaSettings {
  /** Sidebar (TOC alatt, desktop) house-ad be/ki. */
  sidebar: boolean;
  /** Cikk-vég (large-rectangle) house-ad be/ki. */
  inArticleEnd: boolean;
  /** Cikk-közép (2. H2 után, leaderboard) house-ad be/ki. */
  inArticleMid: boolean;
  /** Homepage szekció (billboard) house-ad be/ki. */
  homepage: boolean;
  /** Felső beúszó anchor banner megjelenjen-e. */
  anchorTop: boolean;
  /** Alsó beúszó anchor banner megjelenjen-e. */
  anchorBottom: boolean;
  /** Anchor késleltetett megjelenés (ms). */
  anchorShowDelayMs: number;
  /** Felugró popup (interstitial) be/ki. */
  interstitialEnabled: boolean;
  /** Popup csak ennyiedik oldalletöltéstől (session). */
  interstitialMinPageviews: number;
  /** Popup késleltetés a megjelenés előtt (ms). */
  interstitialDelayMs: number;
}

const DEFAULT_SETTINGS: ErdeirekaSettings = {
  sidebar: true,
  inArticleEnd: true,
  inArticleMid: true,
  homepage: true,
  anchorTop: false,
  anchorBottom: true,
  anchorShowDelayMs: 1200,
  interstitialEnabled: true,
  interstitialMinPageviews: 2,
  interstitialDelayMs: 4000,
};

/**
 * A config JSON kiolvasása defaultokkal. Hiányzó/rossz típusú mezőre a
 * DEFAULT_SETTINGS lép be — a JSON sosem tudja "elrontani" a rendert.
 */
export function getErdeirekaSettings(): ErdeirekaSettings {
  const raw = erdeirekaConfigRaw as {
    placements?: {
      sidebar?: { enabled?: unknown };
      inArticleEnd?: { enabled?: unknown };
      inArticleMid?: { enabled?: unknown };
    };
    anchor?: { top?: unknown; bottom?: unknown; showDelayMs?: unknown };
    interstitial?: {
      enabled?: unknown;
      minPageviews?: unknown;
      delayMs?: unknown;
    };
    homepage?: { enabled?: unknown };
  };
  const p = raw.placements ?? {};
  const a = raw.anchor ?? {};
  const i = raw.interstitial ?? {};
  const h = raw.homepage ?? {};
  const bool = (v: unknown, d: boolean) => typeof v === "boolean" ? v : d;
  const num = (v: unknown, d: number) =>
    typeof v === "number" && isFinite(v) ? v : d;
  return {
    sidebar: bool(p.sidebar?.enabled, DEFAULT_SETTINGS.sidebar),
    inArticleEnd: bool(p.inArticleEnd?.enabled, DEFAULT_SETTINGS.inArticleEnd),
    inArticleMid: bool(p.inArticleMid?.enabled, DEFAULT_SETTINGS.inArticleMid),
    homepage: bool(h.enabled, DEFAULT_SETTINGS.homepage),
    anchorTop: bool(a.top, DEFAULT_SETTINGS.anchorTop),
    anchorBottom: bool(a.bottom, DEFAULT_SETTINGS.anchorBottom),
    anchorShowDelayMs: num(a.showDelayMs, DEFAULT_SETTINGS.anchorShowDelayMs),
    interstitialEnabled: bool(
      i.enabled,
      DEFAULT_SETTINGS.interstitialEnabled,
    ),
    interstitialMinPageviews: num(
      i.minPageviews,
      DEFAULT_SETTINGS.interstitialMinPageviews,
    ),
    interstitialDelayMs: num(i.delayMs, DEFAULT_SETTINGS.interstitialDelayMs),
  };
}
