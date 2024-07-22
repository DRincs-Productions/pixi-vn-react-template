import { getSaveJson } from '@drincs/pixi-vn';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton, Stack, useTheme } from '@mui/joy';
import { motion } from "framer-motion";
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { autoInfoState } from '../atoms/autoInfoState';
import { canGoBackState } from '../atoms/canGoBackState';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { openHistoryState } from '../atoms/openHistoryState';
import { openLoadAlertState } from '../atoms/openLoadAlertState';
import { openSettingsState } from '../atoms/openSettingsState';
import { quickSaveState } from '../atoms/quickSaveState';
import { reloadInterfaceDataEventState } from '../atoms/reloadInterfaceDataEventState';
import { skipEnabledState } from '../atoms/skipEnabledState';
import TextMenuButton from '../components/TextMenuButton';
import { goBack, loadGameSave, saveGame } from '../utility/ActionsUtility';
import { useMyNavigate } from '../utility/useMyNavigate';

export default function QuickActions() {
    const setOpenSettings = useSetRecoilState(openSettingsState);
    const setOpenHistory = useSetRecoilState(openHistoryState);
    const navigate = useMyNavigate();
    const notifyLoadEvent = useSetRecoilState(reloadInterfaceDataEventState);
    const setOpenLoadAlert = useSetRecoilState(openLoadAlertState);
    const { t } = useTranslation(["translation"]);
    const [hideInterface, setHideInterface] = useRecoilState(hideInterfaceState);
    const [skip, setSkip] = useRecoilState(skipEnabledState)
    const [auto, setAuto] = useRecoilState(autoInfoState)
    const canGoBack = useRecoilValue(canGoBackState)
    const [quickSave, setQuickSave] = useRecoilState(quickSaveState)
    const { enqueueSnackbar } = useSnackbar();

    return (
        <>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="flex-end"
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
                    }
                }}
                initial={"closed"}
                animate={hideInterface ? "closed" : "open"}
                exit={"closed"}
                transition={{ type: "tween" }}
            >
                <TextMenuButton
                    onClick={() => goBack(navigate, () => { notifyLoadEvent((prev) => prev + 1) })}
                    disabled={!canGoBack}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("back")}
                </TextMenuButton>
                <TextMenuButton
                    onClick={() => setOpenHistory(true)}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("history")}
                </TextMenuButton>
                <TextMenuButton
                    selected={skip}
                    onClick={() => setSkip((prev) => !prev)}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("skip")}
                </TextMenuButton>
                <TextMenuButton
                    selected={auto.enabled}
                    onClick={() => setAuto((prev) => ({
                        ...prev,
                        enabled: !prev.enabled,
                    }))}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("auto_forward_time_restricted")}
                </TextMenuButton>
                <TextMenuButton
                    onClick={saveGame}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("save")}
                </TextMenuButton>
                <TextMenuButton
                    onClick={() => loadGameSave(navigate, () => {
                        notifyLoadEvent((prev) => prev + 1)
                        enqueueSnackbar(t("success_load"), { variant: 'success' })
                    })}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("load")}
                </TextMenuButton>
                <TextMenuButton
                    onClick={() => {
                        let save = getSaveJson()
                        setQuickSave(save)
                        enqueueSnackbar(t("success_save"), { variant: 'success' })
                    }}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("quick_save_restricted")}
                </TextMenuButton>
                <TextMenuButton
                    onClick={() => setOpenLoadAlert(true)}
                    disabled={!quickSave}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("quick_load_restricted")}
                </TextMenuButton>
                <TextMenuButton
                    onClick={() => setOpenSettings(true)}
                    sx={{ pointerEvents: !hideInterface ? "auto" : "none" }}
                >
                    {t("settings_restricted")}
                </TextMenuButton>
            </Stack >
            <IconButton
                onClick={() => setHideInterface((prev) => !prev)}
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
                    }
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
