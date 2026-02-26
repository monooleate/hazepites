import type { FreshContext } from "fresh";

export async function handler(ctx: FreshContext) {
  const url = new URL(ctx.req.url);

  // HTTPS + www redirect (production only)
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
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

  const resp = await ctx.next();

  // Security headers
  resp.headers.set("X-Content-Type-Options", "nosniff");
  resp.headers.set("X-Frame-Options", "SAMEORIGIN");
  resp.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  resp.headers.set("X-DNS-Prefetch-Control", "on");
  resp.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Cache static assets (fonts, images, CSS, JS)
  const ext = url.pathname.split(".").pop()?.toLowerCase();
  if (ext && ["woff2", "woff", "ttf", "otf"].includes(ext)) {
    resp.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (ext && ["svg", "png", "jpg", "jpeg", "webp", "ico", "gif"].includes(ext)) {
    resp.headers.set("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
  } else if (ext && ["css", "js"].includes(ext) && url.pathname.includes("__frsh_c=")) {
    // Vite hashed assets — immutable
    resp.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return resp;
}
