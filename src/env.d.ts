interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_KEY: string;
  // Server-only (build time) — used by the CRM schema generation script.
  readonly FEISHU_APP_ID: string;
  readonly FEISHU_APP_SECRET: string;
  readonly FEISHU_BASE_APP_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user?: any;
  }
}
