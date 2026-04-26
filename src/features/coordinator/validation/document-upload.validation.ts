import type { DocumentFiles } from '../document-upload/types/documents';
import { validateRequiredFields } from './shared';

export const validateDocumentUploadForm = (files: DocumentFiles) =>
  validateRequiredFields([
    { key: 'nicCopy', label: 'NIC copy', value: files.nicCopy },
    { key: 'taxReceipts', label: 'Tax receipts', value: files.taxReceipts },
    { key: 'utilityBills', label: 'Utility bills', value: files.utilityBills },
    { key: 'otherDocs', label: 'Other documents', value: files.otherDocs },
  ]);
