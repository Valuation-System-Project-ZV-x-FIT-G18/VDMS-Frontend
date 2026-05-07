import type { NewValuationForm } from '../new-valuation/types/new-valuation';
import { validateRequiredFields } from './shared';

export const validateNewValuationForm = (
  form: NewValuationForm,
  date: string,
  time: string,
) => {
  const base = validateRequiredFields([
    { key: 'requestLetter', label: 'Request letter', value: form.requestLetter },
    { key: 'purpose', label: 'Purpose of valuation', value: form.purpose },
    { key: 'toId', label: 'Technical officer', value: form.toId },
    { key: 'date', label: 'Date', value: date },
    { key: 'time', label: 'Time', value: time },
  ]);

  const errors = { ...base.errors };
  if (!form.purpose?.trim()) {
    errors.purpose = 'Purpose of valuation must be required';
  }

  if (date && time) {
    const selected = new Date(`${date}T${time}`);
    if (selected.getTime() <= Date.now()) {
      errors.date = 'Schedule date and time must be in the future';
    } else {
      const h = selected.getHours();
      if (h < 8 || h >= 17) {
        errors.time = 'Schedule must be within working hours (08:00–16:59)';
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
};
