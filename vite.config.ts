import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Automatically open the app in the browser
  },
  build: {
    outDir: "dist", // Vercel will look for the build output here
  },
});
