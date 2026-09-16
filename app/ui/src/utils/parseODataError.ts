import { ApiError } from "./apiError";

export async function parseODataError(res: Response, fallbackMessage: string): Promise<ApiError> {
  const body = await res.json().catch(() => null);
  const odataError = body?.error;
  const details = odataError?.details ?? (odataError?.target ? [odataError] : []);
  return new ApiError(odataError?.message ?? fallbackMessage, details);
}
