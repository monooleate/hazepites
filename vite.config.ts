import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  plugins: [
    { enforce: "pre" as const, ...mdx({ jsxImportSource: "preact" }) },
    fresh(),
    tailwindcss(),
  ],
});
