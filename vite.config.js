import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/kodekenobi.github.io/",
    server: {
        port: 5173,
        host: false,
    },
    build: {
        outDir: "dist",
        sourcemap: true,
        assetsDir: "assets",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            },
            output: {
                manualChunks: undefined,
                assetFileNames: "assets/[name].[hash][extname]",
                chunkFileNames: "assets/[name].[hash].js",
                entryFileNames: "assets/[name].[hash].js",
            },
        },
    },
    publicDir: "public",
    optimizeDeps: {
        include: ["react", "react-dom"],
    },
});
