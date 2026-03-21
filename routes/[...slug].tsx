import { HttpError, page } from "fresh";
import { Partial } from "fresh/runtime";
import { SidebarCategory } from "../components/DocsSidebar.tsx";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import Breadcrumbs from "../components/Breadcrumbs.tsx";
import {
  CATEGORIES,
  TABLE_OF_CONTENTS,
  type TableOfContentsCategory,
  type TableOfContentsEntry,
} from "../data/docs.ts";
import { TableOfContents } from "../islands/TableOfContents.tsx";
import HeadUpdater from "../islands/HeadUpdater.tsx";
import CostCalculator from "../islands/CostCalculator.tsx";
import TamogatasCalculator from "../islands/TamogatasCalculator.tsx";
import RezsiCalculator from "../islands/RezsiCalculator.tsx";
import HitelCalculator from "../islands/HitelCalculator.tsx";
import EnergiaCalculator from "../islands/EnergiaCalculator.tsx";
import { define } from "../utils/state.ts";
import { generateBreadcrumbSchema } from "../utils/schema.ts";
import type { ComponentType } from "preact";

// Island registry — frontmatter "island" mező alapján renderelhető
const ISLAND_REGISTRY: Record<string, ComponentType> = {
  CostCalculator,
  TamogatasCalculator,
  RezsiCalculator,
  HitelCalculator,
  EnergiaCalculator,
};

// Category slugs for overview pages
const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

// Category descriptions for overview pages
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  alapok: "Házépítés előtt állsz? Itt találod az induláshoz szükséges alapismereteket.",
  haztipusok: "Tégla, könnyűszerkezet, fa, modul – melyik technológia illik hozzád?",
  "haztipus-osszehasonlitasok": "Háztípusok egymás mellé állítva: árak, előnyök, hátrányok objektíven.",
  koltsegek: "Négyzetméter árak, tételek, rejtett költségek – valós számokkal, 2026-os árakon.",
  tamogatasok: "CSOK Plusz, Babaváró, Zöld hitel, Falusi CSOK – feltételek és összegek egy helyen.",
  energia: "Hőszigetelés, fűtés, napelem – hogy a ház ne csak szép legyen, hanem olcsón is üzemeljen.",
  tervezes: "Építész választás, alaprajz, engedélyek – a tervezési szakasz lépésről lépésre.",
  jog: "Építési engedélyek, bejelentés, garancia – a jogi és adminisztrációs teendők.",
  kivitelezes: "Kivitelező választás, műszaki ellenőr, minőségellenőrzés – a megvalósítás szakasza.",
  telek: "Telekválasztás, közmű, talajvizsgálat – mire figyelj a helyszín kiválasztásánál.",
  gyik: "A leggyakrabban feltett kérdések házépítésről, rövid és érthető válaszokkal.",
  eszkozok: "Kalkulátorok és interaktív eszközök a házépítés tervezéséhez.",
};

interface Data {
  page: Page;
  isMDX: boolean;
  renderedHtml: string;
  headings: { id: string; html: string; level: number }[];
  islandName?: string;
  categoryOverview?: TableOfContentsCategory;
}

interface NavEntry {
  title: string;
  category?: string;
  href: string;
}

interface Page extends TableOfContentsEntry {
  markdown: string;
  data: Record<string, unknown>;
  prevNav?: NavEntry;
  nextNav?: NavEntry;
  headTitle: string;
  headDescription: string;
  headCanonical: string;
  headSchemas: Record<string, string>;
}

// Built route chunks live at _fresh/server/assets/*.mjs → 3 levels up to project root.
// Dev source lives at routes/[...slug].tsx → 1 level up to project root.
const _CONTENT_UP = import.meta.url.includes("_fresh") ? "../../../" : "../";

