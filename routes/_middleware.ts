import type { FreshContext } from "fresh";
import { isAdsenseEnabled } from "../utils/features.ts";

/**
 * Kategória index → áttekintés oldal.
 * Minden kategória saját áttekintés oldalt kap (auto-generated a route-ban).
 * Nincs redirect — a sidebar "Áttekintés" linkek közvetlenül a kategória oldalra mutatnak.
 */
const CATEGORY_REDIRECTS: Record<string, string> = {
  // Minden kategória áttekintés oldalra megy – nincs redirect
};

export async function handler(ctx: FreshContext) {
  const url = new URL(ctx.req.url);
  const isProd = url.hostname !== "localhost" && url.hostname !== "127.0.0.1";

  // HTTPS + www redirect (production only)
  if (isProd) {
    if (url.protocol !== "https:" || url.hostname === "www.hazepitesikalauz.hu") {
      url.protocol = "https:";
      url.hostname = "hazepitesikalauz.hu";
      return new Response(null, {
        status: 301,
        headers: { Location: url.toString() },
      });
    }
  }

  // Remove trailing slash
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    return new Response(null, {
      status: 301,
      headers: { Location: url.toString() },
    });
  }

  // Category index redirects (e.g. /haztipusok → /haztipusok/teglaepites)
  const redirect = CATEGORY_REDIRECTS[url.pathname];
  if (redirect) {
    return new Response(null, {
      status: 301,
      headers: { Location: redirect },
    });
  }

  const resp = await ctx.next();

  // ── Security headers ──────────────────────────────────────────────
  resp.headers.set("X-Content-Type-Options", "nosniff");
  resp.headers.set("X-Frame-Options", "SAMEORIGIN");
  resp.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  resp.headers.set("X-DNS-Prefetch-Control", "on");
  resp.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // HSTS — 2 év, includeSubDomains, preload-ready
  if (isProd) {
    resp.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }

  // ── Content-Security-Policy ───────────────────────────────────────
  // AdSense: a hirdetés-domaineket CSAK akkor whitelisteljük, ha az
  // ADSENSE_ENABLED kapcsoló BE (utils/features.ts; default: BE). OFF esetén
  // a CSP szűk marad — nem hirdetjük az ad-infrát, amíg nincs bekapcsolva.
  const adsenseOn = isAdsenseEnabled();
  // 'unsafe-eval' kell az AdSense egyes kreatívjaihoz / a Funding Choices
  // consent-falhoz — csak akkor lazítunk, ha a hirdetés-réteg aktív.
  const adScript = adsenseOn
    ? " 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://fundingchoicesmessages.google.com https://www.googletagservices.com https://*.adtrafficquality.google"
    : "";
  const adConnect = adsenseOn
    ? " https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://fundingchoicesmessages.google.com https://*.adtrafficquality.google"
    : "";
  // A GDPR consent-fal (Funding Choices) Google Fonts stíluslapot + fontot tölt.
  const adStyle = adsenseOn ? " https://fonts.googleapis.com" : "";
  const adFont = adsenseOn ? " https://fonts.gstatic.com" : "";
  // Az AdSense reklám-iframe-ek + a consent-fal frame-jei. OFF esetén marad 'none'.
  const frameSrc = adsenseOn
    ? "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.adtrafficquality.google https://www.google.com"
    : "frame-src 'none'";

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com" +
    adScript,
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net" + adStyle,
    "img-src 'self' data: https:",
    "font-src 'self' data: https://cdn.jsdelivr.net" + adFont,
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com" +
    adConnect,
    frameSrc,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  // Az AdSense blob-alapú web workert használ — csak ekkor engedjük.
  if (adsenseOn) {
    csp.push("worker-src 'self' blob:");
  }
  resp.headers.set("Content-Security-Policy", csp.join("; "));

  // ── Cache headers ─────────────────────────────────────────────────
  const ext = url.pathname.split(".").pop()?.toLowerCase();
  if (ext && ["woff2", "woff", "ttf", "otf"].includes(ext)) {
    resp.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (ext && ["svg", "png", "jpg", "jpeg", "webp", "ico", "gif"].includes(ext)) {
    resp.headers.set("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
  } else if (ext && ["css", "js"].includes(ext) && url.pathname.includes("__frsh_c=")) {
    // Vite hashed assets — immutable
    resp.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (!ext || ext === url.pathname.split("/").pop()) {
    // HTML responses — rövid kliens cache, hosszabb CDN cache
    if (!resp.headers.has("Cache-Control")) {
      resp.headers.set("Cache-Control", "public, max-age=0, s-maxage=600, stale-while-revalidate=120");
    }
  }

  return resp;
}
