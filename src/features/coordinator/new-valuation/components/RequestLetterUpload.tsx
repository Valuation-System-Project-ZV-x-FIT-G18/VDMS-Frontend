import type { StoredFile } from '../types/new-valuation';

interface Props {
  value: StoredFile | null;                                // stored file reference (or null)
  onChange: (file: StoredFile | null) => void;             // callback when file is picked
  error?: string;
}

/* Upload field for the request letter document */
const RequestLetterUpload = ({ value, onChange, error }: Props) => (
  <div className="nv-section">
    <h3 className="nv-section-title">Request letter</h3>  {/* section heading */}
    <input
      type="file"                                          // file picker input
      accept=".pdf,.jpg,.png"                              // common document formats
      onChange={e => {                                     // extract only the name so it's serializable
        const f = e.target.files?.[0];
        onChange(f ? { name: f.name } : null);             // store {name} not the raw File object
      }}
    />
    {value && <p className="nv-file-name">{value.name}</p>} {/* show filename if selected */}
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default RequestLetterUpload;
