// Test: does importing data/docs.ts work on Deno Deploy?
import { CATEGORIES, TABLE_OF_CONTENTS } from "../../data/docs.ts";

export const handler = {
  GET(): Response {
    return new Response(JSON.stringify({
      ok: true,
      categoriesCount: CATEGORIES.length,
      tocCount: Object.keys(TABLE_OF_CONTENTS).length,
    }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
