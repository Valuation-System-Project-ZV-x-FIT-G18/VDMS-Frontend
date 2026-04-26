import type { PropertyFormData } from '../types/property';         // form shape
import FormField from '../../register-client/components/FormField'; // reusable input
import SectionHeader from '../../register-client/components/SectionHeader'; // title
import MapPicker from './MapPicker';                                // interactive map
import './GpsSection.css';

interface Props {
  form: PropertyFormData;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

/* GPS COORDINATES section — lat/lng inputs + clickable map */
const GpsSection = ({ form, onChange, errors = {} }: Props) => {
  const handlePick = (lat: number, lng: number) => {       // called when map is clicked
    onChange('latitude', lat.toFixed(7));                   // update lat with 7 decimals
    onChange('longitude', lng.toFixed(7));                  // update lng with 7 decimals
  };

  const lat = parseFloat(form.latitude) || 7.8731;        // default center: Sri Lanka
  const lng = parseFloat(form.longitude) || 80.7718;

  return (
    <div className="gps-section">
      <SectionHeader icon="🌐" title="GPS coordinates" />
      <div className="gps-row">
        <FormField label="Latitude" name="latitude" value={form.latitude}
          onChange={onChange} placeholder="e.g. 6.9271" error={errors.latitude} half />
        <FormField label="Longitude" name="longitude" value={form.longitude}
          onChange={onChange} placeholder="e.g. 79.8612" error={errors.longitude} half />
      </div>
      <p className="gps-hint">Click on the map to pick a location</p>
      <MapPicker lat={lat} lng={lng} onPick={handlePick} />
    </div>
  );
};

export default GpsSection;
