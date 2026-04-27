import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

import { corsHeaders } from "../_shared/cors.ts";
import supabase from "../_shared/supabaseAdmin.ts";

const TABLE_NAME = "short_urls";
const BASE_URL =
  Deno.env.get("SUPABASE_URL")?.replace(
    ".supabase.co",
    ".supabase.co/functions/v1/url_shortener",
  ) || "http://localhost:54321/functions/v1/url_shortener";

// Generate a random 6-character alphanumeric slug
function generateLocalSlug() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function createShortUrl(req: Request) {
  console.info("received a new request to create a short url");

  // Verify Auth
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Missing Authorization header" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Create a user-scoped client to perform a secure remote token verification
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_ANON_KEY') || '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    console.error("Auth error or user not found", authError);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!user.email || !user.email.endsWith("@aldreme.com")) {
    console.error("User email not aldreme.com", user.email);
    return new Response(
      JSON.stringify({ error: "Forbidden: Valid @aldreme.com email required" }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const body = await req.json();
  const { slug, target_url, expired_at } = body;

  if (!target_url) {
    return new Response(JSON.stringify({ error: "Missing target_url" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let finalSlug = slug;
  let data = null;

  if (slug) {
    // User provided a custom slug, do not retry on collision
    const payload: Record<string, string> = {
      slug: slug,
      target_url: target_url,
    };

    if (expired_at) {
      payload.expired_at = expired_at;
    }

    const { data: insertData, error: insertError } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return new Response(
          JSON.stringify({ error: "Custom slug already exists" }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      console.error(
        "failed to insert short URL into the database",
        insertError,
      );
      throw insertError;
    }
    data = insertData;
  } else {
    // Retry logic for generating random slug
    let success = false;
    const maxRetries = 5;
    let retries = 0;

    while (!success && retries < maxRetries) {
      finalSlug = generateLocalSlug();

      const payload: Record<string, string> = {
        slug: finalSlug,
        target_url: target_url,
      };

      if (expired_at) {
        payload.expired_at = expired_at;
      }

      const { data: insertData, error: insertError } = await supabase
        .from(TABLE_NAME)
        .insert(payload)
        .select()
        .single();

      if (insertError) {
        // 23505 is the PostgreSQL unique constraint violation error code
        if (insertError.code === "23505") {
          // Random slug conflicted, loop again
          retries++;
          console.warn(`Slug conflict ${finalSlug}, retrying...`);
        } else {
          console.error(
            "failed to insert short URL into the database",
            insertError,
          );
          throw insertError;
        }
      } else {
        success = true;
        data = insertData;
      }
    }

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Failed to generate a unique short url after multiple retries",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  }

  console.info(`successfully created short URL: ${finalSlug}`);

  return new Response(
    JSON.stringify({
      ...data,
      short_url: `${BASE_URL}?slug=${finalSlug}`,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201,
    },
  );
}

async function handleRedirect(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response(JSON.stringify({ error: "Missing slug parameter" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("target_url, expired_at")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }

  if (data.expired_at) {
    const expiredAt = new Date(data.expired_at);
    if (new Date() > expiredAt) {
      return new Response("URL has expired", {
        status: 410,
        headers: corsHeaders,
      });
    }
  }

  return new Response(null, {
    status: 301,
    headers: {
      ...corsHeaders,
      "Location": data.target_url,
    },
  });
}

Deno.serve(async (req) => {
  const { method } = req;

  // This is needed if you're planning to invoke your function from a browser.
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    switch (method) {
      case "POST":
        return await createShortUrl(req);
      case "GET":
        return await handleRedirect(req);
      default:
        return new Response(
          null,
          {
            headers: corsHeaders,
            status: 405,
          },
        );
    }
  } catch (error) {
    console.error(
      `failed to process the request, error: ${JSON.stringify(error)}`,
    );

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
