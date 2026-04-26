import './BankFormActions.css';

interface Props {
  onBack: () => void;     // fires when Back is clicked
  loading: boolean;       // disables Next while saving
}

/* Bottom bar with Back and Next → Property details buttons */
const BankFormActions = ({ onBack, loading }: Props) => (
  <div className="bank-form-actions">
    <button type="button" className="back-btn" onClick={onBack}>
      Back
    </button>
    <button type="submit" className="next-btn" disabled={loading}>
      {loading ? 'Saving...' : 'Next → Property details'}
    </button>
  </div>
);

export default BankFormActions;
