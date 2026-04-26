import FieldRow from './FieldRow';
import type { DataMap } from '../types/revaluation';

interface Props {
  title: string;
  data?: DataMap | null;
}

const ReadOnlySection = ({ title, data }: Props) => {
  const entries = Object.entries(data || {});
  return (
    <section className="rv-card">
      <h3>{title}</h3>
      {entries.length === 0 && <FieldRow label="Status" value="No data" />}
      {entries.map(([k, v]) => (
        <FieldRow key={k} label={k.replace(/_/g, ' ')} value={Array.isArray(v) ? v.join(', ') : v} />
      ))}
    </section>
  );
};

export default ReadOnlySection;
