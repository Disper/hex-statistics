import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages URL: https://<user>.github.io/hex-stats/ — assets must live under /hex-stats/
export default defineConfig({
  base: "/hex-stats/",
  plugins: [react(), tailwindcss()],
});
