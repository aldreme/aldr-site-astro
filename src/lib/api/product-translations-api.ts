import { supabase } from "@/lib/supabase";

export interface ProductTranslations {
  [lang: string]: {
    name?: string;
    description?: string;
    introduction?: string;
    features?: string[];
    specs?: any;
    tags?: string[];
    application_scenarios?: string[];
    policies?: {
      shipping?: string;
      warranty?: string;
      return?: string;
    };
    [key: string]: any;
  };
}

/**
 * Fetch translations for a specific product.
 */
export async function getProductTranslations(productId: string): Promise<ProductTranslations | null> {
  const { data, error } = await supabase
    .from("products")
    .select("translations")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error fetching product translations:", error);
    return null;
  }
  
  return data?.translations as ProductTranslations || {};
}

/**
 * Replace the entire translations object for a specific product.
 */
export async function saveProductTranslations(productId: string, translations: ProductTranslations): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .update({ translations })
    .eq("id", productId);

  if (error) {
    console.error("Error saving product translations:", error);
    return false;
  }
  return true;
}

/**
 * Upsert (merge) translation data for a specific language into the existing product translations.
 * Does not overwrite other existing languages.
 */
export async function upsertProductTranslation(productId: string, lang: string, data: any): Promise<boolean> {
  // First fetch the existing translations
  const currentTranslations = await getProductTranslations(productId);
  if (!currentTranslations) return false;

  const updatedTranslations = { ...currentTranslations };
  updatedTranslations[lang] = {
    ...(updatedTranslations[lang] || {}),
    ...data
  };

  return await saveProductTranslations(productId, updatedTranslations);
}

/**
 * Remove a specific language from the product's translations object.
 */
export async function removeProductTranslation(productId: string, lang: string): Promise<boolean> {
  const currentTranslations = await getProductTranslations(productId);
  if (!currentTranslations) return false;

  const updatedTranslations = { ...currentTranslations };
  delete updatedTranslations[lang];

  return await saveProductTranslations(productId, updatedTranslations);
}
