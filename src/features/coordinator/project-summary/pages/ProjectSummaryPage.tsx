import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchProjectSummary } from '../api/project-summary';
import type { ProjectSummary } from '../types/project-summary';
import ClientSection from '../components/ClientSection';
import BankSection from '../components/BankSection';
import PropertySection from '../components/PropertySection';
import SurveySection from '../components/SurveySection';
import LegalSection from '../components/LegalSection';
import DocumentSection from '../components/DocumentSection';
import './ProjectSummaryPage.css';

const ProjectSummaryPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();                                 // read ?nic= from URL
  const nic = params.get('nic') || '';                                // extract NIC value
  const [data, setData] = useState<ProjectSummary | null>(null);      // summary response
  const [loading, setLoading] = useState(true);                       // loading state

  useEffect(() => {
    if (!nic) return;                                                  // no NIC → skip fetch
    fetchProjectSummary(nic)                                           // call backend API
      .then(setData)
      .catch(() => setData({ found: false }))                          // handle API error
      .finally(() => setLoading(false));
  }, [nic]);

  if (loading) return <div className="ps-page"><p>Loading...</p></div>;
  if (!data?.found) return <div className="ps-page"><p>No data found for this client.</p></div>;

  return (
    <div className="ps-page">
       <div className="ps-inner">
      <h1 className="ps-heading">Project Summary</h1>
      <p className="ps-sub">Review existing details before creating a new valuation</p>
      <ClientSection data={data.client} />
      <BankSection bank={data.bank} officer={data.bankOfficer} />
      <PropertySection data={data.property} />
      <SurveySection data={data.survey} />
      <LegalSection data={data.legal} />
      <DocumentSection data={data.documents} />
      <button className="ps-valuation-btn" onClick={() => navigate('/coordinator/new-valuation')}>
        New Valuation
      </button>
       </div>
    </div>
  );
};

export default ProjectSummaryPage;
