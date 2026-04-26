import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;
  onFile: (key: keyof DocumentFiles, file: File | null) => void;
  error?: string;
}

/* OTHER DOCUMENTS upload section */
const OtherUpload = ({ files, onFile, error }: Props) => (
  <UploadCard icon="📄" title="Other documents" file={files.otherDocs}
    onFile={(f) => onFile('otherDocs', f)} error={error} />
);

export default OtherUpload;
