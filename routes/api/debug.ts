// Temporary diagnostic endpoint for Deno Deploy debugging
// DELETE after issue is resolved

import {
  CATEGORIES,
  TABLE_OF_CONTENTS,
} from "../../data/docs.ts";
import { frontMatter, renderMarkdown } from "../../utils/markdown.ts";

export const handler = {
  async GET(_req: Request): Promise<Response> {
    const info: Record<string, unknown> = {};

    // 1. Environment
    info.cwd = Deno.cwd();
    info.importMetaUrl = import.meta.url;
    info.denoVersion = Deno.version;

    // 2. Test data/docs.ts (CATEGORIES, TABLE_OF_CONTENTS)
    info.categoriesCount = CATEGORIES.length;
    info.categorySlugs = CATEGORIES.map((c) => c.slug);
    info.tocCount = Object.keys(TABLE_OF_CONTENTS).length;
    info.tocKeys = Object.keys(TABLE_OF_CONTENTS).slice(0, 10);

    // 3. Test markdown.ts (frontMatter, renderMarkdown)
    try {
      const testMd = "---\ntitle: Test\n---\n## Hello\nWorld";
      const { body, attrs } = frontMatter<Record<string, unknown>>(testMd);
      const result = renderMarkdown(body);
      info.markdownTest = `OK: attrs=${JSON.stringify(attrs)}, html=${result.html.length} chars`;
    } catch (e) {
      info.markdownTestError = String(e);
    }

    // 4. Test file reading with import.meta.url approach
    const upPrefix = import.meta.url.includes("_fresh") ? "../../../" : "../";

    // Try reading an actual MDX file that exists
    const tocKeys = Object.keys(TABLE_OF_CONTENTS);
    if (tocKeys.length > 0) {
      const firstEntry = TABLE_OF_CONTENTS[tocKeys[0]];
      info.firstEntry = firstEntry;

      for (const ext of [".mdx", ".md"]) {
        const testUrl = new URL(`${upPrefix}${firstEntry.file}${ext}`, import.meta.url);
        info[`fileUrl_${ext}`] = testUrl.href;
        try {
          const text = await Deno.readTextFile(testUrl);
          info[`fileRead_${ext}`] = `OK, ${text.length} chars`;
          break;
        } catch (e) {
          info[`fileReadError_${ext}`] = String(e);
        }
      }
    }

    // 5. Try listing built files to verify the mdx chunk exists
    try {
      const entries: string[] = [];
      for await (const entry of Deno.readDir("_fresh/server/assets")) {
        entries.push(entry.name);
      }
      info.builtChunks = entries.sort();
    } catch (e) {
      info.builtChunksError = String(e);
    }

    // 6. Try dynamically importing the slug route chunk
    try {
      const chunks = info.builtChunks as string[] | undefined;
      const slugChunk = chunks?.find((f) => f.includes("slug"));
      if (slugChunk) {
        info.slugChunkName = slugChunk;
        const chunkUrl = new URL(`${upPrefix}_fresh/server/assets/${slugChunk}`, import.meta.url);
        info.slugChunkUrl = chunkUrl.href;
        await import(chunkUrl.href);
        info.slugChunkImport = "OK";
      } else {
        info.slugChunkImport = "SKIP: no slug chunk found";
      }
    } catch (e) {
      info.slugChunkImportError = e instanceof Error
        ? `${e.name}: ${e.message}\n${e.stack}`
        : String(e);
    }

    return new Response(JSON.stringify(info, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
