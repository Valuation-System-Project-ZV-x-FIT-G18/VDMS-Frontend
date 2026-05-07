import type { BankOfficerFormData } from '../types/bank-officer';
import { getActiveClientNic } from '../../common/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/* POST /register-bank â€” registers a bank officer linked to a bank */
export async function registerBankOfficer(data: BankOfficerFormData) {
  const applicantNic = getActiveClientNic();

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

export async function registerRevaluationBankOfficer(data: BankOfficerFormData, applicantNic: string) {
  const payload = {
    ...data,
    applicantNic,
  };

  const res = await fetch(`${API_BASE}/register-bank/revaluation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = body?.message;
    throw new Error(Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Revaluation bank save failed'));
  }
  return body;
}

