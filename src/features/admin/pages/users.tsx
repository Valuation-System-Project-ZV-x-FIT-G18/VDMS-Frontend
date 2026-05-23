import { useState, useRef, useEffect } from "react";
import userService from "../../../services/userService";
import type { User, CreateUserDto } from "../../../services/userService";

const AVATAR_COLORS = ["#4F8EF7","#10B981","#8B5CF6","#F59E0B","#EC4899","#14B8A6","#F97316","#6366F1","#EF4444","#06B6D4"];

const ROLE_DISPLAY_MAP: Record<string, string> = {
  "admin": "Admin",
  "bank": "Bank Officer",
  "owner": "Property Owner",
  "coordinator": "Coordinator",
  "technical-officer": "Technical Officer",
  "l3-manager": "L3 Manager",
  "l2-manager": "L2 Manager",
  "l1-manager": "L1 Manager",
  "senior-valuator": "Senior Valuator",
};
// List of all possible roles in the system with label and value for dropdowns
const ROLES_LIST = [
  { label: "Admin", value: "admin" },
  { label: "Senior Valuator", value: "senior-valuator" },
  { label: "L1 Manager", value: "l1-manager" },
  { label: "L2 Manager", value: "l2-manager" },
  { label: "L3 Manager", value: "l3-manager" },
  { label: "Coordinator", value: "coordinator" },
  { label: "Technical Officer", value: "technical-officer" },
  { label: "Bank Officer", value: "bank" },
  { label: "Property Owner", value: "owner" },
];

const DEPARTMENTS = ["Operations","Valuation","Quality Assurance","Logistics","Management","IT & Systems","Compliance","Field Operations"];

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  "admin":             { bg: "#EFF6FF", color: "#2563EB" },
  "senior-valuator":   { bg: "#F0FDF4", color: "#059669" },
  "l1-manager":        { bg: "#FEF3C7", color: "#D97706" },
  "l2-manager":        { bg: "#ECFDF5", color: "#10B981" },
  "l3-manager":        { bg: "#FDF2F8", color: "#BE185D" },
  "coordinator":       { bg: "#FEF2F2", color: "#DC2626" },
  "technical-officer": { bg: "#EFF6FF", color: "#2563EB" },
  "bank":              { bg: "#F0F9FF", color: "#0284C7" },
};

