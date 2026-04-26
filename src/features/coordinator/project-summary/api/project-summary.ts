import type { ProjectSummary } from '../types/project-summary';

const API = 'http://localhost:3000';       // NestJS backend URL

/* Fetch the full project summary for a client by NIC */
export async function fetchProjectSummary(nic: string): Promise<ProjectSummary> {
  const res = await fetch(`${API}/project-summary?nic=${encodeURIComponent(nic)}`);
  if (!res.ok) throw new Error('Failed to fetch project summary');  // HTTP error
  return res.json();                       // parse JSON response
}
