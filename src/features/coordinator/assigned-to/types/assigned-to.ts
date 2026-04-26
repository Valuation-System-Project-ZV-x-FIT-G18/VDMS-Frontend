import type { OfficerBase } from '../../available-to/types/available-to'; // reuse base

/* An assigned officer row from GET /assigned-to */
export interface AssignedOfficer {
  id: number;                      // row PK from assigned_to table
  to_id: string;                   // FK to officer
  time_date: string;               // scheduled date-time (ISO string)
  project_id: string;              // linked project ID
  loan_applicant_nic: string;      // NIC of the loan applicant
  property_address: string;        // address of the property
  officer: OfficerBase;            // eager-loaded officer details
}
