import './ConfirmModal.css';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

// Red warning modal — asks "Are you sure?" before saving
const ConfirmModal = ({ visible, onConfirm, onCancel, loading }: Props) => {
  if (!visible) return null;
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
