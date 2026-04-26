interface Props {
  open: boolean;
  loading: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ open, loading, onOk, onCancel }: Props) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Warning</h2>
        <p className="modal-msg">You cannot change this again. Are you sure?</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-ok" onClick={onOk} disabled={loading}>{loading ? 'Saving...' : 'OK'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
