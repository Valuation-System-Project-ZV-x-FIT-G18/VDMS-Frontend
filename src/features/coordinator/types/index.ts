export interface User {
  name: string;
  role: string;
}

export interface Step {
  number: number;
  label: string;
  path: string;
}

export interface ApplicantInfo {
  firstName: string;
  lastName: string;
  nic: string;
  contact: string;
  email: string;
  street: string;
  city: string;
  district: string;
  province: string;
  additional?: string;
}

export interface BankOfficerInfo {
  firstName: string;
  lastName: string;
  nic: string;
  contact: string;
  email: string;
  bankName: string;
  branch: string;
}

export interface PropertyDetails {
  street: string;
  city: string;
  district: string;
  province: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  notes: string;
}

export interface ValuationDetails {
  priority: 'High' | 'Medium' | 'Low' | '';
  completionDate: string;
  valuationType: 'initial' | 'revaluation';
  files: {
    deed1?: File;
    deed2?: File;
    deed3?: File;
    deed4?: File;
    additional?: File;
  };
}

export interface VisitSchedule {
  inspectionDate: string;
  inspectionTime: string;
  street: string;
  city: string;
  district: string;
  province: string;
  location: {
    lat: number;
    lng: number;
  };
}

// Add this missing export
export interface TechnicalOfficer {
  id: string;
  name: string;
  contact: string;
}

export interface FormErrors {
  // Applicant fields
  appFirst?: string;
  appLast?: string;
  appNIC?: string;
  appContact?: string;
  appEmail?: string;
  appStreet?: string;
  appCity?: string;
  appDistrict?: string;
  appProvince?: string;
  
  // Bank officer fields
  bankFirst?: string;
  bankLast?: string;
  bankNIC?: string;
  bankContact?: string;
  bankEmail?: string;
  bankName?: string;
  bankBranch?: string;

  // Property fields
  propertyStreet?: string;
  propertyCity?: string;
  propertyDistrict?: string;
  propertyProvince?: string;

  // Valuation fields
  priority?: string;
  completionDate?: string;
  files?: string;

  // Visit fields
  visitDate?: string;
  visitTime?: string;
  visitStreet?: string;
  visitCity?: string;
  visitDistrict?: string;
  visitProvince?: string;
  visitLocation?: string;
}