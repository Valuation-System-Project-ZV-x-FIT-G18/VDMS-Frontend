import { useState } from 'react';
import type { DataMap } from '../types/revaluation';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

interface Props { docs?: DataMap[]; }
interface DocEntry { label: string; name: string; url: string; }

/* Converts a stored value (filename or full URL) to a viewable URL */
const toUrl = (v: unknown): string => {
  const s = String(v ?? '').trim();
  if (!s || s === '-') return '';
  if (/^https?:\/\//i.test(s)) return s;
  return `${API_BASE}/uploads/${s}`;
};

/* Parse stored value: could be JSON array, ||‑separated list, or plain string */
const parseStored = (raw: unknown): string[] => {
  const s = String(raw ?? '').trim();
  if (!s || s === '-') return [];
  if (s.startsWith('[')) {
    try { return (JSON.parse(s) as unknown[]).map(String).filter(Boolean); } catch { /* fall through */ }
  }
  if (s.includes('||')) return s.split('||').map(v => v.trim()).filter(Boolean);
  return [s];
};

const isPdf  = (url: string) => url.toLowerCase().endsWith('.pdf');
const isImage = (url: string) => /\.(png|jpg|jpeg|webp|gif)$/i.test(url);

const DocumentsSection = ({ docs = [] }: Props) => {
  const [selected, setSelected] = useState<DocEntry | null>(null);
  const d = docs[0] ?? {};

  /* Build flat list of { label, name, url } for every uploaded file */
  const buildEntries = (label: string, namesRaw: unknown, pathsRaw: unknown): DocEntry[] => {
    const names = parseStored(namesRaw);
    const paths = parseStored(pathsRaw);
    const total = Math.max(names.length, paths.length);
    return Array.from({ length: total }, (_, i) => {
      const name = names[i] ?? paths[i] ?? '';
      const url  = toUrl(paths[i]) || toUrl(names[i]);
      return { label, name, url };
    }).filter(e => Boolean(e.url));
  };

  const entries: DocEntry[] = [
    ...buildEntries('NIC Copy',     d.nic_file_name,     d.nic_file_path),
    ...buildEntries('Tax Receipt',  d.tax_file_name,     d.tax_file_path),
    ...buildEntries('Utility Bill', d.utility_file_name, d.utility_file_path),
    ...buildEntries('Other Doc',    d.other_file_name,   d.other_file_path),
  ];

  /* Default to the first entry if nothing has been clicked yet */
  const active = selected ?? entries[0] ?? null;

  return (
    <section className="rv-card rv-card--full">
      <h3>Documents</h3>
      {entries.length === 0 ? (
        <p className="rv-empty">No documents uploaded</p>
      ) : (
        <div className="rv-dv-container">
          {/* ─── Left: clickable file list ─── */}
          <ul className="rv-dv-list">
            {entries.map((e, i) => (
              <li key={i}>
                <button
                  className={`rv-dv-btn${active?.url === e.url ? ' rv-dv-btn--active' : ''}`}
                  onClick={() => setSelected(e)}
                >
                  <span className="rv-dv-icon">📄</span>
                  <span className="rv-dv-info">
                    <span className="rv-dv-type">{e.label}</span>
                    <span className="rv-dv-name">{e.name}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* ─── Right: embedded viewer ─── */}
          {active && (
            <div className="rv-dv-viewer">
              <div className="rv-dv-header">
                <span className="rv-dv-header-title">{active.label}: {active.name}</span>
                <a href={active.url} target="_blank" rel="noopener noreferrer" className="rv-dv-download">
                  ⬇ Download
                </a>
              </div>
              {isPdf(active.url) ? (
                <iframe
                  src={`${active.url}#toolbar=1`}
                  className="rv-dv-frame"
                  title={active.name}
                />
              ) : isImage(active.url) ? (
                <img src={active.url} alt={active.name} className="rv-dv-img" />
              ) : (
                <div className="rv-dv-no-preview">
                  <p>Cannot preview this file type.</p>
                  <a href={active.url} target="_blank" rel="noopener noreferrer">Open file ↗</a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default DocumentsSection;
