// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders } from '../_shared/cors.ts';
import supabase from "../_shared/supabaseAdmin.ts";

const TABLE_NAME = 'customer_request_for_quotes';

async function createCxRFQ(req: Request) {
  console.info('received a new customer RFQ request');

  const body = await req.json();
  const cxRFQ = body.rfq;

  console.info(`payload: ${JSON.stringify(cxRFQ)}`);

  const { error } = await supabase.from(TABLE_NAME).insert(cxRFQ);
  if (error) {
    console.error('failed to insert customer RFQ into the database');
    throw error;
  }

  console.info('successfully inserted customer RFQ into the database');

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
        return await createCxRFQ(req);
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
    console.error(`failed to process the request for customer RFQ, error: ${JSON.stringify(error)}`);

    return new Response(JSON.stringify({ error: JSON.stringify(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})