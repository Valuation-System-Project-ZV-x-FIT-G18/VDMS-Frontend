/* Shape of a technical officer returned from the API (flat, no nesting) */
export interface FreeOfficerItem {
  to_id: string;                 // officer ID e.g. tof001
  name: string;
  first_name: string;
  last_name: string;
  name_with_initials: string;
  email: string;
  phone: string;
  nic: string;
  dob: string;
}

/* Serializable reference to an uploaded file (persists to localStorage) */
export interface StoredFile {
  name: string;                  // original filename
}

/* Form data shape for the new valuation page */
export interface NewValuationForm {
  toId: string;                  // selected officer ID from dropdown
  timeDate: string;              // scheduled date-time for valuation
  requestLetter: StoredFile | null; // stored as {name} so it survives page refresh
  purpose: string;               // text area — reason for valuation
}
