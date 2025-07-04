import { useQuery } from "@tanstack/react-query";
import { getCurrentWindow } from "@tauri-apps/api/window";

export const IS_FULL_SCREEN_MODE_USE_QUEY_KEY = "is_full_screen_mode_use_quey_key";

export default function useQueryIsFullModeScreen() {
    return useQuery({
        queryKey: [IS_FULL_SCREEN_MODE_USE_QUEY_KEY],
        queryFn: async () => {
            if (window.__TAURI__) {
                return getCurrentWindow().isFullscreen();
            }
            return document.fullscreenElement !== null;
        },
    });
}
