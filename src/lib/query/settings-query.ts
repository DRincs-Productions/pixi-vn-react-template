import { useQuery } from "@tanstack/react-query";

export const IS_FULL_SCREEN_MODE_USE_QUERY_KEY = "is_full_screen_mode_use_query_key";

export function useQueryIsFullModeScreen() {
    return useQuery({
        queryKey: [IS_FULL_SCREEN_MODE_USE_QUERY_KEY],
        queryFn: async () => document.fullscreenElement !== null,
    });
}
