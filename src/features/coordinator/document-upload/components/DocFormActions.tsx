import './DocFormActions.css';

interface Props {
  onBack: () => void;    // fires when Back is clicked
  loading: boolean;      // disables button while saving
}

/* Bottom bar with Back and Submit All buttons */
const DocFormActions = ({ onBack, loading }: Props) => (
  <div className="doc-form-actions">
    <button type="button" className="back-btn" onClick={onBack}>
      Back
    </button>
    <button type="submit" className="submit-btn" disabled={loading}>
      {loading ? 'Saving...' : 'Next \u2192 New valuation'}
    </button>
  </div>
);

export default DocFormActions;
