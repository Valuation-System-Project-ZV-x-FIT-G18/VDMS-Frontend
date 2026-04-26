import type { RevaluationData } from '../types/revaluation';

const API = 'http://localhost:3000';

export async function fetchRevaluation(nic: string): Promise<RevaluationData> {
  const res = await fetch(`${API}/project-summary?nic=${encodeURIComponent(nic)}`);
  if (!res.ok) throw new Error('Failed to fetch revaluation data');
  return res.json();
}
