import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import kok from "./locales/kok.json";
import kn from "./locales/kn.json";
import mr from "./locales/mr.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";

export const supportedLanguages = ["en", "hi", "kok", "kn", "mr", "fr", "es"];

export const languageOptions = [
  { code: "en", key: "languages.en" },
  { code: "hi", key: "languages.hi" },
  { code: "kok", key: "languages.kok" },
  { code: "kn", key: "languages.kn" },
  { code: "mr", key: "languages.mr" },
  { code: "fr", key: "languages.fr" },
  { code: "es", key: "languages.es" },
];

function getInitialLanguage() {
  const locales = getLocales();
  if (!locales?.length) {
    return "en";
  }

  const [deviceLocale] = locales;
  const languageTag = String(deviceLocale?.languageTag || "").toLowerCase();
  const languageCode = String(deviceLocale?.languageCode || "").toLowerCase();

  if (supportedLanguages.includes(languageCode)) {
    return languageCode;
  }

  if (languageTag.startsWith("kok")) {
    return "kok";
  }

  return "en";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: getInitialLanguage(),
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kok: { translation: kok },
      kn: { translation: kn },
      mr: { translation: mr },
      fr: { translation: fr },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
