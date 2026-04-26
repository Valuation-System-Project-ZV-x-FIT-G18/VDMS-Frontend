import type { SearchResult } from '../types/search';

const API_BASE = 'http://localhost:3000'; // NestJS backend URL

/* Calls GET /search?q=<query>&type=<type> and returns the parsed result */
export async function searchLoanApplicant(query: string, type: string = 'nic'): Promise<SearchResult> {
  const res = await fetch(                           // browser fetch API
    `${API_BASE}/search?q=${encodeURIComponent(query)}&type=${type}`, // URL-encode user input + search type
  );
  if (!res.ok) throw new Error('Search request failed'); // handle HTTP errors
  return res.json();                                     // parse JSON body
}
