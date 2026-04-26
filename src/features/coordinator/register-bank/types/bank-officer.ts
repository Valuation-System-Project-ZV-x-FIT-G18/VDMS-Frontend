/* Shape of the bank officer registration form */
export interface BankOfficerFormData {
  fullName: string;
  firstName: string;           // auto-derived
  lastName: string;            // auto-derived
  nameWithInitials: string;    // auto-derived
  nic: string;
  designation: string;         // e.g. "Branch Manager"
  phone: string;
  email: string;
  bankName: string;            // selected from dropdown
  branch: string;              // selected from dropdown
  branchCode: string;          // branch code entered manually
}
