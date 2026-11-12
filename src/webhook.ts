/**
 * Webhook signature verification for the avflow events ingest channel.
 *
 * avflow signs the raw request body with HMAC-SHA256 and sends the lowercase
 * hex digest in `X-Avflow-Signature` (either bare hex or `sha256=<hex>`).
 * Receivers must hash the *raw* body — re-serialized JSON produces a different
 * signature. This is a port of pkg/webhook/sign.go in the engine; the fixed
 * test vectors there and here are computed over the same inputs.
 */

export const SIGNATURE_HEADER = "X-Avflow-Signature";

/** Compute the lowercase hex HMAC-SHA256 of body using secret. */
export async function computeSignature(
  secret: string,
  body: string | Uint8Array,
): Promise<string> {
  const key = new TextEncoder().encode(secret);
  const data = typeof body === "string" ? new TextEncoder().encode(body) : body;
  // Uint8Array<ArrayBufferLike> (per @types/node) vs the narrower backing
  // buffer @types/node wants for WebCrypto inputs; every Uint8Array here is
  // backed by a plain ArrayBuffer.
  const digest = await crypto.subtle.sign(
    "HMAC",
    await crypto.subtle.importKey(
      "raw",
      key as Uint8Array<ArrayBuffer>,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    ),
    data as Uint8Array<ArrayBuffer>,
  );
  return toHex(new Uint8Array(digest));
}

export interface VerifySignatureOptions {
  /** Shared HMAC secret. Empty skips verification and returns true (dev/test only). */
  secret: string;
  /** The raw request body — exactly the bytes that were signed. */
  body: string | Uint8Array;
  /** Value of the X-Avflow-Signature header (bare hex or sha256=<hex>). */
  header: string;
}

/**
 * Verify an X-Avflow-Signature header against HMAC-SHA256(secret, body).
 * Mirrors Go's webhook.VerifyHMACSHA256: `sha256=` prefix is optional, the
 * comparison is constant-time, empty secret means "unsigned, allow" (dev),
 * empty header means reject.
 */
export async function verifySignature(
  options: VerifySignatureOptions,
): Promise<boolean> {
  const { secret, body, header } = options;
  if (secret === "") return true;
  if (header === "") return false;
  const provided = header.startsWith("sha256=")
    ? header.slice("sha256=".length)
    : header;
  const expected = await computeSignature(secret, body);
  return timingSafeEqualHex(provided, expected);
}

/**
 * Verify a webhook Request (Workers / Node 18+ / Bun / Deno). Reads the raw
 * body text — do not consume the body before calling this.
 */
export async function verifyRequest(
  request: Request,
  secret: string,
): Promise<boolean> {
  const header = request.headers.get(SIGNATURE_HEADER) ?? "";
  const body = await request.text();
  return verifySignature({ secret, body, header });
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) {
    out += b.toString(16).padStart(2, "0");
  }
  return out;
}
