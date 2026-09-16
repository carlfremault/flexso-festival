export class ApiError extends Error {
  readonly details: { target?: string; message: string }[];

  constructor(message: string, details: { target?: string; message: string }[]) {
    super(message);
    this.name = "ApiError";
    this.details = details;
  }
}
