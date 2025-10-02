import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Fortune-Numbers/",

  plugins: [react()],

  build: {
    outDir: "docs",
    // empty the output dir before each build
    emptyOutDir: true,
  },

  server: {
    port: 3000,
  },
});
