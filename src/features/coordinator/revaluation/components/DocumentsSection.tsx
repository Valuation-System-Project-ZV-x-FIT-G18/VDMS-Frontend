import type { DataMap } from '../types/revaluation';

interface Props {
  docs?: DataMap[];
}

const pick = (d: DataMap, a: string, b: string) => d[a] || d[b] || '-';
const isUrl = (v: unknown) => /^https?:\/\//i.test(String(v || ''));
const ext = (v: unknown) => String(v || '').toLowerCase();

const DocumentsSection = ({ docs = [] }: Props) => {
  const d = docs[0] || {};
  const rows = [
    ['NIC Copy', pick(d, 'nic_file_name', 'nic_file_path')],
    ['Tax Receipt', pick(d, 'tax_file_name', 'tax_file_path')],
    ['Utility Bill', pick(d, 'utility_file_name', 'utility_file_path')],
    ['Other Doc', pick(d, 'other_file_name', 'other_file_path')],
  ];
  const hasAny = rows.some(([, v]) => v !== '-');
  const src = String(rows[0][1]);
  return <section className="rv-card"><h3>Documents</h3>
    {!hasAny && <p className="rv-empty">No chosen files</p>}
    {isUrl(src) && ext(src).endsWith('.pdf') && <iframe className="rv-pdf" title="nic-pdf" src={src} loading="lazy" />}
    {isUrl(src) && /\.(png|jpg|jpeg|webp)$/i.test(src) && <img className="rv-img" src={src} alt="NIC" />}
    <div className="rv-doc">{rows.map(([k, v]) => <p key={k}>{k}: {String(v)}</p>)}</div>
  </section>;
};

export default DocumentsSection;
