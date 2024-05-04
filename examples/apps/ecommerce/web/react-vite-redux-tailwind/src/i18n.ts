import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import { DEFAULT_LANGUAGE, LOCAL_STORAGE_KEYS, SUPPORTED_LANGUAGES } from "./constants";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    lng: localStorage.getItem(LOCAL_STORAGE_KEYS.selectedLanguage) || DEFAULT_LANGUAGE,
    debug: false,
    supportedLngs: Object.values(SUPPORTED_LANGUAGES)
  });

export default i18n;
