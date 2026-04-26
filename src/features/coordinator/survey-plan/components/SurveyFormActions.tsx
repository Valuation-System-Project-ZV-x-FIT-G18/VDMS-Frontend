import './SurveyFormActions.css';

interface Props {
  onBack: () => void;    // fires when Back is clicked
  loading: boolean;      // disables button while saving
}

/* Bottom bar with Back and Submit buttons */
const SurveyFormActions = ({ onBack, loading }: Props) => (
  <div className="survey-form-actions">
    <button type="button" className="back-btn" onClick={onBack}>
      Back
    </button>
    <button type="submit" className="next-btn" disabled={loading}>
      {loading ? 'Saving...' : 'Next → Legal details'}
    </button>
  </div>
);

export default SurveyFormActions;
