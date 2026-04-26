import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowLayout from '../../components/WorkflowLayout';

interface FormErrors {
  appFirst?: string;
  appLast?: string;
  appNIC?: string;
  appContact?: string;
  appEmail?: string;
  appStreet?: string;
  appCity?: string;
  appDistrict?: string;
  appProvince?: string;
  bankFirst?: string;
  bankLast?: string;
  bankNIC?: string;
  bankContact?: string;
  bankEmail?: string;
  bankName?: string;
  bankBranch?: string;
}

const RegisterClient: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    { number: 1, label: 'Search', path: '/coordinator/workflow/search' },
    { number: 2, label: 'Register', path: '/coordinator/workflow/register' },
    { number: 3, label: 'Create Project', path: '/coordinator/workflow/create-project' },
    { number: 4, label: 'New Valuation', path: '/coordinator/workflow/new-valuation' },
    { number: 5, label: 'Assign TO', path: '/coordinator/workflow/assign-to' }
  ];

  // Applicant form state
  const [applicant, setApplicant] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    contact: '',
    email: '',
    street: '',
    city: '',
    district: '',
    province: '',
    additional: ''
  });

  // Bank officer form state
  const [bankOfficer, setBankOfficer] = useState({
    firstName: '',
    lastName: '',
    nic: '',
    contact: '',
    email: '',
    bankName: 'BOC',
    branch: ''
  });

  // Errors state
  const [errors, setErrors] = useState<FormErrors>({});

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Kurunegala', 'Galle',
    'Jaffna', 'Matara', 'Badulla', 'Ampara', 'Anuradhapura', 'Batticaloa',
    'Hambantota', 'Kegalle', 'Kilinochchi', 'Mannar', 'Matale', 'Monaragala',
    'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Trincomalee', 'Vavuniya'
  ];

  const provinces = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  // Validation functions
  const isEmptyOrSpaces = (str: string): boolean => !str || /^\s*$/.test(str);

  const validateName = (value: string): string => {
    const val = value || '';
    if (isEmptyOrSpaces(val)) return 'Required';
    if (val.trim().length < 2) return 'Minimum 2 characters';
    if (!/^[A-Za-z\s]+$/.test(val)) return 'Only letters allowed';
    return '';
  };

  const validateNIC = (value: string): string => {
    const val = (value || '').trim();
    if (!val) return 'Required';
    const oldNic = /^[0-9]{9}[vVxX]$/;
    const newNic = /^[0-9]{12}$/;
    if (oldNic.test(val) || newNic.test(val)) return '';
    return 'Use 9 digits + V/X or 12 digits';
  };

  const validateEmail = (value: string): string => {
    const val = (value || '').trim();
    if (!val) return 'Required';
    if (/\s/.test(val)) return 'No spaces allowed';
    if (!val.includes('@') || val.indexOf('@') === 0) return 'Must contain @';
    const domain = val.split('@')[1];
    if (!domain || !domain.includes('.') || domain.indexOf('.') === 0 || domain.endsWith('.')) return 'Must have . after @';
    return '';
  };

  const validatePhoneSL = (value: string): string => {
    const val = (value || '').trim();
    if (!val) return 'Required';
    if (!/^0\d{9}$/.test(val)) return '10 digits, start with 0';
    return '';
  };

  const validateStreet = (value: string): string => {
    const val = value || '';
    if (isEmptyOrSpaces(val)) return 'Required';
    if (/[^a-zA-Z0-9\s,./-]/.test(val)) return 'Only letters, numbers, , . / - allowed';
    return '';
  };

  const validateCity = validateStreet;

  const validateDropdown = (value: string): string => {
    const val = value || '';
    if (!val || val === '') return 'Please select an option';
    return '';
  };

  const validateBankName = (value: string): string => {
    const val = (value || '').trim();
    if (!val) return 'Required';
    if (val.length < 2) return 'Minimum 2 characters';
    if (!/^[A-Za-z\s]+$/.test(val)) return 'Letters & spaces only';
    return '';
  };

  const validateBranch = (value: string): string => {
    const val = (value || '').trim();
    if (!val) return 'Required';
    if (val.length < 2) return 'Minimum 2 characters';
    if (!/^[A-Za-z0-9\s]+$/.test(val)) return 'Letters, numbers, spaces only';
    return '';
  };

  const handleApplicantChange = (field: keyof typeof applicant, value: string) => {
    setApplicant(prev => ({ ...prev, [field]: value }));
    if (errors[`app${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [`app${field.charAt(0).toUpperCase() + field.slice(1)}`]: undefined }));
    }
  };

  const handleBankOfficerChange = (field: keyof typeof bankOfficer, value: string) => {
    setBankOfficer(prev => ({ ...prev, [field]: value }));
    if (errors[`bank${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [`bank${field.charAt(0).toUpperCase() + field.slice(1)}`]: undefined }));
    }
  };

  const validateField = (fieldId: string, value: string): string => {
    if (fieldId === 'appFirst' || fieldId === 'appLast' || fieldId === 'bankFirst' || fieldId === 'bankLast') {
      return validateName(value);
    } else if (fieldId === 'appNIC' || fieldId === 'bankNIC') {
      return validateNIC(value);
    } else if (fieldId === 'appContact' || fieldId === 'bankContact') {
      return validatePhoneSL(value);
    } else if (fieldId === 'appEmail' || fieldId === 'bankEmail') {
      return validateEmail(value);
    } else if (fieldId === 'appStreet') {
      return validateStreet(value);
    } else if (fieldId === 'appCity') {
      return validateCity(value);
    } else if (fieldId === 'appDistrict' || fieldId === 'appProvince') {
      return validateDropdown(value);
    } else if (fieldId === 'bankName') {
      return validateBankName(value);
    } else if (fieldId === 'bankBranch') {
      return validateBranch(value);
    }
    return '';
  };

  const handleBlur = (fieldId: string, value: string) => {
    const error = validateField(fieldId, value);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldId]: error }));
    } else {
      setErrors(prev => ({ ...prev, [fieldId]: undefined }));
    }
  };

  const runValidation = useCallback((): boolean => {
    let allValid = true;
    const newErrors: FormErrors = {};

    // Validate applicant fields
    const appFirstError = validateName(applicant.firstName);
    if (appFirstError) { allValid = false; newErrors.appFirst = appFirstError; }

    const appLastError = validateName(applicant.lastName);
    if (appLastError) { allValid = false; newErrors.appLast = appLastError; }

    const appNICError = validateNIC(applicant.nic);
    if (appNICError) { allValid = false; newErrors.appNIC = appNICError; }

    const appContactError = validatePhoneSL(applicant.contact);
    if (appContactError) { allValid = false; newErrors.appContact = appContactError; }

    const appEmailError = validateEmail(applicant.email);
    if (appEmailError) { allValid = false; newErrors.appEmail = appEmailError; }

    const appStreetError = validateStreet(applicant.street);
    if (appStreetError) { allValid = false; newErrors.appStreet = appStreetError; }

    const appCityError = validateCity(applicant.city);
    if (appCityError) { allValid = false; newErrors.appCity = appCityError; }

    const appDistrictError = validateDropdown(applicant.district);
    if (appDistrictError) { allValid = false; newErrors.appDistrict = appDistrictError; }

    const appProvinceError = validateDropdown(applicant.province);
    if (appProvinceError) { allValid = false; newErrors.appProvince = appProvinceError; }

    // Validate bank officer fields
    const bankFirstError = validateName(bankOfficer.firstName);
    if (bankFirstError) { allValid = false; newErrors.bankFirst = bankFirstError; }

    const bankLastError = validateName(bankOfficer.lastName);
    if (bankLastError) { allValid = false; newErrors.bankLast = bankLastError; }

    const bankNICError = validateNIC(bankOfficer.nic);
    if (bankNICError) { allValid = false; newErrors.bankNIC = bankNICError; }

    const bankContactError = validatePhoneSL(bankOfficer.contact);
    if (bankContactError) { allValid = false; newErrors.bankContact = bankContactError; }

    const bankEmailError = validateEmail(bankOfficer.email);
    if (bankEmailError) { allValid = false; newErrors.bankEmail = bankEmailError; }

    const bankNameError = validateBankName(bankOfficer.bankName);
    if (bankNameError) { allValid = false; newErrors.bankName = bankNameError; }

    const bankBranchError = validateBranch(bankOfficer.branch);
    if (bankBranchError) { allValid = false; newErrors.bankBranch = bankBranchError; }

    setErrors(newErrors);
    return allValid;
  }, [applicant, bankOfficer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (runValidation()) {
      navigate('/coordinator/workflow/create-project');
    } else {
      const firstError = document.querySelector('.input-error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    navigate('/coordinator/workflow/search');
  };

  return (
    <WorkflowLayout steps={steps} activeStep={2}>
      <div className="content">
        <h1 className="title">Register Client</h1>

        <form id="registerForm" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {/* LEFT CARD: Loan applicant */}
            <div className="form-card">
              <h2 className="form-card__title">Loan applicant Info</h2>

              {/* Personal Information */}
              <div className="section">
                <div className="section__header">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" stroke="currentColor" fill="none" />
                    <circle cx="12" cy="7" r="4" strokeWidth="2" stroke="currentColor" fill="none" />
                  </svg>
                  Personal Information
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      id="appFirst"
                      value={applicant.firstName}
                      onChange={(e) => handleApplicantChange('firstName', e.target.value)}
                      onBlur={(e) => handleBlur('appFirst', e.target.value)}
                      className={errors.appFirst ? 'input-error' : ''}
                      placeholder="e.g. Sashini"
                    />
                    <div className="error-message" id="errAppFirst">
                      {errors.appFirst || ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      id="appLast"
                      value={applicant.lastName}
                      onChange={(e) => handleApplicantChange('lastName', e.target.value)}
                      onBlur={(e) => handleBlur('appLast', e.target.value)}
                      className={errors.appLast ? 'input-error' : ''}
                      placeholder="e.g. Nisansala"
                    />
                    <div className="error-message" id="errAppLast">
                      {errors.appLast || ''}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full">
                    <label>NIC *</label>
                    <input
                      type="text"
                      id="appNIC"
                      value={applicant.nic}
                      onChange={(e) => handleApplicantChange('nic', e.target.value)}
                      onBlur={(e) => handleBlur('appNIC', e.target.value)}
                      className={errors.appNIC ? 'input-error' : ''}
                      placeholder="e.g. 20098786476 or 987654321V"
                    />
                    <div className="error-message" id="errAppNIC">
                      {errors.appNIC || ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="section">
                <div className="section__header">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" stroke="currentColor" fill="none" />
                  </svg>
                  Contact Details
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact No *</label>
                    <input
                      type="text"
                      id="appContact"
                      value={applicant.contact}
                      onChange={(e) => handleApplicantChange('contact', e.target.value)}
                      onBlur={(e) => handleBlur('appContact', e.target.value)}
                      className={errors.appContact ? 'input-error' : ''}
                      placeholder="e.g. 077675667"
                    />
                    <div className="error-message" id="errAppContact">
                      {errors.appContact || ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      id="appEmail"
                      value={applicant.email}
                      onChange={(e) => handleApplicantChange('email', e.target.value)}
                      onBlur={(e) => handleBlur('appEmail', e.target.value)}
                      className={errors.appEmail ? 'input-error' : ''}
                      placeholder="e.g. abc@gmail.com"
                    />
                    <div className="error-message" id="errAppEmail">
                      {errors.appEmail || ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address with dropdowns */}
              <div className="section">
                <div className="section__header">Address</div>
                <div className="form-row">
                  <div className="form-group full">
                    <label>Street *</label>
                    <input
                      type="text"
                      id="appStreet"
                      value={applicant.street}
                      onChange={(e) => handleApplicantChange('street', e.target.value)}
                      onBlur={(e) => handleBlur('appStreet', e.target.value)}
                      className={errors.appStreet ? 'input-error' : ''}
                      placeholder="e.g. 123 Main Rd"
                    />
                    <div className="error-message" id="errAppStreet">
                      {errors.appStreet || ''}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      id="appCity"
                      value={applicant.city}
                      onChange={(e) => handleApplicantChange('city', e.target.value)}
                      onBlur={(e) => handleBlur('appCity', e.target.value)}
                      className={errors.appCity ? 'input-error' : ''}
                      placeholder="e.g. Katubedda"
                    />
                    <div className="error-message" id="errAppCity">
                      {errors.appCity || ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>District *</label>
                    <select
                      id="appDistrict"
                      value={applicant.district}
                      onChange={(e) => handleApplicantChange('district', e.target.value)}
                      onBlur={(e) => handleBlur('appDistrict', e.target.value)}
                      className={errors.appDistrict ? 'input-error' : ''}
                    >
                      <option value="" disabled>Select district</option>
                      {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    <div className="error-message" id="errAppDistrict">
                      {errors.appDistrict || ''}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full">
                    <label>Province *</label>
                    <select
                      id="appProvince"
                      value={applicant.province}
                      onChange={(e) => handleApplicantChange('province', e.target.value)}
                      onBlur={(e) => handleBlur('appProvince', e.target.value)}
                      className={errors.appProvince ? 'input-error' : ''}
                    >
                      <option value="" disabled>Select province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                    <div className="error-message" id="errAppProvince">
                      {errors.appProvince || ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes (optional) */}
              <div className="section">
                <div className="section__header">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M14 2v6h6" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M12 18v-6" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M9 15h6" strokeWidth="2" stroke="currentColor" fill="none" />
                  </svg>
                  Additional Details
                </div>
                <div className="form-row">
                  <div className="form-group full">
                    <textarea
                      id="appAdditional"
                      value={applicant.additional}
                      onChange={(e) => handleApplicantChange('additional', e.target.value)}
                      placeholder="Additional details... (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT CARD: Bank Officer & Bank Info */}
            <div className="form-card">
              <h2 className="form-card__title">Bank Officer & Bank Info</h2>

              {/* Bank Officer */}
              <div className="section">
                <div className="section__header">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" stroke="currentColor" fill="none" />
                    <circle cx="12" cy="7" r="4" strokeWidth="2" stroke="currentColor" fill="none" />
                  </svg>
                  Bank Officer
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      id="bankFirst"
                      value={bankOfficer.firstName}
                      onChange={(e) => handleBankOfficerChange('firstName', e.target.value)}
                      onBlur={(e) => handleBlur('bankFirst', e.target.value)}
                      className={errors.bankFirst ? 'input-error' : ''}
                      placeholder="e.g. Sashini"
                    />
                    <div className="error-message" id="errBankFirst">
                      {errors.bankFirst || ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      id="bankLast"
                      value={bankOfficer.lastName}
                      onChange={(e) => handleBankOfficerChange('lastName', e.target.value)}
                      onBlur={(e) => handleBlur('bankLast', e.target.value)}
                      className={errors.bankLast ? 'input-error' : ''}
                      placeholder="e.g. Nisansala"
                    />
                    <div className="error-message" id="errBankLast">
                      {errors.bankLast || ''}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full">
                    <label>NIC *</label>
                    <input
                      type="text"
                      id="bankNIC"
                      value={bankOfficer.nic}
                      onChange={(e) => handleBankOfficerChange('nic', e.target.value)}
                      onBlur={(e) => handleBlur('bankNIC', e.target.value)}
                      className={errors.bankNIC ? 'input-error' : ''}
                      placeholder="e.g. 20098786476"
                    />
                    <div className="error-message" id="errBankNIC">
                      {errors.bankNIC || ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Officer Contact */}
              <div className="section">
                <div className="section__header">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" stroke="currentColor" fill="none" />
                  </svg>
                  Contact
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact No *</label>
                    <input
                      type="text"
                      id="bankContact"
                      value={bankOfficer.contact}
                      onChange={(e) => handleBankOfficerChange('contact', e.target.value)}
                      onBlur={(e) => handleBlur('bankContact', e.target.value)}
                      className={errors.bankContact ? 'input-error' : ''}
                      placeholder="e.g. 077675667"
                    />
                    <div className="error-message" id="errBankContact">
                      {errors.bankContact || ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      id="bankEmail"
                      value={bankOfficer.email}
                      onChange={(e) => handleBankOfficerChange('email', e.target.value)}
                      onBlur={(e) => handleBlur('bankEmail', e.target.value)}
                      className={errors.bankEmail ? 'input-error' : ''}
                      placeholder="e.g. abc@bank.lk"
                    />
                    <div className="error-message" id="errBankEmail">
                      {errors.bankEmail || ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="section">
                <div className="section__header">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M3 21h18" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M3 10h18" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M5 6l7-3 7 3" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M4 10v11" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M20 10v11" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M8 14v3" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M12 14v3" strokeWidth="2" stroke="currentColor" fill="none" />
                    <path d="M16 14v3" strokeWidth="2" stroke="currentColor" fill="none" />
                  </svg>
                  Bank Details
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Bank Name *</label>
                    <input
                      type="text"
                      id="bankName"
                      value={bankOfficer.bankName}
                      onChange={(e) => handleBankOfficerChange('bankName', e.target.value)}
                      onBlur={(e) => handleBlur('bankName', e.target.value)}
                      className={errors.bankName ? 'input-error' : ''}
                    />
                    <div className="error-message" id="errBankName">
                      {errors.bankName || ''}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Branch *</label>
                    <input
                      type="text"
                      id="bankBranch"
                      value={bankOfficer.branch}
                      onChange={(e) => handleBankOfficerChange('branch', e.target.value)}
                      onBlur={(e) => handleBlur('bankBranch', e.target.value)}
                      className={errors.bankBranch ? 'input-error' : ''}
                      placeholder="e.g. Katubedda"
                    />
                    <div className="error-message" id="errBankBranch">
                      {errors.bankBranch || ''}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn--secondary" onClick={handleBack}>
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
                  </svg>
                  Back to Search
                </button>
                <button className="btn btn--primary" type="submit">
                  Confirm & Create Valuation
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </WorkflowLayout>
  );
};

export default RegisterClient;