/* Shape of the property information form */
export interface PropertyFormData {
  address: string;            // street address of property
  city: string;               // city name
  district: string;           // Sri Lankan district
  province: string;           // auto-filled from district
  localAuthority: string;     // governing local authority
  landType: string;           // Residential | Commercial | Agricultural
  latitude: string;           // GPS latitude as string
  longitude: string;          // GPS longitude as string
}
