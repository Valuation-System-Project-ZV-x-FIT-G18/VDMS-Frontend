import type { StoredFile } from '../types/new-valuation';

interface Props {
  value: StoredFile | null;                                // stored file reference (or null)
  onChange: (file: StoredFile | null) => void;             // callback when file is picked
  error?: string;
}

/* Upload field for the request letter document */

const RequestLetterUpload = ({ value, onChange, error }: Props) => (
  <div className="nv-section">
    <h3 className="nv-section-title">Request letter</h3>
    <input
      type="file"
      name="requestLetter"
      accept=".pdf,.jpg,.png"
      onChange={e => {
        const f = e.target.files?.[0];
        onChange(f ? f : null); // pass File object up for upload
      }}
    />
    {value && <p className="nv-file-name">{value.name}</p>}
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default RequestLetterUpload;
