import { afterEach, describe, expect, it, vi } from "vitest";

import { createClient } from "../src/client.js";
import { AvflowError } from "../src/errors.js";
import type { Job } from "../src/types.gen.js";

const job: Job = {
  name: "relay",
  sources: [
    { name: "src", type: "rtmp_pull", config: { url: "rtmp://in/live" } },
  ],
  sinks: [
    {
      name: "out",
      type: "rtmp_push",
      inputs: ["src"],
      config: { urls: ["rtmp://out/live"] },
    },
  ],
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createClient", () => {
  it("submitJob POSTs the job with bearer auth to /v1/jobs", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(200, { ...job, id: "j_1", status: "running" }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = createClient({
      apiUrl: "https://api.example.com",
      apiKey: "avf_app1.k1",
    });
    const result = await client.submitJob(job);

    expect(result.id).toBe("j_1");
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      "https://api.example.com/v1/jobs",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: "Bearer avf_app1.k1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      },
    );
  });

  it("supports basePath override for a self-hosted control server", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { items: [] }));
    vi.stubGlobal("fetch", fetchMock);

    const client = createClient({
      apiUrl: "http://localhost:8080",
      apiKey: "local",
      basePath: "",
    });
    await client.listJobs({ limit: 5, page: 2 });

    expect(fetchMock.mock.calls[0][0]).toBe(
      "http://localhost:8080/jobs?limit=5&page=2",
    );
  });

  it("encodes job names in GET and DELETE paths", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(200, { name: "a b", status: "running" }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, { name: "a b", status: "stopped" }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = createClient({
      apiUrl: "https://api.example.com",
      apiKey: "k",
    });
    await client.getJob("a b");
    await client.stopJob("a b");

    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.example.com/v1/jobs/a%20b",
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://api.example.com/v1/jobs/a%20b",
    );
  });

  it("throws AvflowError with the server code and message on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(400, {
          code: "INVALID_JOB",
          message: "at least 1 source required",
        }),
      ),
    );

    const client = createClient({
      apiUrl: "https://api.example.com",
      apiKey: "k",
    });
    const err = await client.submitJob(job).catch((e: unknown) => e);

    expect(err).toBeInstanceOf(AvflowError);
    expect((err as AvflowError).status).toBe(400);
    expect((err as AvflowError).code).toBe("INVALID_JOB");
    expect((err as AvflowError).message).toBe("at least 1 source required");
  });

  it("falls back to a generic code when the error body carries none", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(new Response("gateway timeout", { status: 504 })),
    );

    const client = createClient({
      apiUrl: "https://api.example.com",
      apiKey: "k",
    });
    const err = await client.getJob("x").catch((e: unknown) => e);

    expect(err).toBeInstanceOf(AvflowError);
    expect((err as AvflowError).code).toBe("request_failed");
    expect((err as AvflowError).status).toBe(504);
  });
});
