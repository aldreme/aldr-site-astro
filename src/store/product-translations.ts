import { supabase } from "@/lib/supabase";
import { atom } from "nanostores";

export interface ProductTranslation {
  name: string;
  description?: string;
  [key: string]: any;
}

export interface ProductTranslationsMap {
  [productName: string]: {
    [lang: string]: ProductTranslation;
  };
}

export const productTranslations = atom<ProductTranslationsMap>({});

export async function fetchProductTranslations(productNames?: string[]) {
  const currentMap = productTranslations.get();

  // If specific names requested, filter out what we already have
  let missingNames = productNames;
  if (productNames && productNames.length > 0) {
    missingNames = productNames.filter((name) => !currentMap[name]);
    if (missingNames.length === 0) return; // All requested are already loaded
  }

  if (!missingNames || missingNames.length === 0) {
    return;
  }

  const { data, error } = await supabase
    .from("products")
    .select("name, translations")
    .in("name", missingNames);

  if (error) {
    console.error("Error fetching product translations:", error);
    return;
  }

  const map: ProductTranslationsMap = { ...productTranslations.get() };

  data?.forEach((product) => {
    if (product.translations) {
      map[product.name] = product.translations;
    }
  });

  productTranslations.set(map);
}
