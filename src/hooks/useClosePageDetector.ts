import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import type { FileRouteTypes } from "@/routeTree.gen";
import { addRefreshSave, loadRefreshSave } from "../utils/save-utility";
import useEventListener from "./useKeyDetector";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

export default function useClosePageDetector() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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

    useEffect(() => {
        loadRefreshSave(navigate).then(() =>
            queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }),
        );
    }, [navigate, queryClient]);

    return null;
}
