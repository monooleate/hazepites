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
import { frontMatter, renderMarkdown } from "../utils/markdown.ts";
import { renderMDX, extractHeadingsFromHtml } from "../utils/mdx.ts";
import { TableOfContents } from "../islands/TableOfContents.tsx";
import HeadUpdater from "../islands/HeadUpdater.tsx";
import CostCalculator from "../islands/CostCalculator.tsx";
import { define } from "../utils/state.ts";
import { generateBreadcrumbSchema } from "../utils/schema.ts";
import type { ComponentType } from "preact";

// Island registry — frontmatter "island" mező alapján renderelhető
const ISLAND_REGISTRY: Record<string, ComponentType> = {
  CostCalculator,
};

// Category slugs for overview pages
const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

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
    // ── DEBUG: temporary top-level catch to surface exact error on Deno Deploy ──
    try { return await _handleGET(ctx); } catch (e: unknown) {
      // Re-throw HttpError so Fresh shows 404/etc normally
      if (e instanceof HttpError) throw e;
      const msg = e instanceof Error ? `${e.name}: ${e.message}\n${e.stack}` : String(e);
      console.error("[ROUTE ERROR]", msg);
      // Return plain-text error so we can diagnose via curl
      return new Response(`[ROUTE ERROR] ${msg}\n\nimport.meta.url=${import.meta.url}\n_CONTENT_UP=${_CONTENT_UP}`, {
        status: 500, headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  },
});

// deno-lint-ignore no-explicit-any
async function _handleGET(ctx: any) {
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

    const { body, attrs } = frontMatter<Record<string, unknown>>(fileContent);
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
}

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
                  Az alábbi cikkek és útmutatók segítenek eligazodni a témában.
                </p>

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
