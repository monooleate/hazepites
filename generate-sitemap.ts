/**
 * generate-sitemap.ts — Automatikus sitemap.xml generálás
 *
 * Futtatás: deno run -A generate-sitemap.ts
 * A build task automatikusan hívja.
 *
 * SEO best practices:
 * - XML Sitemap Protocol 0.9
 * - lastmod a frontmatter published_at/refreshed_at alapján
 * - changefreq és priority tartalom típus szerint
 * - Canonical URL-ek (https://hazepitesikalauz.hu/...)
 * - Maximum 50,000 URL / sitemap (bőven elég)
 */

import { TABLE_OF_CONTENTS } from "./data/docs.ts";
import { extract } from "@std/front-matter/yaml";

const DOMAIN = "https://hazepitesikalauz.hu";

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

async function getLastmod(filePath: string): Promise<string | undefined> {
  for (const ext of [".mdx", ".md"]) {
    try {
      const content = await Deno.readTextFile(`${filePath}${ext}`);
      const { attrs } = extract(content);
      const data = attrs as Record<string, unknown>;

      // refreshed_at > published_at > file stat
      const dateStr = (data.refreshed_at || data.published_at) as string | undefined;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return formatDate(d);
      }
    } catch {
      // file not found, try next extension
    }
  }
  return undefined;
}

function getCategoryPriority(slug: string): { changefreq: string; priority: string } {
  const category = slug.split("/")[0];

  // Eszközök (kalkulátorok) — magas prioritás, ritkán változik
  if (category === "eszkozok") {
    return { changefreq: "monthly", priority: "0.9" };
  }

  // Költségek, támogatások — gyakran frissülnek
  if (category === "koltsegek" || category === "tamogatasok") {
    return { changefreq: "weekly", priority: "0.8" };
  }

  // Alapok — pillar content, magas prioritás
  if (category === "alapok") {
    return { changefreq: "monthly", priority: "0.8" };
  }

  // Háztípusok, összehasonlítások — közepes-magas
  if (category === "haztipusok" || category === "haztipus-osszehasonlitasok") {
    return { changefreq: "monthly", priority: "0.7" };
  }

  // GYIK — közepes, ritkán változik
  if (category === "gyik") {
    return { changefreq: "monthly", priority: "0.6" };
  }

  // Minden más (energia, tervezés, jog, kivitelezés, telek)
  return { changefreq: "monthly", priority: "0.7" };
}

async function generateSitemap(): Promise<string> {
  const entries: SitemapEntry[] = [];
  const today = formatDate(new Date());

  // 1. Főoldal — legmagasabb prioritás
  entries.push({
    loc: DOMAIN,
    lastmod: today,
    changefreq: "weekly",
    priority: "1.0",
  });

  // 2. Kapcsolat oldal
  entries.push({
    loc: `${DOMAIN}/kapcsolat`,
    lastmod: today,
    changefreq: "yearly",
    priority: "0.3",
  });

  // 3. Tartalmi oldalak a TOC-ból
  for (const slug in TABLE_OF_CONTENTS) {
    const entry = TABLE_OF_CONTENTS[slug];
    if (entry.hidden) continue;

    const { changefreq, priority } = getCategoryPriority(slug);
    const lastmod = await getLastmod(entry.file);

    entries.push({
      loc: `${DOMAIN}${entry.href}`,
      lastmod: lastmod || today,
      changefreq,
      priority,
    });
  }

  // XML generálás
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${escapeXml(e.loc)}</loc>${
          e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ""
        }\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

// Main
const sitemap = await generateSitemap();
const outputPath = "static/sitemap.xml";
await Deno.writeTextFile(outputPath, sitemap);

const urlCount = (sitemap.match(/<url>/g) || []).length;
console.log(`✅ Sitemap generated: ${outputPath} (${urlCount} URLs)`);
