import type { StoredFile } from '../types/new-valuation';
import { getActiveClientNic } from '../../common/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

// Uploads the request letter file to the backend and returns the stored file info
export async function uploadRequestLetter(file: File): Promise<StoredFile> {
  const nic = getActiveClientNic();
  if (!nic) throw new Error('Client NIC is missing. Please complete Register Client first.');
  const form = new FormData();
  form.append('nic', nic);
  form.append('nicCopy', file);
  const res = await fetch(`${API_BASE}/document-upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Failed to upload request letter');
  // Optionally parse response for file info
  return { name: file.name };
}

// Fetches the uploaded request letter for a NIC
export async function fetchRequestLetter(nic: string): Promise<StoredFile | null> {
  const res = await fetch(`${API_BASE}/document-upload?nic=${encodeURIComponent(nic)}`);
  if (!res.ok) return null;
  const doc = await res.json();
  if (!doc || !doc.nic_file_name) return null;
  return { name: doc.nic_file_name };
}
