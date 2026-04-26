import { LayoutDashboard, FolderOpen, FileText, File, Clock, Settings, LogOut } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: FolderOpen, label: "Assigned Projects", active: true },
    { icon: FileText, label: "Reports" },
    { icon: File, label: "Documents" },
    { icon: Clock, label: "Attendance" },
  ];

  return (
    <aside className="w-56 min-h-screen bg-blue-50 border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-blue-600">ABC VDMS</h2>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          SJ
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Sam Jekob</p>
          <p className="text-xs text-gray-600">Technical Officer</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
              item.active
                ? "bg-blue-100 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-6 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-100 transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
