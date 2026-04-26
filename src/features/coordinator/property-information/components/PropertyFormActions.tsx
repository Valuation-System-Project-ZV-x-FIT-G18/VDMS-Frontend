import './PropertyFormActions.css';

interface Props {
  onBack: () => void;    // fires when Back is clicked
  loading: boolean;      // disables button while saving
}

/* Bottom bar with Back and Next → Valuation details buttons */
const PropertyFormActions = ({ onBack, loading }: Props) => (
  <div className="property-form-actions">
    <button type="button" className="back-btn" onClick={onBack}>
      Back
    </button>
    <button type="submit" className="next-btn" disabled={loading}>
      {loading ? 'Saving...' : 'Next → Survey plan & details'}
    </button>
  </div>
);

export default PropertyFormActions;
