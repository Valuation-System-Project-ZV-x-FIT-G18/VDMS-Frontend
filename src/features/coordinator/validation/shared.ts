export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

type FieldEntry = {
  key: string;
  label: string;
  value: unknown;
};

export type FieldErrors = Record<string, string>;

const hasValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  return value !== null && value !== undefined;
};

export const validateRequiredFields = (
  entries: FieldEntry[],
): ValidationResult => {
  const errors = entries.reduce<FieldErrors>((acc, entry) => {
    if (!hasValue(entry.value)) {
      acc[entry.key] = `${entry.label} is required`;
    }

    return acc;
  }, {});

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const addEmailFormatError = (
  errors: FieldErrors,
  key: string,
  value: string,
) => {
  const trimmed = value.trim();
  if (!trimmed) return;

  const atIndex = trimmed.indexOf('@');
  const dotIndex = trimmed.lastIndexOf('.');
  const hasValidAt = atIndex > 0;
  const hasValidDot = dotIndex > atIndex + 1 && dotIndex < trimmed.length - 1;

  if (!hasValidAt || !hasValidDot) {
    errors[key] = 'Email must include @ and a dot';
  }
};
