import { useState } from "react";

import { getFieldErrorsFromApiError } from "../utils/getFieldErrors";

export function useFormState<TValues extends Record<string, string | string[]>>(
  initialValues: TValues,
  fieldNames: (keyof TValues & string)[],
) {
  const [formValues, setFormValues] = useState<TValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof TValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleFieldChange = <K extends keyof TValues & string>(fieldName: K, value: TValues[K]) => {
    setFormValues((current) => ({ ...current, [fieldName]: value }));
    setFieldErrors((current) => {
      if (!current[fieldName]) return current;
      return { ...current, [fieldName]: undefined };
    });
    setFormError(null);
    setIsDirty(true);
  };

  const handleError = (error: Error) => {
    const fieldLevelErrors = getFieldErrorsFromApiError(error, fieldNames);
    if (fieldLevelErrors) {
      setFieldErrors(fieldLevelErrors as Partial<Record<keyof TValues, string>>);
      return;
    }
    setFieldErrors({});
    setFormError("Something went wrong. Please try again.");
  };

  const handleReset = () => {
    setFormValues(initialValues);
    setFieldErrors({});
    setFormError(null);
    setIsDirty(false);
  };

  return {
    formValues,
    fieldErrors,
    setFieldErrors,
    formError,
    setFormError,
    handleFieldChange,
    handleError,
    handleReset,
    isDirty,
  };
}
