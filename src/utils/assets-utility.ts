import { Assets } from "@drincs/pixi-vn";
import manifest from "../assets/manifest";
import { MAIN_MENU_ROUTE } from "../constans";

/**
 * Define all the assets that will be used in the game.
 * This function will be called before the game starts.
 * You can read more about assets management in the documentation: https://pixi-vn.web.app/start/assets-management.html
 */
export async function defineAssets() {
    Assets.init({ manifest });

    // The game will not start until these asserts are loaded.
    await Assets.loadBundle(MAIN_MENU_ROUTE);

    // The game will start immediately, but these asserts will be loaded in the background.
    // Assets.backgroundLoadBundle("main_menu");
    // Assets.backgroundLoad("background_main_menu");
}
