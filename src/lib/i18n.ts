import i18n from "i18next";
import Backend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

export const LANGUAGE_STORAGE_KEY = "pixi-vn-language";

// Collect available language codes from locale files at build time
const _localeModules = import.meta.glob("/src/locales/strings_*.json");
export const availableLanguages: string[] = Object.keys(_localeModules)
    .map((path) => {
        const match = path.match(/strings_(.+)\.json$/);
        return match ? match[1] : null;
    })
    .filter(Boolean) as string[];

function getUserLang(): string {
    const userLang: string = navigator.language || "en";
    return userLang?.toLocaleLowerCase()?.split("-")[0];
}

export function getBrowserLang(): string {
    return getUserLang();
}

export function getSavedLanguage(): string | undefined {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || undefined;
}

export async function setUserLanguage(lng: string | undefined | null): Promise<void> {
    if (!lng) {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        await i18n.changeLanguage(getUserLang());
    } else {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
        await i18n.changeLanguage(lng);
    }
}

export function getLanguageDisplayName(lng: string): string {
    try {
        return new Intl.DisplayNames([lng], { type: "language" }).of(lng) ?? lng;
    } catch {
        return lng;
    }
}

function getLocalesResource(lng: string): Promise<Record<string, unknown>> {
    return import(`./../locales/strings_${lng}.json`);
}

function generateResourceToTranslate(lng: string): Promise<Record<string, unknown>> {
    return getLocalesResource(lng);
}

export async function downloadResourceToTranslate() {
    const lng = i18n.options.fallbackLng?.toString() || "en";
    const data = await generateResourceToTranslate(lng);
    const jsonString = JSON.stringify(data);
    // download the save data as a JSON file
    const blob = new Blob([jsonString], { type: "application/json" });
    // download the file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `strings_${lng}.json`;
    a.click();
}

export const useI18n = () => {
    if (!i18n.isInitialized) {
        i18n.use(Backend)
            .use(initReactI18next)
            .init({
                debug: false,
                fallbackLng: "en",
                lng: getSavedLanguage() || getUserLang(),
                interpolation: {
                    escapeValue: false,
                },
                load: "currentOnly",
                backend: {
                    backends: [
                        resourcesToBackend(async (lng: string, ns: string) => {
                            const object = await getLocalesResource(lng);
                            return object[ns];
                        }),
                    ],
                },
            });
    }
};
