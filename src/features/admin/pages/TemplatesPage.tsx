import { useState, useRef, useEffect } from "react";
import templateService from "../../../services/templateService";
import type { Template } from "../../../services/templateService";

const CATEGORIES = ["Land", "Residential", "Commercial", "Industrial", "Agricultural"];

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "9px 12px",
  borderRadius: 8, border: "1.5px solid #E5E7EB",
  fontSize: 13, color: "#111827", outline: "none", background: "#fff",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#6B7280",
  display: "block", marginBottom: 5,
};
// This page allows admin users to manage report templates used for generating valuation and site reports. They can create new templates, edit existing ones, upload associated Word/PDF documents, and delete templates. Each template has a title, description, category, status (draft/published), and an optional file attachment. The page also includes modals for editing template details and confirming deletions.
export default function TemplatesPage() {
  const [templates, setTemplates]         = useState<Template[]>([]);
  const [loading, setLoading]             = useState(true);
  const [editTemplate, setEditTemplate]   = useState<Template | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Template | null>(null);
  const [saved, setSaved]                 = useState(false);
  const [showDocs, setShowDocs]           = useState(false);
  const [showFields, setShowFields]       = useState(false);
  const [uploadTarget, setUploadTarget]   = useState<Template | null>(null);
  const [dragOver, setDragOver]           = useState(false);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [addForm, setAddForm]             = useState({ title: "", description: "", category: CATEGORIES[0] });
  const af = (key: string, val: string) => setAddForm(p => ({ ...p, [key]: val }));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit form
  const [editForm, setEditForm] = useState({ title: "", description: "", category: "" });
  const ef = (key: string, val: string) => setEditForm(p => ({ ...p, [key]: val }));

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (t: Template) => {
    setEditTemplate(t);
    setEditForm({ title: t.title, description: t.description || "", category: t.category });
    setSaved(false);
  };

  const handleSaveEdit = async () => {
    if (!editTemplate) return;
    try {
      await templateService.updateTemplate(editTemplate.id, {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
      });
      setSaved(true);
      fetchTemplates();
      setTimeout(() => { setSaved(false); setEditTemplate(null); }, 1500);
    } catch (err) {
      console.error("Failed to update template", err);
    }
  };

  const handleCreateTemplate = async () => {
    if (!addForm.title.trim()) {
      alert("Please enter a title for the template.");
      return;
    }
    try {
      await templateService.createTemplate({
        title: addForm.title,
        description: addForm.description,
        category: addForm.category,
        status: "draft",
      });
      setSaved(true);
      fetchTemplates();
      setTimeout(() => {
        setSaved(false);
        setShowAddModal(false);
        setAddForm({ title: "", description: "", category: CATEGORIES[0] });
      }, 1000);
    } catch (err) {
      console.error("Failed to create template", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await templateService.deleteTemplate(deleteConfirm.id);
      fetchTemplates();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete template", err);
    }
  };

  // ── File upload handler ──
  const handleFileUpload = async (file: File, templateId: string) => {
    if (!file) return;
    const allowedTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(doc|docx|pdf)$/i)) {
      alert("Please upload a Word document (.doc, .docx) or PDF file.");
      return;
    }

    try {
      await templateService.uploadTemplateFile(templateId, file);
      fetchTemplates();
      setUploadTarget(null);
    } catch (err) {
      console.error("Failed to upload file", err);
    }
  };

  const handleRemoveFile = async (templateId: string) => {
    try {
      await templateService.removeTemplateFile(templateId);
      fetchTemplates();
    } catch (err) {
      console.error("Failed to remove file", err);
    }
  };

  const handleDrop = (e: React.DragEvent, templateId: string) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file, templateId);
  };

  const FIELDS_DATA = [
    { group: "Property Details", fields: ["Property Address", "GPS Coordinates", "Land Area (sqm)", "Property Type"] },
    { group: "Legal Information", fields: ["Plan Number", "Lot Number", "Title Reference", "Registry Office"] },
    { group: "Valuation Data",   fields: ["Market Value", "Comparable Sales", "Valuation Date", "Appraiser ID"] },
    { group: "Photo Requirements", fields: ["Front Elevation", "Rear Elevation", "Site Overview", "Boundary Markers"] },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F0F4FF", minHeight: "100vh", padding: 24 }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
        <span style={{ color: "#4F8EF7", cursor: "pointer" }}>Dashboard</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span>Report Template Management</span>
      </div>

      {/* Header — no Create button */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Report Template Management</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#9CA3AF" }}>Configure and manage standard structures for valuation and site reports.</p>
      </div>

      {/* Template Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 28 }}>
        {loading ? (
          <div style={{ gridColumn: "span 3", textAlign: "center", padding: "40px", color: "#9CA3AF" }}>Loading templates...</div>
        ) : templates.map(t => (
          <div key={t.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF5", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {/* Image */}
            <div style={{ position: "relative", height: 160, background: "#F3F4F6", overflow: "hidden" }}>
              {t.image ? (
                <img src={t.image} alt={t.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: t.categoryBg }}>
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke={t.categoryColor} strokeWidth="1.5"/><path d="M8 12h8M8 8h5M8 16h3" stroke={t.categoryColor} strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
              )}
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "4px 10px" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.categoryColor }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: t.categoryColor, textTransform: "uppercase" as const }}>{t.category}</span>
              </div>
              {t.status === "draft" && (
                <div style={{ position: "absolute", top: 12, right: 12, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700, color: "#D97706" }}>DRAFT</div>
              )}
            </div>

            {/* Card body */}
            <div style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{t.title}</div>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>{t.description}</p>

              {/* Uploaded file badge */}
              {t.fileName && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F0FDF4", borderRadius: 8, padding: "8px 12px", marginBottom: 12, border: "1px solid #BBF7D0" }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#10B981" strokeWidth="2"/><path d="M14 2v6h6" stroke="#10B981" strokeWidth="2"/></svg>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{t.fileName}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>{t.fileSize} • {t.fileUploadedAt ? new Date(t.fileUploadedAt).toLocaleDateString() : ""}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={() => window.open(`http://localhost:5001${t.fileUrl}`, '_blank')}
                      title="Download Document"
                      style={{ width: 22, height: 22, borderRadius: 5, border: "none", background: "#EFF6FF", color: "#2563EB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button
                      onClick={() => handleRemoveFile(t.id)}
                      title="Remove Document"
                      style={{ width: 22, height: 22, borderRadius: 5, border: "none", background: "#FEE2E2", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Word doc button */}
              <button
                onClick={() => setUploadTarget(t)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 9, border: "1.5px dashed #D1D5DB", background: "#FAFBFF", color: "#6B7280", fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {t.fileName ? "Replace Document" : "Upload Word / PDF Template"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                  <span style={{ fontWeight: 600, color: "#6B7280" }}>Last Updated</span><br />
                  {new Date(t.updatedAt).toLocaleDateString()}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setDeleteConfirm(t)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                  <button onClick={() => openEdit(t)} style={{ padding: "7px 16px", borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Edit Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Template card */}
        <div
          onClick={() => setShowAddModal(true)}
          style={{ background: "#fff", borderRadius: 16, border: "2px dashed #D1D5DB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280, gap: 12, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#4F8EF7"; e.currentTarget.style.background = "#F9FBFF"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.background = "#fff"; }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#4F8EF7" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Add Template</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", maxWidth: 180 }}>Define a new reporting category or structure</div>
        </div>
      </div>

      {/* About Template Management */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1px solid #E8EDF5", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#4F8EF7" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 6 }}>About Template Management</div>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>
            These templates define the mandatory fields, photo requirements, and calculation formulas for all field reports.
            Changes made here will apply to all <strong>new</strong> reports started after the template is saved.
            Existing reports in draft will retain their original structure until manually updated.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <span onClick={() => setShowDocs(true)} style={{ fontSize: 13, color: "#4F8EF7", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              View documentation
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span onClick={() => setShowFields(true)} style={{ fontSize: 13, color: "#4F8EF7", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              Manage fields
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#D1D5DB" }}>
        <span>ZaVolt Admin v2.4.0 • Uptime: 99.98% • DB Latency: 12ms</span>
        <span>© 2026 ZaVolt Valuation Management Systems. All rights reserved.</span>
      </div>

      {/* ── Upload Document Modal ── */}
      {uploadTarget && (
        <>
          <div onClick={() => setUploadTarget(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, background: "#fff", borderRadius: 20, zIndex: 301, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Upload Template Document</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{uploadTarget.title}</div>
              </div>
              <button onClick={() => setUploadTarget(null)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file && uploadTarget) handleFileUpload(file, uploadTarget.id);
                e.target.value = "";
              }}
            />

            {/* Drag and drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { if (uploadTarget) handleDrop(e, uploadTarget.id); }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "#4F8EF7" : "#D1D5DB"}`,
                borderRadius: 14,
                padding: "40px 24px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "#EFF6FF" : "#FAFBFF",
                transition: "all 0.2s",
                marginBottom: 20,
              }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
                {dragOver ? "Drop your file here" : "Drag & drop your document here"}
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 14 }}>or click to browse from your computer</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {[".docx", ".doc", ".pdf"].map(ext => (
                  <span key={ext} style={{ fontSize: 11, fontWeight: 600, color: "#4F8EF7", background: "#EFF6FF", padding: "3px 10px", borderRadius: 20 }}>{ext}</span>
                ))}
              </div>
            </div>

            {/* If already has file show it */}
            {uploadTarget.fileName && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0FDF4", borderRadius: 10, padding: "12px 14px", marginBottom: 16, border: "1px solid #BBF7D0" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#10B981" strokeWidth="2"/><path d="M14 2v6h6" stroke="#10B981" strokeWidth="2"/></svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{uploadTarget.fileName}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>Currently uploaded • {uploadTarget.fileSize}</div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setUploadTarget(null)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => fileInputRef.current?.click()} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Browse Files
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Add Template Modal ── */}
      {showAddModal && (
        <>
          <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 520, background: "#fff", borderRadius: 20, zIndex: 301, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Create New Template</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Define a new report category and base structure</div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
            </div>
            <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              {saved && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#10B981", fontWeight: 600 }}>✓ Template created successfully!</div>
              )}
              <div>
                <label style={labelStyle}>Template Title</label>
                <input value={addForm.title} onChange={e => af("title", e.target.value)} placeholder="e.g. Standard Valuation" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={addForm.description} onChange={e => af("description", e.target.value)} rows={3} placeholder="Briefly describe the purpose of this template..." style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={addForm.category} onChange={e => af("category", e.target.value)} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowAddModal(false)} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleCreateTemplate} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create Template</button>
            </div>
          </div>
        </>
      )}

      {/* ── Edit Template Modal ── */}
      {editTemplate && (
        <>
          <div onClick={() => setEditTemplate(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 520, background: "#fff", borderRadius: 20, zIndex: 301, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Edit Template</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Update template details and configuration</div>
              </div>
              <button onClick={() => setEditTemplate(null)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
            </div>
            <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
              {saved && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#10B981", fontWeight: 600 }}>✓ Template saved successfully!</div>
              )}
              <div>
                <label style={labelStyle}>Template Title</label>
                <input value={editForm.title} onChange={e => ef("title", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={editForm.description} onChange={e => ef("description", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select value={editForm.category} onChange={e => ef("category", e.target.value)} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setEditTemplate(null)} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSaveEdit} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Changes</button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <>
          <div onClick={() => setDeleteConfirm(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 400 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 380, background: "#fff", borderRadius: 18, zIndex: 401, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "28px 32px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Delete "{deleteConfirm.title}"?</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 22 }}>This action cannot be undone. The template will be permanently removed.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "none", background: "#EF4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </>
      )}

      {/* ── View Documentation Modal ── */}
      {showDocs && (
        <>
          <div onClick={() => setShowDocs(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, maxHeight: "85vh", overflowY: "auto", background: "#fff", borderRadius: 20, zIndex: 301, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Template Documentation</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>ZaVolt Report Template Management Guide</div>
              </div>
              <button onClick={() => setShowDocs(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
            </div>
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                {
                  title: "What are Report Templates?",
                  icon: "📋",
                  content: "Report templates define the mandatory fields, photo requirements, and calculation formulas for all field valuation reports. Each template is category-specific and controls the data structure of every new report created under that category.",
                },
                {
                  title: "How Templates Work",
                  icon: "⚙️",
                  content: "When a valuer starts a new report, the system assigns the matching template based on the property's valuation type. All mandatory fields from the template must be completed before the report can be submitted for review.",
                },
                {
                  title: "Uploading Word Documents",
                  icon: "📄",
                  content: "You can upload a .doc or .docx Word document as the base template for each category. The system will parse the document structure and map fields automatically. Supported formats: .doc, .docx, and .pdf.",
                },
                {
                  title: "Making Changes",
                  icon: "✏️",
                  content: "Changes to templates take effect for all new reports created after saving. Existing reports in draft status will retain their original structure. Published reports are never affected by template changes.",
                },
                {
                  title: "Best Practices",
                  icon: "✅",
                  content: "Always test template changes in the Staging environment before applying to Production. Notify your team before making major structural changes. Keep a version history by duplicating templates before editing.",
                },
              ].map((section, i) => (
                <div key={i} style={{ background: "#FAFBFF", borderRadius: 12, padding: "16px 18px", border: "1px solid #E8EDF5" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{section.icon}</span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{section.title}</div>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>{section.content}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowDocs(false)} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Got it</button>
            </div>
          </div>
        </>
      )}

      {/* ── Manage Fields Modal ── */}
      {showFields && (
        <>
          <div onClick={() => setShowFields(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 640, maxHeight: "88vh", overflowY: "auto", background: "#fff", borderRadius: 20, zIndex: 301, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>
            <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Manage Fields</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Configure global field definitions used across all templates</div>
              </div>
              <button onClick={() => setShowFields(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
            </div>
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              {FIELDS_DATA.map((group, gi) => (
                <div key={gi}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{group.group}</div>
                    <button style={{ fontSize: 11, fontWeight: 600, color: "#4F8EF7", background: "#EFF6FF", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>+ Add Field</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {group.fields.map((field, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F9FAFB", borderRadius: 9, padding: "10px 14px", border: "1px solid #E8EDF5" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4F8EF7" }} />
                          <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{field}</span>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          <button style={{ width: 22, height: 22, borderRadius: 5, border: "1px solid #E8EDF5", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#4F8EF7" }}>
                            <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          </button>
                          <button style={{ width: 22, height: 22, borderRadius: 5, border: "1px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                            <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowFields(false)} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Close</button>
              <button style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save Field Changes</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
