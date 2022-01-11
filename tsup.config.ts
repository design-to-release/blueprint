import { defineConfig } from "tsup";

export default defineConfig(({ watch }) => ({
  format: ["esm"],
  entry: ["main.js", "preview.js"],
  target: "esnext",
  clean: true,
  minify: !watch,
}));