const getInitials = (first: string, last: string) =>
  `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

const EMPTY_FORM = {
  firstName: "", lastName: "", email: "", phone: "", nic: "",
  role: "", department: "", employeeId: "ZV-0000", manager: "", photo: "", password: "",
};

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "9px 12px",
  borderRadius: 8, border: "1.5px solid #E5E7EB",
  fontSize: 13, color: "#111827", outline: "none", background: "#fff",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: "#6B7280",
  display: "block", marginBottom: 5,
};
// Main users management page for admin panel, with user list, search/filter, add/edit/delete functionality
export default function UsersPage() {
  const [users, setUsers]               = useState<User[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterRole, setFilterRole]     = useState("All Roles");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [showModal, setShowModal]       = useState(false);
  const [editUser, setEditUser]         = useState<User | null>(null);
  const [deleteUser, setDeleteUser]     = useState<User | null>(null);
  const [actionMenu, setActionMenu]     = useState<string | null>(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formError, setFormError]       = useState("");
  const [error, setError]               = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to fetch users", err);
      setError(err?.response?.data?.message || err?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const f = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = filterRole   === "All Roles"   || u.role === filterRole;
    // Status is not explicitly in the backend User entity yet, but we'll default it to true
    const status = u.status ?? true;
    const matchStatus = filterStatus === "All Status"  || (filterStatus === "Active" ? status : !status);
    return matchSearch && matchRole && matchStatus;
  });

  const activeCount = users.filter(u => u.status ?? true).length;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => f("photo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({
      ...EMPTY_FORM,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      department: user.department || "",
      photo: user.photo || "",
    });
    setFormError("");
    setShowModal(true);
    setActionMenu(null);
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.email.trim() || !form.role || (!editUser && !form.password)) {
      setFormError("First name, email, role, and password are required."); return;
    }
//      if (form.password && form.password.length < 6) {
    try {
      if (editUser) {
        const updateDto: Partial<CreateUserDto> = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          role: form.role,
          phone: form.phone,
          department: form.department,
        };
        await userService.updateUser(editUser.id, updateDto);
      } else {
        const createDto: CreateUserDto = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          phone: form.phone,
          department: form.department,
        };
        await userService.createUser(createDto);
      }
      fetchUsers();
      setShowModal(false);
      setForm(EMPTY_FORM);
      setFormError("");
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to save user.");
    }
  };
//      setFormError("Password must be at least 6 characters long."); return;
  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      await userService.deleteUser(deleteUser.id);
      fetchUsers();
      setDeleteUser(null);
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };
//       if (!window.confirm(`Are you sure you want to delete user ${deleteUser.firstName} ${deleteUser.lastName}? This action cannot be undone.`)) {
  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#F0F4FF", minHeight: "100vh", padding: 24 }}
      onClick={() => setActionMenu(null)}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
        <span style={{ cursor: "pointer", color: "#4F8EF7" }}>Dashboard</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span style={{ cursor: "pointer", color: "#4F8EF7" }}>Users &amp; Roles</span>
        <span style={{ margin: "0 6px" }}>/</span>
        <span>All Users</span>
      </div>

      {/* Title + Add button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#111827" }}>All Users</h1>
        <button onClick={openAdd} style={{ padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(79,142,247,0.35)", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
          Add New User
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Users",  value: users.length,  color: "#111827" },
          { label: "Active Today", value: activeCount,   color: "#10B981" },
          { label: "Pending",      value: 0,             color: "#F59E0B" },
          { label: "Roles",        value: ROLES_LIST.length, color: "#6366F1" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 22px", border: "1px solid #E8EDF5" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{loading ? "..." : c.value}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: "14px 18px", borderRadius: 14, background: "#FEF3F2", border: "1px solid #FECACA", color: "#B91C1C", fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Table card */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8EDF5", overflow: "visible" }}>

        {/* Toolbar */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F9FAFB", borderRadius: 9, padding: "8px 12px", border: "1px solid #E8EDF5", flex: 1, minWidth: 220 }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#374151", width: "100%" }} />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ padding: "8px 12px", borderRadius: 9, border: "1.5px solid #E8EDF5", fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer" }}>
            <option>All Roles</option>
            {ROLES_LIST.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "8px 12px", borderRadius: 9, border: "1.5px solid #E8EDF5", fontSize: 12, color: "#374151", background: "#fff", cursor: "pointer" }}>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F3F4F6", background: "#FAFBFF" }}>
                <th style={{ width: 36, padding: "11px 16px" }}><input type="checkbox" style={{ cursor: "pointer" }} /></th>
                {["User","Role","Status","Actions"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "11px 14px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" as const, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: 13 }}>Loading users...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: 13 }}>No users found.</td></tr>
              ) : filtered.map((user, i) => {
                const rs = ROLE_STYLES[user.role] ?? { bg: "#F3F4F6", color: "#374151" };
                const initials = getInitials(user.firstName, user.lastName);
                const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const status = user.status ?? true;
                
                return (
                  <tr key={user.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid #F9FAFB" : "none", transition: "background 0.1s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#FAFBFF")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "12px 16px" }}><input type="checkbox" style={{ cursor: "pointer" }} /></td>

                    {/* User */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {user.photo ? (
                          <img src={user.photo} alt={user.firstName} style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}22`, color: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                            {initials}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{user.firstName} {user.lastName}</div>
                          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: rs.bg, color: rs.color, textTransform: "uppercase" as const, letterSpacing: "0.3px" }}>
                        {ROLE_DISPLAY_MAP[user.role] || user.role}
                      </span>
                    </td>

                    {/* Status toggle */}
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ width: 40, height: 22, borderRadius: 11, cursor: "pointer", background: status ? "#10B981" : "#D1D5DB", position: "relative", transition: "background 0.2s" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: status ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "12px 14px", position: "relative" }}>
                      <button
                        onClick={e => { e.stopPropagation(); setActionMenu(actionMenu === user.id ? null : user.id); }}
                        style={{ width: 30, height: 30, borderRadius: 7, border: "1.5px solid #E8EDF5", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                      </button>

                      {/* Dropdown */}
                      {actionMenu === user.id && (
                        <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 44, right: 12, width: 150, background: "#fff", borderRadius: 12, border: "1px solid #E8EDF5", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 999, overflow: "hidden" }}>
                           <button onClick={() => openEdit(user)} style={{ width: "100%", padding: "11px 16px", border: "none", background: "transparent", textAlign: "left", fontSize: 13, color: "#374151", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, fontWeight: 500 }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/></svg>
                            Edit User
                          </button>
                          <div style={{ height: 1, background: "#F3F4F6" }} />
                          <button onClick={() => { setDeleteUser(user); setActionMenu(null); }} style={{ width: "100%", padding: "11px 16px", border: "none", background: "transparent", textAlign: "left", fontSize: 13, color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, fontWeight: 500 }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#FEF2F2")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
                            Delete User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Showing {filtered.length} of {users.length} results</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[1].map(p => (
              <button key={p} style={{ width: 30, height: 30, borderRadius: 7, border: `1.5px solid ${p === 1 ? "#4F8EF7" : "#E8EDF5"}`, background: p === 1 ? "#EFF6FF" : "#fff", color: p === 1 ? "#4F8EF7" : "#374151", fontSize: 12, fontWeight: p === 1 ? 700 : 400, cursor: "pointer" }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 620, maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: 20, zIndex: 301, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>

            {/* Modal Header */}
            <div style={{ padding: "22px 28px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>{editUser ? "Edit User" : "Add New User"}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>
                  {editUser ? "Update user account details." : "Create a new user account and assign system roles."}
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E8EDF5", background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#6B7280" }}>✕</button>
            </div>

            <div style={{ padding: "22px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
              {formError && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#EF4444" }}>{formError}</div>}

              {/* Personal Information */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="#4F8EF7" strokeWidth="2"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="#4F8EF7" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Personal Information</span>
                </div>

                <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                  {/* Photo upload */}
                  <div>
                    <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                    <div onClick={() => photoRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 14, border: "2px dashed #D1D5DB", background: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, overflow: "hidden", position: "relative" }}>
                      {form.photo ? (
                        <>
                          <img src={form.photo} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                            onMouseLeave={e => (e.currentTarget.style.opacity = "0")}>
                            <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>CHANGE</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span style={{ fontSize: 9, color: "#9CA3AF", marginTop: 5, fontWeight: 600 }}>UPLOAD</span>
                          <span style={{ fontSize: 8, color: "#D1D5DB", marginTop: 2 }}>JPG, PNG</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>First Name</label>
                        <input value={form.firstName} onChange={e => f("firstName", e.target.value)} placeholder="e.g. John" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Last Name</label>
                        <input value={form.lastName} onChange={e => f("lastName", e.target.value)} placeholder="e.g. Doe" style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Email Address</label>
                        <input value={form.email} onChange={e => f("email", e.target.value)} placeholder="john.doe@zavolt.com" style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone Number</label>
                        <input value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="+1 (555) 000-0000" style={inputStyle} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Password (Temporary Auth)</label>
                        <input value={form.password} onChange={e => f("password", e.target.value)} placeholder="Enter password..." type="password" style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>NIC / National ID</label>
                  <input value={form.nic} onChange={e => f("nic", e.target.value)} placeholder="9xxxxxxxxV" style={{ ...inputStyle, maxWidth: "48%" }} />
                </div>
              </div>

              {/* Account Details */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#10B981" strokeWidth="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#10B981" strokeWidth="2"/></svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Account Details</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>User Role</label>
                    <select value={form.role} onChange={e => f("role", e.target.value)} style={inputStyle}>
                      <option value="">Select Role</option>
                      {ROLES_LIST.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Department</label>
                    <select value={form.department} onChange={e => f("department", e.target.value)} style={inputStyle}>
                      <option value="">Select Department</option>
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Employee ID</label>
                    <input value={form.employeeId} onChange={e => f("employeeId", e.target.value)} placeholder="ZV-0000" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Reporting Manager</label>
                    <select value={form.manager} onChange={e => f("manager", e.target.value)} style={inputStyle}>
                      <option value="">Select Manager</option>
                      {users.slice(0, 4).map(u => <option key={u.id}>{u.firstName} {u.lastName}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Authentication */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#8B5CF6" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Authentication</span>
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px", border: "1px solid #E8EDF5", fontSize: 12, color: "#6B7280" }}>
                  A temporary password will be generated and sent to the user's email address upon account creation.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 28px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "9px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#4F8EF7,#2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(79,142,247,0.3)" }}>
                {editUser ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteUser && (
        <>
          <div onClick={() => setDeleteUser(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 380, background: "#fff", borderRadius: 18, zIndex: 301, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "28px 32px", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Delete {deleteUser.firstName}?</div>
            <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 22 }}>This action cannot be undone. The user record will be permanently removed.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteUser(null)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1.5px solid #D1D5DB", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "none", background: "#EF4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}