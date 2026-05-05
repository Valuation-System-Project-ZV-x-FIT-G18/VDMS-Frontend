import type { LegalFormData } from '../legal-details/types/legal';
import { validateRequiredFields } from './shared';

const toDateOnly = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

export const validateLegalDetailsForm = (form: LegalFormData) => {
  const base = validateRequiredFields([
    { key: 'deedNumber', label: 'Deed number', value: form.deedNumber },
    { key: 'deedType', label: 'Deed type', value: form.deedType },
    {
      key: 'registrationDate',
      label: 'Registration date',
      value: form.registrationDate,
    },
    {
      key: 'notaryDetails',
      label: 'Notary details',
      value: form.notaryDetails,
    },
    { key: 'ownershipType', label: 'Ownership type', value: form.ownershipType },
    { key: 'file', label: 'Deed copy file', value: form.file },
  ]);

  if (!base.valid) {
    return base;
  }

  if (form.usageRegulations.length === 0) {
    return {
      valid: false,
      errors: {
        ...base.errors,
        usageRegulations: 'Usage regulations is required',
      },
    };
  }

  const registrationDate = form.registrationDate?.trim();
  if (registrationDate) {
    const today = new Date();
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedDate = toDateOnly(registrationDate);

    if (!(selectedDate < todayOnly)) {
      return {
        valid: false,
        errors: {
          ...base.errors,
          registrationDate: 'Registration date must be before today',
        },
      };
    }
  }

  return { valid: true, errors: {} };
};
