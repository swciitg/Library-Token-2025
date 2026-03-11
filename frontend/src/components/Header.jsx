import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/swc-logo.png";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");
  const isShelfPage = location.pathname.split("/").pop() === "shelf";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/test/library/admin/login";
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT SIDE */}
      <img
        onClick={() => navigate("/")}
        src={logo}
        alt="SWC Library Token"
        className="h-10 cursor-pointer"
      />
      {isAdmin && (
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
      )}

      {/* RIGHT SIDE */}
      {isAdmin ? (
        <button
          onClick={handleLogout}
          className="text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:text-red-500 hover:border-red-200 transition font-medium"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate(isShelfPage ? "/" : "/shelf")}
          className="bg-red-400 font-semibold text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          {isShelfPage ? "Home" : "Shelf"}
        </button>
      )}
    </nav>
  );
};
