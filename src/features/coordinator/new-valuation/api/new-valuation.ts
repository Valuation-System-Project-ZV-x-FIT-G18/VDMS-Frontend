import type { FreeOfficerItem, NewValuationForm } from '../types/new-valuation';

const API = 'http://localhost:3000';

/* Fetch all free (available) technical officers for the dropdown */
export const fetchFreeOfficers = async (): Promise<FreeOfficerItem[]> => {
  const res = await fetch(`${API}/new-valuation/free-officers`); // GET request
  if (!res.ok) throw new Error('Failed to fetch free officers');
  return res.json();                                       // parse JSON array
};

export const submitValuation = async (form: NewValuationForm) => {
  if (!form.toId?.trim()) {
    throw new Error('Please select a technical officer.');
  }
  if (!form.timeDate?.trim()) {
    throw new Error('Please select a date and time.');
  }

  const stored = localStorage.getItem('register-client');
  const nic = stored ? (JSON.parse(stored).nic ?? '').trim() : '';
  if (!nic) {
    throw new Error('Client NIC is missing. Please complete the registration flow first.');
  }

  const res = await fetch(`${API}/new-valuation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toId: form.toId,
      timeDate: form.timeDate,
      nic,
      requestLetter: form.requestLetter?.name ?? '',
      purpose: form.purpose,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.message;
    throw new Error(Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Failed to submit valuation'));
  }

  if (!data?.success) throw new Error(data?.message || 'Failed to submit valuation');
  return data;
};
