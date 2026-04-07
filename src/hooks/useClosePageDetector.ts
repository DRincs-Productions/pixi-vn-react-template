import { useLocation } from "@tanstack/react-router";
import type { FileRouteTypes } from "@/routeTree.gen";
import { addRefreshSave } from "../utils/save-utility";
import useEventListener from "./useKeyDetector";

export default function useClosePageDetector() {
    const location = useLocation();

    useEventListener({
        type: "beforeunload",
        listener: async () => {
            if (
                (location.pathname as FileRouteTypes["fullPaths"]) === "/" ||
                (location.pathname as FileRouteTypes["fullPaths"]) === "/loading"
            ) {
                return;
            }
            await addRefreshSave();
        },
    });

    return null;
}
