// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Triggering GitHub CICD Workflow");

Deno.serve(async (_req) => {
  const GITHUB_PAT = Deno.env.get("GITHUB_PAT");
  if (!GITHUB_PAT) {
    return new Response(
      JSON.stringify({ error: "Missing GITHUB_PAT environment variable" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const response = await fetch(
      "https://api.github.com/repos/aldreme/aldr-site-astro/dispatches",
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": `Bearer ${GITHUB_PAT}`,
          "User-Agent": "Supabase-Edge-Function",
        },
        body: JSON.stringify({ event_type: "content-update" }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub API Error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: `GitHub API Error: ${response.status}`,
          details: errorText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.log("Successfully triggered GitHub workflow");
    return new Response(
      JSON.stringify({ message: "GitHub workflow triggered successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Internal Server Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
