import './FormActions.css';

interface Props {
  onCancel: () => void;    // fires when Cancel is clicked
  loading: boolean;        // disables submit while saving
}

/* Bottom bar with Cancel and Register buttons */
const FormActions = ({ onCancel, loading }: Props) => (
  <div className="form-actions">
    <button type="button" className="cancel-btn" onClick={onCancel}>
      Cancel
    </button>
    <button type="submit" className="submit-btn" disabled={loading}>
      {loading ? 'Registering...' : 'Register applicant'}
    </button>
  </div>
);

export default FormActions;
