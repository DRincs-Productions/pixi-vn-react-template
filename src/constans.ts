import { type RootRouteChildren, routeTree } from "@/routeTree.gen";

export const REFRESH_SAVE_LOCAL_STORAGE_KEY = "refresh_save";

export const routePaths: Record<keyof RootRouteChildren, string> = Object.entries(routeTree.children ?? {}).reduce(
    (acc, [key, route]) => {
        acc[key as keyof RootRouteChildren] = route.path;
        return acc;
    },
    {} as Record<keyof RootRouteChildren, string>,
);

export const CANVAS_UI_LAYER_NAME = "ui";
export const CANVAS_MINIGAME_LAYER_NAME = "minigame";
export const HTML_UI_LAYER_NAME = "ui";
export const HTML_CANVAS_LAYER_NAME = "canvas";

export const AUDIO_BUNDLE_NAME = "audio";
export const BGM_CHANNEL_NAME = "bgm";
export const SFX_CHANNEL_NAME = "sfx";

export const SKIP_DELAY = 100;
