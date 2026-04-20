import { SearchParams } from "@/lib/stores/search-param-store";
import { useLocation } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useEffect, useMemo, useRef } from "react";

function pauseGameFromMenuOpen() {
    // TODO: Call the future Pixi-VN pause function here.
}

function resumeGameFromMenuClose() {
    // TODO: Call the future Pixi-VN resume function here.
}

/**
 * Pauses the game when at least one search param is active while inside `/game`.
 * Resumes the game once all menu-related search params are closed.
 */
export default function usePauseGameWhenMenuIsOpen() {
    const { pathname } = useLocation();
    const searchParams = useStore(SearchParams.store);
    const pausedByMenuRef = useRef(false);

    const isOnGameRoute = pathname === "/game" || pathname.startsWith("/game/");
    const hasOpenMenu = useMemo(
        () => Object.values(searchParams).some((value) => value !== undefined),
        [searchParams],
    );

    useEffect(() => {
        if (!isOnGameRoute) {
            if (pausedByMenuRef.current) {
                resumeGameFromMenuClose();
                pausedByMenuRef.current = false;
            }
            return;
        }

        if (hasOpenMenu && !pausedByMenuRef.current) {
            pauseGameFromMenuOpen();
            pausedByMenuRef.current = true;
            return;
        }

        if (!hasOpenMenu && pausedByMenuRef.current) {
            resumeGameFromMenuClose();
            pausedByMenuRef.current = false;
        }
    }, [hasOpenMenu, isOnGameRoute]);
}
