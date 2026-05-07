import './SectionHeader.css';

interface Props {
  icon?: string;   // optional emoji/icon before the title
  title: string;   // section heading text
}

/* Renders a section divider with icon + title (e.g. "Personal information") */
const SectionHeader = ({ icon, title }: Props) => (
  <div className="section-header">
    {icon && <span className="section-icon">{icon}</span>} {/* optional icon */}
    <h2 className="section-title">{title}</h2>
  </div>
);

export default SectionHeader;
