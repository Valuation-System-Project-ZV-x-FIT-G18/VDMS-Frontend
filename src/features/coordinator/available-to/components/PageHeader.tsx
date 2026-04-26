interface Props {
  title: string;                   // page heading text
  subtitle: string;                // description below heading
}

/* Reusable page header for all 4 TO pages */
const PageHeader = ({ title, subtitle }: Props) => (
  <div className="to-header">
    <h1 className="to-heading">{title}</h1>
    <p className="to-sub">{subtitle}</p>
  </div>
);

export default PageHeader;
