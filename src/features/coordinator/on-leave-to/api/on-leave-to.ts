import type { OnLeaveOfficer } from '../types/on-leave-to';

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';                       // backend base URL

/* Fetch all on-leave technical officers */
export const fetchOnLeave = async (): Promise<OnLeaveOfficer[]> => {
  const res = await fetch(`${API}/on-leave-to`);           // GET request
  if (!res.ok) throw new Error('Failed to fetch on-leave officers');
  return res.json();
};

