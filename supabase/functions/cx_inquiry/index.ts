// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders } from '../_shared/cors.ts';
import supabase from "../_shared/supabaseAdmin.ts";

const TABLE_NAME = 'cx_inquiries';

async function createCxInquiry(req: Request) {
  const body = await req.json();
  const cxInquiry = body.inquiry;
  const { error } = await supabase.from(TABLE_NAME).insert(cxInquiry);
  if (error) throw error;

  return new Response(
    null,
    {
      headers: corsHeaders,
      status: 201,
    }
  )
}

Deno.serve(async (req) => {
  const { method } = req;

  // This is needed if you're planning to invoke your function from a browser.
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    switch(method) {
      case 'POST':
        return await createCxInquiry(req);
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
    console.error(error);

    return new Response(JSON.stringify({ error: JSON.stringify(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})