import './ConfirmModal.css';                          // scoped modal styles

interface Props {
  visible: boolean;                                   // controls modal visibility
  onConfirm: () => void;                              // fires when user clicks OK
  onCancel: () => void;                               // fires when user clicks Cancel
  loading: boolean;                                   // disables OK button while saving
}

/* Red warning modal — asks "Are you sure?" before saving to DB */
const ConfirmModal = ({ visible, onConfirm, onCancel, loading }: Props) => {
  if (!visible) return null;                          // don't render when hidden

  return (
    <div className="modal-overlay" onClick={onCancel}> {/* click backdrop to dismiss */}
      <div className="modal-box" onClick={e => e.stopPropagation()}> {/* prevent close on box click */}
        <h2 className="modal-title">⚠ Warning</h2>
        <p className="modal-msg">
          You <strong>cannot change</strong> this information once submitted.<br />
          Are you sure you want to register?
        </p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-ok" onClick={onConfirm} disabled={loading}>
            {loading ? 'Saving...' : 'OK, Register'}  {/* show loading state */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
