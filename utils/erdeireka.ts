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
  type ErdeirekaCampaignId,
  type ErdeirekaCreative,
  type ErdeirekaFormat,
} from "../data/erdeireka-ads.ts";
import erdeirekaConfigRaw from "../data/erdeireka-config.json" with {
  type: "json",
};

const DEFAULT_TARGET_URL = "https://erdeireka.hu";

/**
 * Kampány-alapértelmezések. A data/erdeireka-config.json `campaigns` blokkja
 * felülírja (súly + cél-URL + enabled); hiányzó/rossz mezőre ezek lépnek be.
 * `weight: 1 / 1` = 50-50 rotáció. Egy kampány kikapcsolása: `enabled: false`
 * vagy `weight: 0`.
 */
const DEFAULT_CAMPAIGNS: Record<
  ErdeirekaCampaignId,
  { weight: number; targetUrl: string }
> = {
  utazas: { weight: 1, targetUrl: "https://erdeireka.hu" },
  ingatlan: { weight: 1, targetUrl: "https://erdeireka.hu/dubai-okos-befektetes" },
};

export interface ErdeirekaConfig {
  /** Megjelenhetnek-e Réka hirdetései? (ERDEIREKA_ADS_ENABLED === "true") */
  enabled: boolean;
  /** A requestre kisorsolt aktív kampány (oldalletöltésenként egyszer). */
  campaign: ErdeirekaCampaignId;
  /** Kattintási cél-URL (UTM nélkül; a `erdeirekaHref` teszi rá az UTM-et). */
  targetUrl: string;
}

/** Csak http(s) URL-t fogadunk el (injection-guard, mert href-be kerül). */
function safeHttpUrl(raw: unknown, fallback: string): string {
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    const u = new URL(raw.trim());
    return (u.protocol === "https:" || u.protocol === "http:") ? raw.trim() : fallback;
  } catch {
    return fallback;
  }
}

interface CampaignDef {
  id: ErdeirekaCampaignId;
  weight: number;
  targetUrl: string;
}

/**
 * Az engedélyezett kampányok listája (súly + cél-URL), a config JSON
 * `campaigns` blokkjából, defaultokkal. Csak `enabled !== false` és `weight > 0`
 * kampányok kerülnek be. A `utazas` cél-URL-jét az `ERDEIREKA_TARGET_URL` env
 * felülírja (back-compat az egy-kampányos időkkel).
 */
function resolveCampaigns(): CampaignDef[] {
  const raw = (erdeirekaConfigRaw as {
    campaigns?: Record<string, {
      enabled?: unknown;
      weight?: unknown;
      targetUrl?: unknown;
    }>;
  }).campaigns ?? {};
  const envUtazasUrl = Deno.env.get("ERDEIREKA_TARGET_URL");

  const out: CampaignDef[] = [];
  for (const id of Object.keys(DEFAULT_CAMPAIGNS) as ErdeirekaCampaignId[]) {
    const def = DEFAULT_CAMPAIGNS[id];
    const cfg = raw[id] ?? {};
    if (cfg.enabled === false) continue;
    const weight = typeof cfg.weight === "number" && isFinite(cfg.weight) && cfg.weight > 0
      ? cfg.weight
      : (cfg.weight === undefined ? def.weight : 0);
    if (weight <= 0) continue;
    let targetUrl = safeHttpUrl(cfg.targetUrl, def.targetUrl);
    if (id === "utazas" && envUtazasUrl) targetUrl = safeHttpUrl(envUtazasUrl, targetUrl);
    out.push({ id, weight, targetUrl });
  }
  return out;
}

/**
 * Aktív kampány kisorsolása (súlyozott). OLDALLETÖLTÉSENKÉNT EGYSZER fut a
 * `getErdeirekaConfig()`-ból → az egész oldal ugyanazt a hirdetőt mutatja.
 * Ha nincs engedélyezett kampány → default `utazas`.
 */
function pickErdeirekaCampaign(): CampaignDef {
  const pool = resolveCampaigns();
  if (pool.length === 0) {
    return { id: "utazas", weight: 1, targetUrl: DEFAULT_TARGET_URL };
  }
  if (pool.length === 1) return pool[0];
  const total = pool.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of pool) {
    r -= c.weight;
    if (r <= 0) return c;
  }
  return pool[pool.length - 1];
}

/**
 * Az erdeireka.hu hirdetés-config kiolvasása az env-ből + kampány-sorsolás.
 *
 *   - ERDEIREKA_ADS_ENABLED === "true"  → bekapcsolva
 *   - ERDEIREKA_TARGET_URL              → a `utazas` kampány cél-URL-jét írja
 *     felül (default https://erdeireka.hu); csak http(s) URL-t fogadunk el
 *
 * A kampányt akkor is kisorsoljuk, ha a réteg ki van kapcsolva — így a
 * `targetUrl`/`campaign` mindig érvényes érték (a komponensek `enabled`-re
 * gate-elnek, a sorsolás mellékhatás-mentes).
 */
export function getErdeirekaConfig(): ErdeirekaConfig {
  const enabled = Deno.env.get("ERDEIREKA_ADS_ENABLED") === "true";
  const picked = pickErdeirekaCampaign();
  return { enabled, campaign: picked.id, targetUrl: picked.targetUrl };
}

/** Gyors boolean — kell-e a Réka-réteg? */
export function isErdeirekaAdsEnabled(): boolean {
  return getErdeirekaConfig().enabled;
}

/**
 * Egy adott formátumú + kampányú kreatív kiválasztása (súlyozott rotációval).
 *
 * A kampányt a `getErdeirekaConfig()` sorsolja oldalletöltésenként egyszer, és
 * a route-ok átadják ide → egy oldalon minden slot ugyanahhoz a hirdetőhöz
 * tartozik. Egy kampányon+formátumon belül több tétel esetén a `weight` dönt.
 * Ha nincs ilyen kreatív → null (a slot üresen marad).
 *
 * SSR-ben fut: a kiválasztott kreatívot a szerver propként adja át az
 * island-eknek, így nincs kliens-oldali random → nincs hydration-mismatch.
 *
 * @param campaign ha megadva, csak ehhez a kampányhoz tartozó kreatívok közül
 *                 választ; ha nincs → minden kampányból (back-compat).
 */
export function pickErdeirekaCreative(
  format: ErdeirekaFormat,
  campaign?: ErdeirekaCampaignId,
): ErdeirekaCreative | null {
  const pool = ERDEIREKA_CREATIVES.filter((c) =>
    c.format === format && (campaign === undefined || c.campaign === campaign)
  );
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
