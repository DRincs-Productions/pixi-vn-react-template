import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import { saveGameToIndexDB } from "../utils/save-utility";
import useHotkeys from "./useHotkeys";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "./useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "./useQuerySaves";

export default function useKeyboardDetector() {
    const setOpenLoadAlert = useGameSaveScreenStore((state) => state.editLoadAlert);
    const queryClient = useQueryClient();
    const { t } = useTranslation(["ui"]);
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const { data: lastSave = null } = useQueryLastSave();

    useHotkeys({
        "Alt+s": () => {
            if (location.pathname === "/") {
                console.log("Can't save on home page");
                return;
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
        },
        "Alt+l": () => {
            if (!lastSave) {
                console.log("No save to load");
                return;
            }
            setOpenLoadAlert(lastSave);
        },
    });

    return null;
}
