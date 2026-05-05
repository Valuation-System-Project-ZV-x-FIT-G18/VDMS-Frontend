import type { AssignedOfficer } from '../types/assigned-to';

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';                       // backend base URL

/* Fetch all assigned technical officers */
export const fetchAssigned = async (): Promise<AssignedOfficer[]> => {
  const res = await fetch(`${API}/assigned-to`);           // GET request
  if (!res.ok) throw new Error('Failed to fetch assigned officers');
  return res.json();
};

