import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "name, description, introduction, application_scenarios, policies, specs",
    );

  if (error) {
    console.error(error);
    return;
  }

  console.log(JSON.stringify(products, null, 2));
}

inspectProducts();
