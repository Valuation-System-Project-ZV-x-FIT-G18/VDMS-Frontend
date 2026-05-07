import './LegalFormActions.css';

interface Props {
  onBack: () => void;    // fires when Back is clicked
  loading: boolean;      // disables button while saving
}

/* Bottom bar with Back and Submit buttons */
const LegalFormActions = ({ onBack, loading }: Props) => (
  <div className="legal-form-actions">
    <button type="button" className="back-btn" onClick={onBack}>
      Back
    </button>
    <button type="submit" className="next-btn" disabled={loading}>
      {loading ? 'Saving...' : 'Next → Document upload'}
    </button>
  </div>
);

export default LegalFormActions;
