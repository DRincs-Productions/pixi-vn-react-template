import { Stack } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import TextMenuButton from "../components/TextMenuButton";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import { useQueryCanGoBack } from "../hooks/useQueryInterface";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "../hooks/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../hooks/useQuerySaves";
import useAutoInfoStore from "../stores/useAutoInfoStore";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useHistoryScreenStore from "../stores/useHistoryScreenStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import useSkipStore from "../stores/useSkipStore";
import useStepStore from "../stores/useStepStore";
import { saveGameToIndexDB } from "../utils/save-utility";

export default function QuickTools() {
    const editOpenSettings = useSettingsScreenStore((state) => state.editOpen);
    const editOpenHistory = useHistoryScreenStore((state) => state.editOpen);
    const editOpenSaveScreen = useGameSaveScreenStore((state) => state.editOpen);
    const setOpenLoadAlert = useGameSaveScreenStore((state) => state.editLoadAlert);
    const { t } = useTranslation(["ui"]);
    const hidden = useInterfaceStore((state) => state.hidden);
    const skipEnabled = useSkipStore((state) => state.enabled);
    const editSkipEnabled = useSkipStore((state) => state.editEnabled);
    const setSkipEnabled = useSkipStore((state) => state.setEnabled);
    const autoEnabled = useAutoInfoStore((state) => state.enabled);
    const editAutoEnabled = useAutoInfoStore((state) => state.editEnabled);
    const { enqueueSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const { data: lastSave = null } = useQueryLastSave();
    const { data: canGoBack = null } = useQueryCanGoBack();
    const nextStepLoading = useStepStore((state) => state.loading);
    const { goBack } = useNarrationFunctions();
    const textMenuVarians = useMemo(
        () =>
            hidden
                ? `motion-opacity-out-0 motion-translate-y-out-[50%]`
                : `motion-opacity-in-0 motion-translate-y-in-[50%]`,
        [hidden]
    );

    return (
        <Stack
            direction='row'
            justifyContent='center'
            alignItems='flex-end'
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
                        setSkipEnabled(false);
                    }
                    goBack();
                }}
                disabled={!canGoBack || nextStepLoading}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("back")}
            </TextMenuButton>
            <TextMenuButton onClick={editOpenHistory} sx={{ pointerEvents: !hidden ? "auto" : "none" }}>
                {t("history")}
            </TextMenuButton>
            <TextMenuButton
                selected={skipEnabled}
                onClick={editSkipEnabled}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("skip")}
            </TextMenuButton>
            <TextMenuButton
                selected={autoEnabled}
                onClick={editAutoEnabled}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("auto_forward_time_restricted")}
            </TextMenuButton>
            <TextMenuButton onClick={editOpenSaveScreen} sx={{ pointerEvents: !hidden ? "auto" : "none" }}>
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
                onClick={() => lastSave && setOpenLoadAlert(lastSave)}
                disabled={!lastSave}
                sx={{ pointerEvents: !hidden ? "auto" : "none" }}
            >
                {t("load_last_save_restricted")}
            </TextMenuButton>
            <TextMenuButton onClick={editOpenSettings} sx={{ pointerEvents: !hidden ? "auto" : "none" }}>
                {t("settings_restricted")}
            </TextMenuButton>
        </Stack>
    );
}
