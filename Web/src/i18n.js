import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './i18n/en.json'
import tr from './i18n/tr.json'

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en,
      tr
    },
    fallbackLng: "en", // Use English if language is not available
    debug: true,
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
