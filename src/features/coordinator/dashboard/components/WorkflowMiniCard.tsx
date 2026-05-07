interface Props {
  label: string;
  value: number;
  total: number;
  colorClass: 'blue' | 'green' | 'amber' | 'red';
}

const WorkflowMiniCard = ({ label, value, total, colorClass }: Props) => {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <article className="cd-workflow-card">
      <div className="cd-workflow-card__head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="cd-progress">
        <span className={`cd-progress__fill cd-progress__fill--${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="cd-workflow-card__meta">{pct}% of all technical officers</p>
    </article>
  );
};

export default WorkflowMiniCard;
