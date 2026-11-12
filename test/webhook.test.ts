import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  computeSignature,
  verifyRequest,
  verifySignature,
} from "../src/webhook.js";

const SECRET = "avflow-test-secret";
// Fixed vector shared with the Go implementation (pkg/webhook/sign_test.go
// style): HMAC-SHA256 over this exact body. Computed independently with
// openssl so the TS port can't drift from the engine.
const BODY = '{"schema":"avflow.events.v1","event":"job.started"}';
const VECTOR =
  "0ea5dca25cbd2ab146719b0488d499d480a75bd335c82a6c725d4614c375db42";

describe("computeSignature", () => {
  it("matches the cross-implementation fixed vector", async () => {
    await expect(computeSignature(SECRET, BODY)).resolves.toBe(VECTOR);
  });

  it("matches node:crypto for arbitrary bodies", async () => {
    const body = JSON.stringify({
      eventId: "evt_abc",
      job: { id: "j1" },
      n: 1234,
    });
    const expected = createHmac("sha256", SECRET).update(body).digest("hex");
    await expect(computeSignature(SECRET, body)).resolves.toBe(expected);
  });

  it("accepts Uint8Array bodies", async () => {
    const bytes = new TextEncoder().encode(BODY);
    await expect(computeSignature(SECRET, bytes)).resolves.toBe(VECTOR);
  });
});

describe("verifySignature", () => {
  it("accepts the bare-hex header form", async () => {
    await expect(
      verifySignature({ secret: SECRET, body: BODY, header: VECTOR }),
    ).resolves.toBe(true);
  });

  it("accepts the sha256= prefixed header form", async () => {
    await expect(
      verifySignature({
        secret: SECRET,
        body: BODY,
        header: `sha256=${VECTOR}`,
      }),
    ).resolves.toBe(true);
  });

  it("rejects a tampered body", async () => {
    await expect(
      verifySignature({
        secret: SECRET,
        body: BODY.replace("started", "failed"),
        header: VECTOR,
      }),
    ).resolves.toBe(false);
  });

  it("rejects a wrong secret", async () => {
    const sig = await computeSignature("other-secret", BODY);
    await expect(
      verifySignature({ secret: SECRET, body: BODY, header: sig }),
    ).resolves.toBe(false);
  });

  it("rejects an empty header", async () => {
    await expect(
      verifySignature({ secret: SECRET, body: BODY, header: "" }),
    ).resolves.toBe(false);
  });

  it("skips verification for an empty secret (dev mode)", async () => {
    await expect(
      verifySignature({ secret: "", body: BODY, header: "" }),
    ).resolves.toBe(true);
  });
});

describe("verifyRequest", () => {
  it("verifies a Workers-style Request end to end", async () => {
    const request = new Request("https://example.com/webhook", {
      method: "POST",
      headers: { "X-Avflow-Signature": `sha256=${VECTOR}` },
      body: BODY,
    });
    await expect(verifyRequest(request, SECRET)).resolves.toBe(true);
  });

  it("rejects a Request whose signature does not match the body", async () => {
    const request = new Request("https://example.com/webhook", {
      method: "POST",
      headers: { "X-Avflow-Signature": VECTOR },
      body: '{"schema":"avflow.events.v1","event":"job.failed"}',
    });
    await expect(verifyRequest(request, SECRET)).resolves.toBe(false);
  });
});
