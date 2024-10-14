import { addImage, canvas, clearAllGameDatas, narration, pixivnTestStartLabel } from '@drincs/pixi-vn';
import Stack from '@mui/joy/Stack';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import { hideInterfaceState } from '../atoms/hideInterfaceState';
import { openGameSaveScreenState } from '../atoms/openGameSaveScreenState';
import { openSettingsState } from '../atoms/openSettingsState';
import MenuButton from '../components/MenuButton';
import { INTERFACE_DATA_USE_QUEY_KEY } from '../use_query/useQueryInterface';
import useQueryLastSave from '../use_query/useQueryLastSave';
import { useMyNavigate } from '../utilities/navigate-utility';
import { loadSave } from '../utilities/save-utility';

export default function MainMenu() {
    const navigate = useMyNavigate();
    const setOpenSettings = useSetRecoilState(openSettingsState);
    const setHideInterface = useSetRecoilState(hideInterfaceState);
    const setGameSaveScreen = useSetRecoilState(openGameSaveScreenState);
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(["interface"]);
    const { t: tNarration } = useTranslation(["narration"]);
    const queryClient = useQueryClient()
    const { data: lastSave = null, isLoading } = useQueryLastSave()

    useEffect(() => {
        setHideInterface(false)
        clearAllGameDatas()
        let bg = addImage("background_main_menu", "https://andreannaking.com/wp-content/uploads/2021/12/Download-Beautiful-Nature-Landscape-Hd-Wallpaper-Full-HD-Wallpapers.jpg")
        bg.load()
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
                    navigate("/narration")
                    narration.callLabel(pixivnTestStartLabel, {
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
