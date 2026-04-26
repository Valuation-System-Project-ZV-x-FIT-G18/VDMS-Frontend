import type { PropertyFormData } from '../property-information/types/property';
import { validateRequiredFields } from './shared';

export const validatePropertyInfoForm = (form: PropertyFormData) =>
  validateRequiredFields([
    { key: 'address', label: 'Address', value: form.address },
    { key: 'city', label: 'City', value: form.city },
    { key: 'district', label: 'District', value: form.district },
    { key: 'province', label: 'Province', value: form.province },
    {
      key: 'localAuthority',
      label: 'Local authority',
      value: form.localAuthority,
    },
    { key: 'landType', label: 'Land type', value: form.landType },
    { key: 'latitude', label: 'Latitude', value: form.latitude },
    { key: 'longitude', label: 'Longitude', value: form.longitude },
  ]);
