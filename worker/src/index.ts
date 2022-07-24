/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  TIME_KV: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

let corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response("OK", {
        headers: corsHeaders,
      });
    } else if (request.method === "GET") {
      return await handleGet(request, env);
    } else if (request.method === "POST") {
      return await handlePost(request, env);
    }
  },
};

function createErrorResponse(message: string) {
  return new Response(
    new Blob(
      [
        JSON.stringify({
          success: false,
          message,
        }),
      ],
      { type: "application/json" }
    ),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    }
  );
}

async function handleGet(request: Request, env: Env) {
  let { searchParams } = new URL(request.url);
  let username = searchParams.get("username");
  if (!username) {
    return createErrorResponse("No name query param on request!");
  }
  let value;
  try {
    value = await env.TIME_KV.get(username, { type: "json" });
  } catch (e) {
    return createErrorResponse(`Unable to parse value for '${username}'!`);
  }
  if (!value) {
    return createErrorResponse(`No record found for '${username}'!`);
  }
  return new Response(
    new Blob(
      [
        JSON.stringify({
          data: value,
          success: true,
        }),
      ],
      { type: "application/json" }
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    }
  );
}

interface PostBody {
  username?: string;
  value?: string;
  passkey?: string;
}

interface Value {
  dates: Array<{
    name: string;
    date: string;
  }>;
  passkey: string;
}

async function handlePost(request: Request, env: Env) {
  let body = (await request.json()) as unknown as PostBody;

  let pathname = new URL(request.url).pathname;
  if (!body.username) {
    return createErrorResponse(`No 'username' field provided to POST request!`);
  }

  switch (pathname) {
    // creating a user
    case "/create": {
      let userExists = false;
      try {
        let res = await env.TIME_KV.get(body.username);
        userExists = !!res;
      } catch (e) {
        userExists = false;
      }
      if (userExists) {
        return createErrorResponse(
          `User with username: '${body.username}' already exists! If you created this account, try logging in instead, otherwise try another username.`
        );
      }
      await env.TIME_KV.put(
        body.username,
        JSON.stringify({ dates: [], passkey: body.passkey })
      );

      return new Response(
        new Blob(
          [
            JSON.stringify({
              data: {
                dates: [],
                passkey: body.passkey,
              },
              success: true,
            }),
          ],
          { type: "application/json" }
        ),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
    // checking username and passkey combo
    case "/check-user": {
      let valid = false;
      try {
        let res = (await env.TIME_KV.get(body.username, {
          type: "json",
        })) as Value;
        valid = res.passkey === body.passkey;
      } catch (e) {
        valid = false;
      }
      if (!valid) {
        return createErrorResponse(
          `Incorrect 'passkey' for user: '${body.username}'!`
        );
      }

      return new Response(
        new Blob(
          [
            JSON.stringify({
              success: true,
            }),
          ],
          { type: "application/json" }
        ),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
    // Adding a date to the user...
    case "/":
    default: {
      if (!body.value) {
        return createErrorResponse(
          `No 'value' field provided to POST request for name: '${body.username}'!`
        );
      }

      await env.TIME_KV.put(body.username, JSON.stringify(body.value));

      return new Response(
        new Blob(
          [
            JSON.stringify({
              data: body.value,
              success: true,
            }),
          ],
          { type: "application/json" }
        ),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  }
}
