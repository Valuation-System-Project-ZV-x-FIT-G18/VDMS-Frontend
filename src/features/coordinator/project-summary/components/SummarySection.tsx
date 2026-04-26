interface Props {
  title: string;                           // section heading text
  children: React.ReactNode;               // field rows rendered inside
}

/* Reusable card wrapper for each summary section — title + content */
const SummarySection = ({ title, children }: Props) => (
  <div className="ps-section">
    <h2 className="ps-section-title">{title}</h2>
    <div className="ps-section-body">{children}</div>
  </div>
);

export default SummarySection;
