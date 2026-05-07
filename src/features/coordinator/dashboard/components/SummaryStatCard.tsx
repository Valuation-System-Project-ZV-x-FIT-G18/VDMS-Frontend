interface Props {
  title: string;
  value: number;
  note: string;
  tone?: 'blue' | 'green' | 'amber' | 'red';
}

const SummaryStatCard = ({ title, value, note, tone = 'blue' }: Props) => (
  <article className={`cd-stat cd-stat--${tone}`}>
    <p className="cd-stat__title">{title}</p>
    <p className="cd-stat__value">{value}</p>
    <p className="cd-stat__note">{note}</p>
  </article>
);

export default SummaryStatCard;
