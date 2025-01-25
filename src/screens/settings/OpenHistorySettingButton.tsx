import HistoryIcon from "@mui/icons-material/History";
import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import SettingButton from "../../components/SettingButton";
import useHistoryScreenStore from "../../stores/useHistoryScreenStore";
import useSettingsScreenStore from "../../stores/useSettingsScreenStore";

export default function OpenHistorySettingButton() {
    const { t } = useTranslation(["ui"]);
    const openSettings = useSettingsScreenStore((state) => state.setOpen);
    const editOpenHistory = useHistoryScreenStore((state) => state.editOpen);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton
            onClick={() => {
                editOpenHistory();
                openSettings(false);
            }}
        >
            <HistoryIcon />
            <Typography level='title-md'>{t("history")}</Typography>
            <Typography
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
                level='body-md'
            >
                Alt+H
            </Typography>
        </SettingButton>
    );
}
