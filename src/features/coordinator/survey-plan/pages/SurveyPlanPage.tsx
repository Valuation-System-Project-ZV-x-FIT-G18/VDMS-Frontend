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
import './SurveyPlanPage.css';

const empty: SurveyFormData = {
  planNumber: '', surveyorName: '', boundaryDetails: '',
  lotNumber: '', landShape: '', file: null,
};

/* Survey plan & details page — step after property information */
const SurveyPlanPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<SurveyFormData>('survey-plan', empty);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);           // controls warning modal

  const handleChange = useCallback((name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));                 // update field by name
  }, []);

  const handleFile = useCallback((file: File | null) => {
    setForm(prev => ({ ...prev, file }));                          // store selected file
  }, []);

  /* Show confirmation modal instead of saving directly */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);                                          // open warning modal
  };

  /* Called only when user clicks OK in the modal */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await saveSurveyPlan(form);                                  // save to DB
      setShowConfirm(false);                                       // close modal
      navigate('/coordinator/legal-details');                      // redirect to legal details page
    } catch { alert('Failed to save survey plan'); }
    finally { setLoading(false); }
  };

  return (
    <div className="survey-plan-page">
      <div className="survey-plan-card">
        <h1 className="survey-heading">Survey plan & details</h1>
        <p className="survey-sub">Enter survey plan information</p>
        <form onSubmit={handleSubmit}>
          <PlanDetailsSection form={form} onChange={handleChange} />
          <BoundarySection form={form} onChange={handleChange} />
          <LandShapeSection value={form.landShape} onChange={handleChange} />
          <FileUploadSection file={form.file} onFile={handleFile} />
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
