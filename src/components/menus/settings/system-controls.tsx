import AutoModeIcon from "@mui/icons-material/AutoMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LightModeIcon from "@mui/icons-material/LightMode";
import TranslateIcon from "@mui/icons-material/Translate";
import {
    Box,
    Button,
    FormHelperText,
    FormLabel,
    IconButton,
    Option,
    Select,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/providers/theme-provider";
import SettingButton from "@/components/SettingButton";
import useQueryIsFullModeScreen, {
    IS_FULL_SCREEN_MODE_USE_QUEY_KEY,
} from "@/hooks/useQueryIsFullModeScreen";
import {
    availableLanguages,
    downloadResourceToTranslate,
    getBrowserLang,
    getSavedLanguage,
    setUserLanguage,
} from "@/lib/i18n";

function getLanguageDisplayName(lng: string): string {
    try {
        return new Intl.DisplayNames([lng], { type: "language" }).of(lng) ?? lng;
    } catch {
        return lng;
    }
}

export function SystemControls() {
    return (
        <div className="flex flex-col gap-4">
            <FullScreenSettings />
            <ModeToggle />
            <LanguageSettings />
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

export function DownloadFileToTranslateSettingButton() {
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
            <Typography level="title-md">{t("download_locale")}</Typography>
        </SettingButton>
    );
}

export function LanguageSettings() {
    const { t } = useTranslation(["ui"]);
    const browserLang = getBrowserLang();
    const [selectedLang, setSelectedLang] = useState<string | undefined>(getSavedLanguage());

    const handleChange = (_: React.SyntheticEvent | null, value: string | null) => {
        const lng = value === "" ? undefined : (value ?? undefined);
        setSelectedLang(lng);
        setUserLanguage(lng);
    };

    return (
        <>
            <Box>
                <FormLabel sx={{ typography: "title-sm" }}>{t("language")}</FormLabel>
                <FormHelperText sx={{ typography: "body-sm" }}>
                    {t("language_description")}
                </FormHelperText>
            </Box>
            <Select value={selectedLang ?? ""} onChange={handleChange}>
                <Option value="">
                    {t("language_browser")} ({getLanguageDisplayName(browserLang)})
                </Option>
                {availableLanguages.map((lng) => (
                    <Option key={lng} value={lng}>
                        {getLanguageDisplayName(lng)}
                    </Option>
                ))}
            </Select>
            <DownloadFileToTranslateSettingButton />
        </>
    );
}
