type Role =
  | "bank"
  | "owner"
  | "admin"
  | "coordinator"
  | "technical-officer"
  | "l3-manager"
  | "l2-manager"
  | "l1-manager";

interface RoleSelectPageProps {
  onSelectRole: (role: Role) => void;
}

export default function RoleSelectPage({ onSelectRole }: RoleSelectPageProps) {
  const cardStyle: React.CSSProperties = {
    width: 460,
    padding: 20,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "white",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
    textAlign: "left",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Select Portal (Temporary)</h2>
        <p style={{ margin: 0, color: "#6b7280" }}>
          Until login is implemented, select a role to open the portal.
        </p>

        {/* ✅ Your portals */}
        <button style={btnStyle} onClick={() => onSelectRole("bank")}>
          Bank Credit Officer →
        </button>
        <button style={btnStyle} onClick={() => onSelectRole("owner")}>
          Property Owner →
        </button>
        <button style={btnStyle} onClick={() => onSelectRole("l3-manager")}>
          L3 Manager →
        </button>
        <button style={btnStyle} onClick={() => onSelectRole("l2-manager")}>
          L2 Manager →
        </button>
        <button style={btnStyle} onClick={() => onSelectRole("l1-manager")}>
          L1 Manager →
        </button>

        <hr
          style={{
            width: "100%",
            border: "none",
            borderTop: "1px solid #e5e7eb",
          }}
        />

        {/* ✅ Team portals (blank pages for now) */}
        <button style={btnStyle} onClick={() => onSelectRole("admin")}>
          Admin (blank for now) →
        </button>
        <button style={btnStyle} onClick={() => onSelectRole("coordinator")}>
          Coordinator (blank for now) →
        </button>
        <button
          style={btnStyle}
          onClick={() => onSelectRole("technical-officer")}
        >
          Technical Officer (blank for now) →
        </button>
      </div>
    </div>
  );
}
