import { useState, useCallback } from 'react';                    // React hooks
import { useNavigate } from 'react-router-dom';                    // navigation
import usePersistedState from '../../hooks/usePersistedState';     // persist form on refresh
import type { LegalFormData } from '../types/legal';               // form shape
import { saveLegalDetails } from '../api/legal-details';           // API call
import DeedInfoSection from '../components/DeedInfoSection';
import NotarySection from '../components/NotarySection';
import OwnershipSection from '../components/OwnershipSection';
import RegulationsSection from '../components/RegulationsSection';
import DeedUploadSection from '../components/DeedUploadSection';
import LegalFormActions from '../components/LegalFormActions';
import ConfirmModal from '../components/ConfirmModal'; // red warning modal
import { validateLegalDetailsForm } from '../../validation/legal-details.validation';
import type { FieldErrors } from '../../validation/shared';
import './LegalDetailsPage.css';

const empty: LegalFormData = {
  deedNumber: '', deedType: '', registrationDate: '',
  notaryDetails: '', ownershipType: '', usageRegulations: ['', '', '', ''], file: null,
};

/* Legal details page — step after survey plan */
const LegalDetailsPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<LegalFormData>('legal-details', empty);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // controls warning modal
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

  const handleRegulationChange = useCallback((index: number, value: string) => {  // update regulation text
    setErrors((prev) => {
      if (!prev.usageRegulations && !prev.form) return prev;
      const next = { ...prev };
      delete next.usageRegulations;
      delete next.form;
      return next;
    });

    setForm(prev => {
      const regs = [...prev.usageRegulations];
      regs[index] = value;
      return { ...prev, usageRegulations: regs };
    });
  }, []);

  const handleFile = useCallback((file: File | null) => {
    setErrors((prev) => {
      if (!prev.file && !prev.form) return prev;
      const next = { ...prev };
      delete next.file;
      delete next.form;
      return next;
    });

    setForm(prev => ({ ...prev, file: file ? { name: file.name } : null }));
  }, []);

  const handleFieldBlur = useCallback((event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const field = target.name;
    if (!field) return;

    const validation = validateLegalDetailsForm(form);
    const fieldError = validation.errors[field];
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) next[field] = fieldError;
      else delete next[field];
      return next;
    });
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLegalDetailsForm(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      return;
    }

    setShowConfirm(true); // open warning modal
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await saveLegalDetails(form);
      setShowConfirm(false);
      navigate('/coordinator/document-upload'); // go to document upload
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save legal details';
      setErrors((prev) => ({ ...prev, form: message }));
    }
    finally { setLoading(false); }
  };

  return (
    <div className="legal-details-page">
      <div className="legal-details-card">
        <h1 className="legal-heading">Legal details</h1>
        <p className="legal-sub">Enter deed and legal information</p>
        <form onSubmit={handleSubmit} onBlurCapture={handleFieldBlur} noValidate>
          <DeedInfoSection form={form} onChange={handleChange} errors={errors} />
          <NotarySection form={form} onChange={handleChange} error={errors.notaryDetails} />
          <OwnershipSection value={form.ownershipType} onChange={handleChange} error={errors.ownershipType} />
          <RegulationsSection regulations={form.usageRegulations} onChange={handleRegulationChange} error={errors.usageRegulations} />
          <DeedUploadSection file={form.file} onFile={handleFile} error={errors.file} />
          {errors.form && <span className="field-error">{errors.form}</span>}
          <LegalFormActions onBack={() => navigate(-1)} loading={loading} />
        </form>
      </div>
      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    </div>
  );
};

export default LegalDetailsPage;
