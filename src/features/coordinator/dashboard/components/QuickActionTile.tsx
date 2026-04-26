interface Props {
  icon: string;
  title: string;
  desc: string;
  onClick: () => void;
}

const QuickActionTile = ({ icon, title, desc, onClick }: Props) => (
  <button className="cd-action" onClick={onClick}>
    <span className="cd-action__icon" aria-hidden>{icon}</span>
    <span className="cd-action__body">
      <span className="cd-action__title">{title}</span>
      <span className="cd-action__desc">{desc}</span>
    </span>
  </button>
);

export default QuickActionTile;
