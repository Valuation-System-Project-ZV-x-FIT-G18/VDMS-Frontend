import './ValuationFormActions.css';

interface Props {
  onBack: () => void;                                      // fires when Back is clicked
  loading: boolean;                                        // disables button while saving
}

/* Bottom bar with Back and Submit buttons for the new valuation form */
const ValuationFormActions = ({ onBack, loading }: Props) => (
  <div className="nv-form-actions">
    <button type="button" className="nv-back-btn" onClick={onBack}>
      Back
    </button>
    <button type="submit" className="nv-submit-btn" disabled={loading}>
      {loading ? 'Saving...' : 'Next -> Assign and schedule'}
    </button>
  </div>
);

export default ValuationFormActions;
