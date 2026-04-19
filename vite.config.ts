import { vitePluginPixivn } from "@drincs/pixi-vn/vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { checker } from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        checker({
            typescript: {
                tsconfigPath: "tsconfig.app.json",
            },
        }),
        devtools(),
        tanstackRouter({ target: "react", autoCodeSplitting: true }),
        react(),
        tailwindcss(),
        vitePluginPixivn(),
        VitePWA({
            // you can generate the icons using: https://favicon.io/favicon-converter/
            // and the maskable icon using: https://progressier.com/maskable-icons-editor
            workbox: {
                runtimeCaching: [
                    {
                        // Always fetch from the network so the connectivity probe is never served from cache.
                        urlPattern: ({ url }) => url.pathname === "/network-check",
                        handler: "NetworkOnly",
                    },
                ],
            },
            includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
            manifest: {
                name: "my-app-project-name",
                short_name: "my-app-package-name",
                description: "my-app-description",
                theme_color: "#ffffff",
                start_url: "/",
                display: "fullscreen",
                orientation: "portrait",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    resolve: {
        tsconfigPaths: true,
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
        __APP_NAME__: JSON.stringify(process.env.npm_package_name),
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (
                        id.includes("react-markdown") ||
                        id.includes("rehype-raw") ||
                        id.includes("remark-gfm")
                    )
                        return "react-markdown";
                    if (id.includes("@pixi/sound")) return "sound";
                    if (id.includes("@drincs/pixi-vn-spine")) return "spine";
                    if (id.includes("pixi.js")) return "pixi.js";
                    if (id.includes("@drincs/pixi-vn")) return "pixi-vn";
                },
            },
        },
    },
});
