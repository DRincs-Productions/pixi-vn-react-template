import HistoryIcon from "@mui/icons-material/History";
import { Typography } from "@mui/joy";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";

export default function OpenHistorySettingButton() {
    const { t } = useTranslation(["ui"]);
    const navigate = useNavigate();
    const location = useLocation();
    if (!location.pathname.startsWith("/game")) {
        return null;
    }

    return (
        <SettingButton onClick={() => navigate({ search: ((prev: any) => ({ ...prev, settings: false, history: true })) as any })}>
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
