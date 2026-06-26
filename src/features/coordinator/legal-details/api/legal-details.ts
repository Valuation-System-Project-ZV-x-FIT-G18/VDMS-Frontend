import type { LegalFormData } from '../types/legal'; // form shape
import { getActiveClientNic } from '../../common/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/* POST /legal-details â€” saves legal details to backend */
export async function saveLegalDetails(data: LegalFormData) {
  const nic = getActiveClientNic();
  if (!nic) throw new Error('Client NIC is missing. Please complete Register Client first.');

  const body = {
    nic,                                                 // required â€” identifies the client
    deedNumber: data.deedNumber,
    deedType: data.deedType,
    registrationDate: data.registrationDate,
    notaryDetails: data.notaryDetails,
    ownershipType: data.ownershipType,
    usageRegulations: data.usageRegulations,
    filePath: data.file ? data.file.name : undefined,    // send filename only
  };
  const res = await fetch(`${API_BASE}/legal-details`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },     // send as JSON
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.message;
    throw new Error(Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Failed to save legal details'));
  }
  return json;
}

