import { useLocation } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";
import type { FileRouteTypes } from "@/routeTree.gen";
import { addRefreshSave } from "../utils/save-utility";

/**
 * useAutoSaveOnPageClose
 *
 * Trigger a refresh/save when the user is about to leave the page or when the
 * document becomes hidden. Skips the root path (`/`).
 *
 * This hook does not return a value.
 */
export default function useAutoSaveOnPageClose(): void {
    const location = useLocation();

    const callback = useCallback(() => {
        if ((location.pathname as FileRouteTypes["fullPaths"]) === "/") {
            return;
        }
        addRefreshSave();
    }, [location.pathname]);

    useEffect(() => {
        const onBeforeUnload = () => callback();
        const onVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                callback();
            }
        };

        window.addEventListener("beforeunload", onBeforeUnload);
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, [callback]);
}
