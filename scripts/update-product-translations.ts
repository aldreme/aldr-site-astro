import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const translationsMap: any = {};

async function updateProductTranslations() {
  console.log("Fetching products...");
  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  console.log(`Found ${products.length} products. Starting update...`);

  for (const product of products) {
    let translations = product.translations || {};
    const manualTranslation = translationsMap[product.name];

    if (manualTranslation) {
      // Merge manual translations
      translations.es = { ...translations.es, ...manualTranslation.es };
      translations.ar = { ...translations.ar, ...manualTranslation.ar };

      // Deep clone specs to avoid shared reference issues and ensure clean state
      translations.es.specs = product.specs
        ? JSON.parse(JSON.stringify(product.specs))
        : {};
      translations.ar.specs = product.specs
        ? JSON.parse(JSON.stringify(product.specs))
        : {};

      // Merge material and process technology if available in manual translation
      if (manualTranslation.es.material) {
        translations.es.specs.material = {
          ...translations.es.specs.material,
          value: manualTranslation.es.material,
        };
      }
      if (manualTranslation.es.process_technology) {
        translations.es.specs.process_technology = {
          ...translations.es.specs.process_technology,
          value: manualTranslation.es.process_technology,
        };
      }
      if (manualTranslation.es.application_scenarios) {
        translations.es.application_scenarios =
          manualTranslation.es.application_scenarios;
      }
      if (manualTranslation.es.policies) {
        translations.es.policies = manualTranslation.es.policies;
      }

      if (manualTranslation.ar.material) {
        translations.ar.specs.material = {
          ...translations.ar.specs.material,
          value: manualTranslation.ar.material,
        };
      }
      if (manualTranslation.ar.process_technology) {
        translations.ar.specs.process_technology = {
          ...translations.ar.specs.process_technology,
          value: manualTranslation.ar.process_technology,
        };
      }
      if (manualTranslation.ar.application_scenarios) {
        translations.ar.application_scenarios =
          manualTranslation.ar.application_scenarios;
      }
      if (manualTranslation.ar.policies) {
        translations.ar.policies = manualTranslation.ar.policies;
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({ translations })
        .eq("id", product.id);

      if (updateError) {
        console.error(`Failed to update product ${product.id}:`, updateError);
      } else {
        console.log(`Updated product: ${product.name}`);
      }
    } else {
      console.log(`No manual translation found for: ${product.name}`);
      // Fallback to prefix logic only if absolutely necessary, but user dislikes it.
      // Skipping logic here to respect user preference for "real" translations.
    }
  }

  console.log("Update complete.");
}

updateProductTranslations();
