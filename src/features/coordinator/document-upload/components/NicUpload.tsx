import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;                                    // current file selections
  onFile: (key: keyof DocumentFiles, file: File | null) => void; // file change handler
}

/* NIC COPY upload section */
const NicUpload = ({ files, onFile }: Props) => (
  <UploadCard icon="🪪" title="NIC copy" file={files.nicCopy}
    onFile={(f) => onFile('nicCopy', f)} required />
);

export default NicUpload;
