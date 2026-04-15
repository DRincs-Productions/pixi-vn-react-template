import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import useGameProps from "@/hooks/useGameProps";
import useNarrationFunctions from "@/hooks/useNarrationFunctions";
import { useQueryCanGoBack } from "@/hooks/useQueryInterface";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "@/hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "@/hooks/useQuerySaves";
import { useSetSearchParamState } from "@/hooks/useSearchParamState";
import { useWheelActions } from "@/hooks/useWheelActions";
import { AutoSettings } from "@/lib/stores/auto-settings-store";
import { GameStatus } from "@/lib/stores/game-status-store";
import { InterfaceSettings } from "@/lib/stores/interface-settings-store";
import { SkipSettings } from "@/lib/stores/skip-settings-store";
import { cn } from "@/lib/utils";
import { loadSave, saveGameToIndexDB } from "@/utils/save-utility";
import { useAlertDialog } from "../providers/AlertDialogProvider";

export function QuickTools() {
    const { t } = useTranslation(["ui"]);
    const hidden = useStore(InterfaceSettings.store, (state) => state.hidden);
    const skipEnabled = useStore(SkipSettings.store, (state) => state.enabled);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);
    const queryClient = useQueryClient();
    const { data: lastSave = null } = useQueryLastSave();
    const { data: canGoBack = null } = useQueryCanGoBack();
    const nextStepLoading = useStore(GameStatus.store, (state) => state.loading);
    const { goBack } = useNarrationFunctions();
    const navigate = useNavigate();
    const { openAlertDialog } = useAlertDialog();
    const gameProps = useGameProps();
    useWheelActions();
    const setHistory = useSetSearchParamState<boolean>("history");
    const setSaves = useSetSearchParamState<boolean>("saves");
    const setSettings = useSetSearchParamState<boolean>("settings");

    const noPointer = hidden ? "pointer-events-none" : undefined;

    return (
        <div
            className={cn(
                "flex flex-wrap items-center justify-end gap-1 px-2 pb-2 select-none",
                hidden ? "animate-out fade-out-0" : "animate-in fade-in-0",
            )}
        >
            <Button
                variant="ghost"
                size="xs"
                className={noPointer}
                onClick={() => {
                    if (skipEnabled) {
                        SkipSettings.setEnabled(false);
                    }
                    goBack();
                }}
                disabled={!canGoBack || nextStepLoading}
            >
                {t("back")}
            </Button>
            <Button
                variant="ghost"
                size="xs"
                className={noPointer}
                onClick={() => setHistory(true)}
            >
                {t("history")}
            </Button>
            <Toggle
                size="sm"
                pressed={skipEnabled}
                onPressedChange={(v) => SkipSettings.setEnabled(v)}
                className={noPointer}
            >
                {t("skip")}
            </Toggle>
            <Toggle
                size="sm"
                pressed={autoEnabled}
                onPressedChange={(v) => AutoSettings.setEnabled(v)}
                disabled={skipEnabled}
                className={noPointer}
            >
                {t("auto_forward_time_restricted")}
            </Toggle>
            <Button
                variant="ghost"
                size="xs"
                className={noPointer}
                onClick={() => setSaves(true)}
            >
                {t(`${t("save")}/${t("load")}`)}
            </Button>
            <Button
                variant="ghost"
                size="xs"
                className={noPointer}
                onClick={() => {
                    const savePromise = saveGameToIndexDB().then((save) => {
                        queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                        queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                    });
                    toast.promise(savePromise, {
                        loading: t("saving"),
                        success: t("success_save"),
                        error: t("fail_save"),
                    });
                }}
            >
                {t("quick_save_restricted")}
            </Button>
            <Button
                variant="ghost"
                size="xs"
                className={noPointer}
                onClick={() => {
                    if (!lastSave) return;
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
                }}
                disabled={!lastSave}
            >
                {t("load_last_save_restricted")}
            </Button>
            <Button
                variant="ghost"
                size="xs"
                className={noPointer}
                onClick={() => setSettings(true)}
            >
                {t("settings_restricted")}
            </Button>
        </div>
    );
}
