import { Assets, sound, type AssetsManifest } from "@drincs/pixi-vn";
import type { FileRouteTypes } from "@/routeTree.gen";
import manifest from "../assets/manifest";
import { AUDIO_BUNDLE_NAME } from "../constans";

let assetsInitialized = false;
const GENERATED_MANIFEST_URL = "/assets/manifest.json";

function mergeAssetsManifest(
    staticManifest: AssetsManifest,
    generatedManifest: AssetsManifest,
): AssetsManifest {
    return {
        bundles: [...staticManifest.bundles, ...generatedManifest.bundles],
    };
}

async function getGeneratedManifest(): Promise<AssetsManifest | null> {
    try {
        const response = await fetch(GENERATED_MANIFEST_URL, { cache: "no-store" });
        if (!response.ok) return null;
        const generatedManifest = (await response.json()) as AssetsManifest;
        return generatedManifest.bundles.length ? generatedManifest : null;
    } catch {
        return null;
    }
}

/**
 * Define all the assets that will be used in the game.
 * This function will be called before the game starts.
 * You can read more about assets management in the documentation: https://pixi-vn.web.app/start/assets-management.html
 */
export async function defineAssets() {
    if (!assetsInitialized) {
        const generatedManifest = await getGeneratedManifest();
        const resolvedManifest = generatedManifest
            ? mergeAssetsManifest(manifest, generatedManifest)
            : manifest;
        await Assets.init({ manifest: resolvedManifest });
        assetsInitialized = true;
    }

    // The game will not start until these asserts are loaded.
    await Assets.loadBundle("/" as FileRouteTypes["fullPaths"]);

    // The audio bundle will be loaded in the background, so it will be available when needed, but it won't block the game start.
    sound.backgroundLoadBundle(AUDIO_BUNDLE_NAME);

    // The game will start immediately, but these asserts will be loaded in the background.
    // Assets.backgroundLoadBundle("main_menu");
    // Assets.backgroundLoad("background_main_menu");
}

/**
 * Get the PixiJS asset from the given asset string.
 * If the asset is not a PixiAsset, it will return the asset as is.
 * @param asset - The asset string to resolve.
 * @returns The resolved PixiJS asset or the original asset string.
 */
export function getPixiJSAsset(asset: string) {
    // check if the asset is a PixiAsset
    return Assets.resolver.resolve(asset).src || asset;
}
