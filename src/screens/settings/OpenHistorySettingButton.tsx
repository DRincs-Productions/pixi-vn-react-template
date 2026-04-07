import HistoryIcon from "@mui/icons-material/History";
import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useLocation } from "@tanstack/react-router";
import SettingButton from "../../components/SettingButton";
import { editOpen as editOpenHistory } from "../../stores/useHistoryScreenStore";
import { setOpen as setOpenSettings } from "../../stores/useSettingsScreenStore";

export default function OpenHistorySettingButton() {
    const { t } = useTranslation(["ui"]);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton
            onClick={() => {
                editOpenHistory();
                setOpenSettings(false);
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
                Alt+H
            </Typography>
        </SettingButton>
    );
}
