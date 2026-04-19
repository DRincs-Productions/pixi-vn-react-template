import { pixiPipes } from "@assetpack/core/pixi";

/** @type {import('@assetpack/core').AssetPackConfig} */
export default {
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
