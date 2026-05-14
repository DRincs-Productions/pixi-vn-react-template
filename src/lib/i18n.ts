import { getInkToJson } from "@/lib/utils/ink-utility";
import { generateJsonInkTranslation } from "@drincs/pixi-vn-ink";
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
                supportedLngs: ["en"],
                interpolation: {
                    escapeValue: false,
                },
                load: "currentOnly",
                detection: {
                    order: ["localStorage"],
                    caches: ["localStorage"],
                },
                // backend: {
                //     backends: [
                //         resourcesToBackend(async (lng: string, ns: string) => {
                //             const object = await getLocalesResource(lng);
                //             return object[ns];
                //         }),
                //     ],
                // },
                // missingInterpolationHandler(_text, value, _options) {
                //     const key = value[1];
                //     if (key === "steph_fullname") {
                //         return "Stephanie";
                //     }
                //     const character = RegisteredCharacters.get(key);
                //     if (character) {
                //         return character.name;
                //     }
                //     return `[${key}]`;
                // },
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

async function generateResourceToTranslate(lng: string): Promise<any> {
    let res = await getLocalesResource(lng);
    res = { ...res };
    if (!res) {
        res = {};
    }
    if (!res.narration) {
        res.narration = {};
    }
    if (res.default) {
        delete res.default;
    }
    for (const element of await getInkToJson()) {
        element && (await generateJsonInkTranslation(element, res.narration));
    }
    return res;
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
