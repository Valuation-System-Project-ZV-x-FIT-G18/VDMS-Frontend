import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchRevaluation } from '../api/revaluation';
import type { RevaluationData } from '../types/revaluation';
import ReadOnlySection from '../components/ReadOnlySection';
import DocumentsSection from '../components/DocumentsSection';
import MapSection from '../components/MapSection';
import './RevaluationPage.css';

const getLocal = (k: string) => { try { return JSON.parse(localStorage.getItem(k) || '{}'); } catch { return {}; } };
const localDocs = () => { const x = getLocal('document-upload'); return [{ nic_file_name: x.nicCopy?.name, tax_file_name: x.taxReceipts?.name, utility_file_name: x.utilityBills?.name, other_file_name: x.otherDocs?.name }]; };

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

  return (
    <div className="rv-page">
      <div className="rv-inner">
        <h1>Revaluation Details (Read Only)</h1>
        <div className="rv-grid">
          <ReadOnlySection title="Client Info" data={data.client} />
          <ReadOnlySection title="Property" data={data.property} />
          <MapSection lat={data.property?.latitude} lng={data.property?.longitude} />
          <ReadOnlySection title="Survey" data={data.survey} />
          <ReadOnlySection title="Legal" data={data.legal} />
          <DocumentsSection docs={docs} />
        </div>
        <div className="rv-actions">
          <button className="rv-btn" onClick={() => nav(`/coordinator/revaluation-bank?nic=${encodeURIComponent(nic)}`)}>
            Next - Bank Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevaluationPage;
