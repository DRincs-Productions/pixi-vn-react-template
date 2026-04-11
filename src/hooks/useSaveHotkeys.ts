import { useHotkeys } from "@tanstack/react-hotkeys";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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
    const { data: lastSave = null } = useQueryLastSave();
    const { openAlertDialog } = useAlertDialog();
    const gameProps = useGameProps();

    const quickSave = useCallback(() => {
        if (location.pathname === "/") {
            console.log("Can't save on home page");
            return;
        }
        const savePromise = saveGameToIndexDB().then((save) => {
            queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
            queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
        });
        toast.promise(savePromise, {
            loading: t("save"),
            success: t("success_save"),
            error: t("fail_save"),
        });
    }, [location.pathname, queryClient, t]);

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
                        toast.success(t("success_load"));
                        return true;
                    })
                    .catch((e) => {
                        toast.error(t("fail_load"));
                        console.error(e);
                        return false;
                    }),
        });
    }, [lastSave, openAlertDialog, t, navigate, gameProps]);

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
