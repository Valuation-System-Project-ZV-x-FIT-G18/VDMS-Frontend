import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import usePersistedState from '../../hooks/usePersistedState'; // persist form on refresh
import type { BankOfficerFormData } from '../types/bank-officer';
import { deriveNames } from '../../register-client/utils/deriveNames'; // reuse
import { registerBankOfficer } from '../api/register-bank';
import OfficerNameSection from '../components/OfficerNameSection';
import OfficerContactSection from '../components/OfficerContactSection';
import BankDetailsSection from '../components/BankDetailsSection';
import BankFormActions from '../components/BankFormActions';
import ConfirmModal from '../components/ConfirmModal';  // red warning modal (local copy)
import { validateRegisterBankForm } from '../../validation/register-bank.validation';
import type { FieldErrors } from '../../validation/shared';
import './RegisterBankPage.css';

const mapApiErrorsToFields = (raw: string): FieldErrors => {
  const fieldErrors: FieldErrors = {};
  const messages = raw
    .split('\n')
    .map((message) => message.trim())
    .filter(Boolean);

  for (const message of messages) {
    const lower = message.toLowerCase();

    if (lower.includes('full name')) fieldErrors.fullName = message;
    else if (lower.includes('nic')) fieldErrors.nic = message;
    else if (lower.includes('designation')) fieldErrors.designation = message;
    else if (lower.includes('contact number') || lower.includes('phone')) fieldErrors.phone = message;
    else if (lower.includes('email')) fieldErrors.email = message;
    else if (lower.includes('bank')) fieldErrors.bankName = message;
    else if (lower.includes('branch code')) fieldErrors.branchCode = message;
    else if (lower.includes('branch')) fieldErrors.branch = message;
    else fieldErrors.form = message;
  }

  return fieldErrors;
};

const empty: BankOfficerFormData = {
  fullName: '', firstName: '', lastName: '', nameWithInitials: '',
  nic: '', designation: '', phone: '', email: '',
  bankName: '', branch: '', branchCode: '',
};

/* Bank & officer registration page — step after applicant registration */
const RegisterBankPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<BankOfficerFormData>('register-bank', empty);
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

    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'fullName') Object.assign(next, deriveNames(value)); // auto-derive
      return next;
    });
  }, []);

  const handleFieldBlur = useCallback((event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const field = target.name;
    if (!field) return;

    const validation = validateRegisterBankForm(form);
    const fieldError = validation.errors[field];
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) next[field] = fieldError;
      else delete next[field];
      return next;
    });
  }, [form]);

  /* Show confirmation modal instead of submitting directly */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateRegisterBankForm(form);
    setErrors(validation.errors);
    if (!validation.valid) {
      return;
    }

    setShowConfirm(true);                              // open the warning modal
  };

  /* Called only when user clicks OK in the modal */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await registerBankOfficer(form);
      setShowConfirm(false);                           // close modal
      navigate('/coordinator/property-information');    // next step: property info
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bank registration failed';
      setErrors(mapApiErrorsToFields(message));
    }
    finally { setLoading(false); }
  };

  return (
    <div className="register-bank-page">
      <div className="register-bank-card">
        <h1 className="bank-heading">Register bank &amp; officer</h1>
        <p className="bank-sub">Enter bank officer details for the valuation</p>
        <form onSubmit={handleSubmit} onBlurCapture={handleFieldBlur} noValidate>
          <OfficerNameSection form={form} onChange={handleChange} errors={errors} />
          <OfficerContactSection form={form} onChange={handleChange} errors={errors} />
          <BankDetailsSection form={form} onChange={handleChange} errors={errors} />
          {errors.form && <span className="field-error">{errors.form}</span>}
          <BankFormActions onBack={() => navigate(-1)} loading={loading} />
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

export default RegisterBankPage;
