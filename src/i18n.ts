import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import strings_en from '../src/locales/strings_en.json';

const getUserLang = (): string => {
    let userLang: string = navigator.language || "en";
    return userLang?.toLocaleLowerCase()?.split("-")[0];
}

export const useI18n = () => {
    if (!i18n.isInitialized) {
        i18n
            .use(LanguageDetector)
            .use(initReactI18next)
            .init({
                debug: false,
                fallbackLng: 'en',
                lng: getUserLang(),
                interpolation: {
                    escapeValue: false,
                },
                resources: {
                    en: strings_en,
                    // Add more languages here
                }
            });
    }
}
