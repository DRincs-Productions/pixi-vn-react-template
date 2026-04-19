import { type AssetPackConfig } from "@assetpack/core";
import { pixiPipes } from "@assetpack/core/pixi";

const config: AssetPackConfig = {
    entry: "./assets",
    output: "./public/assets",
    ignore: ["**/*.ts", "**/*.js"],
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
