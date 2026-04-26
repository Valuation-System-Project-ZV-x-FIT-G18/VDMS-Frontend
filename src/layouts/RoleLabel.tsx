interface Props {
  role: string;                    // current role displayed in the top bar
}

/* Shows the role name as a badge/label in the top bar */
const RoleLabel = ({ role }: Props) => (
  <span className="topbar-role">
    {role.replace(/_/g, ' ')}      {/* e.g. "technical_officer" → "technical officer" */}
  </span>
);

export default RoleLabel;
