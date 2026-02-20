import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WorkflowLayout from '../../components/WorkflowLayout';

interface VisitSchedule {
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

interface TechnicalOfficer {
  id: string;
  name: string;
  contact: string;
}

// Fix for Leaflet marker icons
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

fixLeafletIcon();

const AssignTO: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  const steps = [
    { number: 1, label: 'Search', path: '/coordinator/workflow/search' },
    { number: 2, label: 'Register', path: '/coordinator/workflow/register' },
    { number: 3, label: 'Create Project', path: '/coordinator/workflow/create-project' },
    { number: 4, label: 'New Valuation', path: '/coordinator/workflow/new-valuation' },
    { number: 5, label: 'Assign TO', path: '/coordinator/workflow/assign-to' }
  ];
  
  // Technical officers data
  const officers: TechnicalOfficer[] = [
    { id: 'INV-2023-004', name: 'John', contact: '076565333' },
    { id: 'INV-2023-003', name: 'Mike', contact: '077812344' },
    { id: 'INV-2023-005', name: 'Sarah', contact: '071234567' },
    { id: 'INV-2023-002', name: 'David', contact: '075998877' },
    { id: 'INV-2023-001', name: 'Emily', contact: '078345612' }
  ];

  // Form state
  const [inspectionDate, setInspectionDate] = useState('2023-10-24');
  const [inspectionTime, setInspectionTime] = useState('14:30');
  const [street, setStreet] = useState('Katubedda');
  const [city, setCity] = useState('Moratuwa');
  const [district, setDistrict] = useState('Colombo');
  const [province, setProvince] = useState('Western');
  
  // Location state
  const [mapLat, setMapLat] = useState(6.9271);
  const [mapLng, setMapLng] = useState(79.8612);
  const [mapCoords, setMapCoords] = useState('Click map to select location');
  
