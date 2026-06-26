import type { BankOfficerFormData } from '../register-bank/types/bank-officer';
import { addEmailFormatError, validateRequiredFields } from './shared';

export const validateRegisterBankForm = (form: BankOfficerFormData) => {
  const result = validateRequiredFields([
    { key: 'fullName', label: 'Full name', value: form.fullName },
    { key: 'nic', label: 'NIC', value: form.nic },
    { key: 'designation', label: 'Designation', value: form.designation },
    { key: 'phone', label: 'Contact number', value: form.phone },
    { key: 'email', label: 'Email', value: form.email },
    { key: 'bankName', label: 'Bank name', value: form.bankName },
    { key: 'branch', label: 'Branch', value: form.branch },
    { key: 'branchCode', label: 'Branch code', value: form.branchCode },
  ]);

  addEmailFormatError(result.errors, 'email', form.email);

  return {
    valid: Object.keys(result.errors).length === 0,
    errors: result.errors,
  };
};
