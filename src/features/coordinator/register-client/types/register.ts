/* Shape of the registration form data sent to the backend */
export interface RegisterFormData {
  fullName: string;
  firstName: string;          // auto-derived from fullName
  lastName: string;           // auto-derived from fullName
  nameWithInitials: string;   // auto-derived from fullName
  nic: string;
  dateOfBirth: string;        // ISO date string
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  streetAddress: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
}
