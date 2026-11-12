import type { Job } from "./types.gen.js";

import { AvflowError } from "./errors.js";

export interface ClientOptions {
  /**
   * Base URL of the avflow API. For the hosted control plane this is your
   * `avflow-api` endpoint (e.g. https://avflow-api.example.workers.dev); for
   * a self-hosted engine it is the control server origin
   * (e.g. http://localhost:8080) with `basePath: ''`.
   */
  apiUrl: string;
  /** API key: `Bearer` token of the form avf_<appId>.<random>. */
  apiKey: string;
  /**
   * Path prefix of the job API. The hosted control plane serves `/v1/jobs`;
   * a raw engine control server serves `/jobs`. Defaults to `/v1`.
   */
  basePath?: string;
  /** Fetch implementation override (tests, custom agents). Defaults to global fetch. */
  fetch?: typeof fetch;
}

export interface ListJobsOptions {
  limit?: number;
  page?: number;
}

export interface ListJobsResult {
  items?: Job[];
  total?: number;
  [k: string]: unknown;
}

export interface AvflowClient {
  /**
   * Create or hot-update a job. POST /v1/jobs is an upsert keyed by `name`:
   * re-submitting the same name reconfigures the running pipeline instead of
   * restarting it.
   */
  submitJob(job: Job): Promise<Job>;
  getJob(name: string): Promise<Job>;
  listJobs(options?: ListJobsOptions): Promise<ListJobsResult>;
  /** Stop (delete) a job by name. */
  stopJob(name: string): Promise<Job>;
}

export function createClient(options: ClientOptions): AvflowClient {
  const base = options.apiUrl.replace(/\/+$/, "");
  const basePath = options.basePath ?? "/v1";
  const doFetch = options.fetch ?? fetch;

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await doFetch(`${base}${basePath}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    const text = await res.text();
    // Non-JSON bodies (proxy errors, gateway timeouts) must not shadow the
    // HTTP failure with a SyntaxError — treat them as an empty body.
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = null;
      }
    }

    if (!res.ok) {
      const err = body as {
        code?: string;
        error?: string;
        message?: string;
      } | null;
      throw new AvflowError(
        res.status,
        err?.code ?? "request_failed",
        err?.message ?? err?.error ?? `avflow returned ${res.status}`,
      );
    }
    return body as T;
  }

  return {
    submitJob(job: Job): Promise<Job> {
      return request<Job>("/jobs", {
        method: "POST",
        body: JSON.stringify(job),
      });
    },

    getJob(name: string): Promise<Job> {
      return request<Job>(`/jobs/${encodeURIComponent(name)}`);
    },

    listJobs(options: ListJobsOptions = {}): Promise<ListJobsResult> {
      const params = new URLSearchParams();
      if (options.limit !== undefined)
        params.set("limit", String(options.limit));
      if (options.page !== undefined) params.set("page", String(options.page));
      const qs = params.toString();
      return request<ListJobsResult>(`/jobs${qs ? `?${qs}` : ""}`);
    },

    stopJob(name: string): Promise<Job> {
      return request<Job>(`/jobs/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
    },
  };
}
