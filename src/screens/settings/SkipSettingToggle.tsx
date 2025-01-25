import FastForwardIcon from "@mui/icons-material/FastForward";
import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import SettingButton from "../../components/SettingButton";
import useSkipStore from "../../stores/useSkipStore";

export default function SkipSettingToggle() {
    const { t } = useTranslation(["ui"]);
    const enabled = useSkipStore((state) => state.enabled);
    const edit = useSkipStore((state) => state.editEnabled);

    const location = useLocation();
    if (location.pathname === "/") {
        return null;
    }

    return (
        <SettingButton checked={enabled} onClick={edit}>
            <FastForwardIcon />
            <Typography level='title-md'>{t("skip")}</Typography>
            <Typography
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
                level='body-md'
            >
                Press Space
            </Typography>
        </SettingButton>
    );
}
