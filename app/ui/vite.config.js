import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import AdmZip from "adm-zip";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "#cds-models": fileURLToPath(new URL("../../@cds-models", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    react(),
    {
      name: "zip-dist", // zipping ./dist is required for BTP HTML5 repo or Application Frontend deployment
      closeBundle() {
        const zip = new AdmZip();
        zip.addLocalFolder("dist");
        zip.writeZip("dist/ui.zip");
      },
    },
  ],
  server: {
    proxy: {
      "/admin": "http://localhost:4004",
    },
  },
  base: "/ui",
});
