# @avflow/sdk

TypeScript SDK for the [avflow](https://avflow.dev) control plane: typed Job
submission, lifecycle queries, and webhook signature verification.

- **Typed Jobs** — types are generated from the canonical JSON Schemas
  (`schemas/`), which are generated from the Go source of truth in the avflow
  engine. Every source / node / sink `type` is a discriminated union with its
  exact config shape.
- **Zero runtime dependencies** — plain `fetch` + Web Crypto; runs on Node 18+,
  Cloudflare Workers, Bun, Deno.
- **Webhook verification** — a faithful port of the engine's HMAC-SHA256
  signature check (`X-Avflow-Signature`).

## Install

```sh
npm install @avflow/sdk
```

## Submit and manage jobs

```ts
import { createClient } from '@avflow/sdk';

const avflow = createClient({
  apiUrl: 'https://avflow-api.example.workers.dev', // your avflow-api endpoint
  apiKey: 'avf_<appId>.<random>',
});

// POST /v1/jobs is an upsert keyed by `name`: re-submitting the same name
// hot-updates the running pipeline instead of restarting it.
const job = await avflow.submitJob({
  name: 'single-stream-relay',
  sources: [
    { name: 'room_src', type: 'livekit', config: { serverUrl: 'https://live.example.com', token: 'eyJ...' } },
  ],
  sinks: [
    { name: 'rtmp_out', type: 'rtmp_push', inputs: ['room_src'], config: { urls: ['rtmp://live.example.com/app/key'] } },
  ],
});

await avflow.getJob('single-stream-relay');
await avflow.listJobs({ limit: 20, page: 1 });
await avflow.stopJob('single-stream-relay');
```

Against a self-hosted engine control server (no `/v1` prefix), pass
`basePath: ''`:

```ts
const avflow = createClient({ apiUrl: 'http://localhost:8080', apiKey: 'local', basePath: '' });
```

Errors throw `AvflowError` with the HTTP `status` and the server's
machine-readable `code`.

## Verify webhook events

avflow signs every events-ingest delivery with HMAC-SHA256 over the **raw**
request body:

```ts
import { verifyRequest } from '@avflow/sdk';

export default {
  async fetch(request: Request): Promise<Response> {
    const ok = await verifyRequest(request, process.env.AVFLOW_HMAC_SECRET!);
    if (!ok) return new Response('invalid signature', { status: 401 });

    const event = await request.json(); // LifecycleEvent (typed)
    // event.event === 'job.started' | 'job.failed' | 'usage.tick' | ...
    return new Response('ok');
  },
};
```

`verifySignature({ secret, body, header })` is available when you already hold
the raw body. An empty `secret` skips verification (dev mode), matching the
engine's behaviour.

## Where the types come from

`schemas/job.schema.json` and `schemas/events.schema.json` are synced verbatim
from the avflow engine repository (`make sync-sdks` there); `src/*.gen.ts` is
generated from them by `pnpm gen`. CI fails if either step was skipped — the
types you compile against are the types the engine enforces.

## Development

```sh
pnpm install
pnpm gen        # regenerate src/*.gen.ts from schemas/
pnpm typecheck
pnpm test
pnpm build
```

Releases: push a `v*` tag; CI publishes to npm (`NPM_TOKEN` secret required).

## License

MIT
