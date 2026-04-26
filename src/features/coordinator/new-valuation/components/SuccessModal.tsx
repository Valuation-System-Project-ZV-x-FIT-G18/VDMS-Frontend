interface Props {
  open: boolean;
  onClose: () => void;
}

const SuccessModal = ({ open, onClose }: Props) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Success</h2>
        <p className="modal-msg">New valuation created successfully.</p>
        <div className="modal-actions">
          <button className="modal-ok" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
