import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages URL: https://<user>.github.io/stats/ — assets must live under /stats/
export default defineConfig({
  base: "/stats/",
  plugins: [react(), tailwindcss()],
});
