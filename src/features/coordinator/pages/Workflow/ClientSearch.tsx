import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowLayout from '../../components/WorkflowLayout';

const EXISTING_CLIENTS = new Set([
  'alexander@example.com',
  'emily.chen@example.co',
  'valid.user@gmail.com',
  'existing@company.org',
  'sarah.connor@cyberdyne.com',
  'john.doe@example.com',
  'jane.smith@company.co.uk'
]);

const ClientSearch: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('alexander@example.com');
  const [emailError, setEmailError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [resultColor, setResultColor] = useState('#ff2d2d');
  const [isRegisterDisabled, setIsRegisterDisabled] = useState(true);

  const steps = [
    { number: 1, label: 'Search', path: '/coordinator/workflow/search' },
    { number: 2, label: 'Register', path: '/coordinator/workflow/register' },
    { number: 3, label: 'Create Project', path: '/coordinator/workflow/create-project' },
    { number: 4, label: 'New Valuation', path: '/coordinator/workflow/new-valuation' },
    { number: 5, label: 'Assign TO', path: '/coordinator/workflow/assign-to' }
  ];

  const isValidEmail = useCallback((email: string): boolean => {
    if (!email || email.includes(' ')) return false;
    const atPos = email.indexOf('@');
    if (atPos === -1 || atPos === 0) return false;
    
    const domainAndMore = email.slice(atPos + 1);
    if (!domainAndMore.includes('.')) return false;
    
    const lastDotPos = domainAndMore.lastIndexOf('.');
    if (lastDotPos === -1 || lastDotPos === 0 || lastDotPos === domainAndMore.length - 1) return false;
    
    const tld = domainAndMore.slice(lastDotPos + 1);
    return tld.length >= 2 && /^[a-zA-Z]{2,}$/.test(tld);
  }, []);

  const validateAndStyle = useCallback(() => {
    const trimmed = email.trim();
    if (trimmed === '') {
      setIsValid(false);
      setEmailError('Email cannot be empty.');
      return false;
    } else if (!isValidEmail(email)) {
      setIsValid(false);
      setEmailError('Invalid email: must include @, domain with dot, no spaces.');
      return false;
    } else {
      setIsValid(true);
      setEmailError('');
      return true;
    }
  }, [email, isValidEmail]);

  useEffect(() => {
    validateAndStyle();
  }, [email, validateAndStyle]);

  const performSearch = useCallback(() => {
    if (!validateAndStyle()) {
      setResultMessage('Please enter a valid email before searching.');
      setResultColor('#ff2d2d');
      setIsRegisterDisabled(true);
      setShowResult(true);
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    const clientExists = EXISTING_CLIENTS.has(cleanedEmail);

    if (clientExists) {
      setResultMessage('✓ Client exists – redirecting to New Valuation ...');
      setResultColor('#10b981');
      setIsRegisterDisabled(true);
      setShowResult(true);
      setTimeout(() => {
        navigate('/coordinator/workflow/new-valuation');
      }, 600);
    } else {
      setResultMessage('Client does not exist! Please register.');
      setResultColor('#ff2d2d');
      setIsRegisterDisabled(false);
      setShowResult(true);
    }
  }, [email, validateAndStyle, navigate]);

  const handleRegister = () => {
    if (!isRegisterDisabled) {
      navigate('/coordinator/workflow/register');
    }
  };

  return (
    <WorkflowLayout steps={steps} activeStep={1}>
      <div className="content">
        <h1 className="title">Client Search</h1>

        <section className="card">
          <div className="info">
            <div className="info__i">i</div>
            <div className="info__text">Always search first to avoid duplicate client registration.</div>
          </div>

          <div className="search">
            <div className="search__row">
              <div className="input-group">
                <input
                  className={`input ${!isValid && emailError ? 'input--error' : ''} ${isValid && email ? 'input--valid' : ''}`}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                  placeholder="client@domain.com"
                />
                <div className="field-message">{emailError}</div>
              </div>
              <button className="btn" onClick={performSearch}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" strokeWidth="2" strokeLinecap="round" fill="none" stroke="currentColor" />
                </svg>
                Search
              </button>
            </div>

            {showResult && (
              <div className="result">
                <div className="result__msg" style={{ color: resultColor }}>
                  {resultMessage}
                </div>
                <button
                  className="btn btn--small"
                  disabled={isRegisterDisabled}
                  onClick={handleRegister}
                >
                  Register now
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </WorkflowLayout>
  );
};

export default ClientSearch;