import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import WorkflowLayout from "../../components/WorkflowLayout";

// Fix for Leaflet marker icons
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
};

fixLeafletIcon();

interface PropertyDetails {
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

const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const steps = [
    { number: 1, label: "Search", path: "/coordinator/workflow/search" },
    { number: 2, label: "Register", path: "/coordinator/workflow/register" },
    {
      number: 3,
      label: "Create Project",
      path: "/coordinator/workflow/create-project",
    },
    {
      number: 4,
      label: "New Valuation",
      path: "/coordinator/workflow/new-valuation",
    },
    { number: 5, label: "Assign TO", path: "/coordinator/workflow/assign-to" },
  ];

  const [street, setStreet] = useState("42 Main Street");
  const [city, setCity] = useState("Katubedda");
  const [district, setDistrict] = useState("Colombo");
  const [province, setProvince] = useState("Western");
  const [notes, setNotes] = useState("");

  const [streetError, setStreetError] = useState("");
  const [cityError, setCityError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [provinceError, setProvinceError] = useState("");

  // Location state
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 6.9271,
    lng: 79.8612,
    address: "42 Main Street, Katubedda, Colombo, Western Province",
  });

  const [mapCoords, setMapCoords] = useState("Click map to select location");

  const districts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mullaitivu",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Kurunegala",
    "Puttalam",
    "Anuradhapura",
    "Polonnaruwa",
    "Badulla",
    "Moneragala",
    "Ratnapura",
    "Kegalle",
  ];

  const provinces = [
    "Western",
    "Central",
    "Southern",
    "Northern",
    "Eastern",
    "North Western",
    "North Central",
    "Uva",
    "Sabaragamuwa",
  ];

  const provinceDistrictMap: Record<string, string[]> = {
    Western: ["Colombo", "Gampaha", "Kalutara"],
    Central: ["Kandy", "Matale", "Nuwara Eliya"],
    Southern: ["Galle", "Matara", "Hambantota"],
    Northern: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    Eastern: ["Batticaloa", "Ampara", "Trincomalee"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    Uva: ["Badulla", "Moneragala"],
    Sabaragamuwa: ["Ratnapura", "Kegalle"],
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView(
        [selectedLocation.lat, selectedLocation.lng],
        11,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        draggable: true,
      }).addTo(map);

      marker.on("dragend", function (e) {
        const pos = e.target.getLatLng();
        updateLocation(pos.lat, pos.lng);
      });

      map.on("click", function (e) {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        updateLocation(lat, lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
      setMapCoords(
        `Selected: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`,
      );
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const updateLocation = (lat: number, lng: number) => {
    setSelectedLocation({
      lat,
      lng,
      address: generateAddressFromCoords(
        lat,
        lng,
        street,
        city,
        district,
        province,
      ),
    });
    setMapCoords(`Selected: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  };

  const generateAddressFromCoords = (
    _lat: number,
    _lng: number,
    streetVal: string,
    cityVal: string,
    districtVal: string,
    provinceVal: string,
  ): string => {
    return `${streetVal}, ${cityVal}, ${districtVal}, ${provinceVal} Province`;
  };

  // Update address when form fields change
  useEffect(() => {
    setSelectedLocation((prev) => ({
      ...prev,
      address: generateAddressFromCoords(
        prev.lat,
        prev.lng,
        street,
        city,
        district,
        province,
      ),
    }));
  }, [street, city, district, province]);

  const validateField = (value: string): boolean => {
    return value.trim() !== "";
  };

  const handleStreetBlur = () => {
    if (!validateField(street)) {
      setStreetError("Street is required");
    } else {
      setStreetError("");
    }
  };

  const handleCityBlur = () => {
    if (!validateField(city)) {
      setCityError("City is required");
    } else {
      setCityError("");
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDistrict(value);
    if (!value) {
      setDistrictError("District is required");
    } else {
      setDistrictError("");
      for (const [prov, dists] of Object.entries(provinceDistrictMap)) {
        if (dists.includes(value)) {
          setProvince(prov);
          setProvinceError("");
          break;
        }
      }
    }
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProvince(value);
    if (!value) {
      setProvinceError("Province is required");
    } else {
      setProvinceError("");
      if (
        provinceDistrictMap[value] &&
        !provinceDistrictMap[value].includes(district)
      ) {
        setDistrict("");
        setDistrictError("Please select a district");
      }
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!validateField(street)) {
      setStreetError("Street is required");
      isValid = false;
    }

    if (!validateField(city)) {
      setCityError("City is required");
      isValid = false;
    }

    if (!district) {
      setDistrictError("District is required");
      isValid = false;
    }

    if (!province) {
      setProvinceError("Province is required");
      isValid = false;
    }

    return isValid;
  };

  const handleBack = () => {
    navigate("/coordinator/workflow/register");
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const propertyData: PropertyDetails = {
        street,
        city,
        district,
        province,
        location: selectedLocation,
        notes,
      };

      console.log("Property details:", propertyData);
      navigate("/coordinator/workflow/new-valuation");
    } else {
      const firstError = document.querySelector('[class*="error"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <WorkflowLayout steps={steps} activeStep={3}>
      <div className="content">
        <h1 className="title">Create Project</h1>

        <div className="form-grid">
          {/* Left: Property Details */}
          <div className="form-card">
            <h2 className="form-card__title">Property Details</h2>

            <div className={`form-group ${streetError ? "error" : ""}`}>
              <label htmlFor="street">
                Address <span className="required">*</span>
              </label>
              <input
                id="street"
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                onBlur={handleStreetBlur}
                placeholder="Street e.g. road"
                className={streetError ? "input-error" : ""}
              />
              {streetError && (
                <div className="error-message">{streetError}</div>
              )}
            </div>

            <div className={`form-group ${cityError ? "error" : ""}`}>
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={handleCityBlur}
                placeholder="e.g. Katubedda"
                className={cityError ? "input-error" : ""}
              />
              {cityError && <div className="error-message">{cityError}</div>}
            </div>

            <div className={`form-group ${districtError ? "error" : ""}`}>
              <label htmlFor="district">
                District <span className="required">*</span>
              </label>
              <select
                id="district"
                value={district}
                onChange={handleDistrictChange}
                className={districtError ? "input-error" : ""}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {districtError && (
                <div className="error-message">{districtError}</div>
              )}
            </div>

            <div className={`form-group ${provinceError ? "error" : ""}`}>
              <label htmlFor="province">
                Province <span className="required">*</span>
              </label>
              <select
                id="province"
                value={province}
                onChange={handleProvinceChange}
                className={provinceError ? "input-error" : ""}
              >
                <option value="">Select Province</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {provinceError && (
                <div className="error-message">{provinceError}</div>
              )}
            </div>

            <div className="district-hint" id="provinceHint">
              {province
                ? `Showing districts in ${province} Province`
                : "Select a province to filter districts"}
            </div>

            <div className="form-group">
              <div className="map-label">Choose On Map</div>
              <div className="map-container" id="mapContainer">
                <div
                  id="map"
                  style={{ height: "200px", width: "100%", zIndex: 1 }}
                ></div>
              </div>

              <div className="location-info">
                <div className="location-coords">{mapCoords}</div>
                <div className="location-address">
                  {selectedLocation.address}
                </div>
                <div className="location-status location-fetched">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Location selected on map
                </div>
                <div className="location-note">
                  Click on map or drag marker to select different location
                </div>
              </div>
            </div>
          </div>

          {/* Right: Additional Details */}
          <div className="form-card">
            <h2 className="form-card__title with-icon">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="currentColor"
                  fill="none"
                />
                <path
                  d="M14 2v6h6"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                />
                <path
                  d="M12 18v-6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
                <path
                  d="M9 15h6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              Additional Details
            </h2>
            <div className="form-group">
              <label htmlFor="additional">Notes</label>
              <textarea
                id="additional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter additional details..."
                rows={6}
              />
            </div>

            <div className="form-actions">
              <button className="btn btn--secondary" onClick={handleBack}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="currentColor"
                    fill="none"
                  />
                </svg>
                Back to Register
              </button>
              <button className="btn btn--primary" onClick={handleConfirm}>
                Confirm & Create project
              </button>
            </div>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
};

export default CreateProject;
