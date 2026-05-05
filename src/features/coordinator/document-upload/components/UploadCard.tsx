import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import type { StoredDocument } from '../types/documents';
import './UploadCard.css';

interface Props {
  icon: string;                                            // emoji icon
  title: string;                                           // section title
  name?: string;
  files: StoredDocument[];                                 // selected/stored file metadata list
  onFile: (files: File[] | null) => void;                  // callback when file list changes
  multiple?: boolean;
  maxFiles?: number;
  required?: boolean;                                      // whether required
  error?: string;
}

/* Reusable upload card — dashed area with icon, title, file picker */
const UploadCard = ({ icon, title, name, files, onFile, multiple, maxFiles = 10, required, error }: Props) => {
  const safeFiles = Array.isArray(files) ? files : [];
  return (
    <div className="upload-card">
    <SectionHeader icon={icon} title={title} />
    <label className="upload-drop-area">
      <input type="file" accept=".pdf,.jpg,.jpeg,.png"
        name={name}
        multiple={Boolean(multiple)}
        className="upload-hidden-input"
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []);
          if (picked.length === 0) {
            onFile(null);
            return;
          }
          onFile(multiple ? picked.slice(0, maxFiles) : [picked[0]]);
        }}
          required={Boolean(required && safeFiles.length === 0)} />
        <span className="upload-drop-text">
          {safeFiles.length > 0 ? `${safeFiles.length} file(s) selected` : 'Click to upload PDF or image'}
        </span>
    </label>
      {multiple && <span className="upload-help">You can upload up to {maxFiles} files.</span>}
      {safeFiles.length > 0 && (
        <ul className="upload-file-list">
          {safeFiles.map((file, idx) => (
            <li key={`${file.name}-${idx}`} className="upload-file-item">{file.name}</li>
          ))}
        </ul>
      )}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default UploadCard;
