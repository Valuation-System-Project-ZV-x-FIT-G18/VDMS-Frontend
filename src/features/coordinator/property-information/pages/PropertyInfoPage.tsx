import { useState, useCallback } from 'react';                    // React hooks
import { useNavigate } from 'react-router-dom';                    // navigation
import usePersistedState from '../../hooks/usePersistedState';     // persist form on refresh
import type { PropertyFormData } from '../types/property';         // form shape
import { saveProperty } from '../api/property-information';        // API call
import { districts } from '../data/districts';                     // district → province map
import LocationSection from '../components/LocationSection';
import LandTypeSection from '../components/LandTypeSection';
import GpsSection from '../components/GpsSection';
import PropertyFormActions from '../components/PropertyFormActions';
import ConfirmModal from '../components/ConfirmModal';             // red warning modal
import { validatePropertyInfoForm } from '../../validation/property-info.validation';
import type { FieldErrors } from '../../validation/shared';
import './PropertyInfoPage.css';

const empty: PropertyFormData = {
  address: '', city: '', district: '', province: '',
  localAuthority: '', landType: '', latitude: '', longitude: '',
};

/* Property information page — step after bank registration */
const PropertyInfoPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<PropertyFormData>('property-info', empty);
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

    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'district') {                                   // auto-fill province
        const d = districts.find(d => d.name === value);
        if (d) next.province = d.province;
      }
      return next;
    });
  }, []);

  const handleFieldBlur = useCallback((event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const field = target.name;
    if (!field) return;

    const validation = validatePropertyInfoForm(form);
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

    const validation = validatePropertyInfoForm(form);
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
      await saveProperty(form);                                    // save to DB
      setShowConfirm(false);                                       // close modal
      navigate('/coordinator/survey-plan');                         // redirect to survey plan
    } catch {
      setErrors((prev) => ({ ...prev, form: 'Failed to save property' }));
    }
    finally { setLoading(false); }
  };

  return (
    <div className="property-info-page">
      <div className="property-info-card">
        <h1 className="property-heading">Property information</h1>
        <p className="property-sub">Enter property details for the valuation</p>
        <form onSubmit={handleSubmit} onBlurCapture={handleFieldBlur} noValidate>
          <LocationSection form={form} onChange={handleChange} errors={errors} />
          <LandTypeSection form={form} onChange={handleChange} errors={errors} />
          <GpsSection form={form} onChange={handleChange} errors={errors} />
          {errors.form && <span className="field-error">{errors.form}</span>}
          <PropertyFormActions onBack={() => navigate(-1)} loading={loading} />
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

export default PropertyInfoPage;
