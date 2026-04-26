import type { RejectedOfficer } from '../types/rejected-to';

const API = 'http://localhost:3000';                       // backend base URL

/* Fetch all rejected officers */
export const fetchRejected = async (): Promise<RejectedOfficer[]> => {
  const res = await fetch(`${API}/rejected-to`);           // GET request
  if (!res.ok) throw new Error('Failed to fetch rejected officers');
  return res.json();
};

/* Accept officer back — moves from rejected → free */
export const acceptOfficer = async (id: number) => {
  const res = await fetch(`${API}/rejected-to/${id}/accept`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to accept officer');
  return res.json();
};

/* Decline officer — permanently removes from rejected */
export const declineOfficer = async (id: number) => {
  const res = await fetch(`${API}/rejected-to/${id}/decline`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to decline officer');
  return res.json();
};
