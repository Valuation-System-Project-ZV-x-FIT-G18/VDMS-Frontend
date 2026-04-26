import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRevaluation } from '../api/revaluation';
import type { RevaluationData } from '../types/revaluation';
import type { DataMap } from '../types/revaluation';
import ReadOnlySection from '../components/ReadOnlySection';
import DocumentsSection from '../components/DocumentsSection';
import MapSection from '../components/MapSection';
import './RevaluationPage.css';

type AnyMap = DataMap;

const getLocal = (k: string) => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch { return {}; } };
const localDocs = () => { const x = getLocal('document-upload'); return [{ nic_file_name: x.nicCopy?.name, tax_file_name: x.taxReceipts?.name, utility_file_name: x.utilityBills?.name, other_file_name: x.otherDocs?.name }]; };
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
    email: x.email,
    phone: x.phone,
    designation: x.designation,
  };
  return hasAnyValue(mapped) ? mapped : null;
};

const RevaluationPage = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const nic = params.get('nic') || '';
  const [data, setData] = useState<RevaluationData | null>(null);

  useEffect(() => { if (nic) fetchRevaluation(nic).then(setData).catch(() => setData({ found: false })); }, [nic]);
  useEffect(() => {
    if (data?.found && data.client) localStorage.setItem('register-client', JSON.stringify(data.client));
  }, [data]);
  if (!data) return <div className="rv-page">Loading...</div>;
  if (!data.found) return <div className="rv-page">No data found.</div>;
  const docs = data.documents?.length ? data.documents : localDocs();
  const bank = hasAnyValue((data.bank as AnyMap) ?? null)
    ? data.bank
    : localBank();
  const officer = hasAnyValue((data.bankOfficer as AnyMap) ?? null)
    ? data.bankOfficer
    : localOfficer();

  return (
    <div className="rv-page">
      <h1>Revaluation Details (Read Only)</h1>
      <div className="rv-grid">
        <ReadOnlySection title="Client Info" data={data.client} />
        <ReadOnlySection title="Bank Info" data={bank} />
        <ReadOnlySection title="Bank Officer Info" data={officer} />
        <ReadOnlySection title="Property" data={data.property} />
        <MapSection lat={data.property?.latitude} lng={data.property?.longitude} />
        <ReadOnlySection title="Survey" data={data.survey} />
        <ReadOnlySection title="Legal" data={data.legal} />
        <DocumentsSection docs={docs} />
      </div>
      <div className="rv-actions"><button className="rv-btn" onClick={() => nav('/coordinator/new-valuation')}>Next - New Valuation</button></div>
    </div>
  );
};

export default RevaluationPage;
