import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json'
import ru from './locales/ru/translation.json'

const resources = {
    en: {
        translation: en
    },
    ru: {
        translation: ru
    }
};

const locale = window.location.pathname.replace(/^\/([^\/]+).*/i, '$1');

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: locale,
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
