import { getLanguageDisplayName } from "@/lib/i18n";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

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
        if (!Array.isArray(supportedLngs)) return [];
        return supportedLngs.map((lng) => ({
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
