// Serializable document info kept in state/localStorage
export interface StoredDocument {
  name: string;
  path?: string;
}

/* Shape of the document upload form */
export interface DocumentFiles {
  nicCopy: StoredDocument | null;
  taxReceipts: StoredDocument | null;
  utilityBills: StoredDocument | null;
  otherDocs: StoredDocument | null;
}
