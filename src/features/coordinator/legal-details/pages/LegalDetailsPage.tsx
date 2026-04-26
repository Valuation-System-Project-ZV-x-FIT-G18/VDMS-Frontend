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
import './LegalDetailsPage.css';

const empty: LegalFormData = {
  deedNumber: '', deedType: '', registrationDate: '',
  notaryDetails: '', ownershipType: '', usageRegulations: [], file: null,
};

/* Legal details page — step after survey plan */
const LegalDetailsPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<LegalFormData>('legal-details', empty);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // controls warning modal

  const handleChange = useCallback((name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));                 // update field by name
  }, []);

  const handleToggle = useCallback((reg: string) => {              // toggle regulation checkbox
    setForm(prev => {
      const regs = prev.usageRegulations.includes(reg)
        ? prev.usageRegulations.filter(r => r !== reg)             // remove if checked
        : [...prev.usageRegulations, reg];                         // add if unchecked
      return { ...prev, usageRegulations: regs };
    });
  }, []);

  const handleFile = useCallback((file: File | null) => {
    setForm(prev => ({ ...prev, file }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      alert(message);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="legal-details-page">
      <div className="legal-details-card">
        <h1 className="legal-heading">Legal details</h1>
        <p className="legal-sub">Enter deed and legal information</p>
        <form onSubmit={handleSubmit}>
          <DeedInfoSection form={form} onChange={handleChange} />
          <NotarySection form={form} onChange={handleChange} />
          <OwnershipSection value={form.ownershipType} onChange={handleChange} />
          <RegulationsSection selected={form.usageRegulations} onToggle={handleToggle} />
          <DeedUploadSection file={form.file} onFile={handleFile} />
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
