import { Stack } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TextMenuButton from "../components/TextMenuButton";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryCanGoBack } from "../hooks/useQueryInterface";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "../hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../hooks/useQuerySaves";
import { useWheelActions } from "../hooks/useWheelActions";
import { AutoSettings } from "../stores/auto-settings-store";
import { GameStatus } from "../stores/game-status-store";
import { InterfaceSettings } from "../stores/interface-settings-store";
import { SkipSettings } from "../stores/skip-settings-store";
import { GameSaveScreenStore } from "../stores/useGameSaveScreenStore";
import { HistoryScreenStore } from "../stores/useHistoryScreenStore";
import { saveGameToIndexDB } from "../utils/save-utility";

export default function QuickTools() {
    const { t } = useTranslation(["ui"]);
    const hidden = useStore(InterfaceSettings.store, (state) => state.hidden);
    const skipEnabled = useStore(SkipSettings.store, (state) => state.enabled);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { data: lastSave = null } = useQueryLastSave();
    const { data: canGoBack = null } = useQueryCanGoBack();
    const nextStepLoading = useStore(GameStatus.store, (state) => state.loading);
    const { goBack } = useNarrationFunctions();
    const navigate = useNavigate();
    useWheelActions();
    const textMenuVarians = useMemo(
        () =>
            hidden
                ? `motion-opacity-out-0 motion-translate-y-out-[50%]`
                : `motion-opacity-in-0 motion-translate-y-in-[50%]`,
        [hidden],
    );

    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="flex-end"
            spacing={{ xs: 0.5, sm: 1, md: 2 }}
            sx={{
                position: "absolute",
                height: { xs: "0.9rem", sm: "1rem", md: "1.1rem", lg: "1.3rem", xl: "1.4rem" },
                paddingLeft: { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 },
                left: 0,
                right: 0,
                bottom: 0,
            }}
            className={textMenuVarians}
        >
            <TextMenuButton
                onClick={() => {
                    if (skipEnabled) {
                        SkipSettings.setEnabled(false);
                    }
                    goBack();
                }}
                disabled={!canGoBack || nextStepLoading}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("back")}
            </TextMenuButton>
            <TextMenuButton onClick={HistoryScreenStore.toggleOpen} sx={{ pointerEvents: !hidden ? "auto" : "none" }}>
                {t("history")}
            </TextMenuButton>
            <TextMenuButton
                selected={skipEnabled}
                onClick={SkipSettings.toggleEnabled}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("skip")}
            </TextMenuButton>
            <TextMenuButton
                selected={autoEnabled}
                disabled={skipEnabled}
                onClick={AutoSettings.toggleEnabled}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("auto_forward_time_restricted")}
            </TextMenuButton>
            <TextMenuButton onClick={() => navigate({ search: ((prev: any) => ({ ...prev, saves: true })) as any })} sx={{ pointerEvents: !hidden ? "auto" : "none" }}>
                {t(`${t("save")}/${t("load")}`)}
            </TextMenuButton>
            <TextMenuButton
                onClick={() => {
                    saveGameToIndexDB()
                        .then((save) => {
                            queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                            queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                            enqueueSnackbar(t("success_save"), { variant: "success" });
                        })
                        .catch(() => {
                            enqueueSnackbar(t("fail_save"), { variant: "error" });
                        });
                }}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("quick_save_restricted")}
            </TextMenuButton>
            <TextMenuButton
                onClick={() => lastSave && GameSaveScreenStore.editLoadAlert(lastSave)}
                disabled={!lastSave}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("load_last_save_restricted")}
            </TextMenuButton>
            <TextMenuButton
                onClick={() => navigate({ search: ((prev: any) => ({ ...prev, settings: true })) as any })}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("settings_restricted")}
            </TextMenuButton>
        </Stack>
    );
}
