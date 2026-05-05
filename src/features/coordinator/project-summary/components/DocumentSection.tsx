import { useState } from 'react';
import type { ProjectSummary } from '../types/project-summary';
import SummarySection from './SummarySection';

interface Props { data: ProjectSummary['documents']; } // documents array from summary

/* Displays uploaded documents with embedded PDF viewer */
const DocumentSection = ({ data }: Props) => {
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const parseStoredValue = (value?: string): string[] => {
    if (!value) return [];
    const trimmed = value.trim();

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      } catch {
        // fall back to legacy single value parsing
      }
    }

    if (trimmed.includes('||')) {
      return trimmed.split('||').map((v) => v.trim()).filter(Boolean);
    }

    return [value];
  };

  const toDocs = (type: string, namesRaw?: string, pathsRaw?: string) => {
    const names = parseStoredValue(namesRaw);
    const paths = parseStoredValue(pathsRaw);
    const total = Math.max(names.length, paths.length);

    return Array.from({ length: total }, (_, i) => ({
      type,
      fileName: names[i] ?? `Document ${i + 1}`,
      filePath: paths[i] ?? names[i] ?? '',
    })).filter((entry) => Boolean(entry.fileName || entry.filePath));
  };

  if (!data || data.length === 0) return null;

  // Extract all file entries (nic, tax, utility, other)
  const fileEntries: Array<{ type: string; fileName: string; filePath: string }> = [];
  
  data.forEach((doc) => {
    fileEntries.push(...toDocs('NIC', doc.nic_file_name, doc.nic_file_path));
    fileEntries.push(...toDocs('Tax Receipt', doc.tax_file_name, doc.tax_file_path));
    fileEntries.push(...toDocs('Utility Bill', doc.utility_file_name, doc.utility_file_path));
    fileEntries.push(...toDocs('Other', doc.other_file_name, doc.other_file_path));
  });

  if (fileEntries.length === 0) return null;

  return (
    <SummarySection title="Uploaded Documents">
      <div className="ps-doc-container">
        {/* File list on the left */}
        <div className="ps-doc-list">
          <h4>Files</h4>
          <ul>
            {fileEntries.map((file, i) => (
              <li key={i}>
                <button
                  className={`ps-doc-btn ${selectedPdfUrl === file.filePath ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPdfUrl(file.filePath);
                    setSelectedFileName(file.fileName);
                  }}
                >
                  <span className="doc-icon">📄</span>
                  <span className="doc-info">
                    <div className="doc-type">{file.type}</div>
                    <div className="doc-name">{file.fileName}</div>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* PDF viewer on the right */}
        <div className="ps-pdf-viewer">
          {selectedPdfUrl ? (
            <>
              <div className="ps-pdf-header">
                <h4>{selectedFileName}</h4>
                <a href={selectedPdfUrl} target="_blank" rel="noopener noreferrer" className="ps-pdf-download-btn">
                  ⬇ Download
                </a>
              </div>
              <iframe
                src={`${selectedPdfUrl}#toolbar=1`}
                className="ps-pdf-frame"
                title={selectedFileName}
                onError={(e) => {
                  (e.target as HTMLIFrameElement).style.display = 'none';
                  const errorDiv = document.getElementById('pdf-error');
                  if (errorDiv) errorDiv.style.display = 'block';
                }}
              />
              <div id="pdf-error" style={{ display: 'none', color: '#b91c1c', marginTop: 12 }}>
                Unable to load PDF. <a href={selectedPdfUrl} target="_blank" rel="noopener noreferrer">Open in new tab</a>.
              </div>
            </>
          ) : (
            <div className="ps-pdf-placeholder">
              <p>Select a document to view</p>
            </div>
          )}
        </div>
      </div>
    </SummarySection>
  );
};

export default DocumentSection;
