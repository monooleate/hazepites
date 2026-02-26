/**
 * Dinamikus sitemap.xml route — mindig friss, dev módban is működik.
 *
 * Prioritás/changefreq a kategória és a frontmatter lastmod alapján.
 * Cache: 1 óra CDN edge, 10 perc kliens (production-ben elég,
 * tartalom úgyis ritkán változik).
 */
import { TABLE_OF_CONTENTS } from "../data/docs.ts";
import { extract } from "@std/front-matter/yaml";

const DOMAIN = "https://hazepitesikalauz.hu";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

async function getLastmod(filePath: string): Promise<string | undefined> {
  for (const ext of [".mdx", ".md"]) {
    try {
      const url = new URL(`../${filePath}${ext}`, import.meta.url);
      const content = await Deno.readTextFile(url);
      const { attrs } = extract(content);
      const data = attrs as Record<string, unknown>;
      const dateStr = (data.refreshed_at || data.published_at) as string | undefined;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return formatDate(d);
      }
    } catch {
      // next extension
    }
  }
  return undefined;
}

function getCategoryMeta(slug: string): { changefreq: string; priority: string } {
  const category = slug.split("/")[0];
  if (category === "eszkozok") return { changefreq: "monthly", priority: "0.9" };
  if (category === "koltsegek" || category === "tamogatasok") return { changefreq: "weekly", priority: "0.8" };
  if (category === "alapok") return { changefreq: "monthly", priority: "0.8" };
  if (category === "haztipusok" || category === "haztipus-osszehasonlitasok") return { changefreq: "monthly", priority: "0.7" };
  if (category === "gyik") return { changefreq: "monthly", priority: "0.6" };
  return { changefreq: "monthly", priority: "0.7" };
}

export const handler = {
  async GET(): Promise<Response> {
    const today = formatDate(new Date());
    const urls: string[] = [];

    // Főoldal
    urls.push(entry(DOMAIN, today, "weekly", "1.0"));

    // Kapcsolat
    urls.push(entry(`${DOMAIN}/kapcsolat`, today, "yearly", "0.3"));

    // Tartalmi oldalak
    for (const slug in TABLE_OF_CONTENTS) {
      const e = TABLE_OF_CONTENTS[slug];
      if (e.hidden) continue;
      const { changefreq, priority } = getCategoryMeta(slug);
      const lastmod = await getLastmod(e.file);
      urls.push(entry(`${DOMAIN}${e.href}`, lastmod || today, changefreq, priority));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=600, s-maxage=3600",
        "X-Robots-Tag": "noindex",
      },
    });
  },
};

function entry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}
