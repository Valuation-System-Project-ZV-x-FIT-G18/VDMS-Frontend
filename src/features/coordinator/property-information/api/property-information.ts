import type { PropertyFormData } from '../types/property'; // form shape
import { getActiveClientNic } from '../../common/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/* POST /property-information â€” saves property details to backend */
export async function saveProperty(data: PropertyFormData) {
  const nic = getActiveClientNic();                                 // extract active client nic
  const res = await fetch(`${API_BASE}/property-information`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, nic }),                        // include NIC in request body
  });
  if (!res.ok) throw new Error('Failed to save property'); // handle HTTP errors
  return res.json();                                       // return parsed response
}

