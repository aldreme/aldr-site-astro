import en_us from "@/assets/i18n/en_us.json";
import zh_cn from "@/assets/i18n/zh_cn.json";
import React, { createContext, useContext, useEffect, useState } from "react";

// Admin-specific translations will be merged or handled here. 
// For simplicity, we're sharing the main JSONs but you could have admin-specific ones.
const translations = {
  en: en_us,
  zh: zh_cn
};

export type AdminLocale = 'en' | 'zh';

interface AdminI18nContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: string) => string;
}

const AdminI18nContext = createContext<AdminI18nContextType | undefined>(undefined);

export function AdminI18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('en');

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('admin_locale') as AdminLocale;
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('admin_locale', newLocale);
  };

  const t = (key: string): string => {
    // Current implementation only supports flat keys as per current JSON structure
    // @ts-ignore
    const result = translations[locale][key];

    // Fallback to English if missing
    if (!result && locale !== 'en') {
      // @ts-ignore
      return translations['en'][key] || key;
    }

    return result || key;
  };

  return (
    <AdminI18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminTranslation() {
  const context = useContext(AdminI18nContext);
  if (!context) {
    throw new Error("useAdminTranslation must be used within an AdminI18nProvider");
  }
  return context;
}
