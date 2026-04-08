import HistoryIcon from "@mui/icons-material/History";
import { Typography } from "@mui/joy";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import useHistoryScreenStore from "../../stores/useHistoryScreenStore";
import useSettingsScreenStore from "../../stores/useSettingsScreenStore";

export default function OpenHistorySettingButton() {
    const { t } = useTranslation(["ui"]);
    const openSettings = useSettingsScreenStore((state) => state.setOpen);
    const toggleOpenHistory = useHistoryScreenStore((state) => state.toggleOpen);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton
            onClick={() => {
                toggleOpenHistory();
                openSettings(false);
            }}
        >
            <HistoryIcon />
            <Typography level="title-md">{t("history")}</Typography>
            <Typography
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
                level="body-md"
            >
                Ctrl+H
            </Typography>
        </SettingButton>
    );
}
