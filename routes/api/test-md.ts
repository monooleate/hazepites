// Test: does importing utils/markdown.ts work on Deno Deploy?
import { renderMarkdown } from "../../utils/markdown.ts";

export const handler = {
  GET(): Response {
    try {
      const result = renderMarkdown("## Hello\nWorld");
      return new Response(JSON.stringify({
        ok: true,
        htmlLength: result.html.length,
      }, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({
        ok: false,
        error: String(e),
      }, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
