import HistoryIcon from "@mui/icons-material/History";
import { Typography } from "@mui/joy";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import { HistoryScreenStore } from "../../stores/useHistoryScreenStore";

export default function OpenHistorySettingButton() {
    const { t } = useTranslation(["ui"]);
    const navigate = useNavigate();

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton
            onClick={() => {
                HistoryScreenStore.toggleOpen();
                navigate({
                    search: ((prev: { settings?: true }): { settings?: true } => {
                        const { settings: _, ...rest } = prev;
                        return rest;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }) as any,
                });
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
