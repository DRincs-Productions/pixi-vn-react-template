import { canvas, ImageSprite, narration } from "@drincs/pixi-vn";
import Stack from "@mui/joy/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect } from "react";
import MenuButton from "../components/MenuButton";
import { CANVAS_UI_LAYER_NAME, NARRATION_ROUTE } from "../constans";
import useGameProps from "../hooks/useGameProps";
import useGameSaveScreenStore from "../stores/useGameSaveScreenStore";
import useInterfaceStore from "../stores/useInterfaceStore";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import { INTERFACE_DATA_USE_QUEY_KEY } from "../use_query/useQueryInterface";
import useQueryLastSave from "../use_query/useQueryLastSave";
import { loadSave } from "../utils/save-utility";

export default function MainMenu() {
    const setOpenSettings = useSettingsScreenStore((state) => state.setOpen);
    const editHideInterface = useInterfaceStore((state) => state.setHidden);
    const editSaveScreen = useGameSaveScreenStore((state) => state.editOpen);
    const queryClient = useQueryClient();
    const { data: lastSave = null, isLoading } = useQueryLastSave();
    const gameProps = useGameProps();
    const { uiTransition: t, navigate, notify } = gameProps;

    useEffect(() => {
        editHideInterface(false);
        let bg = new ImageSprite({}, "background_main_menu");
        bg.load();
        let layer = canvas.getLayer(CANVAS_UI_LAYER_NAME);
        if (layer) {
            layer.addChild(bg);
        }

        return () => {
            canvas.getLayer(CANVAS_UI_LAYER_NAME)?.removeChildren();
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
                            notify(t("fail_load"), { variant: "error" });
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
                    narration.callLabel("start", gameProps).then(() => {
                        queryClient.invalidateQueries({ queryKey: [INTERFACE_DATA_USE_QUEY_KEY] });
                        navigate(NARRATION_ROUTE);
                    });
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
