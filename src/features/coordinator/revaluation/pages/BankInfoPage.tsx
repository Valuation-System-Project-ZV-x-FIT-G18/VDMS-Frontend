import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRevaluation } from '../api/revaluation';
import type { RevaluationData, DataMap } from '../types/revaluation';
import type { BankOfficerFormData } from '../../register-bank/types/bank-officer';
import { deriveNames } from '../../register-client/utils/deriveNames';
import { registerRevaluationBankOfficer } from '../../register-bank/api/register-bank';
import OfficerNameSection from '../../register-bank/components/OfficerNameSection';
import OfficerContactSection from '../../register-bank/components/OfficerContactSection';
import BankDetailsSection from '../../register-bank/components/BankDetailsSection';
import { validateRegisterBankForm } from '../../validation/register-bank.validation';
import type { FieldErrors } from '../../validation/shared';
import '../../register-bank/pages/RegisterBankPage.css';

type AnyMap = DataMap;

const empty: BankOfficerFormData = {
  fullName: '', firstName: '', lastName: '', nameWithInitials: '',
  nic: '', designation: '', phone: '', email: '',
  bankName: '', branch: '', branchCode: '',
};

const getLocal = (k: string) => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch { return {}; } };
const hasValue = (v: unknown) => typeof v === 'string' ? v.trim().length > 0 : v != null;
const hasAnyValue = (x?: AnyMap | null) => !!x && Object.values(x).some(hasValue);

const localBank = () => {
  const x = getLocal('register-bank') as Record<string, string | null | undefined>;
  const mapped: AnyMap = {
    bank_name: x.bank_name ?? x.bankName,
    branch: x.branch,
    branch_code: x.branch_code ?? x.branchCode,
  };
  return hasAnyValue(mapped) ? mapped : null;
};

const localOfficer = () => {
  const x = getLocal('register-bank') as Record<string, string | null | undefined>;
  const mapped: AnyMap = {
    name: x.name ?? x.fullName,
    nic: x.nic,
    email: x.email,
    phone: x.phone,
    designation: x.designation,
  };
  return hasAnyValue(mapped) ? mapped : null;
};

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

const BankInfoPage = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const nic = params.get('nic') || '';
  const [data, setData] = useState<RevaluationData | null>(null);
  const [form, setForm] = useState<BankOfficerFormData>(empty);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (nic) fetchRevaluation(nic).then(setData).catch(() => setData({ found: false }));
  }, [nic]);

  const bank = data && hasAnyValue((data.bank as AnyMap) ?? null) ? data.bank : localBank();
  const officer = data && hasAnyValue((data.bankOfficer as AnyMap) ?? null) ? data.bankOfficer : localOfficer();

  const officerName = String(officer?.name ?? '').trim();
  const officerNic = String(officer?.nic ?? '').trim();
  const officerDesignation = String(officer?.designation ?? '');
  const officerPhone = String(officer?.phone ?? '');
  const officerEmail = String(officer?.email ?? '');
  const bankName = String(bank?.bank_name ?? '');
  const bankBranch = String(bank?.branch ?? '');
  const bankBranchCode = String(bank?.branch_code ?? '');

  useEffect(() => {
    if (!bankName && !bankBranch && !bankBranchCode && !officerName && !officerDesignation && !officerPhone && !officerEmail) {
      return;
    }

    const nameParts = deriveNames(officerName);
    const nextForm: BankOfficerFormData = {
      fullName: officerName,
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      nameWithInitials: nameParts.nameWithInitials,
      nic: officerNic,
      designation: officerDesignation,
      phone: officerPhone,
      email: officerEmail,
      bankName,
      branch: bankBranch,
      branchCode: bankBranchCode,
    };

    setForm((prev) => {
      const unchanged =
        prev.fullName === nextForm.fullName &&
        prev.firstName === nextForm.firstName &&
        prev.lastName === nextForm.lastName &&
        prev.nameWithInitials === nextForm.nameWithInitials &&
        prev.nic === nextForm.nic &&
        prev.designation === nextForm.designation &&
        prev.phone === nextForm.phone &&
        prev.email === nextForm.email &&
        prev.bankName === nextForm.bankName &&
        prev.branch === nextForm.branch &&
        prev.branchCode === nextForm.branchCode;

      return unchanged ? prev : nextForm;
    });
  }, [
    nic,
    officerName,
    officerNic,
    officerDesignation,
    officerPhone,
    officerEmail,
    bankName,
    bankBranch,
    bankBranchCode,
  ]);

  const handleChange = useCallback((name: string, value: string) => {
    setErrors((prev) => {
      if (!prev[name] && !prev.form) return prev;
      const next = { ...prev };
      delete next[name];
      delete next.form;
      return next;
    });

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'fullName') Object.assign(next, deriveNames(value));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateRegisterBankForm(form);
    setErrors(validation.errors);
    if (!validation.valid) return;

    setLoading(true);
    try {
      await registerRevaluationBankOfficer(form, nic);
      nav('/coordinator/new-valuation');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Revaluation bank save failed';
      setErrors(mapApiErrorsToFields(message));
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <div className="rv-page">Loading...</div>;
  if (!data.found) return <div className="rv-page">No data found.</div>;

  return (
    <div className="register-bank-page">
      <div className="register-bank-card">
        <h1 className="bank-heading">Edit bank &amp; officer for revaluation</h1>
        <p className="bank-sub">Save creates a new record for the same project with a new associated valuation id.</p>
        <form onSubmit={handleSubmit} onBlurCapture={handleFieldBlur} noValidate>
          <OfficerNameSection form={form} onChange={handleChange} errors={errors} />
          <OfficerContactSection form={form} onChange={handleChange} errors={errors} />
          <BankDetailsSection form={form} onChange={handleChange} errors={errors} />
          {errors.form && <span className="field-error">{errors.form}</span>}
          <div className="bank-form-actions">
            <button type="button" className="back-btn" onClick={() => nav(-1)}>
              Back
            </button>
            <button type="submit" className="next-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save & Next -> New valuation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankInfoPage;
