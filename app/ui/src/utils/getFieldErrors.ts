import { ApiError } from "./apiError";

export function getFieldErrorsFromApiError<TField extends string>(
  error: unknown,
  fields: readonly TField[],
): Partial<Record<TField, string>> | null {
  if (!(error instanceof ApiError)) {
    return null;
  }

  const fieldErrors: Partial<Record<TField, string>> = {};

  for (const detail of error.details) {
    const field = fields.find((f) => f === detail.target);
    if (field) {
      fieldErrors[field] = detail.message;
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}
