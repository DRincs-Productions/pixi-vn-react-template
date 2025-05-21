import { AssetsManifest } from "@drincs/pixi-vn";
import { MAIN_MENU_ROUTE } from "../constans";

/**
 * Manifest for the assets used in the game.
 * You can read more about the manifest here: https://pixijs.com/8.x/guides/components/assets#loading-multiple-assets
 */
const manifest: AssetsManifest = {
    bundles: [
        // screens
        {
            name: MAIN_MENU_ROUTE,
            assets: [
                {
                    alias: "background_main_menu",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fmain-menu.webp?alt=media",
                },
            ],
        },
        // labels
        {
            name: "start",
            assets: [
                {
                    alias: "bg01-hallway",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fbg01-hallway.webp?alt=media",
                },
            ],
        },
        {
            name: "second_part",
            assets: [
                {
                    alias: "bg02-dorm",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fbg02-dorm.webp?alt=media",
                },
            ],
        },
        // characters
        {
            name: "fm01",
            assets: [
                {
                    alias: "fm01-body",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-body.webp?alt=media",
                },
                {
                    alias: "fm01-eyes-grin",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-eyes-grin.webp?alt=media",
                },
                {
                    alias: "fm01-eyes-smile",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-eyes-smile.webp?alt=media",
                },
                {
                    alias: "fm01-eyes-soft",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-eyes-soft.webp?alt=media",
                },
                {
                    alias: "fm01-eyes-upset",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-eyes-upset.webp?alt=media",
                },
                {
                    alias: "fm01-eyes-wow",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-eyes-wow.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-grin00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-grin00.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-serious00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-serious00.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-serious01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-serious01.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-smile00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-smile00.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-smile01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-smile01.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-soft00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-soft00.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-soft01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-soft01.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-upset00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-upset00.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-upset01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-upset01.webp?alt=media",
                },
                {
                    alias: "fm01-mouth-wow01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm01%2Ffm01-mouth-wow01.webp?alt=media",
                },
            ],
        },
        {
            name: "fm02",
            assets: [
                {
                    alias: "fm02-body",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-body.webp?alt=media",
                },
                {
                    alias: "fm02-eyes-bawl",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-eyes-bawl.webp?alt=media",
                },
                {
                    alias: "fm02-eyes-joy",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-eyes-joy.webp?alt=media",
                },
                {
                    alias: "fm02-eyes-nervous",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-eyes-nervous.webp?alt=media",
                },
                {
                    alias: "fm02-eyes-smile",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-eyes-smile.webp?alt=media",
                },
                {
                    alias: "fm02-eyes-upset",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-eyes-upset.webp?alt=media",
                },
                {
                    alias: "fm02-eyes-wow",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-eyes-wow.webp?alt=media",
                },
                {
                    alias: "fm02-mouth-cry01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-mouth-cry01.webp?alt=media",
                },
                {
                    alias: "fm02-mouth-nervous00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-mouth-nervous00.webp?alt=media",
                },
                {
                    alias: "fm02-mouth-nervous01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-mouth-nervous01.webp?alt=media",
                },
                {
                    alias: "fm02-mouth-smile00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-mouth-smile00.webp?alt=media",
                },
                {
                    alias: "fm02-mouth-smile01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-mouth-smile01.webp?alt=media",
                },
                {
                    alias: "fm02-mouth-upset00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-mouth-upset00.webp?alt=media",
                },
                {
                    alias: "fm02-mouth-upset01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-mouth-upset01.webp?alt=media",
                },
                {
                    alias: "fm02-mouth-wow01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Ffm02%2Ffm02-mouth-wow01.webp?alt=media",
                },
            ],
        },
        {
            name: "m01",
            assets: [
                {
                    alias: "m01-body",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-body.webp?alt=media",
                },
                {
                    alias: "m01-eyes-annoy",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-eyes-annoy.webp?alt=media",
                },
                {
                    alias: "m01-eyes-concern",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-eyes-concern.webp?alt=media",
                },
                {
                    alias: "m01-eyes-cry",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-eyes-cry.webp?alt=media",
                },
                {
                    alias: "m01-eyes-grin",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-eyes-grin.webp?alt=media",
                },
                {
                    alias: "m01-eyes-smile",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-eyes-smile.webp?alt=media",
                },
                {
                    alias: "m01-eyes-wow",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-eyes-wow.webp?alt=media",
                },
                {
                    alias: "m01-mouth-annoy00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-annoy00.webp?alt=media",
                },
                {
                    alias: "m01-mouth-annoy01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-annoy01.webp?alt=media",
                },
                {
                    alias: "m01-mouth-concern00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-concern00.webp?alt=media",
                },
                {
                    alias: "m01-mouth-concern01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-concern01.webp?alt=media",
                },
                {
                    alias: "m01-mouth-cry00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-cry00.webp?alt=media",
                },
                {
                    alias: "m01-mouth-cry01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-cry01.webp?alt=media",
                },
                {
                    alias: "m01-mouth-grin00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-grin00.webp?alt=media",
                },
                {
                    alias: "m01-mouth-neutral00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-neutral00.webp?alt=media",
                },
                {
                    alias: "m01-mouth-neutral01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-neutral01.webp?alt=media",
                },
                {
                    alias: "m01-mouth-smile00",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-smile00.webp?alt=media",
                },
                {
                    alias: "m01-mouth-smile01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-smile01.webp?alt=media",
                },
                {
                    alias: "m01-mouth-wow01",
                    src: "https://firebasestorage.googleapis.com/v0/b/pixi-vn.appspot.com/o/public%2Fbreakdown%2Fm01%2Fm01-mouth-wow01.webp?alt=media",
                },
            ],
        },
    ],
};
export default manifest;
