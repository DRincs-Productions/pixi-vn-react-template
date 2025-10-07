import { RegisteredCharacters } from "@drincs/pixi-vn";
import { generateJsonInkTranslation } from "@drincs/pixi-vn-ink";
import i18n from "i18next";
import Backend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import { convertInkToJson } from "./utils/ink-utility";

function getUserLang(): string {
    let userLang: string = navigator.language || "en";
    return userLang?.toLocaleLowerCase()?.split("-")[0];
}

function getLocalesResource(lng: string): Promise<any> {
    return import(`./locales/strings_${lng}.json`);
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
    for (const element of await convertInkToJson()) {
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

export const useI18n = () => {
    if (!i18n.isInitialized) {
        i18n.use(Backend)
            .use(initReactI18next)
            .init({
                debug: false,
                fallbackLng: "en",
                lng: getUserLang(),
                interpolation: {
                    escapeValue: false,
                },
                load: "currentOnly",
                backend: {
                    backends: [
                        resourcesToBackend(async (lng: string, ns: string) => {
                            let object = await getLocalesResource(lng);
                            return object[ns];
                        }),
                    ],
                },
                missingInterpolationHandler(_text, value, _options) {
                    let key = value[1];
                    if (key === "steph_fullname") {
                        return "Stephanie";
                    }
                    let character = RegisteredCharacters.get(key);
                    if (character) {
                        return character.name;
                    }
                    return `[${key}]`;
                },
            });
    }
};
