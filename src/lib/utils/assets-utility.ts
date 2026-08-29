import { manifest } from "@/assets";
import { AUDIO_BUNDLE_NAME } from "@/constants";
import type { FileRouteTypes } from "@/routeTree.gen";
import { Assets, sound } from "@drincs/pixi-vn";

let assetsInitialized = false;

/**
 * Define all the assets that will be used in the game.
 * This function will be called before the game starts.
 * You can read more about assets management in the documentation: https://pixi-vn.com/start/assets-management.html
 */
export async function defineAssets() {
    if (!assetsInitialized) {
        // PixiJS's own `path.toAbsolute()` only recognizes `http:`/`https:` as a "real" URL
        // with a host (see its `path.isUrl()` regex, `/^https?:/`) when resolving a
        // root-absolute asset src (e.g. `/main-menu.png`) against the current document.
        // Under Roves' `game://content/` custom scheme this makes it drop the host,
        // producing `game://main-menu.png` instead of `game://content/main-menu.png` and
        // failing to load. `location.protocol`/`location.host` (unlike `location.origin`,
        // which reports the literal string "null" for this custom scheme) still reflect the
        // real URL. `resolver.rootPath` must be set explicitly, not just `basePath` — left
        // unset, `toAbsolute()` derives it from `basePath` via that same buggy http(s)-only
        // check, so `basePath` alone doesn't actually fix root-absolute references. `rootPath`
        // isn't an `Assets.init()` option (only `Resolver` exposes it), so it's set directly
        // on `Assets.resolver` — and it must happen *before* `init()`, since `init()` already
        // resolves every manifest asset's URL (via `addManifest`) as part of its own call.
        const origin = `${location.protocol}//${location.host}/`;
        Assets.resolver.rootPath = origin;
        await Assets.init({ manifest, basePath: origin });
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
