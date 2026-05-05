import type { AvailableOfficer } from '../types/available-to';

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';                       // backend base URL

/* Fetch all available (free) technical officers */
export const fetchAvailable = async (): Promise<AvailableOfficer[]> => {
  const res = await fetch(`${API}/available-to`);          // GET request
  if (!res.ok) throw new Error('Failed to fetch available officers');
  return res.json();
};

