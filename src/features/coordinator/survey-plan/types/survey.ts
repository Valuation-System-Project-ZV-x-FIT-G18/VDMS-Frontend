/* Shape of the survey plan form */
export interface SurveyFormData {
  planNumber: string;         // survey plan number
  surveyorName: string;       // name of the surveyor
  boundaryDetails: string;    // boundary description
  lotNumber: string;          // lot number
  landShape: string;          // Square | Rectangle | Circle | Irregular
  file: File | null;          // uploaded survey plan copy
}
