import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es.json";
import en from "./locales/en.json";

const resources = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
};

const storedData = localStorage.getItem("gameState");
const parsedData = storedData ? JSON.parse(storedData) : null;

const localeLanguage = new Intl.Locale(navigator.language).language;
const browserLanguage = ["en", "es"].includes(localeLanguage) ? localeLanguage : null;

const language = parsedData?.settings.language ?? browserLanguage ?? "en";

i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: "en",
});

export default i18n;