import { useRef, useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
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
import { projectService } from '../../../services/projectService';
import type { ProjectDetails } from '../../../services/projectService';
import { documentService } from '../../../services/documentService';
import { teamService } from '../../../services/teamService';
import type { TeamMember as TeamType } from '../../../services/teamService';
import type { Project } from '../types';

interface ValuationJobDetailProps {
  projectId: string;
  initialProject?: Project | null;
  onBack: () => void;
}

interface JobDocument {
  id: string;
  name: string;
  uploadDate?: string;
  status: 'submitted' | 'pending';
  uploadedBy?: string;
  required: boolean;
  note?: string;
}

const ValuationJobDetail = ({ projectId, initialProject, onBack }: ValuationJobDetailProps) => {
  const [showAllTeam, setShowAllTeam] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [selectedUploadDocId, setSelectedUploadDocId] = useState<string | null>(null);
  const documentUploadInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ NEW: State for API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [documents, setDocuments] = useState<JobDocument[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamType[]>([]);

  // ✅ NEW: Fetch project details from backend
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prefer the selected row data so the page opens even if the
        // project-by-id endpoint is failing in the running backend process.
        let projectData: ProjectDetails;
        if (initialProject) {
          projectData = initialProject as ProjectDetails;
        } else {
          try {
            projectData = await projectService.getById(projectId);
          } catch {
            const allProjects = await projectService.getAll({ search: projectId });
            const matchedProject = allProjects.find((p) => p.projectId === projectId);
            if (!matchedProject) {
              throw new Error('Project not found');
            }
            projectData = matchedProject as ProjectDetails;
          }
        }

        setProject(projectData);

        const resolvedId = projectData.id || projectId;

        // Load related data independently so a single endpoint failure
        // does not block the detail page from rendering.
        const [docsResult, teamResult] = await Promise.allSettled([
          documentService.getByProject(resolvedId),
          teamService.getByProject(resolvedId),
        ]);

        const docsData = docsResult.status === 'fulfilled' ? docsResult.value : [];
        const teamData = teamResult.status === 'fulfilled' ? teamResult.value : [];
        
        // Transform documents to match component interface
        const transformedDocs: JobDocument[] = docsData.map(doc => ({
          id: doc.id,
          name: doc.name,
          uploadDate: doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          }) : undefined,
          status: (doc.status === 'submitted' || doc.status === 'approved') ? 'submitted' : 'pending',
          uploadedBy: doc.uploadedBy || undefined,
          required: doc.required,
          note: doc.note || undefined,
        }));
        
        setDocuments(transformedDocs);
        setTeamMembers(teamData);
      } catch (err) {
        setError('Failed to load project details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, initialProject]);

  const handleDocumentUpload = (docId: string) => {
    setSelectedUploadDocId(docId);
    documentUploadInputRef.current?.click();
  };

  const handleDocumentFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !selectedUploadDocId) return;

    setUploadingDoc(selectedUploadDocId);

    const uploadDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedUploadDocId
          ? {
              ...doc,
              status: 'submitted',
              uploadDate,
              uploadedBy: 'John Doe',
              note: undefined,
            }
          : doc
      )
    );

    setUploadingDoc(null);
    setSelectedUploadDocId(null);
    event.target.value = '';
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
      }}>
        <div style={{ fontSize: '16px', color: theme.colors.text.secondary }}>
          Loading project details...
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !project) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ color: '#ff4d4f', fontSize: '16px' }}>
          {error || 'Project not found'}
        </div>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            backgroundColor: theme.colors.primary.main,
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  // ✅ Transform backend data to match UI
  const uploadedCount = documents.filter(d => d.status === 'submitted').length;
  const totalCount = documents.length;

  // Calculate days remaining
  const expectedDate = new Date(project.expectedCompletion);
  const today = new Date();
  const diffTime = expectedDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Map project status to stages
  const getStages = (status: string) => {
    const stageOrder = ['Awaiting Docs', 'Site Inspected', 'Report Prepared', 'Payment Pending', 'Completed'];
    const currentIndex = stageOrder.indexOf(status);
    
    return [
      { name: 'Docs\nReceived', completed: currentIndex > 0, current: currentIndex === 0 },
      { name: 'Site\nInspected', completed: currentIndex > 1, current: currentIndex === 1 },
      { name: 'Report\nPrepared', completed: currentIndex > 2, current: currentIndex === 2 },
      { name: 'Report\nSent', completed: currentIndex > 3, current: currentIndex === 3 },
      { name: 'Comple\nted', completed: currentIndex > 4, current: currentIndex === 4 },
    ];
  };

  const jobData = {
    id: project.projectId,
    address: project.propertyAddress,
    client: 'Abeywickrama Holdings Pvt Ltd', // TODO: Get from backend when client table exists
    projectId: project.projectId,
    propertyType: 'Residential Land & House', // TODO: Add to project entity
    valuationType: 'Market Valuation', // TODO: Add to project entity
    bankBranch: 'Colombo 07 - Main', // TODO: Add to project entity
    creditOfficer: 'You (John Doe)', // TODO: Get from auth
    applicant: project.applicants && project.applicants.length > 0 ? project.applicants[0] : 'N/A',
    applicantContact: '+94 77 123 4567', // TODO: Add to project entity
    requestedDate: new Date(project.requestedDate).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    expectedCompletion: new Date(project.expectedCompletion).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    daysRemaining,
    currentStage: project.status,
    assignedTeam: teamMembers,
    documents,
    stages: getStages(project.status),
  };

  // ── Styles ──────────────────────────────────────────

  const containerStyle: CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px 40px',
  };

  const backButtonStyle: CSSProperties = {
    backgroundColor: '#f5f8ff',
    border: '1px solid #c9dcff',
    borderRadius: '6px',
    color: theme.colors.text.primary,
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
  };

  const headerCardStyle: CSSProperties = {
    backgroundColor: '#f7fbff',
    borderRadius: '8px',
    padding: '24px 28px',
    border: '2px solid #b7d7ff',
    boxShadow: '0 6px 16px rgba(24, 144, 255, 0.12)',
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

  const stageWrapperStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px 40px',
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
    backgroundColor: completed ? '#1677ff' : current ? '#b5e7ff' : 'white',
    border: `2px solid ${completed ? '#1677ff' : current ? '#b5e7ff' : '#d9d9d9'}`,
    color: completed ? 'white' : current ? '#1677ff' : '#bfbfbf',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  });

  const stageLabelStyle = (completed: boolean, current: boolean): CSSProperties => ({
    fontSize: '11px',
    color: current ? '#1677ff' : completed ? theme.colors.text.primary : theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: current ? 600 : 400,
    lineHeight: '1.4',
    whiteSpace: 'pre-line' as const,
  });

  const contentGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '20px',
    alignItems: 'start',
  };

  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #999',
    overflow: 'hidden',
  };

  const cardHeaderStyle: CSSProperties = {
    padding: '14px 20px',
    borderBottom: '1px solid #999',
    fontSize: '15px',
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const sectionHeaderTitleStyle: CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    color: '#000',
    letterSpacing: '0.2px',
  };

  const cardBodyStyle: CSSProperties = {
    padding: '20px',
  };

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
    backgroundColor: daysRemaining < 0 ? '#fff1f0' : '#fff7e6',
    color: daysRemaining < 0 ? '#ff4d4f' : '#fa8c16',
    border: daysRemaining < 0 ? '1px solid #ffa39e' : '1px solid #ffd591',
  };

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

  const reportActionButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid #91caff',
    backgroundColor: '#e6f4ff',
    color: '#1677ff',
  };

  return (
    <div style={containerStyle}>

      {/* Back Button */}
      <button style={backButtonStyle} onClick={onBack}>
        Back
      </button>

      {/* Header Card */}
      <div style={headerCardStyle}>
        <h1 style={titleStyle}>{jobData.id}</h1>
        <div style={addressStyle}>
          {jobData.address}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div style={clientStyle}>
            Client: <strong>{jobData.client}</strong>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button style={reportActionButtonStyle} onClick={() => alert('Report download feature will be available soon.')}>
              <DownloadOutlined /> Download Report
            </button>
            <button style={reportActionButtonStyle}>
              <EyeOutlined /> View Report
            </button>
          </div>
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
            <div style={cardHeaderStyle}>
              <span style={sectionHeaderTitleStyle}>Project Details</span>
            </div>
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
                  <span style={daysBadgeStyle}>
                    {daysRemaining < 0 ? `${Math.abs(daysRemaining)} Days Overdue` : `${daysRemaining} Days`}
                  </span>
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
              <span style={sectionHeaderTitleStyle}>Document Checklist</span>
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
              <span style={sectionHeaderTitleStyle}>Assigned Team</span>
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
                View All ({jobData.assignedTeam.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={documentUploadInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
        onChange={handleDocumentFileChange}
      />

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