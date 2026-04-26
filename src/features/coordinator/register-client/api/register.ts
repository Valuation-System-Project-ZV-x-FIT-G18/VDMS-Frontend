import type { RegisterFormData } from '../types/register';

const API_BASE = 'http://localhost:3000'; // NestJS backend URL

/* POST /register — sends form data to create a new loan applicant */
export async function registerApplicant(data: RegisterFormData) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),                          // send form as JSON
  });
  const body = await res.json().catch(() => null);       // always parse body
  if (!res.ok) {
    const msg = body?.message;                           // NestJS validation errors
    throw new Error(Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Registration failed'));
  }
  return body;                                           // parse response
}
