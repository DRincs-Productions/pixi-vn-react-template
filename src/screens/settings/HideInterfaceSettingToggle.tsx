import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Typography } from "@mui/joy";
import { useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import useInterfaceStore from "../../stores/useInterfaceStore";

export default function HideInterfaceSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const hidden = useInterfaceStore((state) => state.hidden);
    const editHidden = useInterfaceStore((state) => state.toggleHidden);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton checked={hidden} onClick={editHidden}>
            <VisibilityOffIcon />
            <Typography level="title-md">{t("hide_ui")}</Typography>
            <Typography
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
                level="body-md"
            >
                Alt+V
            </Typography>
        </SettingButton>
    );
}
