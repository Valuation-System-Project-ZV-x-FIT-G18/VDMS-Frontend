export const isEmptyOrSpaces = (str: string): boolean => {
  return !str || /^\s*$/.test(str);
};

// Name validation (first/last) – only letters, min 2
export const validateName = (value: string): string => {
  const val = value || '';
  if (isEmptyOrSpaces(val)) return 'Required';
  if (val.trim().length < 2) return 'Minimum 2 characters';
  if (!/^[A-Za-z\s]+$/.test(val)) return 'Only letters allowed';
  return '';
};

// NIC Sri Lanka: old 9 digits + V/X, new 12 digits
export const validateNIC = (value: string): string => {
  const val = (value || '').trim();
  if (!val) return 'Required';
  const oldNic = /^[0-9]{9}[vVxX]$/;
  const newNic = /^[0-9]{12}$/;
  if (oldNic.test(val) || newNic.test(val)) return '';
  return 'Use 9 digits + V/X or 12 digits';
};

// Email: must contain @, dot after @, no spaces
export const validateEmail = (value: string): string => {
  const val = (value || '').trim();
  if (!val) return 'Required';
  if (/\s/.test(val)) return 'No spaces allowed';
  if (!val.includes('@') || val.indexOf('@') === 0) return 'Must contain @';
  const domain = val.split('@')[1];
  if (!domain || !domain.includes('.') || domain.indexOf('.') === 0 || domain.endsWith('.')) return 'Must have . after @';
  return '';
};

// Phone: 10 digits, start with 0 (Sri Lanka format)
export const validatePhoneSL = (value: string): string => {
  const val = (value || '').trim();
  if (!val) return 'Required';
  if (!/^0\d{9}$/.test(val)) return '10 digits, start with 0';
  return '';
};

// Street/City: not empty, letters/numbers and , . / - allowed
export const validateStreet = (value: string): string => {
  const val = value || '';
  if (isEmptyOrSpaces(val)) return 'Required';
  if (/[^a-zA-Z0-9\s,./-]/.test(val)) return 'Only letters, numbers, , . / - allowed';
  return '';
};

export const validateCity = validateStreet; // Same rules

// Dropdown must be selected
export const validateDropdown = (value: string): string => {
  const val = value || '';
  if (!val || val === '') return 'Please select an option';
  return '';
};

// Bank name: letters and spaces only, min 2
export const validateBankName = (value: string): string => {
  const val = (value || '').trim();
  if (!val) return 'Required';
  if (val.length < 2) return 'Minimum 2 characters';
  if (!/^[A-Za-z\s]+$/.test(val)) return 'Letters & spaces only';
  return '';
};

// Branch: letters, numbers, spaces allowed
export const validateBranch = (value: string): string => {
  const val = (value || '').trim();
  if (!val) return 'Required';
  if (val.length < 2) return 'Minimum 2 characters';
  if (!/^[A-Za-z0-9\s]+$/.test(val)) return 'Letters, numbers, spaces only';
  return '';
};

// Date validation (must be today or future)
export const validateDate = (value: string): string => {
  if (!value) return 'Date is required';
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) return 'Date must be today or later';
  return '';
};

// Time validation
export const validateTime = (value: string): string => {
  if (!value) return 'Time is required';
  return '';
};

// Priority validation
export const validatePriority = (value: string): string => {
  if (!value) return 'Please select a priority level';
  return '';
};

// File validation
export const validateFile = (file: File | undefined, required: boolean = true): string => {
  if (required && !file) return 'File is required';
  return '';
};