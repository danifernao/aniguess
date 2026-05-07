import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es.json";
import en from "./locales/en.json";
import { loadGameState } from "./storage/gameState";

const resources = {
  es: {
    translation: es,
  },
  en: {
    translation: en,
  },
};

const localState = loadGameState();

const localeLanguage = new Intl.Locale(navigator.language).language;
const browserLanguage = ["en", "es"].includes(localeLanguage) ? localeLanguage : null;

const language = localState?.settings.language ?? browserLanguage ?? "en";

i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: "en",
});

export default i18n;