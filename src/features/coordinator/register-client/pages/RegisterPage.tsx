import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import usePersistedState from '../../hooks/usePersistedState'; // persist form on refresh
import type { RegisterFormData } from '../types/register';
import { deriveNames } from '../utils/deriveNames';
import { registerApplicant } from '../api/register';
import NameSection from '../components/NameSection';
import IdentitySection from '../components/IdentitySection';
import AddressSection from '../components/AddressSection';
import FormActions from '../components/FormActions';
import ConfirmModal from '../components/ConfirmModal';  // red warning modal
import { validateRegisterClientForm } from '../../validation/register-client.validation';
import type { FieldErrors } from '../../validation/shared';
import { resetCoordinatorStateAfterRegisterSuccess } from '../../common/storage';
import './RegisterPage.css';

const mapApiErrorsToFields = (raw: string): FieldErrors => {
  const fieldErrors: FieldErrors = {};
  const messages = raw
    .split('\n')
    .map((m) => m.trim())
    .filter(Boolean);

  for (const message of messages) {
    const lower = message.toLowerCase();

    if (lower.includes('full name')) {
      fieldErrors.fullName = message;
      continue;
    }
    if (lower.includes('nic')) {
      fieldErrors.nic = message;
      continue;
    }
    if (lower.includes('birth day') || lower.includes('date of birth')) {
      fieldErrors.dateOfBirth = message;
      continue;
    }
    if (lower.includes('contact number') || lower.includes('phone')) {
      fieldErrors.phone = message;
      continue;
    }
    if (lower.includes('email')) {
      fieldErrors.email = message;
      continue;
    }
    if (lower.includes('confirm password')) {
      fieldErrors.confirmPassword = message;
      continue;
    }
    if (lower.includes('password')) {
      fieldErrors.password = message;
      continue;
    }
    if (lower.includes('street address')) {
      fieldErrors.streetAddress = message;
      continue;
    }
    if (lower.includes('city')) {
      fieldErrors.city = message;
      continue;
    }
    if (lower.includes('district')) {
      fieldErrors.district = message;
      continue;
    }
    if (lower.includes('province')) {
      fieldErrors.province = message;
      continue;
    }
    if (lower.includes('postal code')) {
      fieldErrors.postalCode = message;
      continue;
    }

    fieldErrors.fullName = message;
  }

  return fieldErrors;
};

const empty: RegisterFormData = {
  fullName: '', firstName: '', lastName: '', nameWithInitials: '',
  nic: '', dateOfBirth: '', phone: '', email: '',
  password: '', confirmPassword: '',
  streetAddress: '', city: '', district: '', province: '', postalCode: '',
};

/* Registration page — coordinator registers a new loan applicant */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<RegisterFormData>('register-client', empty);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // controls warning modal
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange = useCallback((name: string, value: string) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'fullName') {                         // auto-derive name fields
        const derived = deriveNames(value);
        Object.assign(next, derived);
      }
      return next;
    });
  }, []);

  const handleFieldBlur = useCallback((event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const field = target.name;
    if (!field) return;

    const validation = validateRegisterClientForm(form);
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

    const validation = validateRegisterClientForm(form);
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
      await registerApplicant(form);
      resetCoordinatorStateAfterRegisterSuccess(form.nic);
      setForm(empty);
      setErrors({});
      setShowConfirm(false);                           // close modal
      navigate('/coordinator/register-bank');           // next step: bank registration
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setShowConfirm(false);
      setErrors(mapApiErrorsToFields(message));
    }
    finally { setLoading(false); }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-heading">Register loan applicant</h1>
        <p className="register-sub">Enter personal information to create a new applicant account</p>
        <form onSubmit={handleSubmit} onBlurCapture={handleFieldBlur} noValidate>
          <NameSection form={form} onChange={handleChange} errors={errors} />
          <IdentitySection form={form} onChange={handleChange} errors={errors} />
          <AddressSection form={form} onChange={handleChange} errors={errors} />
          <FormActions onCancel={() => navigate(-1)} loading={loading} />
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

export default RegisterPage;
