import type { SurveyFormData } from '../types/survey'; // form shape

const API_BASE = 'http://localhost:3000';

/* POST /survey-plan — saves survey plan details to backend */
export async function saveSurveyPlan(data: SurveyFormData) {
  const stored = localStorage.getItem('register-client');  // get registered client data
  const nic = stored ? JSON.parse(stored).nic : '';        // extract NIC from persisted form
  const body = {                                           // extract JSON-safe fields
    nic,                                                   // include NIC to link user
    planNumber: data.planNumber,
    surveyorName: data.surveyorName,
    boundaryDetails: data.boundaryDetails,
    lotNumber: data.lotNumber,
    landShape: data.landShape,
    filePath: data.file ? data.file.name : undefined,      // send filename only for now
  };
  const res = await fetch(`${API_BASE}/survey-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },       // send as JSON
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to save survey plan');
  return res.json();
}
