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
import './RegisterPage.css';

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

  const handleChange = useCallback((name: string, value: string) => {
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'fullName') {                         // auto-derive name fields
        const derived = deriveNames(value);
        Object.assign(next, derived);
      }
      return next;
    });
  }, []);

  /* Show confirmation modal instead of submitting directly */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);                              // open the warning modal
  };

  /* Called only when user clicks OK in the modal */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      await registerApplicant(form);
      setShowConfirm(false);                           // close modal
      navigate('/coordinator/register-bank');           // next step: bank registration
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      alert(message);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-heading">Register loan applicant</h1>
        <p className="register-sub">Enter personal information to create a new applicant account</p>
        <form onSubmit={handleSubmit}>
          <NameSection form={form} onChange={handleChange} />
          <IdentitySection form={form} onChange={handleChange} />
          <AddressSection form={form} onChange={handleChange} />
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
