import { useAlertDialog } from "@/components/providers/alert-dialog-provider";
import { useNarrationFunctions } from "@/lib/hooks/narration-hooks";
import { useSetSearchParamState } from "@/lib/hooks/navigation-hooks";
import { useGameProps } from "@/lib/hooks/props-hooks";
import { useQueryInputValue } from "@/lib/query/narration-query";
import {
    LAST_SAVE_USE_QUERY_KEY,
    SAVES_USE_QUERY_KEY,
    useQueryLastSave,
} from "@/lib/query/save-query";
import { QuickActionsWheelState } from "@/lib/stores/quick-actions-wheel-store";
import { SkipSettings } from "@/lib/stores/skip-settings-store";
import { TextDisplaySettings } from "@/lib/stores/text-display-settings-store";
import { loadSave, saveGameToIndexDB } from "@/lib/utils/save-utility";
import { narration } from "@drincs/pixi-vn";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useCallback } from "react";
import { useSelector } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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
export function useSaveHotkeys(): null {
    const queryClient = useQueryClient();
    const { t } = useTranslation(["ui"]);
    const location = useLocation();
    const { data: lastSave = null } = useQueryLastSave();
    const { openAlertDialog } = useAlertDialog();
    const gameProps = useGameProps();

    const quickSave = useCallback(() => {
        if (location.pathname === "/") {
            console.log("Can't save on home page");
            return;
        }
        const savePromise = saveGameToIndexDB().then((save) => {
            queryClient.setQueryData([SAVES_USE_QUERY_KEY, save.id], save);
            queryClient.setQueryData([LAST_SAVE_USE_QUERY_KEY], save);
        });
        toast.promise(savePromise, {
            loading: t("saving"),
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
                loadSave(lastSave)
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
    }, [lastSave, openAlertDialog, t, gameProps]);

    useHotkeys([
        {
            hotkey: "F5",
            callback: quickSave,
            options: {
                meta: {
                    name: t("quick_save"),
                    description: t("quick_save_hotkey_description"),
                },
            },
        },
        {
            hotkey: "Control+S",
            callback: quickSave,
            options: {
                meta: {
                    name: t("quick_save"),
                    description: t("quick_save_hotkey_alternative_description"),
                },
            },
        },
        {
            hotkey: "F9",
            callback: quickLoad,
            options: {
                meta: {
                    name: t("load_last_save"),
                    description: t("quick_load_hotkey_description"),
                },
            },
        },
        {
            hotkey: "Control+L",
            callback: quickLoad,
            options: {
                meta: {
                    name: t("load_last_save"),
                    description: t("quick_load_hotkey_alternative_description"),
                },
            },
        },
    ]);

    return null;
}

export function useSettingsHotkeys(): null {
    const { t } = useTranslation(["ui"]);
    const setSettingsOpen = useSetSearchParamState<boolean>("settings");
    const setSettingsTab = useSetSearchParamState<string>("settings_tab");

    const openControlsPage = useCallback(() => {
        setSettingsOpen(true);
        setSettingsTab("menus/controls");
    }, [setSettingsOpen, setSettingsTab]);

    useHotkeys([
        {
            hotkey: "Escape",
            callback: () => setSettingsOpen((prev) => !prev),
            options: {
                meta: {
                    name: t("settings"),
                    description: t("settings_toggle_hotkey_description"),
                },
            },
        },
        {
            hotkey: "Control+K",
            callback: openControlsPage,
            options: {
                meta: {
                    name: t("hotkeys_menu"),
                    description: t("hotkeys_menu_shortcut_description"),
                },
            },
        },
    ]);

    return null;
}

export function useGameHotkeys(): null {
    const setSettingsOpen = useSetSearchParamState<boolean>("settings");
    const setSettingsTab = useSetSearchParamState<string>("settings_tab");
    const setHistory = useSetSearchParamState<boolean>("history");
    const { t } = useTranslation(["ui"]);

    const openHistoryPage = useCallback(() => {
        setHistory(undefined);
        setSettingsOpen(true);
        setSettingsTab("menus/history");
    }, [setHistory, setSettingsOpen, setSettingsTab]);

    const toggleQuickActionsWheel = useCallback(() => {
        const isOpen = QuickActionsWheelState.store.state.open;
        if (isOpen) {
            QuickActionsWheelState.setOpen(false);
        } else {
            QuickActionsWheelState.setOpen(true);
        }
    }, []);

    useHotkeys([
        {
            hotkey: "Control+H",
            callback: openHistoryPage,
            options: {
                meta: {
                    name: t("history"),
                    description: t("history_hotkey_description"),
                },
            },
        },
        {
            hotkey: "Tab",
            callback: toggleQuickActionsWheel,
            options: {
                meta: {
                    name: t("quick_actions"),
                    description: t("quick_actions_open_description"),
                },
            },
        },
    ]);

    return null;
}

export function useNarrationHotkeys(): null {
    const { t } = useTranslation(["ui"]);
    const { goNext } = useNarrationFunctions();
    const { data: { isRequired } = {} } = useQueryInputValue<string | number>();
    const typewriterInProgress = useSelector(TextDisplaySettings.store, (state) => state.inProgress);

    const onSkipKeyDown = useCallback(() => SkipSettings.setEnabled(true), []);
    const onSkipKeyUp = useCallback(() => {
        SkipSettings.setEnabled(false);
        if (typewriterInProgress && !narration.dialogGlue) {
            TextDisplaySettings.complete();
            return;
        }
        goNext();
    }, [goNext, typewriterInProgress]);

    useHotkeys([
        {
            hotkey: "Enter",
            callback: onSkipKeyDown,
            options: {
                meta: {
                    name: t("skip"),
                    description: t("skip_hold_description"),
                },
                enabled: !isRequired,
            },
        },
        {
            hotkey: "Space",
            callback: onSkipKeyDown,
            options: {
                meta: {
                    name: t("skip"),
                    description: t("skip_hold_space_description"),
                },
                enabled: !isRequired,
            },
        },
        {
            hotkey: "Enter",
            callback: onSkipKeyUp,
            options: {
                eventType: "keyup",
                conflictBehavior: "allow",
                meta: {
                    name: t("next"),
                    description: t("skip_release_description"),
                },
                enabled: !isRequired,
            },
        },
        {
            hotkey: "Space",
            callback: onSkipKeyUp,
            options: {
                eventType: "keyup",
                conflictBehavior: "allow",
                meta: {
                    name: t("next"),
                    description: t("skip_release_space_description"),
                },
                enabled: !isRequired,
            },
        },
    ]);

    return null;
}
