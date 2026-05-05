import type { SurveyFormData } from '../types/survey'; // form shape
import { getActiveClientNic } from '../../common/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/* POST /survey-plan â€” saves survey plan details to backend */
export async function saveSurveyPlan(data: SurveyFormData) {
  const nic = getActiveClientNic();                         // extract active client nic
  if (!nic) {
    throw new Error('Client NIC is missing. Please complete Register Client first.');
  }

  const boundaryDetails = [
    `North: ${data.northBoundary}`,
    `South: ${data.southBoundary}`,
    `East: ${data.eastBoundary}`,
    `West: ${data.westBoundary}`,
  ].join('; ');

  const body = {                                           // extract JSON-safe fields
    nic,                                                   // include NIC to link user
    planNumber: data.planNumber,
    surveyorName: data.surveyorName,
    boundaryDetails,
    lotNumber: data.lotNumber,
    landShape: data.landShape,
    filePath: data.file ? data.file.name : undefined,      // send filename only for now
  };
  const res = await fetch(`${API_BASE}/survey-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },       // send as JSON
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.message;
    throw new Error(Array.isArray(msg) ? msg.join('\n') : (msg ?? 'Failed to save survey plan'));
  }
  return json;
}

