import { define } from "../../utils/state.ts";

// ── Rate limiting (in-memory, per-IP) ──────────────────────────
const hits = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;       // max requests
const RATE_WINDOW = 600_000; // per 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// ── Validation helpers ─────────────────────────────────────────
function sanitize(s: string): string {
  return s.trim().replace(/<[^>]*>/g, "");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}

// ── Handler ────────────────────────────────────────────────────
export const handler = define.handlers({
  async POST(ctx) {
    // CORS / method
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://hazepitesikalauz.hu",
    };

    // Rate limit
    const ip = ctx.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
             ?? ctx.req.headers.get("cf-connecting-ip")
             ?? "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Túl sok üzenet. Próbáld újra 10 perc múlva." }),
        { status: 429, headers },
      );
    }

    // Parse body
    let body: Record<string, unknown>;
    try {
      body = await ctx.req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Érvénytelen kérés." }),
        { status: 400, headers },
      );
    }

    // Honeypot — if filled, it's a bot
    if (body.website) {
      // Pretend success so bots don't retry
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    const email   = sanitize(String(body.email ?? ""));
    const subject = sanitize(String(body.subject ?? ""));
    const message = sanitize(String(body.message ?? ""));

    // Validate
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Adj meg egy érvényes email címet." }),
        { status: 400, headers },
      );
    }
    if (!subject || subject.length < 2 || subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "A tárgy 2-200 karakter között legyen." }),
        { status: 400, headers },
      );
    }
    if (!message || message.length < 10 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Az üzenet 10-5000 karakter között legyen." }),
        { status: 400, headers },
      );
    }

    // ── Send via Resend ────────────────────────────────────────
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("[contact] RESEND_API_KEY not set");
      return new Response(
        JSON.stringify({ error: "Szerver hiba. Próbáld újra később." }),
        { status: 500, headers },
      );
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Házépítési Kalauz <info@hazepitesikalauz.hu>",
          to: "info@hazepitesikalauz.hu",
          reply_to: email,
          subject: `[Kapcsolat] ${subject}`,
          html: [
            `<h2 style="margin:0 0 16px">Új üzenet a hazepitesikalauz.hu-ról</h2>`,
            `<table style="border-collapse:collapse">`,
            `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">Feladó:</td><td>${email}</td></tr>`,
            `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">Tárgy:</td><td>${subject}</td></tr>`,
            `</table>`,
            `<hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0">`,
            `<div style="white-space:pre-wrap;line-height:1.6">${message}</div>`,
            `<hr style="margin:16px 0;border:none;border-top:1px solid #e2e8f0">`,
            `<p style="font-size:12px;color:#94a3b8">IP: ${ip}</p>`,
          ].join("\n"),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("[contact] Resend error:", res.status, err);
        return new Response(
          JSON.stringify({ error: "Nem sikerült elküldeni. Próbáld újra később." }),
          { status: 502, headers },
        );
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (err) {
      console.error("[contact] fetch error:", err);
      return new Response(
        JSON.stringify({ error: "Hálózati hiba. Próbáld újra később." }),
        { status: 502, headers },
      );
    }
  },
});
