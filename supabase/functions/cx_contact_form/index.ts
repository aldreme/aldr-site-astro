// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders } from "../_shared/cors.ts";
import supabase from "../_shared/supabaseAdmin.ts";

const TABLE_NAME = "cx_contact_messages";

async function createCxContactMessage(req: Request) {
  console.info("received a new customer contact message");

  const body = await req.json();
  const contactMessage = body.contact_message;

  if (!contactMessage) {
    throw new Error("missing contact_message in request body");
  }

  console.info(`payload: ${JSON.stringify(contactMessage)}`);

  const { error } = await supabase.from(TABLE_NAME).insert(contactMessage);
  if (error) {
    console.error(
      "failed to insert customer contact message into the database",
    );
    throw error;
  }

  console.info(
    "successfully inserted customer contact message into the database",
  );

  return new Response(
    JSON.stringify({ message: "success" }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201,
    },
  );
}

Deno.serve(async (req) => {
  const { method } = req;

  // Handle CORS preflight
  if (method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    switch (method) {
      case "POST":
        return await createCxContactMessage(req);
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
      `failed to process contact message, error: ${
        error.message || JSON.stringify(error)
      }`,
    );

    return new Response(
      JSON.stringify({ error: error.message || JSON.stringify(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
