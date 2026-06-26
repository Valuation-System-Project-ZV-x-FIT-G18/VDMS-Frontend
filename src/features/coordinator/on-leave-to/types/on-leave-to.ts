import type { OfficerBase } from '../../available-to/types/available-to'; // reuse base

/* An on-leave officer row from GET /on-leave-to */
export interface OnLeaveOfficer {
  id: number;                      // row PK from on_leave table
  to_id: string;                   // FK to officer
  reason_for_leave: string;        // why officer is on leave
  date_from: string;               // leave start date
  date_to: string;                 // leave end date
  officer: OfficerBase;            // eager-loaded officer details
}
