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
