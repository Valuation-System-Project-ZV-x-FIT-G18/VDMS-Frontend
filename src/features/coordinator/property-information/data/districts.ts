/* Sri Lankan districts mapped to their provinces */
export interface DistrictData {
  name: string;       // district name
  province: string;   // parent province
}

export const districts: DistrictData[] = [
  /* Western Province */
  { name: 'Colombo', province: 'Western' },
  { name: 'Gampaha', province: 'Western' },
  { name: 'Kalutara', province: 'Western' },
  /* Central Province */
  { name: 'Kandy', province: 'Central' },
  { name: 'Matale', province: 'Central' },
  { name: 'Nuwara Eliya', province: 'Central' },
  /* Southern Province */
  { name: 'Galle', province: 'Southern' },
  { name: 'Matara', province: 'Southern' },
  { name: 'Hambantota', province: 'Southern' },
  /* Northern Province */
  { name: 'Jaffna', province: 'Northern' },
  { name: 'Kilinochchi', province: 'Northern' },
  { name: 'Mullaitivu', province: 'Northern' },
  { name: 'Mannar', province: 'Northern' },
  { name: 'Vavuniya', province: 'Northern' },
  /* Eastern Province */
  { name: 'Batticaloa', province: 'Eastern' },
  { name: 'Ampara', province: 'Eastern' },
  { name: 'Trincomalee', province: 'Eastern' },
  /* North Western Province */
  { name: 'Kurunegala', province: 'North Western' },
  { name: 'Puttalam', province: 'North Western' },
  /* North Central Province */
  { name: 'Anuradhapura', province: 'North Central' },
  { name: 'Polonnaruwa', province: 'North Central' },
  /* Uva Province */
  { name: 'Badulla', province: 'Uva' },
  { name: 'Monaragala', province: 'Uva' },
  /* Sabaragamuwa Province */
  { name: 'Ratnapura', province: 'Sabaragamuwa' },
  { name: 'Kegalle', province: 'Sabaragamuwa' },
];
