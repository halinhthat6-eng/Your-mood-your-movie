import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  define: {
    // 注意：这里改为 Vercel 环境变量名
    "import.meta.env.VITE_API_KEY": JSON.stringify(process.env.API_KEY),
  },
  build: {
    outDir: "dist",
  },
});

