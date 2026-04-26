import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import usePersistedState from '../../hooks/usePersistedState';
import type { FreeOfficerItem, NewValuationForm } from '../types/new-valuation';
import { fetchFreeOfficers, submitValuation } from '../api/new-valuation';
import ConfirmModal from '../components/ConfirmModal';
import RequestLetterUpload from '../components/RequestLetterUpload';
import PurposeInput from '../components/PurposeInput';
import OfficerDropdown from '../components/OfficerDropdown';
import SchedulePicker from '../components/SchedulePicker';
import SuccessModal from '../components/SuccessModal';
import ValuationFormActions from '../components/ValuationFormActions';
import './NewValuationPage.css';

const empty: NewValuationForm = {
  toId: '', timeDate: '', requestLetter: null, purpose: '',
};

const flowKeys = [
  'search-mode', 'search-query', 'search-result',
  'register-client', 'register-bank', 'property-info',
  'survey-plan', 'legal-details', 'document-upload',
  'new-valuation', 'nv-date', 'nv-time',
];

const NewValuationPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<NewValuationForm>('new-valuation', empty);
  const [date, setDate] = usePersistedState('nv-date', '');
  const [time, setTime] = usePersistedState('nv-time', '');
  const [officers, setOfficers] = useState<FreeOfficerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => { fetchFreeOfficers().then(setOfficers).catch(() => {}); }, []);

  const set = useCallback(<K extends keyof NewValuationForm>(k: K, v: NewValuationForm[K]) => {
    setForm(prev => ({ ...prev, [k]: v }));
  }, [setForm]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setConfirmOpen(true); };
  const handleConfirm = async () => {
    setLoading(true);
    try { await submitValuation({ ...form, timeDate: `${date}T${time}` }); setConfirmOpen(false); setSuccessOpen(true); }
    catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'Unable to create valuation';
      alert(message);
    }
    finally { setLoading(false); }
  };

  const handleSuccessClose = () => {
    flowKeys.forEach((k) => localStorage.removeItem(k));
    setForm(empty);
    setDate('');
    setTime('');
    setSuccessOpen(false);
    navigate('/coordinator/search');
  };

  return (
    <div className="nv-page">
      <div className="nv-card">
        <h1 className="nv-heading">New valuation</h1>
        <p className="nv-sub">Assign a technical officer and schedule the valuation</p>
        <form onSubmit={handleSubmit}>
          <RequestLetterUpload value={form.requestLetter} onChange={f => set('requestLetter', f)} />
          <PurposeInput value={form.purpose} onChange={v => set('purpose', v)} />
          <OfficerDropdown officers={officers} value={form.toId} onChange={v => set('toId', v)} />
          <SchedulePicker date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />
          <ValuationFormActions onBack={() => navigate(-1)} loading={loading} />
        </form>
      </div>
      <ConfirmModal open={confirmOpen} loading={loading} onOk={handleConfirm} onCancel={() => setConfirmOpen(false)} />
      <SuccessModal open={successOpen} onClose={handleSuccessClose} />
    </div>
  );
};

export default NewValuationPage;
