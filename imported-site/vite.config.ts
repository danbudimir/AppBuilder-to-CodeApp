import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { powerApps } from "@microsoft/power-apps-vite/plugin";

export default defineConfig({
  plugins: [react(), powerApps()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