async function resolveContentFile(basePath: string): Promise<{ content: string; isMDX: boolean }> {
  for (const ext of [".mdx", ".md"]) {
    try {
      const url = new URL(`${_CONTENT_UP}${basePath}${ext}`, import.meta.url);
      const content = await Deno.readTextFile(url);
      return { content, isMDX: ext === ".mdx" };
    } catch {
      // next
    }
  }
  throw new Error(`Content file not found: ${basePath}`);
}

export const handler = define.handlers<Data>({
  async GET(ctx) {
    const slug = ctx.params.slug;

    // ── Category overview page ──
    if (CATEGORY_SLUGS.has(slug)) {
      const category = CATEGORIES.find((c) => c.slug === slug)!;
      ctx.state.title = `${category.title} | Házépítési Kalauz`;
      ctx.state.description = `${category.title} – cikkek, útmutatók és kalkulátorok a Házépítési Kalauzon.`;
      ctx.state.cleanUrl = `https://hazepitesikalauz.hu/${slug}`;

      return page({
        page: {
          slug,
          title: category.title,
          href: `/${slug}`,
          file: "",
          category: slug,
          markdown: "",
          data: {},
          headTitle: ctx.state.title ?? "",
          headDescription: ctx.state.description ?? "",
          headCanonical: ctx.state.cleanUrl ?? "",
          headSchemas: {},
        },
        isMDX: false,
        renderedHtml: "",
        headings: [],
        categoryOverview: category,
      });
    }

    // ── Regular article page ──
    const entry = TABLE_OF_CONTENTS[slug];
    if (!entry) throw new HttpError(404);

    const entryKeys = Object.keys(TABLE_OF_CONTENTS);
    const validEntries = entryKeys
      .map((key) => TABLE_OF_CONTENTS[key])
      .filter((e) => e.href && e.file);

    const idx = validEntries.findIndex((e) => e.slug === entry.slug);
    let nextNav: NavEntry | undefined;
    let prevNav: NavEntry | undefined;

    const prevEntry = validEntries[idx - 1];
    const nextEntry = validEntries[idx + 1];

    if (prevEntry) {
      const category = prevEntry.category ? TABLE_OF_CONTENTS[prevEntry.category]?.title ?? "" : "";
      prevNav = { title: prevEntry.title, category, href: prevEntry.href };
    }
    if (nextEntry) {
      const category = nextEntry.category ? TABLE_OF_CONTENTS[nextEntry.category]?.title ?? "" : "";
      nextNav = { title: nextEntry.title, category, href: nextEntry.href };
    }

    const breadcrumbSchema = generateBreadcrumbSchema(slug, TABLE_OF_CONTENTS);
    ctx.state.breadcrumbSchema = JSON.stringify(breadcrumbSchema, null, 2).replace(/</g, "\\u003c");

    let fileContent: string;
    let isMDX = false;
    try {
      const resolved = await resolveContentFile(entry.file);
      fileContent = resolved.content;
      isMDX = resolved.isMDX;
    } catch {
      throw new HttpError(404);
    }

    // Dynamic import: keeps the heavy markdown pipeline (marked, prismjs, katex)
    // out of this route chunk so it loads successfully on Deno Deploy.
    const { frontMatter: fm, renderMarkdown } = await import("../utils/markdown.ts");
    const { body, attrs } = fm<Record<string, unknown>>(fileContent);
    ctx.state.title = (attrs?.title as string) || `${entry.title} | Házépítési Kalauz`;
    ctx.state.description = (attrs?.description as string) || "Házépítési Kalauz — Független útmutató házépítőknek";
    ctx.state.keywords = attrs?.keywords as string | undefined;
    ctx.state.cleanUrl = ctx.url.href.split("?")[0];

    if (attrs?.articleSchema) {
      ctx.state.articleSchema = JSON.stringify(attrs.articleSchema, null, 2).replace(/</g, "\\u003c");
      // OG image from schema
      const img = (attrs.articleSchema as Record<string, unknown>)?.image as Record<string, string> | undefined;
      if (img?.url) ctx.state.ogImage = img.url;
    }

    if (attrs?.faqPageSchema) {
      const mainEntity = Object.keys(attrs.faqPageSchema as Record<string, unknown>)
        .filter((key) => key.startsWith("question"))
        .sort()
        .map((key) => {
          const matchResult = key.match(/\d+$/);
          const questionNumber = matchResult ? matchResult[0] : "";
          return {
            "@type": "Question",
            "name": (attrs.faqPageSchema as Record<string, string>)[key],
            "acceptedAnswer": {
              "@type": "Answer",
              "text": (attrs.faqPageSchema as Record<string, string>)[`answer${questionNumber}`],
            },
          };
        });
      const schema = { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": mainEntity };
      ctx.state.faqPageSchema = JSON.stringify(schema, null, 2).replace(/</g, "\\u003c");
    }

    if (attrs?.howToSchema) {
      const howTo = attrs.howToSchema as Record<string, unknown>;
      const steps = Object.keys(howTo)
        .filter((key) => key.startsWith("step"))
        .sort()
        .map((key) => ({
          "@type": (howTo[key] as Record<string, string>)["@type"],
          "name": (howTo[key] as Record<string, string>).name,
          "text": (howTo[key] as Record<string, string>).text,
        }));
      const schema = {
        "@context": (howTo as Record<string, string>)["@context"],
        "@type": (howTo as Record<string, string>)["@type"],
        "name": (howTo as Record<string, string>).name,
        "description": (howTo as Record<string, string>).description,
        "step": steps,
      };
      ctx.state.howToSchema = JSON.stringify(schema, null, 2).replace(/</g, "\\u003c");
    }

    if (attrs?.softwareSchema) {
      ctx.state.softwareSchema = JSON.stringify(attrs.softwareSchema, null, 2).replace(/</g, "\\u003c");
      if (!ctx.state.ogImage) {
        const img = (attrs.softwareSchema as Record<string, unknown>)?.image as Record<string, string> | undefined;
        if (img?.url) ctx.state.ogImage = img.url;
      }
    }

    // Render content: MDX or Markdown
    let renderedHtml: string;
    let headings: { id: string; html: string; level: number }[] = [];

    if (isMDX) {
      try {
        // Dynamic import: keeps the heavy MDX pipeline (acorn, @mdx-js/mdx, …)
        // out of this route chunk so the chunk loads successfully on Deno Deploy.
        const { renderMDX, extractHeadingsFromHtml } = await import("../utils/mdx.ts");
        const mdxResult = await renderMDX(body, slug);
        renderedHtml = mdxResult.html;
        headings = extractHeadingsFromHtml(renderedHtml);
        console.log(`[MDX OK] ${slug} — ${renderedHtml.length} chars, ${headings.length} headings`);
      } catch (e) {
        console.error("[MDX ERROR]", slug, e);
        // Fallback to markdown
        const result = renderMarkdown(body);
        renderedHtml = result.html;
        headings = result.headings;
        isMDX = false;
      }
    } else {
      const result = renderMarkdown(body);
      renderedHtml = result.html;
      headings = result.headings;
    }

    const islandName = (attrs?.island as string) || undefined;

    // Collect schema data for HeadUpdater (Partial navigation)
    const headSchemas: Record<string, string> = {};
    if (ctx.state.articleSchema) headSchemas.Article = ctx.state.articleSchema;
    if (ctx.state.faqPageSchema) headSchemas.FAQ = ctx.state.faqPageSchema;
    if (ctx.state.howToSchema) headSchemas.HowTo = ctx.state.howToSchema;
    if (ctx.state.softwareSchema) headSchemas.Software = ctx.state.softwareSchema;
    if (ctx.state.breadcrumbSchema) headSchemas.BreadCrumb = ctx.state.breadcrumbSchema;

    return page({
      page: {
        ...entry,
        markdown: body,
        data: attrs ?? {},
        prevNav,
        nextNav,
        headTitle: ctx.state.title ?? "",
        headDescription: ctx.state.description ?? "",
        headCanonical: ctx.state.cleanUrl ?? "",
        headSchemas,
      },
      isMDX,
      renderedHtml,
      headings,
      islandName,
    });
  },
});

export default define.page<typeof handler>(function DocsPage(props) {
  const { page: pageData, renderedHtml, headings, islandName, categoryOverview } = props.data;
  const { url } = props;
  const IslandComponent = islandName ? ISLAND_REGISTRY[islandName] : null;
  const refreshDate: Date | undefined = pageData.data.refreshed_at
    ? new Date(String(pageData.data.refreshed_at))
    : undefined;

  return (
    <div class="min-h-screen flex flex-col bg-white dark:bg-slate-950" f-client-nav={true}>
      <Header active={pageData.slug} showNav={true} showSidebarToggle={true} headings={categoryOverview ? undefined : headings} />

      {/* Mobile sidebar — checkbox + overlay (controlled from header toggle button) */}
      <input type="checkbox" class="hidden toggle" id="docs_sidebar" />
      <MobileSidebar url={url.toString()} />

      <div class="flex-1 flex">
        {/* Desktop Sidebar — collapsible with CSS checkbox */}
        <input type="checkbox" id="sidebar-collapse" class="hidden peer/sidebar" />
        {/* Sidebar panel */}
        <aside class="hidden lg:flex peer-checked/sidebar:!hidden flex-col w-72 xl:w-80 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-all duration-300">
          <div class="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
            {/* Collapse button at top of sidebar */}
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Navigáció</span>
              <label
                for="sidebar-collapse"
                class="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                title="Menü elrejtése"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                </svg>
              </label>
            </div>
            <nav>
              {CATEGORIES.map((category) => (
                <SidebarCategory
                  key={category.title}
                  category={category}
                  url={url.toString()}
                />
              ))}
            </nav>
          </div>
        </aside>
        {/* Sidebar restore button — shown when sidebar is collapsed */}
        <div class="hidden peer-checked/sidebar:lg:flex items-start">
          <label
            for="sidebar-collapse"
            class="sticky top-20 ml-2 mt-4 p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title="Menü megjelenítése"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </label>
        </div>

        {/* Main Content — Partial wrapper for client-side navigation */}
        <Partial name="docs-main">
          {/* HeadUpdater: frissíti a <head>-et és a navigáció aktív állapotát Partial swap után */}
          <HeadUpdater
            title={pageData.headTitle}
            description={pageData.headDescription}
            canonical={pageData.headCanonical}
            schemas={pageData.headSchemas}
            headings={categoryOverview ? [] : headings}
          />

          {categoryOverview ? (
            /* ── Category Overview Page ── */
            <div class="flex-1 min-w-0">
              <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 xl:px-16 py-8 max-w-4xl mx-auto w-full">
                <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3 leading-tight">
                  {categoryOverview.title}
                </h1>
                <p class="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  {CATEGORY_DESCRIPTIONS[categoryOverview.slug] ?? "Az alábbi cikkek és útmutatók segítenek eligazodni a témában."}
                </p>

                {categoryOverview.slug === "eszkozok" ? (
                  /* ── Eszközök: rich card grid ── */
                  <EszkozokGrid entries={categoryOverview.entries as TableOfContentsEntry[]} />
                ) : categoryOverview.entries.length === 0 ? (
                  /* ── Üres kategória ── */
                  <div class="p-8 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 text-center">
                    <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto mb-4">
                      <svg class="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">Hamarosan</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      A tartalom előkészítés alatt áll. Nézz vissza később, vagy böngészd a többi kategóriát.
                    </p>
                  </div>
                ) : (
                  <div class="grid gap-3">
                    {categoryOverview.entries.map((entry) => {
                      if ("entries" in entry) return null;
                      const e = entry as TableOfContentsEntry;
                      return (
                        <a
                          key={e.href}
                          href={e.href}
                          class="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md bg-white dark:bg-slate-900/50 transition-all"
                        >
                          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/40 shrink-0">
                            <svg class="w-5 h-5 text-primary-500 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          </div>
                          <span class="text-base font-medium text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {e.title}
                          </span>
                          <svg class="w-4 h-4 ml-auto text-slate-400 dark:text-slate-500 group-hover:text-primary-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </a>
                      );
                    })}
                  </div>
                )}
              </main>
            </div>
          ) : (
            /* ── Regular Article Page ── */
            <div class="flex-1 min-w-0 flex">
              {/* Article */}
              <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 xl:px-16 py-8 max-w-4xl mx-auto w-full">
                {/* Breadcrumbs */}
                <div class="mb-6">
                  <Breadcrumbs slug={pageData.slug} />
                </div>

                {/* Title */}
                <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
                  {pageData.data.title as string ?? pageData.title}
                </h1>

                {/* Island component (kalkulátor, eszköz stb.) — a cím után, tartalom előtt */}
                {IslandComponent && <IslandComponent />}

                {/* Content */}
                <article
                  class="markdown-body"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />

                {/* Refresh date */}
                {refreshDate && (
                  <div class="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    <span>Frissítve:</span>
                    <time>
                      {refreshDate.toLocaleDateString("hu-HU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                )}

                {/* Prev / Next navigation */}
                <nav class="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <div class="grid sm:grid-cols-2 gap-4">
                    {pageData.prevNav ? (
                      <a
                        href={pageData.prevNav.href}
                        class="group flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
                      >
                        <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                          Előző
                        </span>
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {pageData.prevNav.title}
                        </span>
                      </a>
                    ) : <div />}
                    {pageData.nextNav ? (
                      <a
                        href={pageData.nextNav.href}
                        class="group flex flex-col items-end text-right p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
                      >
                        <span class="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                          Következő
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </span>
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {pageData.nextNav.title}
                        </span>
                      </a>
                    ) : <div />}
                  </div>
                </nav>
              </main>

              {/* Desktop Table of Contents */}
              <aside class="hidden xl:block w-64 shrink-0">
                <div class="sticky top-20 py-8 pr-4">
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            </div>
          )}
        </Partial>
      </div>

      <Footer />
    </div>
  );
});

/**
 * Mobile sidebar overlay — a checkbox #docs_sidebar vezérli (header toggle gombból).
 * Az overlay-re kattintás bezárja a sidebar-t.
 */
// ── Eszközök gazdagabb áttekintés grid ──
const ESZKOZ_META: Record<string, { icon: string; description: string; color: string }> = {
  "eszkozok/hazepitesi-koltseg-kalkulator": {
    icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z",
    description: "Becsüld meg a teljes építési költséget technológia, méret, régió és minőségi szint alapján, tételes bontással.",
    color: "from-blue-500 to-blue-600",
  },
  "eszkozok/hitel-kalkulator": {
    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
    description: "Számold ki a havi törlesztőt piaci hitelre, CSOK Plusz-ra, Zöld hitelre vagy Babaváróra.",
    color: "from-emerald-500 to-emerald-600",
  },
  "eszkozok/tamogatas-kalkulator": {
    icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    description: "CSOK Plusz, Falusi CSOK és Babaváró kombináció – mennyi kedvezményes forrásra számíthatsz?",
    color: "from-amber-500 to-amber-600",
  },
  "eszkozok/energia-kalkulator": {
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    description: "Becsüld meg a házad energetikai besorolását: szigetelés, nyílászárók, fűtés és napelem alapján.",
    color: "from-green-500 to-green-600",
  },
  "eszkozok/rezsi-kalkulator": {
    icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z",
    description: "Fűtési rendszer, szigetelés és napelem hatása a havi rezsire – éves és havi bontásban.",
    color: "from-orange-500 to-orange-600",
  },
};

function EszkozokGrid({ entries }: { entries: TableOfContentsEntry[] }) {
  // Planned tools that don't exist yet
  const plannedTools = [
    { slug: "negyzetmeter-ar-kalkulator", title: "Négyzetméter ár kalkulátor", description: "Négyzetméterár kalkuláció régiók és technológiák szerint.", icon: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" },
    { slug: "telekmeretezesi-kalkulator", title: "Telekméretezési kalkulátor", description: "Mekkora telekre van szükség a tervezett házadhoz?", icon: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" },
    { slug: "megtakaritas-kalkulator", title: "Megtakarítás kalkulátor", description: "Mennyi időbe telik összegyűjteni az önerőt a házadhoz?", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" },
  ];

  return (
    <div>
      {/* Active tools */}
      <div class="grid gap-4 sm:grid-cols-2">
        {entries.map((entry) => {
          if ("entries" in entry) return null;
          const e = entry as TableOfContentsEntry;
          const meta = ESZKOZ_META[e.slug];
          return (
            <a
              key={e.href}
              href={e.href}
              class="group relative flex flex-col p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg bg-white dark:bg-slate-900/50 transition-all"
            >
              <div class={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${meta?.color ?? "from-primary-500 to-primary-600"} mb-3 shadow-md`}>
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d={meta?.icon ?? "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H18v-.008zm0 2.25h.008v.008H18V13.5zM9.75 9h4.5m-4.5 0a2.002 2.002 0 01-2.039-1.5M9.75 9c0 .896-.393 1.7-1.016 2.25M9.75 9h4.5m0 0c0 .896.393 1.7 1.016 2.25m-5.516 0c-.907.672-1.484 1.73-1.484 2.917 0 2 1.625 3.625 3.625 3.625h.75m-2.891-6.542A2.994 2.994 0 009.75 9m5.516 2.25c.907.672 1.484 1.73 1.484 2.917 0 2-1.625 3.625-3.625 3.625h-.75"} />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                {e.title}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 flex-1">
                {meta?.description ?? "Interaktív kalkulátor a házépítés megtervezéséhez."}
              </p>
              <div class="mt-3 flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                <span>Megnyitás</span>
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </a>
          );
        })}
      </div>

      {/* Planned tools – hamarosan */}
      {plannedTools.length > 0 && (
        <div class="mt-10">
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Hamarosan</h2>
          <div class="grid gap-3 sm:grid-cols-3">
            {plannedTools.map((tool) => (
              <div
                key={tool.slug}
                class="relative flex flex-col p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 mb-2">
                  <svg class="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d={tool.icon} />
                  </svg>
                </div>
                <h3 class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {tool.title}
                </h3>
                <p class="text-xs text-slate-400 dark:text-slate-500">
                  {tool.description}
                </p>
                <span class="absolute top-3 right-3 text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                  Hamarosan
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Mobile sidebar overlay — a checkbox #docs_sidebar vezérli (header toggle gombból).
 * Az overlay-re kattintás bezárja a sidebar-t.
 */
function MobileSidebar({ url }: { url: string }) {
  return (
    <div class="lg:hidden fixed inset-0 z-[60] hidden toggled">
      {/* Backdrop — kattintás bezárja */}
      <label class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" for="docs_sidebar" />
      <div class="relative flex flex-col w-80 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl">
        {/* Header */}
        <div class="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-800">
          <a href="/" class="flex items-center gap-2" f-client-nav={false}>
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <span class="font-bold text-slate-900 dark:text-white">Házépítési Kalauz</span>
          </a>
          <label for="docs_sidebar" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
            <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </label>
        </div>

        {/* Scrollable nav */}
        <nav class="flex-1 overflow-y-auto py-4 px-3">
          {CATEGORIES.map((category) => (
            <SidebarCategory key={category.title} category={category} url={url} />
          ))}
        </nav>
      </div>
    </div>
  );
}
