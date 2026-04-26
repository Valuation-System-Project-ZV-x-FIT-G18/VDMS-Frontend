import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;
  onFile: (key: keyof DocumentFiles, file: File | null) => void;
}

/* TAX RECEIPTS upload section */
const TaxUpload = ({ files, onFile }: Props) => (
  <UploadCard icon="🧾" title="Tax receipts" file={files.taxReceipts}
    onFile={(f) => onFile('taxReceipts', f)} />
);

export default TaxUpload;
