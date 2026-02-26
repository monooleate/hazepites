#!/usr/bin/env -S deno run -A --node-modules-dir
/**
 * Dev szerver indító script.
 *
 * Workaround-ok:
 * 1. Deno 2.6+ EISDIR lstat hiba a Vite file watcher-ben (nem fatális)
 * 2. Windows symlink permission warning (os error 1314) — ez a Deno Rust
 *    rétegéből jön, JS szinten nem szűrhető. Cosmetikus, a szerver működik.
 *    Végleges javítás: Windows Settings > For Developers > Developer Mode ON
 */

// Suppress non-fatal EISDIR errors from Deno's fs compatibility layer
process.on("uncaughtException", (err: Error) => {
  if (err.message?.includes("EISDIR")) {
    return;
  }
  console.error("Uncaught exception:", err);
  process.exit(1);
});

const { createServer } = await import("npm:vite");

const server = await createServer({
  configFile: "./vite.config.ts",
  root: ".",
});

await server.listen();
server.printUrls();

console.log("\n  ℹ  Ha \"WARN RS\" symlink warningot látsz, az ártalmatlan.");
console.log("     Végleges javítás: Windows Settings > For Developers > Developer Mode\n");
