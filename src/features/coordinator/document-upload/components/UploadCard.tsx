import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import type { StoredDocument } from '../types/documents';
import './UploadCard.css';

interface Props {
  icon: string;                                            // emoji icon
  title: string;                                           // section title
  file: StoredDocument | null;                             // selected/stored file metadata
  onFile: (file: File | null) => void;                     // callback when file changes
  required?: boolean;                                      // whether required
  error?: string;
}

/* Reusable upload card — dashed area with icon, title, file picker */
const UploadCard = ({ icon, title, file, onFile, required, error }: Props) => (
  <div className="upload-card">
    <SectionHeader icon={icon} title={title} />
    <label className="upload-drop-area">
      <input type="file" accept=".pdf,.jpg,.jpeg,.png"
        className="upload-hidden-input"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        required={Boolean(required && !file)} />
      <span className="upload-drop-text">
        {file ? file.name : 'Click to upload PDF or image'}
      </span>
    </label>
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default UploadCard;
