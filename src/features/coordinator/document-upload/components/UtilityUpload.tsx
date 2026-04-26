import type { DocumentFiles } from '../types/documents';
import UploadCard from './UploadCard';

interface Props {
  files: DocumentFiles;
  onFile: (key: keyof DocumentFiles, file: File | null) => void;
  error?: string;
}

/* UTILITY BILLS upload section */
const UtilityUpload = ({ files, onFile, error }: Props) => (
  <UploadCard icon="💡" title="Utility bills" file={files.utilityBills}
    onFile={(f) => onFile('utilityBills', f)} error={error} />
);

export default UtilityUpload;
