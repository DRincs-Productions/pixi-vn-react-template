import { useQuery } from "@tanstack/react-query";

export const IS_FULL_SCREEN_MODE_USE_QUEY_KEY = "is_full_screen_mode_use_quey_key";

export default function useQueryIsFullModeScreen() {
    return useQuery({
        queryKey: [IS_FULL_SCREEN_MODE_USE_QUEY_KEY],
        queryFn: async () => document.fullscreenElement !== null,
    });
}
