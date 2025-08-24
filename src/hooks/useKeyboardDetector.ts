import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import { saveGameToIndexDB } from "../utils/save-utility";
import useEventListener from "./useKeyDetector";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "./useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "./useQuerySaves";

export default function useKeyboardDetector() {
    const setOpenLoadAlert = useGameSaveScreenStore((state) => state.editLoadAlert);
    const queryClient = useQueryClient();
    const { t } = useTranslation(["ui"]);
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const { data: lastSave = null } = useQueryLastSave();

    const onkeydown = useCallback(
        (event: KeyboardEvent) => {
            switch (event.code) {
                case "KeyS":
                    if (event.altKey) {
                        if (location.pathname === "/") {
                            console.log("Can't save on home page");
                            break;
                        }
                        saveGameToIndexDB()
                            .then((save) => {
                                queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                                queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                                enqueueSnackbar(t("success_save"), { variant: "success" });
                            })
                            .catch(() => {
                                enqueueSnackbar(t("fail_save"), { variant: "error" });
                            });
                    }
                    break;
                case "KeyL":
                    if (event.altKey) {
                        if (!lastSave) {
                            console.log("No save to load");
                            return;
                        }
                        setOpenLoadAlert(lastSave);
                    }
                    break;
            }
        },
        [location, lastSave, queryClient, t]
    );

    useEventListener({ type: "keydown", listener: onkeydown });

    return null;
}
