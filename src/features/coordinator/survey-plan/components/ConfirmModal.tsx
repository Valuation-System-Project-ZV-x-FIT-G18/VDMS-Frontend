import './ConfirmModal.css';                          // scoped modal styles

interface Props {
  visible: boolean;                                   // controls modal visibility
  onConfirm: () => void;                              // fires when user clicks OK
  onCancel: () => void;                               // fires when user clicks Cancel
  loading: boolean;                                   // disables OK button while saving
}

/* Red warning modal — warns user data cannot be changed after save */
const ConfirmModal = ({ visible, onConfirm, onCancel, loading }: Props) => {
  if (!visible) return null;                          // don't render when hidden

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">⚠ Warning</h2>
        <p className="modal-msg">
          You <strong>cannot change</strong> this information again.<br />
          Are you sure you want to save?
        </p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-ok" onClick={onConfirm} disabled={loading}>
            {loading ? 'Saving...' : 'OK, Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
