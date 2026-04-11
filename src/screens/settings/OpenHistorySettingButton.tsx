import HistoryIcon from "@mui/icons-material/History";
import { Typography } from "@mui/joy";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import { useSetSearchParamState } from "../../hooks/useSearchParamState";

export default function OpenHistorySettingButton() {
    const { t } = useTranslation(["ui"]);
    const location = useLocation();
    const setSettings = useSetSearchParamState<boolean>("settings");
    const setHistory = useSetSearchParamState<boolean>("history");
    if (!location.pathname.startsWith("/game")) {
        return null;
    }

    return (
        <SettingButton
            onClick={() => {
                setSettings(undefined);
                setHistory(true);
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
