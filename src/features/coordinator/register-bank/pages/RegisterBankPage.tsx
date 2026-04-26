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
import './RegisterBankPage.css';

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

  const handleChange = useCallback((name: string, value: string) => {
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'fullName') Object.assign(next, deriveNames(value)); // auto-derive
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
      await registerBankOfficer(form);
      setShowConfirm(false);                           // close modal
      navigate('/coordinator/property-information');    // next step: property info
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bank registration failed';
      alert(message);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="register-bank-page">
      <div className="register-bank-card">
        <h1 className="bank-heading">Register bank &amp; officer</h1>
        <p className="bank-sub">Enter bank officer details for the valuation</p>
        <form onSubmit={handleSubmit}>
          <OfficerNameSection form={form} onChange={handleChange} />
          <OfficerContactSection form={form} onChange={handleChange} />
          <BankDetailsSection form={form} onChange={handleChange} />
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
