import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

function getLanguageDisplayName(lng: string): string {
    try {
        const name = new Intl.DisplayNames([lng], { type: "language" }).of(lng);
        if (name) return name.charAt(0).toUpperCase() + name.slice(1);
        return lng;
    } catch {
        return lng;
    }
}

export function useLanguageSettings() {
    const {
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
        return getLanguageDisplayName(selectedLang);
    }, [selectedLang]);

    const handleChange = useCallback(
        (value: string | null) => {
            if (!value) return;
            changeLanguage(value);
        },
        [changeLanguage],
    );

    const languageOptions = useMemo(() => {
        if (supportedLngs === false) return [];
        return supportedLngs
            .filter((option) => option !== "cimode")
            .map((lng) => ({
                value: lng,
                label: getLanguageDisplayName(lng),
            }));
    }, [supportedLngs]);

    return {
        selectedLang,
        displayLabel,
        handleChange,
        languageOptions,
    };
}
