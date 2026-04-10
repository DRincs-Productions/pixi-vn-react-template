import { useHotkeys } from "@tanstack/react-hotkeys";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAlertDialog } from "../providers/AlertDialogProvider";
import { loadSave, saveGameToIndexDB } from "../utils/save-utility";
import useGameProps from "./useGameProps";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "./useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "./useQuerySaves";

/**
 * useSaveHotkeys
 *
 * Hook that registers hotkeys for quick saving and loading the most
 * recent save.
 *
 * Chosen hotkeys (common in games and web apps):
 * - `F5`: quick save
 * - `F9`: quick load (loads the most recent save)
 * - `Ctrl+S`: alternative quick save (for keyboards without function keys)
 * - `Ctrl+L`: alternative quick load
 *
 * This hook accepts no parameters and returns `null` because it is used
 * only for side effects (registering hotkeys).
 */
export default function useSaveHotkeys(): null {
    const queryClient = useQueryClient();
    const { t } = useTranslation(["ui"]);
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { data: lastSave = null } = useQueryLastSave();
    const { openAlertDialog } = useAlertDialog();
    const gameProps = useGameProps();

    const quickSave = useCallback(() => {
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
    }, [location.pathname, queryClient, t, enqueueSnackbar]);

    const quickLoad = useCallback(() => {
        if (!lastSave) {
            console.log("No save to load");
            return;
        }
        openAlertDialog({
            head: t("load"),
            content: t("you_sure_to_load_save", {
                name: lastSave.name || `${t("save_slot")} ${lastSave.id}`,
            }),
            onConfirm: () =>
                loadSave(lastSave, (to) => navigate({ to }))
                    .then(() => {
                        gameProps.invalidateInterfaceData();
                        enqueueSnackbar(t("success_load"), { variant: "success" });
                        return true;
                    })
                    .catch((e) => {
                        enqueueSnackbar(t("fail_load"), { variant: "error" });
                        console.error(e);
                        return false;
                    }),
        });
    }, [lastSave, openAlertDialog, t, navigate, gameProps, enqueueSnackbar]);

    useHotkeys([
        {
            hotkey: "F5",
            callback: quickSave,
        },
        {
            hotkey: "Control+S",
            callback: quickSave,
        },
        {
            hotkey: "F9",
            callback: quickLoad,
        },
        {
            hotkey: "Control+L",
            callback: quickLoad,
        },
    ]);

    return null;
}
