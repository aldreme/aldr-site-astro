import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load env vars
const envPath = path.resolve(process.cwd(), ".env.local");
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.PUBLIC_SUPABASE_URL ||
  process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.PUBLIC_SUPABASE_KEY ||
  process.env.PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("name, description, application_scenarios, features");

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

fetchProducts();
