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
import { type Theme, useMediaQuery } from "@mui/material";
import { useHotkeys } from "@tanstack/react-hotkeys";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import AutoSettingToggle from "@/components/menus/settings/AutoSettingToggle";
import DialoguesSettings from "@/components/menus/settings/DialoguesSettings";
import DownloadFileToTranslateSettingButton from "@/components/menus/settings/DownloadFileToTranslateSettingButton";
import FullScreenSettings from "@/components/menus/settings/FullScreenSettings";
import HideInterfaceSettingToggle from "@/components/menus/settings/HideInterfaceSettingToggle";
import OpenHistorySettingButton from "@/components/menus/settings/OpenHistorySettingButton";
import SaveLoadSettingButtons from "@/components/menus/settings/SaveLoadSettingButtons";
import SkipSettingToggle from "@/components/menus/settings/SkipSettingToggle";
import SoundSettings from "@/components/menus/settings/SoundSettings";
import ThemeSettings from "@/components/menus/settings/ThemeSettings";
import { useSearchParamState, useSetSearchParamState } from "../../../hooks/useSearchParamState";
import ReturnMainMenuButton from "../../ReturnMainMenuButton";

export default function Settings() {
    const open = useSearchParamState<boolean>("settings");
    const setOpen = useSetSearchParamState<boolean>("settings");
    const { t } = useTranslation(["ui"]);
    const smScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const toggleOpen = useCallback(() => {
        setOpen(open ? undefined : true);
    }, [open, setOpen]);

    useHotkeys([
        {
            hotkey: "Escape",
            callback: toggleOpen,
        },
    ]);

    return (
        <Drawer
            variant="plain"
            open={open ?? false}
            onClose={toggleOpen}
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
                    <Typography level="title-md" fontWeight="bold">
                        {t("dialogues")}
                    </Typography>
                    <DialoguesSettings />

                    <Typography level="title-md" fontWeight="bold">
                        {t("sound")}
                    </Typography>
                    <SoundSettings />
                    <Typography level="title-md" fontWeight="bold">
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
