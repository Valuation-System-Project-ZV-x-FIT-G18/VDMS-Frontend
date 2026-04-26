/* Shape of the legal details form */
export interface LegalFormData {
  deedNumber: string;              // official deed number
  deedType: string;                // Transfer | Gift | Lease | Partition
  registrationDate: string;        // date string (YYYY-MM-DD)
  notaryDetails: string;           // notary name and info
  ownershipType: string;           // Single Owner | Joint Ownership
  usageRegulations: string[];      // checked restrictions
  file: File | null;               // uploaded deed copy
}
