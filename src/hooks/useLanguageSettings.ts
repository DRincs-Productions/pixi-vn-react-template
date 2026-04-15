import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getBrowserLang, getLanguageDisplayName, LANGUAGE_STORAGE_KEY } from "@/lib/i18n";

export function useLanguageSettings() {
    const {
        t,
        i18n: {
            options: { fallbackLng, supportedLngs = [] },
            language,
            changeLanguage,
        },
    } = useTranslation(["ui"]);

    const selectedLang = useMemo(() => {
        if (Array.isArray(supportedLngs) && supportedLngs.includes(language)) {
            return language;
        }
        if (typeof fallbackLng === "string") {
            return fallbackLng;
        }
        return language;
    }, [language, supportedLngs, fallbackLng]);

    const displayLabel = useMemo(() => {
        const browserLang = getBrowserLang();
        return (
            getLanguageDisplayName(selectedLang) +
            (selectedLang === browserLang ? ` (${t("system")})` : "")
        );
    }, [selectedLang, t]);

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
        if (!Array.isArray(supportedLngs)) return [];
        return supportedLngs.map((lng) => ({
            value: lng,
            label: getLanguageDisplayName(lng) + (lng === browserLang ? ` (${t("system")})` : ""),
        }));
    }, [supportedLngs, t]);

    return {
        selectedLang,
        displayLabel,
        handleChange,
        languageOptions,
    };
}
