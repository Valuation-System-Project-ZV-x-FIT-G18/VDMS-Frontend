import type { SurveyFormData } from '../survey-plan/types/survey';
import { validateRequiredFields } from './shared';

export const validateSurveyPlanForm = (form: SurveyFormData) =>
  validateRequiredFields([
    { key: 'planNumber', label: 'Plan number', value: form.planNumber },
    {
      key: 'surveyorName',
      label: 'Surveyor name',
      value: form.surveyorName,
    },
    {
      key: 'boundaryDetails',
      label: 'Boundary details',
      value: form.boundaryDetails,
    },
    { key: 'lotNumber', label: 'Lot number', value: form.lotNumber },
    { key: 'landShape', label: 'Land shape', value: form.landShape },
    { key: 'file', label: 'Survey plan file', value: form.file },
  ]);
