export interface StoredSurveyFile {
  name: string;
}

/* Shape of the survey plan form */
export interface SurveyFormData {
  planNumber: string;         // survey plan number
  surveyorName: string;       // name of the surveyor
  northBoundary: string;      // what is located to the north
  southBoundary: string;      // what is located to the south
  eastBoundary: string;       // what is located to the east
  westBoundary: string;       // what is located to the west
  lotNumber: string;          // lot number
  landShape: string;          // Square | Rectangle | Circle | Irregular
  file: StoredSurveyFile | null; // uploaded survey plan copy (serializable)
}
