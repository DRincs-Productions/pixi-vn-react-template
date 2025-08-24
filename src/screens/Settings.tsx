import {
    Box,
    DialogContent,
    DialogTitle,
    Divider,
    Drawer,
    FormControl,
    ModalClose,
    RadioGroup,
    Sheet,
    Typography,
} from "@mui/joy";
import { Theme, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import ReturnMainMenuButton from "../components/ReturnMainMenuButton";
import useEventListener from "../hooks/useKeyDetector";
import useSettingsScreenStore from "../stores/useSettingsScreenStore";
import AutoSettingToggle from "./settings/AutoSettingToggle";
import DialoguesSettings from "./settings/DialoguesSettings";
import DownloadFileToTranslateSettingButton from "./settings/DownloadFileToTranslateSettingButton";
import FullScreenSettings from "./settings/FullScreenSettings";
import HideInterfaceSettingToggle from "./settings/HideInterfaceSettingToggle";
import OpenHistorySettingButton from "./settings/OpenHistorySettingButton";
import SaveLoadSettingButtons from "./settings/SaveLoadSettingButtons";
import SkipSettingToggle from "./settings/SkipSettingToggle";
import ThemeSettings from "./settings/ThemeSettings";

export default function Settings() {
    const open = useSettingsScreenStore((state) => state.open);
    const editOpen = useSettingsScreenStore((state) => state.editOpen);
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    useEventListener({
        type: "keydown",
        listener: (event) => {
            if (event.code == "Escape") {
                editOpen();
            }
        },
    });

    return (
        <Drawer
            variant='plain'
            open={open}
            onClose={editOpen}
            sx={{
                "& .MuiDrawer-content": {
                    width: smScreen ? "100%" : 600,
                    maxWidth: "100%",
                },
            }}
            slotProps={{
                content: {
                    sx: {
                        bgcolor: "transparent",
                        p: { md: 3, sm: 0 },
                        boxShadow: "none",
                    },
                },
            }}
        >
            <Sheet
                sx={{
                    borderRadius: "md",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    height: "100%",
                    overflow: "auto",
                }}
            >
                <DialogTitle>{t("settings")}</DialogTitle>
                <ModalClose />
                <Divider sx={{ mt: "auto" }} />
                <DialogContent sx={{ gap: 2 }}>
                    <FormControl>
                        <RadioGroup>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                                    gap: 1.5,
                                }}
                            >
                                <SkipSettingToggle />
                                <AutoSettingToggle />
                                <OpenHistorySettingButton />
                                <SaveLoadSettingButtons />
                                <HideInterfaceSettingToggle />
                                <DownloadFileToTranslateSettingButton />
                            </Box>
                        </RadioGroup>
                    </FormControl>
                    <Typography level='title-md' fontWeight='bold'>
                        {t("dialogues")}
                    </Typography>
                    <DialoguesSettings />

                    <Typography level='title-md' fontWeight='bold'>
                        {t("display")}
                    </Typography>
                    <FullScreenSettings />
                    <ThemeSettings />
                </DialogContent>
                <Divider sx={{ mt: "auto" }} />
                <ReturnMainMenuButton />
            </Sheet>
        </Drawer>
    );
}
