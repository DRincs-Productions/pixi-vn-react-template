import FastForwardIcon from "@mui/icons-material/FastForward";
import { Typography } from "@mui/joy";
import { useLocation } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import SettingButton from "@/components/SettingButton";
import { SkipSettings } from "@/lib/stores/skip-settings-store";

export default function SkipSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const enabled = useStore(SkipSettings.store, (state) => state.enabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton checked={enabled} onClick={SkipSettings.toggleEnabled}>
            <FastForwardIcon />
            <Typography level="title-md">{t("skip")}</Typography>
            <Typography
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
                level="body-md"
            >
                Press Space
            </Typography>
        </SettingButton>
    );
}
