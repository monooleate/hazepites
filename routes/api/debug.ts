// Temporary diagnostic endpoint for Deno Deploy debugging
// DELETE after issue is resolved

export const handler = {
  async GET(_req: Request): Promise<Response> {
    const info: Record<string, unknown> = {};

    // 1. Environment
    info.cwd = Deno.cwd();
    info.importMetaUrl = import.meta.url;
    info.denoVersion = Deno.version;

    // 2. Try listing content directory
    try {
      const entries: string[] = [];
      for await (const entry of Deno.readDir("./content")) {
        entries.push(`${entry.isDirectory ? "D" : "F"}: ${entry.name}`);
      }
      info.contentDir = entries;
    } catch (e) {
      info.contentDirError = String(e);
    }

    // 3. Try CWD-relative file read
    try {
      const text = await Deno.readTextFile("./content/alapok/hazepites-lepesrol-lepesre.mdx");
      info.cwdRelativeRead = `OK, ${text.length} chars`;
    } catch (e) {
      info.cwdRelativeReadError = String(e);
    }

    // 4. Try URL-based read (the current approach)
    const upPrefix = import.meta.url.includes("_fresh") ? "../../../" : "../";
    const testUrl = new URL(`${upPrefix}content/alapok/hazepites-lepesrol-lepesre.mdx`, import.meta.url);
    info.resolvedUrl = testUrl.href;
    try {
      const text = await Deno.readTextFile(testUrl);
      info.urlBasedRead = `OK, ${text.length} chars`;
    } catch (e) {
      info.urlBasedReadError = String(e);
    }

    // 5. Try reading from routes/ perspective (1 level up)
    const testUrl2 = new URL(`../content/alapok/hazepites-lepesrol-lepesre.mdx`, import.meta.url);
    info.resolvedUrl2 = testUrl2.href;
    try {
      const text = await Deno.readTextFile(testUrl2);
      info.url1LevelRead = `OK, ${text.length} chars`;
    } catch (e) {
      info.url1LevelReadError = String(e);
    }

    // 6. Try /src/ prefix (Deno Deploy convention)
    try {
      const text = await Deno.readTextFile("/src/content/alapok/hazepites-lepesrol-lepesre.mdx");
      info.srcPrefixRead = `OK, ${text.length} chars`;
    } catch (e) {
      info.srcPrefixReadError = String(e);
    }

    return new Response(JSON.stringify(info, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
