import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;
  onFile: (key: keyof DocumentFiles, file: File | null) => void;
}

/* OTHER DOCUMENTS upload section */
const OtherUpload = ({ files, onFile }: Props) => (
  <UploadCard icon="📄" title="Other documents" file={files.otherDocs}
    onFile={(f) => onFile('otherDocs', f)} />
);

export default OtherUpload;
