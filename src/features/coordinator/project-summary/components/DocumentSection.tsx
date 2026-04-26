import type { ProjectSummary } from '../types/project-summary';
import SummarySection from './SummarySection';

interface Props { data: ProjectSummary['documents']; } // documents array from summary

/* Displays uploaded documents in a table inside a read-only section */
const DocumentSection = ({ data }: Props) => {
  if (!data || data.length === 0) return null;          // skip if no documents
  return (
    <SummarySection title="Uploaded Documents">
      <table className="ps-doc-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>File Name</th>
            <th>Uploaded At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((doc, i) => (
            <tr key={i}>
              <td>{doc.document_type}</td>
              <td>{doc.file_name}</td>
              <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SummarySection>
  );
};

export default DocumentSection;
