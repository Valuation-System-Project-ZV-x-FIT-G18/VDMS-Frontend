import type { BankOfficerFormData } from '../types/bank-officer';

const API_BASE = 'http://localhost:3000';

/* POST /register-bank — registers a bank officer linked to a bank */
export async function registerBankOfficer(data: BankOfficerFormData) {
  const stored = localStorage.getItem('register-client');
  const applicantNic = stored
    ? (JSON.parse(stored) as { nic?: string }).nic ?? ''
    : '';

  const payload = {
    ...data,
    applicantNic,
  };

  const res = await fetch(`${API_BASE}/register-bank`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = body?.message;
    throw new Error(Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Bank registration failed'));
  }
  return body;
}
