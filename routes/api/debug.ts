// Simple debug endpoint — no external imports
export const handler = {
  GET(): Response {
    return new Response(JSON.stringify({
      ok: true,
      cwd: Deno.cwd(),
      importMetaUrl: import.meta.url,
      denoVersion: Deno.version,
      time: new Date().toISOString(),
    }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
