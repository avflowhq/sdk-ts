/**
 * AvflowError is thrown by the client for any non-2xx response. `code` is the
 * machine-readable error code from the control plane (or `request_failed` when
 * the body carried none); `status` is the HTTP status code.
 */
export class AvflowError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AvflowError";
    this.status = status;
    this.code = code;
  }
}
