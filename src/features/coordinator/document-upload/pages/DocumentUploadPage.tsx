import { useState, useCallback, useEffect } from 'react';                    // React hooks
import { useNavigate } from 'react-router-dom';                    // navigation
import type { DocumentFiles } from '../types/documents';           // form shape
import { saveDocuments } from '../api/document-upload';            // API call
import { fetchDocuments } from '../api/fetch-documents';           // fetch API
import NicUpload from '../components/NicUpload';
import TaxUpload from '../components/TaxUpload';
import UtilityUpload from '../components/UtilityUpload';
import OtherUpload from '../components/OtherUpload';
import DocFormActions from '../components/DocFormActions';
import ConfirmModal from '../components/ConfirmModal'; // red warning modal
import './DocumentUploadPage.css';
import usePersistedState from '../../hooks/usePersistedState'; // persist form on refresh

const empty: DocumentFiles = {
  nicCopy: null, taxReceipts: null, utilityBills: null, otherDocs: null,
};

/* Document upload page — final step, saves all data to DB */

const DocumentUploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = usePersistedState<DocumentFiles>('document-upload', empty);
  const [rawFiles, setRawFiles] = useState<Record<keyof DocumentFiles, File | null>>({
    nicCopy: null, taxReceipts: null, utilityBills: null, otherDocs: null,
  });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // controls warning modal

  // Fetch uploaded documents on mount
  useEffect(() => {
    const stored = localStorage.getItem('register-client');
    const nic = stored ? JSON.parse(stored).nic : '';
    if (!nic) return;

    fetchDocuments(nic)
      .then(fetched => {
        // Only update if backend has data
        if (fetched && Object.values(fetched).some(Boolean)) {
          setFiles(prev => ({ ...prev, ...fetched }));
        }
      })
      .catch(() => {}); // ignore errors
  }, [setFiles]);

  const handleFile = useCallback((key: keyof DocumentFiles, file: File | null) => {
    setRawFiles(prev => ({ ...prev, [key]: file }));
    setFiles(prev => ({
      ...prev,
      [key]: file ? { name: file.name, path: file.name } : null,
    }));
  }, [setFiles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true); // open warning modal
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await saveDocuments(files, rawFiles);
      setShowConfirm(false);
      navigate('/coordinator/new-valuation'); // go to new valuation page
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save documents';
      alert(message);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="doc-upload-page">
      <div className="doc-upload-card">
        <h1 className="doc-heading">Document upload</h1>
        <p className="doc-sub">Upload required documents to complete the valuation</p>
        <form onSubmit={handleSubmit}>
          <NicUpload files={files} onFile={handleFile} />
          <TaxUpload files={files} onFile={handleFile} />
          <UtilityUpload files={files} onFile={handleFile} />
          <OtherUpload files={files} onFile={handleFile} />
          <DocFormActions onBack={() => navigate(-1)} loading={loading} />
        </form>
      </div>
      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    </div>
  );
};

export default DocumentUploadPage;
