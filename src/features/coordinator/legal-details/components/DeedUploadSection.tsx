import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './DeedUploadSection.css';

interface Props {
  file: File | null;                                       // currently selected file
  onFile: (file: File | null) => void;                     // callback when file changes
  error?: string;
}

/* UPLOAD section — file input for deed copy */
const DeedUploadSection = ({ file, onFile, error }: Props) => (
  <div className="deed-upload-section">
    <SectionHeader icon="📎" title="Copy of deed" />
    <label className="deed-upload-area">
      <input type="file" accept=".pdf,.jpg,.jpeg,.png"     /* accepted types */
        className="deed-file-input"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
      <span className="deed-upload-text">
        {file ? file.name : 'Click to upload PDF or image'}
      </span>
    </label>
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default DeedUploadSection;
