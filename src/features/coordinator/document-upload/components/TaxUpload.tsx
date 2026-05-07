import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;
  onFile: (key: keyof DocumentFiles, files: File[] | null) => void;
  error?: string;
}

/* TAX RECEIPTS upload section */
const TaxUpload = ({ files, onFile, error }: Props) => (
  <UploadCard icon="🧾" title="Tax receipts" name="taxReceipts" files={files.taxReceipts}
    onFile={(f) => onFile('taxReceipts', f)} error={error} multiple maxFiles={10} />
);

export default TaxUpload;
