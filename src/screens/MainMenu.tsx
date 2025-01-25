import { addImage, canvas, narration } from "@drincs/pixi-vn";
import Stack from "@mui/joy/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import MenuButton from "../components/MenuButton";
import { NARRATION_ROUTE } from "../constans";
import startLabel from "../labels/startLabel";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../use_query/useQueryInterface";
import useQueryLastSave from "../use_query/useQueryLastSave";
import { useMyNavigate } from "../utils/navigate-utility";
import { loadSave } from "../utils/save-utility";

export default function MainMenu() {
    const navigate = useMyNavigate();
    const setOpenSettings = useSettingsScreenStore((state) => state.setOpen);
    const editHideInterface = useInterfaceStore((state) => state.setHidden);
    const editSaveScreen = useGameSaveScreenStore((state) => state.editOpen);
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(["ui"]);
    const { t: tNarration } = useTranslation(["narration"]);
    const queryClient = useQueryClient();
    const { data: lastSave = null, isLoading } = useQueryLastSave();

    useEffect(() => {
        editHideInterface(false);
        let bg = addImage("background_main_menu");
        bg.load();

        return () => {
            canvas.remove("background_main_menu");
        };
    });

    return (
        <Stack
            direction='column'
            justifyContent='center'
            alignItems='flex-start'
            spacing={{ xs: 1, sm: 2, lg: 3 }}
            sx={{
                height: "100%",
                width: "100%",
                paddingLeft: { xs: 1, sm: 2, md: 4, lg: 6, xl: 8 },
            }}
            component={motion.div}
            initial='closed'
            animate={"open"}
            exit='closed'
        >
            <MenuButton
                onClick={() => {
                    if (!lastSave) {
                        return;
                    }
                    loadSave(lastSave, navigate)
                        .then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }))
                        .catch((e) => {
                            enqueueSnackbar(t("fail_load"), { variant: "error" });
                            console.error(e);
                        });
                }}
                transitionDelay={0.1}
                loading={isLoading}
                disabled={!isLoading && !lastSave}
            >
                {t("continue")}
            </MenuButton>
            <MenuButton
                onClick={() => {
                    canvas.removeAll();
                    navigate(NARRATION_ROUTE);
                    narration
                        .callLabel(startLabel, {
                            navigate: navigate,
                            t: tNarration,
                            notify: (message, variant) => enqueueSnackbar(message, { variant }),
                        })
                        .then(() => queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] }));
                }}
                transitionDelay={0.2}
            >
                {t("start")}
            </MenuButton>
            <MenuButton onClick={editSaveScreen} transitionDelay={0.3}>
                {t("load")}
            </MenuButton>
            <MenuButton onClick={() => setOpenSettings(true)} transitionDelay={0.4}>
                {t("settings")}
            </MenuButton>
        </Stack>
    );
}
