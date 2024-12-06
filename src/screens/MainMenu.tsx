import { addImage, canvas, narration } from '@drincs/pixi-vn';
import Stack from '@mui/joy/Stack';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "motion/react";
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { openGameSaveScreenState } from '../atoms/openGameSaveScreenState';
import { openSettingsState } from '../atoms/openSettingsState';
import MenuButton from '../components/MenuButton';
import { NARRATION_ROUTE } from '../constans';
import { INTERFACE_DATA_USE_QUEY_KEY } from '../use_query/useQueryInterface';
import useQueryLastSave from '../use_query/useQueryLastSave';
import { useMyNavigate } from '../utils/navigate-utility';
import { loadSave } from '../utils/save-utility';

export default function MainMenu() {
    const navigate = useMyNavigate();
    const setOpenSettings = useSetRecoilState(openSettingsState);
    const setHideInterface = useSetRecoilState(hideInterfaceState);
    const setGameSaveScreen = useSetRecoilState(openGameSaveScreenState);
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(["ui"]);
    const { t: tNarration } = useTranslation(["narration"]);
    const queryClient = useQueryClient()
    const { data: lastSave = null, isLoading } = useQueryLastSave()

    useEffect(() => {
        setHideInterface(false)
        let bg = addImage("background_main_menu")
        bg.load()

        return () => {
            canvas.remove("background_main_menu")
        }
    })

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={{ xs: 1, sm: 2, lg: 3 }}
            sx={{
                height: "100%",
                width: "100%",
                paddingLeft: { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 }
            }}
            component={motion.div}
            initial="closed"
            animate={"open"}
            exit="closed"
        >
            <MenuButton
                onClick={() => {
                    if (!lastSave) {
                        return
                    }
                    loadSave(lastSave, navigate)
                        .then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }))
                        .catch((e) => {
                            enqueueSnackbar(t("fail_load"), { variant: 'error' })
                            console.error(e)
                        })
                }}
                transitionDelay={0.1}
                loading={isLoading}
                disabled={!isLoading && !lastSave}
            >
                {t("continue")}
            </MenuButton>
            <MenuButton
                onClick={() => {
                    canvas.removeAll()
                    navigate(NARRATION_ROUTE)
                    narration.callLabel("start", {
                        navigate: navigate,
                        t: tNarration,
                        notify: (message, variant) => enqueueSnackbar(message, { variant }),
                    }).then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }))
                }}
                transitionDelay={0.2}
            >
                {t("start")}
            </MenuButton>
            <MenuButton
                onClick={() => setGameSaveScreen(true)}
                transitionDelay={0.3}
            >
                {t("load")}
            </MenuButton>
            <MenuButton
                onClick={() => setOpenSettings(true)}
                transitionDelay={0.4}
            >
                {t("settings")}
            </MenuButton>
        </Stack>
    );
}
