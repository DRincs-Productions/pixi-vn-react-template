import AutoModeIcon from "@mui/icons-material/AutoMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
    Box,
    Button,
    FormHelperText,
    FormLabel,
    IconButton,
    ToggleButtonGroup,
    Tooltip,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/providers/theme-provider";
import useQueryIsFullModeScreen, {
    IS_FULL_SCREEN_MODE_USE_QUEY_KEY,
} from "@/hooks/useQueryIsFullModeScreen";

export function SystemControls() {
    return (
        <div className="flex flex-col gap-4">
            <FullScreenSettings />
            <ModeToggle />
        </div>
    );
}

export function ModeToggle() {
    const { setTheme, theme } = useTheme();
    const { t } = useTranslation(["ui"]);

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("theme_mode")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>
                    {t("theme_mode_description")}
                </FormHelperText>
            </Box>
            <ToggleButtonGroup
                value={theme}
                onChange={(_, newValue) => {
                    setTheme(newValue as "light" | "dark" | "system");
                }}
            >
                <Tooltip title="Light Mode">
                    <span>
                        <IconButton value="light">
                            <LightModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="System Mode">
                    <span>
                        <IconButton value="system">
                            <AutoModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="Dark Mode">
                    <span>
                        <IconButton value="dark">
                            <DarkModeIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </ToggleButtonGroup>
        </>
    );
}

export function FullScreenSettings() {
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
                <FormHelperText sx={{ typography: "body-sm" }}>
                    {t("fullscreen_description")}
                </FormHelperText>
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
                        queryClient.invalidateQueries({
                            queryKey: [IS_FULL_SCREEN_MODE_USE_QUEY_KEY],
                        });
                    });
                }}
                startDecorator={isFullScreenMode ? <FullscreenExitIcon /> : <FullscreenIcon />}
            >
                {isFullScreenMode ? t("exit_fullscreen") : t("enter_fullscreen")}
            </Button>
        </>
    );
}
