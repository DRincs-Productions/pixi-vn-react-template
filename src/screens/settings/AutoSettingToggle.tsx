import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import { Typography } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import { autoInfoStore, editAutoEnabled } from "../../stores/useAutoInfoStore";

export default function AutoSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const autoEnabled = useStore(autoInfoStore, (state) => state.enabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton checked={autoEnabled} onClick={editAutoEnabled}>
            <HdrAutoIcon />
            <Typography level="title-md">{t("auto_forward_time_restricted")}</Typography>
        </SettingButton>
    );
}
