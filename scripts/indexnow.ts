/**
 * indexnow.ts — URL-ek beküldése az IndexNow API-ba (Bing, Yandex, Seznam…).
 *
 * A kulcsfájl a site gyökerében él: static/<KEY>.txt → az API ezt hívja le
 * a beküldés hitelesítéséhez. A kulcs NEM titok (nyilvánosan elérhető), ezért
 * beégethető ide; env-ből felülírható (INDEXNOW_KEY).
 *
 * ── Használat ──────────────────────────────────────────────────────────────
 *   deno run -A scripts/indexnow.ts <url|content-path> [...]   explicit lista
 *   deno run -A scripts/indexnow.ts --changed <base> <head>    git diff → URL-ek
 *   deno run -A scripts/indexnow.ts --all                      minden tartalmi URL
 *
 * Kapcsolók:
 *   --wait     beküldés ELŐTT megvárja, míg a cél-URL-ek élőben 200-at adnak
 *              (deploy lefutása) — így a crawler a friss tartalmat kapja.
 *   --dry-run  nem küld be, csak kiírja mit küldene.
 *
 * Miért nem build-időben? A `deno task build` a deploy ELŐTT fut (a deployt a
 * Deno Deploy GitHub-integrációja végzi, nem a CI). Ha buildkor beküldenénk,
 * a keresők a RÉGI tartalmat crawlolnák. Ezért ez push utáni CI-lépésként fut,
 * `--wait`-tel (lásd .github/workflows/indexnow.yml).
 */

const DOMAIN = "https://hazepitesikalauz.hu";
const HOST = "hazepitesikalauz.hu";
const KEY = Deno.env.get("INDEXNOW_KEY") ?? "eef4e2a1cc87825217362d19030c1392";
const KEY_LOCATION = `${DOMAIN}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** content/{kat}/{slug}.(md|mdx) → https://.../{kat}/{slug}  (+ a {kat} hub). */
function contentPathToUrls(path: string): string[] {
  const norm = path.replace(/\\/g, "/");
  const m = norm.match(/^content\/(.+)\.(mdx?|md)$/);
  if (!m) return [];
  let slug = m[1].replace(/\/index$/, ""); // subcategory index → a kategória-URL
  const urls = [`${DOMAIN}/${slug}`];
  const cat = slug.split("/")[0];
  if (cat && cat !== slug) urls.push(`${DOMAIN}/${cat}`); // szülő hub is frissül
  return urls;
}

function isZeroSha(sha: string): boolean {
  return !sha || /^0+$/.test(sha);
}

async function git(args: string[]): Promise<string> {
  const cmd = new Deno.Command("git", { args, stdout: "piped", stderr: "piped" });
  const { code, stdout, stderr } = await cmd.output();
  if (code !== 0) throw new Error(new TextDecoder().decode(stderr));
  return new TextDecoder().decode(stdout);
}

async function changedUrls(base: string, head: string): Promise<string[]> {
  let range = `${base} ${head}`;
  if (isZeroSha(base)) range = "HEAD~1 HEAD"; // első push / nincs before → utolsó commit
  let out = "";
  try {
    out = await git(["diff", "--name-only", ...range.split(" ")]);
  } catch {
    out = await git(["diff", "--name-only", "HEAD~1", "HEAD"]);
  }
  const urls = new Set<string>();
  for (const line of out.split("\n").map((l) => l.trim()).filter(Boolean)) {
    for (const u of contentPathToUrls(line)) urls.add(u);
  }
  return [...urls];
}

async function allUrls(): Promise<string[]> {
  const urls = new Set<string>();
  for await (const e of walk("content")) {
    if (e.isFile && /\.(mdx?|md)$/.test(e.path)) {
      for (const u of contentPathToUrls(e.path.replace(/\\/g, "/"))) urls.add(u);
    }
  }
  return [...urls];
}

async function* walk(dir: string): AsyncGenerator<{ path: string; isFile: boolean }> {
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory) yield* walk(path);
    else yield { path, isFile: entry.isFile };
  }
}

/** Megvárja, míg az URL élőben 200-at ad (deploy kész). */
async function waitLive(url: string, tries = 15, delayMs = 20_000): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "manual" });
      await res.body?.cancel();
      if (res.status === 200) return true;
    } catch { /* retry */ }
    if (i < tries - 1) await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

async function main() {
  const args = [...Deno.args];
  const wait = args.includes("--wait");
  const dryRun = args.includes("--dry-run");
  const rest = args.filter((a) => !a.startsWith("--"));

  let urls: string[] = [];
  if (args.includes("--all")) {
    urls = await allUrls();
  } else if (args.includes("--changed")) {
    const [base, head] = rest;
    urls = await changedUrls(base ?? "", head ?? "HEAD");
  } else {
    // explicit: URL-ek vagy content-path-ok
    for (const a of rest) {
      if (a.startsWith("http")) urls.push(a);
      else urls.push(...contentPathToUrls(a.replace(/\\/g, "/")));
    }
    urls = [...new Set(urls)];
  }

  if (urls.length === 0) {
    console.log("IndexNow: nincs beküldendő URL (nem változott tartalmi oldal).");
    return;
  }

  console.log(`IndexNow: ${urls.length} URL\n${urls.map((u) => "  " + u).join("\n")}`);

  if (wait) {
    console.log("Várakozás az élő deploy-ra (--wait)…");
    const live = await Promise.all(urls.map((u) => waitLive(u)));
    const notLive = urls.filter((_, i) => !live[i]);
    if (notLive.length) {
      console.log(`⚠️  Nem lett élő időben (submit ennek ellenére):\n${notLive.map((u) => "  " + u).join("\n")}`);
    }
  }

  if (dryRun) {
    console.log("--dry-run: nincs tényleges beküldés.");
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });
  const text = await res.text();
  console.log(`IndexNow válasz: HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  // 200/202 = elfogadva; minden más hiba → nem-nulla exit CI-hez.
  if (res.status !== 200 && res.status !== 202) Deno.exit(1);
}

if (import.meta.main) await main();
