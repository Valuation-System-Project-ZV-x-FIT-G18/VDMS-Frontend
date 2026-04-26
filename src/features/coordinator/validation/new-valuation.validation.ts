import type { NewValuationForm } from '../new-valuation/types/new-valuation';
import { validateRequiredFields } from './shared';

export const validateNewValuationForm = (
  form: NewValuationForm,
  date: string,
  time: string,
) =>
  validateRequiredFields([
    { key: 'requestLetter', label: 'Request letter', value: form.requestLetter },
    { key: 'purpose', label: 'Purpose', value: form.purpose },
    { key: 'toId', label: 'Technical officer', value: form.toId },
    { key: 'date', label: 'Date', value: date },
    { key: 'time', label: 'Time', value: time },
  ]);
