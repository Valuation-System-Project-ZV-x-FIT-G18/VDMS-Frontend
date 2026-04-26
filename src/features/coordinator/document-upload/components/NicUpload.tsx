import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;                                    // current file selections
  onFile: (key: keyof DocumentFiles, file: File | null) => void; // file change handler
  error?: string;
}

/* NIC COPY upload section */
const NicUpload = ({ files, onFile, error }: Props) => (
  <UploadCard icon="🪪" title="NIC copy" file={files.nicCopy}
    onFile={(f) => onFile('nicCopy', f)} error={error} required />
);

export default NicUpload;
