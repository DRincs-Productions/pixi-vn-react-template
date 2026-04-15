import i18n, { type ReadCallback } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ChainedBackend from "i18next-chained-backend";
import { initReactI18next } from "react-i18next";

class Backend extends ChainedBackend {
    override async read(lng: string, ns: string, callback: ReadCallback) {
        try {
            const object = await getLocalesResource(lng);
            const result = object[ns];
            callback(null, result);
        } catch (error) {
            callback(error as Error, { data: null });
        }
    }
}

export const useI18n = async () => {
    if (!i18n.isInitialized) {
        return await i18n
            .use(Backend)
            .use(LanguageDetector)
            .use(initReactI18next)
            .init({
                debug: false,
                fallbackLng: "en",
                supportedLngs: ["en", "es"],
                interpolation: {
                    escapeValue: false,
                },
                load: "currentOnly",
                detection: {
                    order: ["localStorage"],
                    caches: ["localStorage"],
                },
            });
    }
};

export function getBrowserLang(): string {
    const userLang: string = navigator.language || "en";
    return userLang?.toLocaleLowerCase()?.split("-")[0];
}

function getLocalesResource(lng: string): Promise<Record<string, Record<string, string>>> {
    return import(`./../locales/${lng}.json`);
}

export async function downloadResourceToTranslate() {
    const lng = i18n.options.fallbackLng?.toString() || "en";
    const data = await getLocalesResource(lng);
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
