import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;
  onFile: (key: keyof DocumentFiles, files: File[] | null) => void;
  error?: string;
}

/* OTHER DOCUMENTS upload section */
const OtherUpload = ({ files, onFile, error }: Props) => (
  <UploadCard icon="📄" title="Other documents" name="otherDocs" files={files.otherDocs}
    onFile={(f) => onFile('otherDocs', f)} error={error} multiple maxFiles={10} />
);

export default OtherUpload;
