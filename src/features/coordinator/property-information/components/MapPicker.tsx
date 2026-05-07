import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'; // map components
import L from 'leaflet';               // core leaflet for icon fix
import 'leaflet/dist/leaflet.css';     // leaflet default styles
import './MapPicker.css';

/* Fix default marker icon paths for bundled environments (Vite / Webpack) */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  lat: number;                          // current marker latitude
  lng: number;                          // current marker longitude
  onPick: (lat: number, lng: number) => void; // callback when map is clicked
}

/* Inner component that listens for map click events */
const ClickHandler = ({ onPick }: Pick<Props, 'onPick'>) => {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng); } }); // fire on click
  return null;
};

/* Interactive Leaflet map — click anywhere to select GPS coordinates */
const MapPicker = ({ lat, lng, onPick }: Props) => (
  <div className="map-picker">
    <MapContainer center={[lat, lng]} zoom={8} className="map-container">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />        {/* red pin at selected location */}
      <ClickHandler onPick={onPick} />         {/* click listener */}
    </MapContainer>
  </div>
);

export default MapPicker;
