import { useState, useCallback } from 'react';                    // React hooks
import { useNavigate } from 'react-router-dom';                    // navigation
import usePersistedState from '../../hooks/usePersistedState';     // persist form on refresh
import type { SurveyFormData } from '../types/survey';             // form shape
import { saveSurveyPlan } from '../api/survey-plan';               // API call
import PlanDetailsSection from '../components/PlanDetailsSection';
import BoundarySection from '../components/BoundarySection';
import LandShapeSection from '../components/LandShapeSection';
import FileUploadSection from '../components/FileUploadSection';
import SurveyFormActions from '../components/SurveyFormActions';
import ConfirmModal from '../components/ConfirmModal';             // red warning modal
import { validateSurveyPlanForm } from '../../validation/survey-plan.validation';
import type { FieldErrors } from '../../validation/shared';
import './SurveyPlanPage.css';

const mapApiErrorsToFields = (raw: string): FieldErrors => {
  const fieldErrors: FieldErrors = {};
  const messages = raw
    .split('\n')
    .map((message) => message.trim())
    .filter(Boolean);

  for (const message of messages) {
    const lower = message.toLowerCase();

    if (lower.includes('plan number')) fieldErrors.planNumber = message;
    else if (lower.includes('surveyor')) fieldErrors.surveyorName = message;
    else if (lower.includes('north boundary')) fieldErrors.northBoundary = message;
    else if (lower.includes('south boundary')) fieldErrors.southBoundary = message;
    else if (lower.includes('east boundary')) fieldErrors.eastBoundary = message;
    else if (lower.includes('west boundary')) fieldErrors.westBoundary = message;
    else if (lower.includes('lot number')) fieldErrors.lotNumber = message;
    else if (lower.includes('land shape')) fieldErrors.landShape = message;
    else if (lower.includes('file')) fieldErrors.file = message;
    else fieldErrors.form = message;
  }

  return fieldErrors;
};

const empty: SurveyFormData = {
  planNumber: '', surveyorName: '', northBoundary: '', southBoundary: '', eastBoundary: '', westBoundary: '',
  lotNumber: '', landShape: '', file: null,
};

/* Survey plan & details page — step after property information */
const SurveyPlanPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<SurveyFormData>('survey-plan', empty);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);           // controls warning modal
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange = useCallback((name: string, value: string) => {
    setErrors((prev) => {
      if (!prev[name] && !prev.form) return prev;
      const next = { ...prev };
      delete next[name];
      delete next.form;
      return next;
    });

    setForm(prev => ({ ...prev, [name]: value }));                 // update field by name
  }, []);

  const handleFile = useCallback((file: File | null) => {
    setErrors((prev) => {
      if (!prev.file && !prev.form) return prev;
      const next = { ...prev };
      delete next.file;
      delete next.form;
      return next;
    });

    setForm(prev => ({ ...prev, file: file ? { name: file.name } : null })); // store selected filename
  }, []);

  const handleFieldBlur = useCallback((event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const field = target.name;
    if (!field) return;

    const validation = validateSurveyPlanForm(form);
    const fieldError = validation.errors[field];
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) next[field] = fieldError;
      else delete next[field];
      return next;
    });
  }, [form]);

  /* Show confirmation modal instead of saving directly */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateSurveyPlanForm(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      return;
    }

    setShowConfirm(true);                                          // open warning modal
  };

  /* Called only when user clicks OK in the modal */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await saveSurveyPlan(form);                                  // save to DB
      setShowConfirm(false);                                       // close modal
      navigate('/coordinator/legal-details');                      // redirect to legal details page
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save survey plan';
      setErrors(mapApiErrorsToFields(message));
    }
    finally { setLoading(false); }
  };

  return (
    <div className="survey-plan-page">
      <div className="survey-plan-card">
        <h1 className="survey-heading">Survey plan & details</h1>
        <p className="survey-sub">Enter survey plan information</p>
        <form onSubmit={handleSubmit} onBlurCapture={handleFieldBlur} noValidate>
          <PlanDetailsSection form={form} onChange={handleChange} errors={errors} />
          <BoundarySection form={form} onChange={handleChange} errors={errors} />
          <LandShapeSection value={form.landShape} onChange={handleChange} error={errors.landShape} />
          <FileUploadSection file={form.file} onFile={handleFile} error={errors.file} />
          {errors.form && <span className="field-error">{errors.form}</span>}
          <SurveyFormActions onBack={() => navigate(-1)} loading={loading} />
        </form>
      </div>

      {/* Red warning modal — shown before final save */}
      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    </div>
  );
};

export default SurveyPlanPage;
