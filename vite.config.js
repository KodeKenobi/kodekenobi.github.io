import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/kodekenobi.github.io/",
    build: {
        outDir: "dist",
        assetsDir: "assets",
        rollupOptions: {
            output: {
                manualChunks: undefined,
                assetFileNames: "assets/[name].[hash][extname]",
                chunkFileNames: "assets/[name].[hash].js",
                entryFileNames: "assets/[name].[hash].js",
            },
        },
    },
});