  // Error states
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [streetError, setStreetError] = useState('');
  const [cityError, setCityError] = useState('');
  const [districtError, setDistrictError] = useState('');
  const [provinceError, setProvinceError] = useState('');
  const [locationError, setLocationError] = useState('');

  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
  ];

  const provinces = [
    'Western', 'Central', 'Southern', 'Northern', 'Eastern',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  // Validation functions
  const validateDate = (value: string): string => {
    if (!value) return 'Date is required';
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return 'Date must be today or later';
    return '';
  };

  const validateTime = (value: string): string => {
    if (!value) return 'Time is required';
    return '';
  };

  const validateStreet = (value: string): string => {
    const val = value || '';
    if (!val || /^\s*$/.test(val)) return 'Required';
    if (/[^a-zA-Z0-9\s,./-]/.test(val)) return 'Only letters, numbers, , . / - allowed';
    return '';
  };

  const validateCity = validateStreet;

  const validateDropdown = (value: string): string => {
    const val = value || '';
    if (!val || val === '') return 'Please select an option';
    return '';
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([mapLat, mapLng], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([mapLat, mapLng], { draggable: true }).addTo(map);
      
      marker.on('dragend', function(e) {
        const pos = e.target.getLatLng();
        updateLocation(pos.lat, pos.lng);
      });

      map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updateLocation(lat, lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const updateLocation = (lat: number, lng: number) => {
    setMapLat(lat);
    setMapLng(lng);
    setMapCoords(`Selected: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    setLocationError('');
  };

  const handleDateBlur = () => {
    const error = validateDate(inspectionDate);
    setDateError(error);
  };

  const handleTimeBlur = () => {
    const error = validateTime(inspectionTime);
    setTimeError(error);
  };

  const handleStreetBlur = () => {
    const error = validateStreet(street);
    setStreetError(error);
  };

  const handleCityBlur = () => {
    const error = validateCity(city);
    setCityError(error);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDistrict(value);
    const error = validateDropdown(value);
    setDistrictError(error);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProvince(value);
    const error = validateDropdown(value);
    setProvinceError(error);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
    const dateValidation = validateDate(inspectionDate);
    if (dateValidation) {
      setDateError(dateValidation);
      isValid = false;
    }
    
    const timeValidation = validateTime(inspectionTime);
    if (timeValidation) {
      setTimeError(timeValidation);
      isValid = false;
    }
    
    const streetValidation = validateStreet(street);
    if (streetValidation) {
      setStreetError(streetValidation);
      isValid = false;
    }
    
    const cityValidation = validateCity(city);
    if (cityValidation) {
      setCityError(cityValidation);
      isValid = false;
    }
    
    const districtValidation = validateDropdown(district);
    if (districtValidation) {
      setDistrictError(districtValidation);
      isValid = false;
    }
    
    const provinceValidation = validateDropdown(province);
    if (provinceValidation) {
      setProvinceError(provinceValidation);
      isValid = false;
    }
    
    if (!mapLat || !mapLng) {
      setLocationError('Please select a location on the map');
      isValid = false;
    }
    
    return isValid;
  };

  const handleAssign = (officer: TechnicalOfficer) => {
    alert(`Assigning Technical Officer: ${officer.id} (demo)`);
  };

  const handleBack = () => {
    navigate('/coordinator/workflow/new-valuation');
  };

  const handleConfirm = () => {
    if (validateForm()) {
      const visitData: VisitSchedule = {
        inspectionDate,
        inspectionTime,
        street,
        city,
        district,
        province,
        location: {
          lat: mapLat,
          lng: mapLng
        }
      };
      
      console.log('Visit schedule:', visitData);
      
      alert(`✅ Workflow completed!\nDate: ${inspectionDate} ${inspectionTime}\nAddress: ${street}, ${city}, ${district}, ${province}\nMap coordinates: (${mapLat.toFixed(4)}, ${mapLng.toFixed(4)})\n\nNavigating to dashboard...`);
      
      navigate('/coordinator/dashboard');
    } else {
      alert('❌ Please fill all required fields correctly and select a map location.');
    }
  };

  return (
    <WorkflowLayout steps={steps} activeStep={5}>
      <div className="content">
        <h1 className="title">Assign Technical Officer</h1>

        <div className="cards-grid">
          {/* left card - Technical Officers list */}
          <div className="card">
            <h2 className="card__title">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" stroke="currentColor" fill="none" />
                <circle cx="12" cy="7" r="4" strokeWidth="2" stroke="currentColor" fill="none" />
              </svg>
              Assign Technical Officer
            </h2>
            <div className="card__subtitle">Available Technical Officers</div>
            <table className="table">
              <thead>
                <tr>
                  <th>TO ID</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {officers.map((officer) => (
                  <tr key={officer.id}>
                    <td>{officer.id}</td>
                    <td>{officer.name}</td>
                    <td>{officer.contact}</td>
                    <td>
                      <button className="btn-assign" onClick={() => handleAssign(officer)}>
                        Assign now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* right card - Schedule Site Visit */}
          <div className="card">
            <h2 className="card__title">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M8 2v4M16 2v4" strokeWidth="2" stroke="currentColor" fill="none" />
                <path d="M3 10h18M5 6h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" strokeWidth="2" stroke="currentColor" fill="none" />
              </svg>
              Schedule Site Visit
            </h2>

            <form id="visitForm" noValidate>
              <div className="date-time-row">
                <div className="form-group">
                  <label htmlFor="inspectionDate">
                    Inspection Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="inspectionDate"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    onBlur={handleDateBlur}
                    min="2023-01-01"
                    max="2030-12-31"
                    className={dateError ? 'input-error' : ''}
                    required
                  />
                  {dateError && <div className="error-message">{dateError}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="inspectionTime">
                    Time <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    id="inspectionTime"
                    value={inspectionTime}
                    onChange={(e) => setInspectionTime(e.target.value)}
                    onBlur={handleTimeBlur}
                    className={timeError ? 'input-error' : ''}
                    required
                  />
                  {timeError && <div className="error-message">{timeError}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="visitStreet">
                  Street <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="visitStreet"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  onBlur={handleStreetBlur}
                  placeholder="e.g. 42 Main Street"
                  className={streetError ? 'input-error' : ''}
                  required
                />
                {streetError && <div className="error-message">{streetError}</div>}
              </div>

              <div className="location-row">
                <div className="form-group">
                  <label htmlFor="visitCity">
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="visitCity"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onBlur={handleCityBlur}
                    placeholder="e.g. Moratuwa"
                    className={cityError ? 'input-error' : ''}
                    required
                  />
                  {cityError && <div className="error-message">{cityError}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="visitDistrict">
                    District <span className="required">*</span>
                  </label>
                  <select
                    id="visitDistrict"
                    value={district}
                    onChange={handleDistrictChange}
                    className={districtError ? 'input-error' : ''}
                    required
                  >
                    <option value="" disabled>– Select district –</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {districtError && <div className="error-message">{districtError}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="visitProvince">
                  Province <span className="required">*</span>
                </label>
                <select
                  id="visitProvince"
                  value={province}
                  onChange={handleProvinceChange}
                  className={provinceError ? 'input-error' : ''}
                  required
                >
                  <option value="" disabled>– Select province –</option>
                  {provinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {provinceError && <div className="error-message">{provinceError}</div>}
              </div>

              {/* Interactive map */}
              <div className="form-group">
                <label>
                  Pick location on map <span className="required">*</span>
                </label>
                <div id="map" className="map-container" style={{ height: '240px', zIndex: 1 }}></div>
                <div className="location-feedback">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  <span id="mapCoords">{mapCoords}</span>
                </div>
                {locationError && <div className="error-message">{locationError}</div>}
              </div>
            </form>
          </div>
        </div>

        <div className="footer-actions">
          <button className="footer-btn btn--secondary" onClick={handleBack}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            </svg>
            Back to New Valuation
          </button>
          <button className="footer-btn btn--primary" onClick={handleConfirm}>
            Complete & Finish
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </WorkflowLayout>
  );
};

export default AssignTO;