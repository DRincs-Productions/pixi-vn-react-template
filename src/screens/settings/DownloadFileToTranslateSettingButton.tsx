import TranslateIcon from "@mui/icons-material/Translate";
import { Typography } from "@mui/joy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SettingButton from "../../components/SettingButton";
import { downloadResourceToTranslate } from "../../i18n";

export default function DownloadFileToTranslateSettingButton() {
    const { t } = useTranslation(["ui"]);
    const [loading, setLoading] = useState(false);

    // Only show this button in development mode
    if (import.meta.env.PROD) {
        return null;
    }

    return (
        <SettingButton
            key={"download_locale"}
            onClick={() => {
                setLoading(true);
                downloadResourceToTranslate()
                    .then(() => setLoading(false))
                    .catch(() => setLoading(false));
            }}
            disabled={loading}
        >
            <TranslateIcon />
            <Typography level='title-md'>{t("download_locale")}</Typography>
        </SettingButton>
    );
}
