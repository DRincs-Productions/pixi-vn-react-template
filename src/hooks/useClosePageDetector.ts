import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LOADING_ROUTE, MAIN_MENU_ROUTE } from "../constans";
import { addRefreshSave, loadRefreshSave } from "../utils/save-utility";
import useEventListener from "./useKeyDetector";
import useMyNavigate from "./useMyNavigate";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./useQueryInterface";

export default function useClosePageDetector() {
    const navigate = useMyNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();

    useEventListener({
        type: "beforeunload",
        listener: async () => {
            if (location.pathname === MAIN_MENU_ROUTE || location.pathname === LOADING_ROUTE) {
                return;
            }
            await addRefreshSave();
        },
    });

    useEffect(() => {
        loadRefreshSave(navigate).then(() =>
            queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] })
        );
    }, []);

    return null;
}
