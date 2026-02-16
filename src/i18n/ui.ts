import en_us from "../assets/i18n/en_us.json";
import fr_fr from "../assets/i18n/fr_fr.json";
import zh_cn from "../assets/i18n/zh_cn.json";

export const languages = {
  en: "English",
  zh: "简体中文",
  fr: "Français",
};

export const defaultLang = "en";

export const ui = {
  en: en_us,
  zh: zh_cn,
  fr: fr_fr,
} as const;

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    // @ts-ignore
    return ui[lang][key] || ui[defaultLang][key];
  };
}
