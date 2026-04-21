import { SearchParams } from "@/lib/stores/search-param-store";
import { useStore } from "@tanstack/react-store";
import { useEffect, useMemo, useRef } from "react";

function pauseGameFromMenuOpen() {
    // TODO: Call the future Pixi-VN pause function here.
}

function resumeGameFromMenuClose() {
    // TODO: Call the future Pixi-VN resume function here.
}

/**
 * Pauses the game when at least one search param is active.
 * Resumes the game once all menu-related search params are closed.
 *
 * Must be called from a component that is only rendered on the `/game` route
 * so that pause/resume is automatically scoped to the game screen.
 */
export default function usePauseGameWhenMenuIsOpen() {
    const searchParams = useStore(SearchParams.store, (state) => state);
    const pausedByMenuRef = useRef(false);

    const hasOpenMenu = useMemo(
        () => Object.values(searchParams).some((value) => value !== undefined),
        [searchParams],
    );

    useEffect(() => {
        if (hasOpenMenu && !pausedByMenuRef.current) {
            pauseGameFromMenuOpen();
            pausedByMenuRef.current = true;
            return;
        }

        if (!hasOpenMenu && pausedByMenuRef.current) {
            resumeGameFromMenuClose();
            pausedByMenuRef.current = false;
        }
    }, [hasOpenMenu]);

    useEffect(() => {
        return () => {
            if (pausedByMenuRef.current) {
                resumeGameFromMenuClose();
                pausedByMenuRef.current = false;
            }
        };
    }, []);
}
