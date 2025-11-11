import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Vite 配置（兼容本地和 Vercel 环境）
export default defineConfig(({ mode }) => {
  // 载入环境变量
  const env = loadEnv(mode, process.cwd(), "");

  return {
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
      // ✅ 确保能正确读到 Vercel 的环境变量
      "process.env.API_KEY": JSON.stringify(process.env.API_KEY || env.API_KEY),
      "import.meta.env.VITE_API_KEY": JSON.stringify(
        process.env.API_KEY || env.API_KEY
      ),
    },
    build: {
      // ✅ 确保打包目录与 vercel.json 匹配
      outDir: "dist",
      emptyOutDir: true,
    },
  };
});
