import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import { Typography } from "@mui/joy";
import { useLocation } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import { AutoSettings } from "../../stores/auto-settings-store";

export default function AutoSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const autoEnabled = useStore(AutoSettings.store, (state) => state.enabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton checked={autoEnabled} onClick={AutoSettings.toggleEnabled}>
            <HdrAutoIcon />
            <Typography level="title-md">{t("auto_forward_time_restricted")}</Typography>
        </SettingButton>
    );
}
