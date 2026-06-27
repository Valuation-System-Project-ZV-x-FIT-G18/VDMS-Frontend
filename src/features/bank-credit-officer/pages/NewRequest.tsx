import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { 
  ArrowLeftOutlined, 
  HomeOutlined, 
  UserOutlined, 
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { theme } from '../../../styles/theme';
import valuationJobService from '../../../services/valuationJobService';
import valuationTypeService, { type ValuationType } from '../../../services/valuationTypeService';

interface NewRequestProps {
  onBack: () => void;
  onSuccess: () => void;
}

const NewRequest = ({ onBack, onSuccess }: NewRequestProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [valuationTypes, setValuationTypes] = useState<ValuationType[]>([]);
  
  const [formData, setFormData] = useState({
    propertyAddress: '',
    applicants: ['', ''],
    valuationTypeId: '',
    requestedDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchValuationTypes();
  }, []);

  const fetchValuationTypes = async () => {
    try {
      const data = await valuationTypeService.getTypes();
      setValuationTypes(data);
    } catch (err) {
      console.error("Failed to fetch valuation types", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplicantChange = (index: number, value: string) => {
    const newApplicants = [...formData.applicants];
    newApplicants[index] = value;
    setFormData(prev => ({ ...prev, applicants: newApplicants }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create a unique project ID for demo purposes
      const projectId = `VAL-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      await valuationJobService.createJob({
        projectId,
        propertyAddress: formData.propertyAddress,
        applicants: formData.applicants.filter(a => a.trim() !== ''),
        status: 'In Progress',
        requestedDate: formData.requestedDate,
        paymentStatus: 'Pending',
      });
      
      setStep(4); // Success step
    } catch (err) {
      console.error("Failed to create request", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerStyle: CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
  };

  const cardStyle: CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #eef2f6',
  };

  const stepIndicatorStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
    position: 'relative',
  };

  const stepItemStyle = (itemStep: number): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    zIndex: 1,
    color: step >= itemStep ? theme.colors.primary.main : '#94a3b8',
    fontWeight: step >= itemStep ? 600 : 400,
    cursor: 'pointer',
  });

  const stepCircleStyle = (itemStep: number): CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: step >= itemStep ? theme.colors.primary.main : '#f1f5f9',
    color: step >= itemStep ? '#fff' : '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    border: step === itemStep ? `2px solid ${theme.colors.primary.main}44` : 'none',
  });

  const inputGroupStyle: CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#334155',
    marginBottom: '8px',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const btnStyle = (variant: 'primary' | 'secondary'): CSSProperties => ({
    padding: '12px 24px',
    borderRadius: '8px',
    border: variant === 'primary' ? 'none' : '1px solid #e2e8f0',
    backgroundColor: variant === 'primary' ? theme.colors.primary.main : '#fff',
    color: variant === 'primary' ? '#fff' : '#64748b',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  return (
    <div style={containerStyle}>
      <button 
        onClick={onBack}
        style={{ ...btnStyle('secondary'), border: 'none', padding: '0', marginBottom: '24px', background: 'transparent' }}
      >
        <ArrowLeftOutlined /> Back to Projects
      </button>

      <div style={cardStyle}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>New Valuation Request</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
          Fill in the details below to initiate a new property valuation job.
        </p>

        {/* Steps */}
        <div style={stepIndicatorStyle}>
          <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '2px', backgroundColor: '#f1f5f9', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: '16px', left: '0', width: `${((step - 1) / 3) * 100}%`, height: '2px', backgroundColor: theme.colors.primary.main, zIndex: 0, transition: 'width 0.3s' }} />
          
          <div style={stepItemStyle(1)} onClick={() => step > 1 && setStep(1)}>
            <div style={stepCircleStyle(1)}><HomeOutlined /></div>
            <span style={{ fontSize: '12px' }}>Property</span>
          </div>
          <div style={stepItemStyle(2)} onClick={() => step > 2 && setStep(2)}>
            <div style={stepCircleStyle(2)}><UserOutlined /></div>
            <span style={{ fontSize: '12px' }}>Applicants</span>
          </div>
          <div style={stepItemStyle(3)} onClick={() => step > 3 && setStep(3)}>
            <div style={stepCircleStyle(3)}><FileTextOutlined /></div>
            <span style={{ fontSize: '12px' }}>Review</span>
          </div>
        </div>

        {/* Step 1: Property Info */}
        {step === 1 && (
          <div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Property Address</label>
              <input 
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                placeholder="Enter full property address"
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Valuation Type</label>
              <select 
                name="valuationTypeId"
                value={formData.valuationTypeId}
                onChange={handleInputChange}
                style={inputStyle}
              >
                <option value="">Select a category</option>
                {valuationTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button 
                onClick={() => setStep(2)}
                disabled={!formData.propertyAddress || !formData.valuationTypeId}
                style={{ ...btnStyle('primary'), opacity: (!formData.propertyAddress || !formData.valuationTypeId) ? 0.5 : 1 }}
              >
                Continue to Applicants
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Applicant Info */}
        {step === 2 && (
          <div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Primary Applicant Name</label>
              <input 
                value={formData.applicants[0]}
                onChange={(e) => handleApplicantChange(0, e.target.value)}
                placeholder="Full name as per deed"
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Secondary Applicant (Optional)</label>
              <input 
                value={formData.applicants[1]}
                onChange={(e) => handleApplicantChange(1, e.target.value)}
                placeholder="Joint applicant name"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button onClick={() => setStep(1)} style={btnStyle('secondary')}>Back</button>
              <button 
                onClick={() => setStep(3)}
                disabled={!formData.applicants[0]}
                style={{ ...btnStyle('primary'), opacity: !formData.applicants[0] ? 0.5 : 1 }}
              >
                Review Request
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>PROPERTY</span>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>{formData.propertyAddress}</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>VALUATION TYPE</span>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>
                  {valuationTypes.find(t => t.id === formData.valuationTypeId)?.name}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>APPLICANTS</span>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>
                  {formData.applicants.filter(a => a).join(', ')}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button onClick={() => setStep(2)} style={btnStyle('secondary')}>Back</button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                style={btnStyle('primary')}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>
              <CheckCircleOutlined />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Request Submitted!</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
              The valuation request has been successfully created. You can now track its progress in the project list.
            </p>
            <button 
              onClick={onSuccess}
              style={{ ...btnStyle('primary'), margin: '0 auto' }}
            >
              Done, back to projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRequest;
