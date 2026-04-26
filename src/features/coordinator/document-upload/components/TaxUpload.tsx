import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;
  onFile: (key: keyof DocumentFiles, file: File | null) => void;
  error?: string;
}

/* TAX RECEIPTS upload section */
const TaxUpload = ({ files, onFile, error }: Props) => (
  <UploadCard icon="🧾" title="Tax receipts" file={files.taxReceipts}
    onFile={(f) => onFile('taxReceipts', f)} error={error} />
);

export default TaxUpload;
