// utils/mdx.ts — MDX renderelés Preact-tel (szerver oldali)
//
// compile() + run() a @mdx-js/mdx v3-ból:
// 1. compile(source, { outputFormat: "function-body" }) → JS function body
//    Az import statement-ek await import(specifier) hívásokká alakulnak.
// 2. run(code, { Fragment, jsx, jsxs, baseUrl }) → { default: MDXContent }
//    A baseUrl kötelező ha van import az MDX-ben.
//    Bare specifier-ek (pl. "preact/hooks") a Deno resolver-en mennek át.

import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as jsxRuntime from "preact/jsx-runtime";
import type { ComponentType } from "preact";

// MDX komponensek – automatikusan elérhetők minden .mdx fájlban import nélkül
import InfoCard from "../components/mdx/InfoCard.tsx";
import Accordion from "../components/mdx/Accordion.tsx";
import CaseStudy from "../components/mdx/CaseStudy.tsx";
import CostRange from "../components/mdx/CostRange.tsx";
import ExpertQuote from "../components/mdx/ExpertQuote.tsx";
import ComparisonRow from "../components/mdx/ComparisonRow.tsx";
import MdxLink from "../components/mdx/MdxLink.tsx";
import ProConList from "../components/mdx/ProConList.tsx";
import StepByStep from "../components/mdx/StepByStep.tsx";
import Checklist from "../components/mdx/Checklist.tsx";
import Timeline from "../components/mdx/Timeline.tsx";

/** Ezek a komponensek minden MDX fájlban elérhetők import nélkül.
 *  Kisbetűs kulcsok (pl. `a`) a HTML elemek override-jai.
 *  Nagybetűs kulcsok (pl. `InfoCard`) egyedi MDX komponensek. */
const MDX_COMPONENTS = {
  // HTML elem override-ok
  a: MdxLink,
  // Egyedi MDX komponensek
  InfoCard,
  Accordion,
  CaseStudy,
  CostRange,
  ExpertQuote,
  ComparisonRow,
  ProConList,
  StepByStep,
  Checklist,
  Timeline,
};

interface MDXCacheEntry {
  component: ComponentType;
  html: string;
}

const mdxCache = new Map<string, MDXCacheEntry>();

/**
 * Heading kinyerés a renderelt HTML-ből.
 * Az MDX compilernél nem kapunk heading struktúrát natívan,
 * ezért a renderelt HTML-ből regex-szel nyerjük ki.
 */
export function extractHeadingsFromHtml(
  html: string,
): { id: string; html: string; level: number }[] {
  const headings: { id: string; html: string; level: number }[] = [];
  const regex = /<h([2-4])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      html: match[3].replace(/<a[^>]*>.*?<\/a>/g, "").trim(),
    });
  }
  return headings;
}

/**
 * Heading ID-k hozzáadása ha hiányoznak az MDX kimenetből.
 * Az MDX compiler nem generál automatikusan id-kat a heading-ekhez.
 */
function addHeadingIds(html: string): string {
  return html.replace(
    /<h([2-4])(?![^>]*\bid=)(.*?)>([\s\S]*?)<\/h\1>/gi,
    (_match, level, attrs, content) => {
      // Strip HTML tags for ID generation
      const text = content.replace(/<[^>]+>/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
    },
  );
}

export async function renderMDX(
  source: string,
  cacheKey?: string,
): Promise<{ component: ComponentType; html: string }> {
  if (cacheKey && mdxCache.has(cacheKey)) {
    return mdxCache.get(cacheKey)!;
  }

  // Step 1: Compile MDX → JS function body
  const compiled = await compile(source, {
    jsxImportSource: "preact",
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
  });

  // Step 2: Run — a Deno resolver kezeli az importokat
  // deno-lint-ignore no-explicit-any
  const result = await run(String(compiled), {
    ...jsxRuntime,
    baseUrl: import.meta.url,
  } as any);

  const MDXContent = result.default as ComponentType;

  // Step 3: Pre-render to HTML for heading extraction
  const { h } = await import("preact");
  const { render: renderToString } = await import("preact-render-to-string");
  let html = renderToString(h(MDXContent, { components: MDX_COMPONENTS }));

  // Step 4: Add heading IDs if missing
  html = addHeadingIds(html);

  const entry = { component: MDXContent, html };

  if (cacheKey) {
    mdxCache.set(cacheKey, entry);
  }

  return entry;
}

export function clearMDXCache() {
  mdxCache.clear();
}
