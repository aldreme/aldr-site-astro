// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

function ips(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(/\s*,\s*/);
}

/**
 * location function returns the requester's geolocation from the IP retreieved from the `x-forwarded-for` header. 
 */
Deno.serve(async (req) => {
  const clientIps = ips(req);

  console.info(`client ips: ${JSON.stringify(clientIps)}`);

  if (!clientIps) {
    return new Response('cannot find client ip in the request x-forwarded-for header', {
      status: 400,
    });
  }

  const ipToQuery = clientIps[0];

  console.info(`querying the location for ip: ${ipToQuery}`);

  const res = await fetch(
    `https://ipinfo.io/${ipToQuery}?token=${Deno.env.get('IPINFO_TOKEN')}`,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (res.ok) {
    const resJson = await res.json();
    
    console.info(`ip location query response: ${JSON.stringify(resJson)}`);

    const { city, country } = resJson;

    if (!country) {
      return new Response(`no country found for the ip ${ipToQuery}`, {
        status: 404,
      });
    }
    
    console.info(`city: ${city}, country: ${country}`);

    return new Response(
      JSON.stringify({
        city: city,
        country: country,
      }),
      {
       headers: { 'Content-Type': 'application/json' },
      }
    );
  } else {
    return new Response(await res.text(), {
      status: 400,
    });
  }
})