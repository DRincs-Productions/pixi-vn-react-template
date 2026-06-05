import type { AssetPackConfig } from "@assetpack/core";
import { pixiPipes } from "@assetpack/core/pixi";

// TAURI_ENV_TARGET_TRIPLE is set by `tauri build` before running beforeBuildCommand
const isTauri = !!process.env.TAURI_ENV_TARGET_TRIPLE;

const config: AssetPackConfig = {
    entry: "./src/assets",
    output: "./public/assets",
    ignore: ["**/*.ts", "**/*.js", "**/*.gen.*"],
    pipes: [
        ...pixiPipes({
            manifest: {
                output: "src/assets/manifest.gen.json",
                createShortcuts: true,
            },
            // For Tauri: skip @0.5x mipmaps (unused on desktop, WebView handles DPR)
            resolutions: isTauri ? { default: 1 } : undefined,
            // For Tauri: raise WebP quality — files are local so bandwidth is not a concern
            compression: isTauri
                ? { png: true, jpg: true, webp: { quality: 88, alphaQuality: 88 } }
                : undefined,
        }),
    ],
};

export default config;
