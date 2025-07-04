import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box, Button, FormHelperText, FormLabel } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useQueryIsFullModeScreen, { IS_FULL_SCREEN_MODE_USE_QUEY_KEY } from "../../hooks/useQueryIsFullModeScreen";

export default function FullScreenSettings() {
    const { data: isFullScreenMode } = useQueryIsFullModeScreen();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const { t } = useTranslation(["ui"]);

    if (document.fullscreenEnabled === false) {
        return null;
    }

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("fullscreen")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>{t("fullscreen_description")}</FormHelperText>
            </Box>
            <Button
                loading={loading}
                onClick={() => {
                    setLoading(true);
                    let promise: Promise<void>;
                    if (isFullScreenMode) {
                        promise = document.exitFullscreen();
                    } else {
                        promise = document.documentElement.requestFullscreen();
                    }
                    promise.finally(() => {
                        setLoading(false);
                        queryClient.invalidateQueries({ queryKey: [IS_FULL_SCREEN_MODE_USE_QUEY_KEY] });
                    });
                }}
                startDecorator={isFullScreenMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
            >
                {isFullScreenMode ? t("exit_fullscreen") : t("enter_fullscreen")}
            </Button>
        </>
    );
}
