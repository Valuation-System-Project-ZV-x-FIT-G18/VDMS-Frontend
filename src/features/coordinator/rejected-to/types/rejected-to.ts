import type { OfficerBase } from '../../available-to/types/available-to'; // reuse base

/* A rejected officer row from GET /rejected-to */
export interface RejectedOfficer {
  id: number;                      // row PK from rejected table
  to_id: string;                   // FK to officer
  reason_for_reject: string;       // why the valuation was rejected
  officer: OfficerBase;            // eager-loaded officer details
}
