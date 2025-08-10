import { RegisteredCharacters } from "@drincs/pixi-vn";
import i18n from "i18next";
import Backend from "i18next-chained-backend";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

const getUserLang = (): string => {
    let userLang: string = navigator.language || "en";
    return userLang?.toLocaleLowerCase()?.split("-")[0];
};

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
                            let object = await import(`./locales/strings_${lng}.json`);
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
