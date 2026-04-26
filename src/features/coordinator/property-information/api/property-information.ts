import type { PropertyFormData } from '../types/property'; // form shape

const API_BASE = 'http://localhost:3000';

/* POST /property-information — saves property details to backend */
export async function saveProperty(data: PropertyFormData) {
  const stored = localStorage.getItem('register-client');          // get registered client data
  const nic = stored ? JSON.parse(stored).nic : '';                // extract NIC from persisted form
  const res = await fetch(`${API_BASE}/property-information`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, nic }),                        // include NIC in request body
  });
  if (!res.ok) throw new Error('Failed to save property'); // handle HTTP errors
  return res.json();                                       // return parsed response
}
