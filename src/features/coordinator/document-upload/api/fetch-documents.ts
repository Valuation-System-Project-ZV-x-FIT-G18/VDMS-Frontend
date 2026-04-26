import type { DocumentFiles } from '../types/documents';

const API_BASE = 'http://localhost:3000';

// Fetch uploaded document info for a NIC
export async function fetchDocuments(nic: string): Promise<Partial<DocumentFiles>> {
  const res = await fetch(`${API_BASE}/document-upload?nic=${encodeURIComponent(nic)}`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  const doc = await res.json();
  if (!doc) return {};

  return {
    nicCopy: doc.nic_file_name ? { name: doc.nic_file_name, path: doc.nic_file_path ?? doc.nic_file_name } : null,
    taxReceipts: doc.tax_file_name ? { name: doc.tax_file_name, path: doc.tax_file_path ?? doc.tax_file_name } : null,
    utilityBills: doc.utility_file_name ? { name: doc.utility_file_name, path: doc.utility_file_path ?? doc.utility_file_name } : null,
    otherDocs: doc.other_file_name ? { name: doc.other_file_name, path: doc.other_file_path ?? doc.other_file_name } : null,
  };
}
