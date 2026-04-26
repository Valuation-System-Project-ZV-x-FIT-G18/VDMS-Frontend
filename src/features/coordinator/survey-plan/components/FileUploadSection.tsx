import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './FileUploadSection.css';

interface Props {
  file: File | null;                                       // currently selected file
  onFile: (file: File | null) => void;                     // callback when file changes
  error?: string;
}

/* UPLOAD section — file input for survey plan copy */
const FileUploadSection = ({ file, onFile, error }: Props) => (
  <div className="file-upload-section">
    <SectionHeader icon="📎" title="Survey plan copy" />
    <label className="upload-area">
      <input type="file" accept=".pdf,.jpg,.jpeg,.png"     /* accepted file types */
        className="file-input"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      <span className="upload-text">
        {file ? file.name : 'Click to upload PDF or image'}
      </span>
    </label>
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default FileUploadSection;
