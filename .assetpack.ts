import type { AssetPackConfig } from "@assetpack/core";
import { pixiPipes } from "@assetpack/core/pixi";

const config: AssetPackConfig = {
    entry: "./src/assets",
    output: "./public/assets",
    ignore: ["**/*.ts", "**/*.js", "**/*.gen.json"],
    pipes: [
        ...pixiPipes({
            manifest: {
                output: "src/assets/manifest.gen.json",
                createShortcuts: true,
            },
        }),
    ],
};

export default config;
