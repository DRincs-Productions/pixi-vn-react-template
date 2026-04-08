import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import { Typography } from "@mui/joy";
import { useStore } from "@tanstack/react-store";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import { AutoInfoStore } from "../../stores/useAutoInfoStore";

export default function AutoSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const autoEnabled = useStore(AutoInfoStore.store, (state) => state.enabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton checked={autoEnabled} onClick={AutoInfoStore.editEnabled}>
            <HdrAutoIcon />
            <Typography level="title-md">{t("auto_forward_time_restricted")}</Typography>
        </SettingButton>
    );
}
