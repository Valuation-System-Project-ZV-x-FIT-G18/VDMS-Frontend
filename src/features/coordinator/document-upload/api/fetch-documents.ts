import type { DocumentFiles } from '../types/documents';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const parseStoredValue = (value?: string): string[] => {
  if (!value) return [];
  const trimmed = value.trim();

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      // fall through to legacy handling
    }
  }

  if (trimmed.includes('||')) {
    return trimmed.split('||').map((v) => v.trim()).filter(Boolean);
  }

  return [value];
};

const toStoredDocs = (namesRaw?: string, pathsRaw?: string) => {
  const names = parseStoredValue(namesRaw);
  const paths = parseStoredValue(pathsRaw);
  const total = Math.max(names.length, paths.length);

  return Array.from({ length: total }, (_, i) => ({
    name: names[i] ?? `Document ${i + 1}`,
    path: paths[i] ?? names[i] ?? '',
  })).filter((doc) => Boolean(doc.name || doc.path));
};

// Fetch uploaded document info for a NIC
export async function fetchDocuments(nic: string): Promise<Partial<DocumentFiles>> {
  const res = await fetch(`${API_BASE}/document-upload?nic=${encodeURIComponent(nic)}`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  const doc = await res.json();
  if (!doc) return {};

  const nicDocs = toStoredDocs(doc.nic_file_name, doc.nic_file_path);

  return {
    nicCopy: nicDocs[0] ?? null,
    taxReceipts: toStoredDocs(doc.tax_file_name, doc.tax_file_path),
    utilityBills: toStoredDocs(doc.utility_file_name, doc.utility_file_path),
    otherDocs: toStoredDocs(doc.other_file_name, doc.other_file_path),
  };
}

