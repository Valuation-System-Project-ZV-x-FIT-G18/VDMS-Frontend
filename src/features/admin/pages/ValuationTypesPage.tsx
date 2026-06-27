import { useState, useEffect } from "react";
import valuationTypeService, { type ValuationType as BackendType, type CreateValuationTypeDto } from "../../../services/valuationTypeService";

const TABS = ["All Types", "Agricultural", "Residential", "Commercial", "Industrial", ];

interface ValuationType {
  id: string; 
  key: string; 
  title: string; 
  desc: string; 
  category: string;
  stats: { days: string; total: string };
  docs: { name: string; required: boolean; validate: boolean }[];
  color: string; 
  bg: string; 
  active: boolean;
  imageUrl?: string;
}

// ── Constants ──

const MODAL_TABS = ["Overview", "Documents"];
const AVATAR_COLORS = ["#6366F1","#EC4899","#14B8A6","#F97316","#EF4444","#8B5CF6"];

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "8px 11px",
  borderRadius: 8, border: "1.5px solid #E5E7EB",
  fontSize: 13, color: "#111827", outline: "none", background: "#fff",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#6B7280",
  display: "block", marginBottom: 5,
};

export default function ValuationTypesPage() {
  const [activeTab,    setActiveTab]    = useState("All Types");
  const [types,        setTypes]        = useState<ValuationType[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedType, setSelectedType] = useState<ValuationType | null>(null);
  const [modalTab,     setModalTab]     = useState("Documents");
  const [showCreate,   setShowCreate]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<ValuationType | null>(null);

  // ── Create form state ──
  const [newTypeName,  setNewTypeName]  = useState("");
  const [newTypeDesc,  setNewTypeDesc]  = useState("");
  const [newTypeCat,   setNewTypeCat]   = useState("Residential");
  const [newTypeDays,  setNewTypeDays]  = useState("");

  // ── Edit form state (Overview tab) ──
  const [editTitle,    setEditTitle]    = useState("");
  const [editDesc,     setEditDesc]     = useState("");
  const [editCat,      setEditCat]      = useState("");
  const [editDays,     setEditDays]     = useState("");
  const [editActive,   setEditActive]   = useState(true);
  const [editSaved,    setEditSaved]    = useState(false);

  // ── Document add state (Documents tab) ──
  const [showAddDoc,   setShowAddDoc]   = useState(false);
  const [newDocName,   setNewDocName]   = useState("");
  const [newDocReq,    setNewDocReq]    = useState(true);
  const [newDocVal,    setNewDocVal]    = useState(false);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const data = await valuationTypeService.getTypes();
      setTypes(data.map(mapBackendToFrontend));
    } catch (err) {
      console.error("Failed to fetch valuation types", err);
    } finally {
      setLoading(false);
    }
  };

  const mapBackendToFrontend = (b: BackendType): ValuationType => ({
    id: b.id,
    key: b.name.toLowerCase().replace(/\s/g, "_"),
    title: b.name,
    desc: b.description || "",
    category: b.category,
    stats: { days: b.turnaroundTime || "TBD", total: "0 Total" },
    docs: (b.documents || []).map(d => ({
      name: d.name,
      required: d.isRequired,
      validate: d.isGisValidated,
    })),
    color: b.color || AVATAR_COLORS[0],
    bg: b.background || "#F8FAFF",
    active: b.isActive,
    imageUrl: b.imageUrl,
  });

  const filtered = activeTab === "All Types"
    ? types
    : types.filter(t => t.category === activeTab);

  const activeCount = types.filter(t => t.active).length;
  const draftCount  = types.filter(t => !t.active).length;

  // ── Open modal ──
  const openModal = (type: ValuationType, tab: string) => {
    setSelectedType(type);
    setModalTab(tab);
    setEditTitle(type.title);
    setEditDesc(type.desc);
    setEditCat(type.category);
    setEditDays(type.stats.days);
    setEditActive(type.active);
    setEditSaved(false);
    setShowAddDoc(false);
    setNewDocName(""); setNewDocReq(true); setNewDocVal(false);
  };

  // ── Save Overview edits ──
  const handleSaveOverview = async () => {
    if (!selectedType) return;
    try {
      const dto: Partial<CreateValuationTypeDto> = {
        name: editTitle,
        description: editDesc,
        category: editCat,
        turnaroundTime: editDays,
        isActive: editActive,
      };
      const updated = await valuationTypeService.updateType(selectedType.id, dto);
      const frontendUpdated = mapBackendToFrontend(updated);
      
      setTypes(types.map(t => t.id === selectedType.id ? frontendUpdated : t));
      setSelectedType(frontendUpdated);
      setEditSaved(true);
      setTimeout(() => setEditSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update valuation type", err);
    }
  };

  // ── Toggle doc field ──
  const toggleDoc = async (docIndex: number, field: "required" | "validate") => {
    if (!selectedType) return;
    try {
      const updatedDocs = selectedType.docs.map((d, i) =>
        i === docIndex ? { ...d, [field]: !d[field] } : d
      );
      
      const dto: Partial<CreateValuationTypeDto> = {
        documents: updatedDocs.map(d => ({
          name: d.name,
          isRequired: d.required,
          isGisValidated: d.validate,
        }))
      };

      const updated = await valuationTypeService.updateType(selectedType.id, dto);
      const frontendUpdated = mapBackendToFrontend(updated);
      
      setTypes(types.map(t => t.id === selectedType.id ? frontendUpdated : t));
      setSelectedType(frontendUpdated);
    } catch (err) {
      console.error("Failed to toggle document field", err);
    }
  };

  // ── Add document ──
  const handleAddDoc = async () => {
    if (!newDocName.trim() || !selectedType) return;
    try {
      const newDoc = { name: newDocName.trim(), required: newDocReq, validate: newDocVal };
      const updatedDocs = [...selectedType.docs, newDoc];
      
      const dto: Partial<CreateValuationTypeDto> = {
        documents: updatedDocs.map(d => ({
          name: d.name,
          isRequired: d.required,
          isGisValidated: d.validate,
        }))
      };

      const updated = await valuationTypeService.updateType(selectedType.id, dto);
      const frontendUpdated = mapBackendToFrontend(updated);
      
      setTypes(types.map(t => t.id === selectedType.id ? frontendUpdated : t));
      setSelectedType(frontendUpdated);
      setNewDocName(""); setNewDocReq(true); setNewDocVal(false);
      setShowAddDoc(false);
    } catch (err) {
      console.error("Failed to add document", err);
    }
  };

  // ── Delete document ──
  const handleDeleteDoc = async (docIndex: number) => {
    if (!selectedType) return;
    try {
      const updatedDocs = selectedType.docs.filter((_, i) => i !== docIndex);
      
      const dto: Partial<CreateValuationTypeDto> = {
        documents: updatedDocs.map(d => ({
          name: d.name,
          isRequired: d.required,
          isGisValidated: d.validate,
        }))
      };

      const updated = await valuationTypeService.updateType(selectedType.id, dto);
      const frontendUpdated = mapBackendToFrontend(updated);
      
      setTypes(types.map(t => t.id === selectedType.id ? frontendUpdated : t));
      setSelectedType(frontendUpdated);
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  // ── Delete category ──
  const handleDeleteType = async () => {
    if (!deleteConfirm) return;
    try {
      await valuationTypeService.deleteType(deleteConfirm.id);
      setTypes(prev => prev.filter(t => t.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      if (selectedType?.id === deleteConfirm.id) setSelectedType(null);
    } catch (err) {
      console.error("Failed to delete valuation type", err);
    }
  };

  // ── Create new type ──
  const handleCreate = async (asDraft: boolean) => {
    if (!newTypeName.trim()) return;
    try {
      const color = AVATAR_COLORS[types.length % AVATAR_COLORS.length];
      const dto: CreateValuationTypeDto = {
        name: newTypeName.trim(),
        description: newTypeDesc.trim() || "New valuation type.",
        category: newTypeCat,
        turnaroundTime: newTypeDays.trim() || "TBD",
        color: color,
        background: "#EEF2FF",
        isActive: !asDraft,
        documents: [],
      };
      
      const created = await valuationTypeService.createType(dto);
      setTypes(p => [...p, mapBackendToFrontend(created)]);
      setNewTypeName(""); setNewTypeDesc(""); setNewTypeCat("Residential"); setNewTypeDays("");
      setShowCreate(false);
    } catch (err) {
      console.error("Failed to create valuation type", err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#F0F4FF" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #E5E7EB", borderTopColor: "#4F8EF7", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#4F8EF7", fontWeight: 600 }}>Loading types...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F0F4FF", minHeight: "100vh", padding: 24 }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
        <span style={{ color: "#4F8EF7", cursor: "pointer" }}>Dashboard</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span>Valuation Types</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>Valuation Types Management</h1>
        <button onClick={() => setShowCreate(true)} style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(79,142,247,0.35)", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
          New Type
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Types", value: types.length,  color: "#111827" },
          { label: "Active",      value: activeCount,   color: "#10B981" },
          { label: "Draft",       value: draftCount,    color: "#F59E0B" },
          { label: "Most Used",   value: "Residential", color: "#4F8EF7" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 22px", border: "1px solid #E8EDF5" }}>
            <div style={{ fontSize: typeof c.value === "number" ? 28 : 18, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: "#fff", borderRadius: 12, padding: "6px", border: "1px solid #E8EDF5", width: "fit-content" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
            background: activeTab === tab ? "linear-gradient(135deg,#4F8EF7,#2563EB)" : "transparent",
            color: activeTab === tab ? "#fff" : "#6B7280",
            boxShadow: activeTab === tab ? "0 2px 8px rgba(79,142,247,0.3)" : "none",
          }}>{tab}</button>
        ))}
      </div>

      {/* Type Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {filtered.map(type => (
          <div key={type.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF5", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            {/* Image Header */}
            <div style={{ position: "relative", height: 140, overflow: "hidden" }}>
              <img 
                src={type.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80"} 
                alt={type.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: type.color, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase" }}>{type.category}</span>
              </div>
            </div>

            <div style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{type.title}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: type.active ? "#F0FDF4" : "#F3F4F6", color: type.active ? "#10B981" : "#9CA3AF" }}>
                    {type.active ? "Active" : "Draft"}
                  </span>
                  <button onClick={() => setDeleteConfirm(type)} style={{ width: 26, height: 26, borderRadius: 7, border: "1.5px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>

              <p style={{ margin: "0 0 12px", fontSize: 12, color: "#6B7280", lineHeight: 1.6 }}>{type.desc}</p>

              <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: "#9CA3AF" }}>Avg Time: </span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{type.stats.days}</span>
                </div>
                <div style={{ fontSize: 12 }}>
                  <span style={{ color: "#9CA3AF" }}>Cases: </span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{type.stats.total}</span>
                </div>
              </div>

              {type.docs.length > 0 && (
                <div style={{ background: "#F8FAFF", borderRadius: 10, padding: "10px 12px", marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" as const, marginBottom: 8 }}>Mandatory Documents</div>
                  {type.docs.slice(0, 3).map((doc, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: type.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#374151" }}>{doc.name}</span>
                    </div>
                  ))}
                  {type.docs.length > 3 && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>+{type.docs.length - 3} more</div>}
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openModal(type, "Documents")} style={{ flex: 1, padding: "8px", borderRadius: 9, border: "1.5px solid #E8EDF5", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                  Configure
                </button>
                <button onClick={() => openModal(type, "Overview")} style={{ flex: 1, padding: "8px", borderRadius: 9, border: "none", background: type.bg, color: type.color, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Edit Type
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Category card */}
        <div onClick={() => setShowCreate(true)}
          style={{ background: "#fff", borderRadius: 16, border: "2px dashed #D1D5DB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", cursor: "pointer", gap: 10 }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#4F8EF7")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#D1D5DB")}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#4F8EF7" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Create New Category</div>
          <div style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center" }}>Define a new valuation category and configure checklists.</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#D1D5DB" }}>
        <span>ZaVolt Admin v2.4.0 • Uptime: 99.98% • DB Latency: 12ms</span>
        <span>© 2026 ZaVolt Valuation Management Systems. All rights reserved.</span>
      </div>

      {/* ── Config / Edit Modal ── */}
      {selectedType && (
        <>
          <div onClick={() => setSelectedType(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 720, maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: 20, zIndex: 301, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>

            {/* Modal Header */}
            <div style={{ padding: "20px 28px 0", borderBottom: "1px solid #F3F4F6", position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: selectedType.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" stroke={selectedType.color} strokeWidth="2"/><path d="M8 12h8M8 8h5M8 16h3" stroke={selectedType.color} strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{selectedType.title} — Configuration</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>Manage documents and settings</div>
                  </div>
                </div>
                <button onClick={() => setSelectedType(null)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
              </div>
              <div style={{ display: "flex" }}>
                {MODAL_TABS.map(tab => (
                  <button key={tab} onClick={() => setModalTab(tab)} style={{
                    padding: "9px 20px", border: "none", background: "transparent", cursor: "pointer",
                    fontSize: 13, fontWeight: modalTab === tab ? 600 : 400,
                    color: modalTab === tab ? "#4F8EF7" : "#6B7280",
                    borderBottom: modalTab === tab ? "2px solid #4F8EF7" : "2px solid transparent",
                  }}>{tab}</button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px 28px" }}>

              {/* ── Documents Tab ── */}
              {modalTab === "Documents" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                      Mandatory Documents
                      <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 8px", borderRadius: 20 }}>{selectedType.docs.length}</span>
                    </div>
                    <button onClick={() => setShowAddDoc(!showAddDoc)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: showAddDoc ? "#F3F4F6" : "linear-gradient(135deg,#4F8EF7,#2563EB)", color: showAddDoc ? "#374151" : "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {showAddDoc ? "✕ Cancel" : "+ Add Document"}
                    </button>
                  </div>

                  {/* Add document inline form */}
                  {showAddDoc && (
                    <div style={{ background: "#F8FAFF", border: "1.5px solid #DBEAFE", borderRadius: 12, padding: "16px 18px", marginBottom: 18 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1D4ED8", marginBottom: 12 }}>New Document</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, alignItems: "flex-end" }}>
                        <div>
                          <label style={labelStyle}>Document Name</label>
                          <input value={newDocName} onChange={e => setNewDocName(e.target.value)} placeholder="e.g. Survey Plan" style={inputStyle} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <label style={labelStyle}>Required</label>
                          <div onClick={() => setNewDocReq(!newDocReq)} style={{ width: 36, height: 20, borderRadius: 10, cursor: "pointer", background: newDocReq ? "#4F8EF7" : "#D1D5DB", position: "relative", margin: "0 auto" }}>
                            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: newDocReq ? 19 : 3, transition: "left 0.15s" }} />
                          </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <label style={labelStyle}>Validate GIS</label>
                          <div onClick={() => setNewDocVal(!newDocVal)} style={{ width: 36, height: 20, borderRadius: 10, cursor: "pointer", background: newDocVal ? "#10B981" : "#D1D5DB", position: "relative", margin: "0 auto" }}>
                            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: newDocVal ? 19 : 3, transition: "left 0.15s" }} />
                          </div>
                        </div>
                        <button onClick={handleAddDoc} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#10B981,#059669)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const }}>
                          ✓ Add
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Documents table */}
                  {selectedType.docs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px", color: "#9CA3AF", background: "#F9FAFB", borderRadius: 12 }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>No documents yet</div>
                      <div style={{ fontSize: 12, marginTop: 4 }}>Click "+ Add Document" to add required documents.</div>
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
                      <thead>
                        <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
                          {["Document Name","Required","Validate (GIS)","Sort Order","Actions"].map(h => (
                            <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedType.docs.map((doc, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid #F9FAFB" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#FAFBFF")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <td style={{ padding: "12px", fontSize: 13, color: "#111827" }}>{doc.name}</td>
                            <td style={{ padding: "12px" }}>
                              <div onClick={() => toggleDoc(i, "required")} style={{ width: 20, height: 20, borderRadius: 5, background: doc.required ? "#4F8EF7" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: doc.required ? "none" : "1.5px solid #D1D5DB" }}>
                                {doc.required && <svg width="11" height="11" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                            </td>
                            <td style={{ padding: "12px" }}>
                              <div onClick={() => toggleDoc(i, "validate")} style={{ width: 36, height: 20, borderRadius: 10, cursor: "pointer", background: doc.validate ? "#10B981" : "#D1D5DB", position: "relative", transition: "background 0.15s" }}>
                                <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: doc.validate ? 19 : 3, transition: "left 0.15s" }} />
                              </div>
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, color: "#374151" }}>{i + 1}</td>
                            <td style={{ padding: "12px" }}>
                              <button onClick={() => handleDeleteDoc(i)} style={{ width: 26, height: 26, borderRadius: 6, border: "1.5px solid #FEE2E2", background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF4444" }}>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Fields Preview */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Fields Configuration (Preview)</div>
                    <button style={{ fontSize: 12, color: "#4F8EF7", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>Manage All Fields →</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {["Property Details","Legal Information","Property Address","Plan Number","GPS Coordinates","Lot Number"].map((field, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F9FAFB", borderRadius: 8, padding: "10px 14px", border: "1px solid #E8EDF5" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedType.color }} />
                          <span style={{ fontSize: 12, color: "#374151" }}>{field}</span>
                        </div>
                        <span style={{ fontSize: 10, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 7px", borderRadius: 10 }}>CONFIG</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Overview / Edit Tab ── */}
              {modalTab === "Overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {editSaved && (
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#10B981", fontWeight: 600 }}>
                      ✓ Changes saved successfully!
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Type Name</label>
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Category</label>
                      <select value={editCat} onChange={e => setEditCat(e.target.value)} style={inputStyle}>
                        {["Residential","Commercial","Industrial","Agricultural"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Description</label>
                    <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Average Turnaround</label>
                    <input value={editDays} onChange={e => setEditDays(e.target.value)} placeholder="e.g. 4-5 Days" style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F9FAFB", borderRadius: 10, padding: "12px 16px", border: "1px solid #E8EDF5" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Active Status</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>Enable or disable this valuation type</div>
                    </div>
                    <div onClick={() => setEditActive(!editActive)} style={{ width: 40, height: 22, borderRadius: 11, background: editActive ? "#10B981" : "#D1D5DB", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: editActive ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setDeleteConfirm(selectedType)} style={{ padding: "9px 16px", borderRadius: 10, border: "1.5px solid #FEE2E2", background: "#FEF2F2", color: "#EF4444", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                🗑 Delete Type
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setSelectedType(null)} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Close</button>
                {modalTab === "Overview" && (
                  <button onClick={handleSaveOverview} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    ✓ Save Changes
                  </button>
                )}
                {modalTab === "Documents" && (
                  <button style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    ✓ Save Configuration
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Create New Type Modal ── */}
      {showCreate && (
        <>
          <div onClick={() => setShowCreate(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 480, background: "#fff", borderRadius: 20, zIndex: 301, boxShadow: "0 24px 60px rgba(0,0,0,0.18)", padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Create New Category</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Define a new valuation type and configure its settings</div>
              </div>
              <button onClick={() => setShowCreate(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Type Name *</label>
                  <input value={newTypeName} onChange={e => setNewTypeName(e.target.value)} placeholder="e.g. Heritage Property" style={{ ...inputStyle, border: !newTypeName.trim() ? "1.5px solid #FECACA" : "1.5px solid #E5E7EB" }} />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={newTypeCat} onChange={e => setNewTypeCat(e.target.value)} style={inputStyle}>
                    {["Residential","Commercial","Industrial","Agricultural"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={newTypeDesc} onChange={e => setNewTypeDesc(e.target.value)} placeholder="Describe this valuation type…" rows={3} style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }} />
              </div>
              <div>
                <label style={labelStyle}>Average Turnaround</label>
                <input value={newTypeDays} onChange={e => setNewTypeDays(e.target.value)} placeholder="e.g. 4-5 Days" style={inputStyle} />
              </div>
              <div style={{ background: "#F8FAFF", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#6B7280", border: "1px solid #E8EDF5" }}>
                💡 You can add documents after creating the type by clicking <strong>Configure</strong>.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setShowCreate(false)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={() => handleCreate(true)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#F59E0B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Save as Draft
              </button>
              <button onClick={() => handleCreate(false)} disabled={!newTypeName.trim()} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: newTypeName.trim() ? "linear-gradient(135deg,#4F8EF7,#2563EB)" : "#D1D5DB", color: "#fff", fontSize: 13, fontWeight: 600, cursor: newTypeName.trim() ? "pointer" : "not-allowed" }}>
                Create & Activate
              </button>
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
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 22 }}>This action cannot be undone. All documents and configuration for this type will be permanently removed.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDeleteType} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "none", background: "#EF4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}