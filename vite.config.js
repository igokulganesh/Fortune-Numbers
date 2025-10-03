import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/Fortune-Numbers/",

  plugins: [react(), VitePWA(manifestForPlugIn)],

  build: {
    outDir: "docs",
    emptyOutDir: false,
    chunkSizeWarningLimit: 2000,
  },

  server: {
    port: 3000,
  },
});

const manifestForPlugIn = {
  registerType: "autoUpdate",
  manifest: {
    name: "Fortune Numbers",
    short_name: "Numerology App",
    description:
      "Discover your life's blueprint and future insights with our free numerology app. Find your fortune numbers today!",
    icons: [
      {
        src: "/icons/Icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/icons/Icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/icons/Icon-180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/icons/Icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#0b1220",
    background_color: "#010c26",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};
