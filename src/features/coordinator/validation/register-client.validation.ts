import type { RegisterFormData } from '../register-client/types/register';
import { addEmailFormatError, validateRequiredFields } from './shared';

export const validateRegisterClientForm = (form: RegisterFormData) => {
  const result = validateRequiredFields([
    { key: 'fullName', label: 'Full name', value: form.fullName },
    { key: 'nic', label: 'NIC', value: form.nic },
    { key: 'dateOfBirth', label: 'Birth day', value: form.dateOfBirth },
    { key: 'phone', label: 'Contact number', value: form.phone },
    { key: 'email', label: 'Email', value: form.email },
    { key: 'password', label: 'Password', value: form.password },
    {
      key: 'confirmPassword',
      label: 'Confirm password',
      value: form.confirmPassword,
    },
    {
      key: 'streetAddress',
      label: 'Street address',
      value: form.streetAddress,
    },
    { key: 'city', label: 'City', value: form.city },
    { key: 'district', label: 'District', value: form.district },
    { key: 'province', label: 'Province', value: form.province },
    { key: 'postalCode', label: 'Postal code', value: form.postalCode },
  ]);

  addEmailFormatError(result.errors, 'email', form.email);

  return {
    valid: Object.keys(result.errors).length === 0,
    errors: result.errors,
  };
};
