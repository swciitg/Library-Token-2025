import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/swc-logo.png";

export const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/test/library/admin/login";
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT SIDE */}
      <img
        src={logo}
        alt="SWC Library Token"
        onClick={() => navigate("/")}
        className="h-10 cursor-pointer"
      />

      {/* CENTER NAV */}
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

      {/* RIGHT SIDE */}
      <button
        onClick={handleLogout}
        className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:text-red-500 hover:border-red-200 transition font-medium"
      >
        Logout
      </button>
    </nav>
  );
};
