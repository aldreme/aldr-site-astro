import { defaultLang, ui } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLocalizedRoute(path: string, locale: string) {
  const isDefault = locale === defaultLang;

  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // If routing to default locale, remove locale prefix if present (since prefixDefaultLocale: false)
  if (isDefault) {
    return cleanPath;
  }

  // For other locales, prepend locale
  return `/${locale}${cleanPath}`;
}

/**
 * Helper to get translated product data
 * Falls back to default locale (English) fields if translation is missing
 */
export function getProductTranslation(product: any, locale: string) {
  if (locale === defaultLang) {
    return {
      name: product.name,
      description: product.description,
      introduction: product.introduction,
      features: product.features,
    };
  }

  const translations = product.translations as Record<string, any> | null;
  const translation = translations?.[locale];

  return {
    name: translation?.name || product.name,
    description: translation?.description || product.description,
    introduction: translation?.introduction || product.introduction,
    features: translation?.features || product.features,
    application_scenarios: translation?.application_scenarios ||
      product.application_scenarios,
    policies: {
      ...product.policies,
      ...(translation?.policies || {}),
    },
    specs: {
      ...product.specs,
      ...(translation?.specs || {}),
      material: {
        ...product.specs?.material,
        ...(translation?.specs?.material || {}),
      },
      process_technology: {
        ...product.specs?.process_technology,
        ...(translation?.specs?.process_technology || {}),
      },
    },
  };
}
