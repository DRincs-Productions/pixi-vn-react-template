import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, Stack, useTheme } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import TextMenuButton from "../components/TextMenuButton";
import useNarrationFunctions from "../hooks/useNarrationFunctions";
import useAutoInfoStore from "../stores/useAutoInfoStore";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useHistoryScreenStore from "../stores/useHistoryScreenStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import useSkipStore from "../stores/useSkipStore";
import useStepStore from "../stores/useStepStore";
import { useQueryCanGoBack } from "../use_query/useQueryInterface";
import useQueryLastSave, { LAST_SAVE_USE_QUEY_KEY } from "../use_query/useQueryLastSave";
import { SAVES_USE_QUEY_KEY } from "../use_query/useQuerySaves";
import { putSaveIntoIndexDB } from "../utils/save-utility";

export default function QuickTools() {
    const editOpenSettings = useSettingsScreenStore((state) => state.editOpen);
    const editOpenHistory = useHistoryScreenStore((state) => state.editOpen);
    const editOpenSaveScreen = useGameSaveScreenStore((state) => state.editOpen);
    const setOpenLoadAlert = useGameSaveScreenStore((state) => state.editLoadAlert);
    const { t } = useTranslation(["ui"]);
    const hideInterface = useInterfaceStore((state) => state.hidden);
    const setHideInterface = useInterfaceStore((state) => state.editHidden);
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

    return (
        <>
            <Stack
                direction='row'
                justifyContent='center'
                alignItems='flex-end'
                spacing={{ xs: 0.5, sm: 1, md: 2 }}
                sx={{
                    height: "100%",
                    width: "100%",
                    paddingLeft: { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 },
                    position: "absolute",
                    marginBottom: 0,
                    bottom: 0,
                }}
                component={motion.div}
                variants={{
                    open: {
                        opacity: 1,
                        y: 0,
                    },
                    closed: {
                        opacity: 0,
                        y: 8,
                    },
                }}
                initial={"closed"}
                animate={hideInterface ? "closed" : "open"}
                exit={"closed"}
                transition={{ type: "tween" }}
            >
                <TextMenuButton
                    onClick={() => {
                        if (skipEnabled) {
                            setSkipEnabled(false);
                        }
                        goBack();
                    }}
                    disabled={!canGoBack || nextStepLoading}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("back")}
                </TextMenuButton>
                <TextMenuButton onClick={editOpenHistory} sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}>
                    {t("history")}
                </TextMenuButton>
                <TextMenuButton
                    selected={skipEnabled}
                    onClick={editSkipEnabled}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("skip")}
                </TextMenuButton>
                <TextMenuButton
                    selected={autoEnabled}
                    onClick={editAutoEnabled}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("auto_forward_time_restricted")}
                </TextMenuButton>
                <TextMenuButton onClick={editOpenSaveScreen} sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}>
                    {t(`${t("save")}/${t("load")}`)}
                </TextMenuButton>
                <TextMenuButton
                    onClick={() => {
                        putSaveIntoIndexDB()
                            .then((save) => {
                                queryClient.setQueryData([SAVES_USE_QUEY_KEY, save.id], save);
                                queryClient.setQueryData([LAST_SAVE_USE_QUEY_KEY], save);
                                enqueueSnackbar(t("success_save"), { variant: "success" });
                            })
                            .catch(() => {
                                enqueueSnackbar(t("fail_save"), { variant: "error" });
                            });
                    }}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("quick_save_restricted")}
                </TextMenuButton>
                <TextMenuButton
                    onClick={() => lastSave && setOpenLoadAlert(lastSave)}
                    disabled={!lastSave}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("load_last_save_restricted")}
                </TextMenuButton>
                <TextMenuButton onClick={editOpenSettings} sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}>
                    {t("settings_restricted")}
                </TextMenuButton>
            </Stack>
            <IconButton
                onClick={setHideInterface}
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                }}
                component={motion.div}
                variants={{
                    open: {
                        opacity: 1,
                        x: 0,
                        pointerEvents: "auto",
                    },
                    closed: {
                        opacity: 0,
                        x: 8,
                        pointerEvents: "none",
                    },
                }}
                initial={"closed"}
                animate={!hideInterface ? "closed" : "open"}
                exit={"closed"}
                transition={{ type: "tween" }}
            >
                <VisibilityOffIcon
                    sx={{
                        color: useTheme().palette.neutral[500],
                    }}
                />
            </IconButton>
        </>
    );
}
