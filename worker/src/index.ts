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
  TIME_KV: KVNamespace
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method === 'GET') {
      return await handleGet(request, env)
    } else if (request.method === 'POST') {
      return await handlePost(request, env)
    }
  },
}

function createErrorResponse(message: string) {
  return new Response(
    new Blob(
      [
        JSON.stringify({
          success: false,
          message,
        }),
      ],
      { type: 'application/json' },
    ),
    {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

async function handleGet(request: Request, env: Env) {
  let { searchParams } = new URL(request.url)
  let name = searchParams.get('name')
  if (!name) {
    return createErrorResponse('No name query param on request!')
  }
  let value = await env.TIME_KV.get(name, { type: 'json' })
  if (!value) {
    return createErrorResponse(`No record found for '${name}'!`)
  }
  return new Response(
    new Blob(
      [
        JSON.stringify({
          data: value,
          success: true,
        }),
      ],
      { type: 'application/json' },
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

interface PostBody {
  name?: string
  value?: string
}

async function handlePost(request: Request, env: Env) {
  let body = (await request.json()) as unknown as PostBody

  if (!body.name) {
    return createErrorResponse(`No 'name' field provided to POST request!`)
  }
  if (!body.value) {
    return createErrorResponse(
      `No 'value' field provided to POST request for name: '${body.name}'!`,
    )
  }

  await env.TIME_KV.put(body.name, JSON.parse(body.value))

  return new Response(
    new Blob(
      [
        JSON.stringify({
          data: JSON.parse(body.value),
          success: true,
        }),
      ],
      { type: 'application/json' },
    ),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
