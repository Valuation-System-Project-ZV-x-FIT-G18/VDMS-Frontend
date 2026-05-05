/* Shape of the project summary response from the backend */
export interface ProjectSummary {
  found: boolean;                          // whether the client was found
  client?: {                               // loan applicant / user details
    full_name: string;
    nic: string;
    email: string;
    phone: string;
    date_of_birth: string;
    street_address: string;
    city: string;
    district: string;
    province: string;
    postal_code: string;
  };
  bank?: {                                 // bank details
    bank_name: string;
    branch: string;
    branch_code: string;
  } | null;
  bankOfficer?: {                          // bank officer details
    name: string;
    email: string;
    phone: string;
    designation: string;
  } | null;
  property?: {                             // property details
    address: string;
    city: string;
    district: string;
    province: string;
    local_authority: string;
    land_type: string;
    latitude: number;
    longitude: number;
  } | null;
  survey?: {                               // survey plan details
    plan_number: string;
    surveyor_name: string;
    boundary_details: string;
    lot_number: string;
    land_shape: string;
  } | null;
  legal?: {                                // legal details
    deed_number: string;
    deed_type: string;
    registration_date: string;
    notary_details: string;
    ownership_type: string;
    usage_regulations: string[];
  } | null;
  documents?: {                            // uploaded documents
    nic_file_name?: string;
    nic_file_path?: string;
    tax_file_name?: string;
    tax_file_path?: string;
    utility_file_name?: string;
    utility_file_path?: string;
    other_file_name?: string;
    other_file_path?: string;
    uploaded_at: string;
  }[];
}
