import { NavLink } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-13 flex items-center justify-between sticky top-0 z-50">

      {/* Logo */}
      <div className="text-sm font-bold text-gray-800">Admin Panel</div>

      {/* Nav Links */}
      <div className="flex gap-1">
        {[
          { to: "/admin/dashboard", label: "Shelfs" },
          { to: "/admin/analytics", label: "Analytics" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/test/library/admin/login";
        }}
        className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:text-red-500 hover:border-red-200 transition font-medium"
      >
        ↪ Logout
      </button>

    </nav>
  );
}