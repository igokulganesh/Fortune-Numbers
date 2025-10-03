import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Fortune-Numbers/",

  plugins: [react()],

  build: {
    outDir: "docs",
    emptyOutDir: false,
  },

  server: {
    port: 3000,
  },
});
