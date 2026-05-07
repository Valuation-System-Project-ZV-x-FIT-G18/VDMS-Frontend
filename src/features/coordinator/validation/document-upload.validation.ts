import type { DocumentFiles } from '../document-upload/types/documents';
import type { ValidationResult } from './shared';

export const validateDocumentUploadForm = (files: DocumentFiles): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!files.nicCopy) errors.nicCopy = 'NIC copy is required';

  if (files.taxReceipts.length > 10) errors.taxReceipts = 'Maximum 10 tax receipts allowed';
  if (files.utilityBills.length > 10) errors.utilityBills = 'Maximum 10 utility bills allowed';
  if (files.otherDocs.length > 10) errors.otherDocs = 'Maximum 10 other documents allowed';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
