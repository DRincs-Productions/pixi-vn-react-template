import { DownloadIcon, FullscreenIcon, MoonIcon, MonitorIcon, SunIcon } from "lucide-react";
import { useState } from "react";
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
    availableLanguages,
    downloadResourceToTranslate,
    getBrowserLang,
    getSavedLanguage,
    setUserLanguage,
} from "@/lib/i18n";
import { useQueryClient } from "@tanstack/react-query";

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
        <div className="flex flex-col gap-1.5">
            <div>
                <p className="text-sm font-medium leading-none">{t("theme_mode")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t("theme_mode_description")}</p>
            </div>
            <div className="flex gap-1 rounded-lg border p-1 w-fit">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
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
                        <TooltipTrigger asChild>
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
                        <TooltipTrigger asChild>
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
        <div className="flex flex-col gap-1.5">
            <div>
                <p className="text-sm font-medium leading-none">{t("fullscreen")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {t("fullscreen_description")}
                </p>
            </div>
            <div>
                <Button
                    variant="outline"
                    disabled={loading}
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
        </div>
    );
}

export function LanguageSettings() {
    const { t } = useTranslation(["ui"]);
    const browserLang = getBrowserLang();
    const [selectedLang, setSelectedLang] = useState<string>(
        getSavedLanguage() ?? browserLang,
    );

    const handleChange = (value: string) => {
        setSelectedLang(value);
        // If the selected language matches the browser language, store undefined
        // so the app follows the system preference
        setUserLanguage(value === browserLang ? undefined : value);
    };

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
                            <TooltipTrigger asChild>
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
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {availableLanguages.map((lng) => (
                        <SelectItem key={lng} value={lng}>
                            {getLanguageDisplayName(lng)}
                            {lng === browserLang ? " (system)" : ""}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
