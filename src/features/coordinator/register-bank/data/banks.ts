/* Bank list with branches — single source of truth for dropdowns */
export interface BankData {
  name: string;
  branches: string[];
}

export const banks: BankData[] = [
  { name: 'Bank of Ceylon', branches: ['Head Office', 'Colombo Fort', 'Kandy', 'Galle', 'Kurunegala'] },
  { name: 'People\'s Bank', branches: ['Head Office', 'Colombo', 'Matara', 'Jaffna', 'Ratnapura'] },
  { name: 'Seylan Bank', branches: ['Head Office', 'Colombo 03', 'Negombo', 'Panadura', 'Anuradhapura'] },
  { name: 'Commercial Bank', branches: ['Head Office', 'Colombo 01', 'Rajagiriya', 'Kandy', 'Galle'] },
  { name: 'Hatton National Bank', branches: ['Head Office', 'Colombo 10', 'Nugegoda', 'Matale', 'Badulla'] },
  { name: 'Sampath Bank', branches: ['Head Office', 'Colombo 07', 'Maharagama', 'Kurunegala', 'Batticaloa'] },
  { name: 'NDB Bank', branches: ['Head Office', 'Colombo 02', 'Wattala', 'Kandy'] },
  { name: 'DFCC Bank', branches: ['Head Office', 'Colombo 03', 'Gampaha', 'Matara'] },
];
