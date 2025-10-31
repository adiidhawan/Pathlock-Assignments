// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward /api to your backend during dev
      "/api": {
        target: "https://localhost:7011",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
