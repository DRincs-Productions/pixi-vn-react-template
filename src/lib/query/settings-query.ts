import { useQuery } from "@tanstack/react-query";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const IS_FULL_SCREEN_MODE_USE_QUERY_KEY = "is_full_screen_mode_use_query_key";

export function useQueryIsFullModeScreen() {
    return useQuery({
        queryKey: [IS_FULL_SCREEN_MODE_USE_QUERY_KEY],
        queryFn: async () => {
            if (window.__TAURI__) {
                return getCurrentWindow().isFullscreen();
            }
            return document.fullscreenElement !== null;
        },
    });
}
