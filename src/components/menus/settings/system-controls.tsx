import { useQueryClient } from "@tanstack/react-query";
import { DownloadIcon, FullscreenIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useQueryIsFullModeScreen, {
    IS_FULL_SCREEN_MODE_USE_QUEY_KEY,
} from "@/hooks/useQueryIsFullModeScreen";
import {
    downloadResourceToTranslate,
    getBrowserLang,
    getLanguageDisplayName,
    LANGUAGE_STORAGE_KEY,
} from "@/lib/i18n";

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
        <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
                <p className="text-sm font-medium leading-none">{t("theme_mode")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("theme_mode_description")}</p>
            </div>
            <div className="flex gap-1 rounded-lg border p-1 shrink-0">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Toggle
                                size="sm"
                                pressed={theme === "light"}
                                onPressedChange={() => setTheme("light")}
                                aria-label="Light Mode"
                            >
                                <SunIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Light Mode</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Toggle
                                size="sm"
                                pressed={theme === "system"}
                                onPressedChange={() => setTheme("system")}
                                aria-label="System Mode"
                            >
                                <MonitorIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>System Mode</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger>
                            <Toggle
                                size="sm"
                                pressed={theme === "dark"}
                                onPressedChange={() => setTheme("dark")}
                                aria-label="Dark Mode"
                            >
                                <MoonIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>Dark Mode</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
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
        <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
                <p className="text-sm font-medium leading-none">{t("fullscreen")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("fullscreen_description")}</p>
            </div>
            <Button
                variant="outline"
                size="sm"
                disabled={loading}
                className="shrink-0"
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
            >
                <FullscreenIcon />
                {isFullScreenMode ? t("exit_fullscreen") : t("enter_fullscreen")}
            </Button>
        </div>
    );
}

export function LanguageSettings() {
    const {
        t,
        i18n: {
            options: { fallbackLng },
            language,
            languages,
            changeLanguage,
        },
    } = useTranslation(["ui"]);

    const selectedLang = useMemo(() => {
        if (languages.includes(language)) {
            return language;
        }
        if (typeof fallbackLng === "string") {
            return fallbackLng;
        }
        return language;
    }, [language, languages, fallbackLng]);
    const displayLabel = useMemo(() => {
        const browserLang = getBrowserLang();
        return (
            getLanguageDisplayName(selectedLang) + (selectedLang === browserLang ? " (system)" : "")
        );
    }, [selectedLang]);

    const handleChange = useCallback(
        (value: string | null) => {
            if (!value) return;
            const browserLang = getBrowserLang();
            changeLanguage(value);
            if (value === browserLang) {
                localStorage.removeItem(LANGUAGE_STORAGE_KEY);
            } else {
                localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
            }
        },
        [changeLanguage],
    );
    const languageOptions = useMemo(() => {
        const browserLang = getBrowserLang();
        return languages.map((lng) => ({
            value: lng,
            label: getLanguageDisplayName(lng) + (lng === browserLang ? ` (${t("system")})` : ""),
        }));
    }, [languages, t]);

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                    <p className="text-sm font-medium leading-none">{t("language")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {t("language_description")}
                    </p>
                </div>
                {!import.meta.env.PROD && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        downloadResourceToTranslate();
                                    }}
                                    aria-label={t("download_locale")}
                                >
                                    <DownloadIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t("download_locale")}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <Select value={selectedLang} onValueChange={handleChange}>
                <SelectTrigger className="w-full">
                    {/* Render display name explicitly so the trigger always shows text, not the value code */}
                    <SelectValue>{displayLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {languageOptions.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
