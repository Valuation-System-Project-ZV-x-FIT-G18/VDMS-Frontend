import type { DocumentFiles } from '../types/documents'; // form shape
import { getActiveClientNic } from '../../common/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/* POST /document-upload â€” saves document info to backend */
export async function saveDocuments(
  files: DocumentFiles,
  rawFiles: {
    nicCopy: File | null;
    taxReceipts: File[];
    utilityBills: File[];
    otherDocs: File[];
  },
) {
  const nic = getActiveClientNic();
  if (!nic) {
    throw new Error('Client NIC is missing. Please complete Register Client first.');
  }

  const form = new FormData();
  form.append('nic', nic);
  if (rawFiles.nicCopy) form.append('nicCopy', rawFiles.nicCopy);
  rawFiles.taxReceipts.forEach((f) => form.append('taxReceipts', f));
  rawFiles.utilityBills.forEach((f) => form.append('utilityBills', f));
  rawFiles.otherDocs.forEach((f) => form.append('otherDocs', f));
  form.append('nicFileName', files.nicCopy?.name ?? '');
  form.append('nicFilePath', files.nicCopy?.path ?? files.nicCopy?.name ?? '');
  form.append('taxFileName', JSON.stringify(files.taxReceipts.map((d) => d.name)));
  form.append('taxFilePath', JSON.stringify(files.taxReceipts.map((d) => d.path ?? d.name)));
  form.append('utilityFileName', JSON.stringify(files.utilityBills.map((d) => d.name)));
  form.append('utilityFilePath', JSON.stringify(files.utilityBills.map((d) => d.path ?? d.name)));
  form.append('otherFileName', JSON.stringify(files.otherDocs.map((d) => d.name)));
  form.append('otherFilePath', JSON.stringify(files.otherDocs.map((d) => d.path ?? d.name)));

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

