import { useEffect, useCallback, useState } from 'react';
import { uploadRequestLetter } from '../api/request-letter-upload';
import { useNavigate } from 'react-router-dom';
import type { FreeOfficerItem, NewValuationForm } from '../types/new-valuation';
import { fetchFreeOfficers, submitValuation } from '../api/new-valuation';
import usePersistedState from '../../hooks/usePersistedState';
import ConfirmModal from '../components/ConfirmModal';
import RequestLetterUpload from '../components/RequestLetterUpload';
import PurposeInput from '../components/PurposeInput';
import OfficerDropdown from '../components/OfficerDropdown';
import SchedulePicker from '../components/SchedulePicker';
import SuccessModal from '../components/SuccessModal';
import ValuationFormActions from '../components/ValuationFormActions';
import { validateNewValuationForm } from '../../validation/new-valuation.validation';
import type { FieldErrors } from '../../validation/shared';
import './NewValuationPage.css';

const empty: NewValuationForm = {
  toId: '', timeDate: '', requestLetter: null, purpose: '',
};

const NewValuationPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<NewValuationForm>('new-valuation-form', empty);
  const [date, setDate] = usePersistedState('new-valuation-date', '');
  const [time, setTime] = usePersistedState('new-valuation-time', '');
  const [officers, setOfficers] = useState<FreeOfficerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Fetch officers on mount
  useEffect(() => {
    fetchFreeOfficers().then(setOfficers).catch(() => {});
  }, []);

  const set = useCallback(<K extends keyof NewValuationForm>(k: K, v: NewValuationForm[K]) => {
    setErrors((prev) => {
      if (!prev[k] && !prev.form) return prev;
      const next = { ...prev };
      delete next[k];
      delete next.form;
      return next;
    });
    setForm(prev => ({ ...prev, [k]: v }));
  }, [setForm]);

  const handleFieldBlur = useCallback((event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as unknown as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const field = target.name;
    if (!field) return;

    const validation = validateNewValuationForm(form, date, time);
    const fieldError = validation.errors[field];
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) next[field] = fieldError;
      else delete next[field];
      return next;
    });
  }, [form, date, time]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateNewValuationForm(form, date, time);
    setErrors(validation.errors);
    if (!validation.valid) {
      return;
    }

    setConfirmOpen(true);
  };
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
      setErrors((prev) => ({ ...prev, form: message }));
    }
    finally { setLoading(false); }
  };

  const handleSuccessClose = () => {
    setForm(empty);
    setDate('');
    setTime('');
    setErrors({});
    setPdfError(null);
    setSuccessOpen(false);
    navigate('/coordinator/search');
  };

  return (
    <div className="nv-page">
      <div className="nv-card">
        <h1 className="nv-heading">New valuation</h1>
        <p className="nv-sub">Assign a technical officer and schedule the valuation</p>
        <form onSubmit={handleSubmit} onBlurCapture={handleFieldBlur} noValidate>
          <RequestLetterUpload
            value={form.requestLetter}
            onChange={async (f) => {
              setPdfError(null);
              if (!f) {
                set('requestLetter', null);
                return;
              }
              // Save the chosen filename immediately so refresh does not clear it
              set('requestLetter', { name: f.name });
              // If f is a File (from input), upload it
              if ((window as any).File && f && (f as any).name && (f as any).lastModified) {
                setPdfUploading(true);
                try {
                  const uploaded = await uploadRequestLetter(f as any as File);
                  set('requestLetter', uploaded);
                  setPdfError(null);
                } catch (err) {
                  setPdfError('Failed to upload PDF. Make sure client is registered and NIC is valid.');
                } finally {
                  setPdfUploading(false);
                }
              } else {
                set('requestLetter', f);
              }
            }}
            error={errors.requestLetter}
          />
          {pdfUploading && <div style={{ color: '#2563eb', marginBottom: 8 }}>Uploading PDF...</div>}
          {pdfError && <div style={{ color: 'red', marginBottom: 8 }}>{pdfError}</div>}
          <PurposeInput value={form.purpose} onChange={v => set('purpose', v)} error={errors.purpose} />
          <OfficerDropdown officers={officers} value={form.toId} onChange={v => set('toId', v)} error={errors.toId} />
          <SchedulePicker
            date={date}
            time={time}
            onDateChange={(value) => {
              setErrors((prev) => {
                if (!prev.date) return prev;
                const next = { ...prev };
                delete next.date;
                return next;
              });
              setDate(value);
            }}
            onTimeChange={(value) => {
              setErrors((prev) => {
                if (!prev.time) return prev;
                const next = { ...prev };
                delete next.time;
                return next;
              });
              setTime(value);
            }}
            dateError={errors.date}
            timeError={errors.time}
          />
          {errors.form && <span className="field-error">{errors.form}</span>}
          <ValuationFormActions onBack={() => navigate(-1)} loading={loading} />
        </form>
      </div>
      <ConfirmModal open={confirmOpen} loading={loading} onOk={handleConfirm} onCancel={() => setConfirmOpen(false)} />
      <SuccessModal open={successOpen} onClose={handleSuccessClose} />
    </div>
  );
};

export default NewValuationPage;
