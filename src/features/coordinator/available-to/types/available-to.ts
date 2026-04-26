/* Shape of an officer record — shared base fields for all 4 tables */
export interface OfficerBase {
  to_id: string;                   // technical officer ID e.g. tof001
  name: string;                    // full name
  first_name: string;              // first name
  last_name: string;               // last / surname
  name_with_initials: string;      // e.g. "R.A. Silva"
  email: string;                   // contact email
  phone: string;                   // phone number
  nic: string;                     // national ID card number
  dob: string;                     // date of birth
}

/* A technical officer row returned from GET /available-to (flat, no nesting) */
export type AvailableOfficer = OfficerBase;
