import type { DocumentFiles } from '../types/documents'; // form shape

const API_BASE = 'http://localhost:3000';

const getNicFromLocalStorage = () => {
  const stored = localStorage.getItem('register-client');
  if (!stored) return '';

  try {
    const parsed = JSON.parse(stored) as { nic?: string; NIC?: string };
    return (parsed.nic ?? parsed.NIC ?? '').trim();
  } catch {
    return '';
  }
};

/* POST /document-upload — saves document info to backend */
export async function saveDocuments(files: DocumentFiles, rawFiles: Record<keyof DocumentFiles, File | null>) {
  const nic = getNicFromLocalStorage();
  if (!nic) {
    throw new Error('Client NIC is missing. Please complete Register Client first.');
  }

  const form = new FormData();
  form.append('nic', nic);
  if (rawFiles.nicCopy) form.append('nicCopy', rawFiles.nicCopy);
  if (rawFiles.taxReceipts) form.append('taxReceipts', rawFiles.taxReceipts);
  if (rawFiles.utilityBills) form.append('utilityBills', rawFiles.utilityBills);
  if (rawFiles.otherDocs) form.append('otherDocs', rawFiles.otherDocs);
  form.append('nicFileName', files.nicCopy?.name ?? '');
  form.append('nicFilePath', files.nicCopy?.path ?? files.nicCopy?.name ?? '');
  form.append('taxFileName', files.taxReceipts?.name ?? '');
  form.append('taxFilePath', files.taxReceipts?.path ?? files.taxReceipts?.name ?? '');
  form.append('utilityFileName', files.utilityBills?.name ?? '');
  form.append('utilityFilePath', files.utilityBills?.path ?? files.utilityBills?.name ?? '');
  form.append('otherFileName', files.otherDocs?.name ?? '');
  form.append('otherFilePath', files.otherDocs?.path ?? files.otherDocs?.name ?? '');

  const res = await fetch(`${API_BASE}/document-upload`, {
    method: 'POST',
    body: form,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || 'Failed to save documents';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  if (!data?.success) throw new Error(data?.message || 'Failed to save documents');
  return data;
}
