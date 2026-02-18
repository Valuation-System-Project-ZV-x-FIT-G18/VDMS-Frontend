import { useState } from 'react';
import type { CSSProperties } from 'react';
import {  
  FileTextOutlined,
  CheckOutlined,
  EyeOutlined,
  UploadOutlined,
  CloseOutlined,
  WarningOutlined,
  UserOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { theme } from '../../../styles/theme';

interface ValuationJobDetailProps {
  projectId: string;
  onBack: () => void;
}

const ValuationJobDetail = ({ projectId, onBack }: ValuationJobDetailProps) => {
  const [showAllTeam, setShowAllTeam] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const jobData = {
    id: projectId,
    address: '123 Galle Road, Colombo 03, Western Province',
    client: 'Abeywickrama Holdings Pvt Ltd',
    projectId: '#PROJ-1234',
    propertyType: 'Residential Land & House',
    valuationType: 'Market Valuation',
    bankBranch: 'Colombo 07 - Main',
    creditOfficer: 'You (John Doe)',
    applicant: 'Mr. S. Perera',
    applicantContact: '+94 77 123 4567',
    requestedDate: 'Oct 20, 2023',
    expectedCompletion: 'Nov 05, 2023',
    daysRemaining: 5,
    currentStage: 'Report Prepared',
    assignedTeam: [
      { name: 'Alice Freeman', role: 'coordinator', email: 'alice@example.com' },
      { name: 'Marcus Johnson', role: 'Technical officer', email: 'marcus@example.com' },
      { name: 'Sarah Jenkins', role: 'Manager', email: 'sarah@example.com' },
      { name: 'David Brown', role: 'Senior Valuator', email: 'david@example.com' },
      { name: 'Emma Wilson', role: 'Technical Officer', email: 'emma@example.com' },
    ],
    documents: [
      { id: '1', name: 'Survey Plan', uploadDate: 'Oct 24, 2023', status: 'submitted', uploadedBy: 'John Doe', required: false },
      { id: '2', name: 'Local Authority Certificate', uploadDate: 'Oct 23, 2023', status: 'submitted', uploadedBy: 'John Doe', required: false },
      { id: '3', name: 'Deed Copy (Prior 30 Years)', status: 'pending', required: true, note: 'Required for site verification' },
      { id: '4', name: 'Building Plan (Approved)', status: 'pending', required: false, note: 'Waiting for client' },
    ],
    stages: [
      { name: 'Docs\nReceived', completed: true, current: false },
      { name: 'Site\nInspected', completed: true, current: false },
      { name: 'Report\nPrepared', completed: false, current: true },
      { name: 'Report\nSent', completed: false, current: false },
      { name: 'Comple\nted', completed: false, current: false },
    ],
  };

  const uploadedCount = jobData.documents.filter(d => d.status === 'submitted').length;
  const totalCount = jobData.documents.length;

  const handleDocumentUpload = (docId: string) => {
    setUploadingDoc(docId);
    setTimeout(() => {
      alert(`Upload interface for: ${jobData.documents.find(d => d.id === docId)?.name}`);
      setUploadingDoc(null);
    }, 500);
  };

  // ── Styles ──────────────────────────────────────────

  const containerStyle: CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px 40px',
  };

  const backButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.primary.main,
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: 0,
  };

  const headerCardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px 28px',
    border: '1px solid #e8e8e8',
    marginBottom: '24px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.colors.text.primary,
    marginBottom: '8px',
  };

  const addressStyle: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px',
  };

  const clientStyle: CSSProperties = {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  };

  // Progress stages
  const stageWrapperStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px 40px',
    border: '1px solid #e8e8e8',
    marginBottom: '24px',
  };

  const stageContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
  };

  const stageLineStyle: CSSProperties = {
    position: 'absolute',
    top: '22px',
    left: '44px',
    right: '44px',
    height: '2px',
    backgroundColor: '#e8e8e8',
    zIndex: 0,
  };

  const stageItemStyle = (): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    zIndex: 1,
    minWidth: '70px',
  });

  const stageIconStyle = (completed: boolean, current: boolean): CSSProperties => ({
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: completed ? '#52c41a' : current ? '#1890ff' : 'white',
    border: `2px solid ${completed ? '#52c41a' : current ? '#1890ff' : '#d9d9d9'}`,
    color: completed ? 'white' : current ? 'white' : '#bfbfbf',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  });

  const stageLabelStyle = (completed: boolean, current: boolean): CSSProperties => ({
    fontSize: '11px',
    color: current ? '#1890ff' : completed ? theme.colors.text.primary : theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: current ? 600 : 400,
    lineHeight: '1.4',
    whiteSpace: 'pre-line' as const,
  });

  // Main grid
  const contentGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '20px',
    alignItems: 'start',
  };

  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e8e8e8',
    overflow: 'hidden',
  };

  const cardHeaderStyle: CSSProperties = {
    padding: '14px 20px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '15px',
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const cardBodyStyle: CSSProperties = {
    padding: '20px',
  };

  // Project details grid
  const detailsGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0',
  };

  const detailCellStyle: CSSProperties = {
    padding: '10px 12px',
    borderBottom: '1px solid #f5f5f5',
  };

  const detailLabelStyle: CSSProperties = {
    fontSize: '12px',
    color: theme.colors.text.secondary,
    marginBottom: '3px',
  };

  const detailValueStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: theme.colors.text.primary,
  };

  const daysBadgeStyle: CSSProperties = {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#fff7e6',
    color: '#fa8c16',
    border: '1px solid #ffd591',
  };

  // Document checklist
  const docItemStyle = (): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #f5f5f5',
    backgroundColor: 'white',
  });

  const docIconStyle = (pending: boolean): CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    backgroundColor: pending ? '#fff2e8' : '#e6f4ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: pending ? '#fa8c16' : theme.colors.primary.main,
    flexShrink: 0,
  });

  const submittedBadgeStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '84px',
    height: '28px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#f6ffed',
    color: '#52c41a',
    border: '1px solid #b7eb8f',
  };

  const pendingBadgeStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '84px',
    height: '28px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#fff1f0',
    color: '#ff4d4f',
    border: '1px solid #ffa39e',
  };

  const uploadBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '84px',
    height: '28px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#e6f4ff',
    color: '#1677ff',
    border: '1px solid #91caff',
    cursor: 'pointer',
  };

  const docActionGroupStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '6px',
    width: '174px',
  };

  const viewBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '84px',
    height: '28px',
    borderRadius: '4px',
    backgroundColor: '#f6ffed',
    color: '#52c41a',
    border: '1px solid #b7eb8f',
    cursor: 'pointer',
  };

  // Team styles
  const teamAvatarStyle: CSSProperties = {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8c8c8c',
    fontSize: '18px',
    flexShrink: 0,
  };

  const viewAllBtnStyle: CSSProperties = {
    width: '100%',
    padding: '8px',
    marginTop: '8px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '13px',
    color: theme.colors.text.primary,
  };

  // Modal styles
  const modalOverlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalBoxStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    width: '440px',
    maxHeight: '80vh',
    overflowY: 'auto',
  };

  const modalHeaderStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>

      {/* Back Button */}
      <button style={backButtonStyle} onClick={onBack}>
        ← Back
      </button>

      {/* Header Card */}
      <div style={headerCardStyle}>
        <div>
          <h1 style={titleStyle}>{jobData.id}</h1>
          <div style={addressStyle}>
            📍 {jobData.address}
          </div>
          <div style={clientStyle}>
            Client: <strong>{jobData.client}</strong>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '6px', fontSize: '14px',
            fontWeight: 500, cursor: 'pointer', border: 'none',
            backgroundColor: theme.colors.primary.main, color: 'white',
          }} onClick={() => alert('Report download feature will be available soon.')}>
            <DownloadOutlined /> Download Report
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '6px', fontSize: '14px',
            fontWeight: 500, cursor: 'pointer',
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: 'white', color: theme.colors.text.primary,
          }}>
            <EyeOutlined /> View Report
          </button>
        </div>
      </div>

      {/* Progress Stages */}
      <div style={stageWrapperStyle}>
        <div style={stageContainerStyle}>
          <div style={stageLineStyle} />
          {jobData.stages.map((stage, index) => (
            <div key={index} style={stageItemStyle()}>
              <div style={stageIconStyle(stage.completed, stage.current)}>
                {stage.completed
                  ? <CheckOutlined />
                  : stage.current
                    ? <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white' }} />
                    : null
                }
              </div>
              <span style={stageLabelStyle(stage.completed, stage.current)}>
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={contentGridStyle}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Project Details Card */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>Project Details</div>
            <div style={detailsGridStyle}>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Project ID</div>
                <div style={detailValueStyle}>{jobData.projectId}</div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Property Type</div>
                <div style={detailValueStyle}>{jobData.propertyType}</div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Requested Date</div>
                <div style={detailValueStyle}>{jobData.requestedDate}</div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Valuation Type</div>
                <div style={detailValueStyle}>{jobData.valuationType}</div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Expected Completion</div>
                <div style={detailValueStyle}>{jobData.expectedCompletion}</div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Bank Branch</div>
                <div style={detailValueStyle}>{jobData.bankBranch}</div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Days Remaining</div>
                <div style={detailValueStyle}>
                  <span style={daysBadgeStyle}>{jobData.daysRemaining} Days</span>
                </div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Credit Officer</div>
                <div style={detailValueStyle}>{jobData.creditOfficer}</div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Loan Applicant</div>
                <div style={{ ...detailValueStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserOutlined style={{ fontSize: '12px' }} /> {jobData.applicant}
                </div>
              </div>
              <div style={detailCellStyle}>
                <div style={detailLabelStyle}>Applicant Contact</div>
                <div style={detailValueStyle}>
                  <a href={`tel:${jobData.applicantContact}`} style={{ color: theme.colors.primary.main, textDecoration: 'none' }}>
                    {jobData.applicantContact}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Document Checklist Card */}
          <div style={cardStyle}>
            <div style={{ ...cardHeaderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Document Checklist</span>
              <span style={{ fontSize: '13px', fontWeight: 400, color: theme.colors.text.secondary }}>
                {uploadedCount}/{totalCount} Uploaded
              </span>
            </div>

            {jobData.documents.map((doc) => (
              <div key={doc.id} style={docItemStyle()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={docIconStyle(doc.status === 'pending')}>
                    {doc.status === 'pending'
                      ? <WarningOutlined />
                      : <FileTextOutlined />
                    }
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: theme.colors.text.primary }}>
                      {doc.name}
                    </div>
                    {doc.uploadDate && (
                      <div style={{ fontSize: '11px', color: theme.colors.text.secondary }}>
                        Uploaded on {doc.uploadDate}
                      </div>
                    )}
                    {doc.note && (
                      <div style={{ fontSize: '11px', color: doc.required ? '#ff4d4f' : '#fa8c16' }}>
                        {doc.note}
                      </div>
                    )}
                  </div>
                </div>

                <div style={docActionGroupStyle}>
                  {doc.status === 'submitted' ? (
                    <>
                      <span style={submittedBadgeStyle}>
                        Submitted
                      </span>
                      <button style={viewBtnStyle}>
                        <EyeOutlined />
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={pendingBadgeStyle}>Pending</span>
                      <button
                        style={uploadBtnStyle}
                        onClick={() => handleDocumentUpload(doc.id)}
                        disabled={uploadingDoc === doc.id}
                      >
                        <UploadOutlined />
                        {uploadingDoc === doc.id ? '...' : 'Upload'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div style={cardStyle}>
            <div style={{ ...cardHeaderStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Assigned Team</span>
            </div>
            <div style={cardBodyStyle}>
              {jobData.assignedTeam.slice(0, 3).map((member, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={teamAvatarStyle}>
                    <UserOutlined />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: theme.colors.text.primary }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                      {member.role}
                    </div>
                  </div>
                </div>
              ))}

              <button style={viewAllBtnStyle} onClick={() => setShowAllTeam(true)}>
                View All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View All Team Modal */}
      {showAllTeam && (
        <div style={modalOverlayStyle} onClick={() => setShowAllTeam(false)}>
          <div style={modalBoxStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
                Complete Team ({jobData.assignedTeam.length})
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                onClick={() => setShowAllTeam(false)}
              >
                <CloseOutlined />
              </button>
            </div>

            {jobData.assignedTeam.map((member, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={teamAvatarStyle}>
                  <UserOutlined />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{member.name}</div>
                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>{member.role}</div>
                  <div style={{ fontSize: '12px', color: theme.colors.primary.main }}>{member.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValuationJobDetail;