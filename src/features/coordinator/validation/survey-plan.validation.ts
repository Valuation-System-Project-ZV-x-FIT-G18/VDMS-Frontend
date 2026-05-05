import type { SurveyFormData } from '../survey-plan/types/survey';
import { validateRequiredFields } from './shared';

export const validateSurveyPlanForm = (form: SurveyFormData) => {
  const result = validateRequiredFields([
    { key: 'planNumber', label: 'Plan number', value: form.planNumber },
    {
      key: 'surveyorName',
      label: 'Surveyor name',
      value: form.surveyorName,
    },
    {
      key: 'northBoundary',
      label: 'North boundary',
      value: form.northBoundary,
    },
    {
      key: 'southBoundary',
      label: 'South boundary',
      value: form.southBoundary,
    },
    {
      key: 'eastBoundary',
      label: 'East boundary',
      value: form.eastBoundary,
    },
    {
      key: 'westBoundary',
      label: 'West boundary',
      value: form.westBoundary,
    },
    { key: 'lotNumber', label: 'Lot number', value: form.lotNumber },
    { key: 'landShape', label: 'Land shape', value: form.landShape },
    { key: 'file', label: 'Survey plan file', value: form.file },
  ]);

  const planNumber = form.planNumber.trim();
  if (planNumber && !/^sp\/\d{4}\/[A-Za-z0-9]{3}$/i.test(planNumber)) {
    result.errors.planNumber = 'Plan number must be in format SP/YYYY/XXX (SP or sp)';
  }

  const surveyorName = form.surveyorName.trim();
  if (surveyorName && !/^[A-Za-z\s]+$/.test(surveyorName)) {
    result.errors.surveyorName = 'Surveyor name can contain only letters and spaces';
  }

  const lotNumber = form.lotNumber.trim();
  if (lotNumber && !/^[A-Za-z0-9]+$/.test(lotNumber)) {
    result.errors.lotNumber = 'Lot number must be alphanumeric';
  }

  return {
    valid: Object.keys(result.errors).length === 0,
    errors: result.errors,
  };
};
