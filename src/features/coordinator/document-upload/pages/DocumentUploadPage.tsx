import { useState, useCallback } from 'react';                    // React hooks
import { useNavigate } from 'react-router-dom';                    // navigation
import type { DocumentFiles } from '../types/documents';           // form shape
import usePersistedState from '../../hooks/usePersistedState';
import { saveDocuments } from '../api/document-upload';            // API call
import NicUpload from '../components/NicUpload';
import TaxUpload from '../components/TaxUpload';
import UtilityUpload from '../components/UtilityUpload';
import OtherUpload from '../components/OtherUpload';
import DocFormActions from '../components/DocFormActions';
import ConfirmModal from '../components/ConfirmModal'; // red warning modal
import './DocumentUploadPage.css';
import { validateDocumentUploadForm } from '../../validation/document-upload.validation';
import type { FieldErrors } from '../../validation/shared';

const empty: DocumentFiles = {
  nicCopy: null, taxReceipts: [], utilityBills: [], otherDocs: [],
};

const STORAGE_KEY = 'document-upload';
const LEGACY_STORAGE_KEY = 'document-upload-files';

const readDraftDocuments = (): DocumentFiles => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<DocumentFiles>;
    return {
      nicCopy: parsed.nicCopy ?? null,
      taxReceipts: Array.isArray(parsed.taxReceipts) ? parsed.taxReceipts : [],
      utilityBills: Array.isArray(parsed.utilityBills) ? parsed.utilityBills : [],
      otherDocs: Array.isArray(parsed.otherDocs) ? parsed.otherDocs : [],
    };
  } catch {
    return empty;
  }
};

/* Document upload page — final step, saves all data to DB */

const DocumentUploadPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = usePersistedState<DocumentFiles>(STORAGE_KEY, readDraftDocuments());
  const [rawFiles, setRawFiles] = useState<{
    nicCopy: File | null;
    taxReceipts: File[];
    utilityBills: File[];
    otherDocs: File[];
  }>({
    nicCopy: null, taxReceipts: [], utilityBills: [], otherDocs: [],
  });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // controls warning modal
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleFile = useCallback((key: keyof DocumentFiles, selected: File[] | null) => {
    let nextFiles: DocumentFiles = files;

    if (key === 'nicCopy') {
      const file = selected?.[0] ?? null;
      nextFiles = {
        ...files,
        nicCopy: file ? { name: file.name, path: file.name } : null,
      };
      setRawFiles(prev => ({ ...prev, nicCopy: file }));
      setFiles(nextFiles);
    } else {
      const picked = (selected ?? []).slice(0, 10);
      const mapped = picked.map((f) => ({ name: f.name, path: f.name }));

      if (key === 'taxReceipts') {
        nextFiles = { ...files, taxReceipts: mapped };
        setRawFiles(prev => ({ ...prev, taxReceipts: picked }));
      } else if (key === 'utilityBills') {
        nextFiles = { ...files, utilityBills: mapped };
        setRawFiles(prev => ({ ...prev, utilityBills: picked }));
      } else {
        nextFiles = { ...files, otherDocs: mapped };
        setRawFiles(prev => ({ ...prev, otherDocs: picked }));
      }

      setFiles(nextFiles);
    }

    const validation = validateDocumentUploadForm(nextFiles);
    const fieldError = validation.errors[key];
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) next[key] = fieldError;
      else delete next[key];
      delete next.form;
      return next;
    });
  }, [files]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateDocumentUploadForm(files);
    setErrors(validation.errors);
    if (!validation.valid) {
      return;
    }

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
      setErrors((prev) => ({ ...prev, form: message }));
    }
    finally { setLoading(false); }
  };

  return (
    <div className="doc-upload-page">
      <div className="doc-upload-card">
        <h1 className="doc-heading">Document upload</h1>
        <p className="doc-sub">Upload required documents to complete the valuation</p>
        <form onSubmit={handleSubmit} noValidate>
          <NicUpload files={files} onFile={handleFile} error={errors.nicCopy} />
          <TaxUpload files={files} onFile={handleFile} error={errors.taxReceipts} />
          <UtilityUpload files={files} onFile={handleFile} error={errors.utilityBills} />
          <OtherUpload files={files} onFile={handleFile} error={errors.otherDocs} />
          {errors.form && <span className="field-error">{errors.form}</span>}
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
