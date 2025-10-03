import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssets: [
    "icons/favicon.ico",
    "icons/Icon-180.jpg",
    "icons/Icon-512.png",
  ],
  manifest: {
    name: "Fortune Numbers",
    short_name: "Fortune Numbers",
    description:
      "Discover your life's blueprint and future insights with our free numerology app. Find your fortune numbers today!",
    icons: [
      {
        src: "icons/Icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/Icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/Icon-180.jpg",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    theme_color: "#0b1220",
    background_color: "#010c26",
    display: "standalone",
    scope: "/Fortune-Numbers/",
    start_url: "/Fortune-Numbers/",
    orientation: "portrait",
    lang: "en",
  },
};

export default defineConfig({
  base: "/Fortune-Numbers/",

  plugins: [react(), VitePWA(manifestForPlugIn)],

  build: {
    outDir: "docs",
    emptyOutDir: true,
    chunkSizeWarningLimit: 2000,
  },

  server: {
    port: 3000,
  },
});
