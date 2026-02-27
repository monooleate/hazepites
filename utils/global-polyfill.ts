// Polyfill: PrismJS language plugins reference `Prism` via the Node.js `global`
// object. On Deno Deploy, `global` is undefined, causing a ReferenceError.
// By aliasing `globalThis` to `global`, the PrismJS bundle code
// `if (typeof global !== "undefined") { global.Prism = Prism$1; }`
// executes correctly, making `Prism` available for language components.
if (typeof (globalThis as Record<string, unknown>).global === "undefined") {
  (globalThis as Record<string, unknown>).global = globalThis;
}
