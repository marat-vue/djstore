export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body: Record<string, unknown> = { detail: message },
  ) {
    super(message);
  }
}
