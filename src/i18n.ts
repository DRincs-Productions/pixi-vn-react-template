import i18n from "i18next";
import Backend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

function getUserLang(): string {
    let userLang: string = navigator.language || "en";
    return userLang?.toLocaleLowerCase()?.split("-")[0];
}

function getLocalesResource(lng: string): Promise<any> {
    return import(`./locales/strings_${lng}.json`);
}

function generateResourceToTranslate(lng: string): Promise<any> {
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
            });
    }
};
