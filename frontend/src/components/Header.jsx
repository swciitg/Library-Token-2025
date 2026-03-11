import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../images/swc-logo.png";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isShelfPage = location.pathname.split("/").pop() === "shelf";

  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
      {/* LEFT SIDE */}
      <img
        src={logo}
        alt="SWC Library Token"
        onClick={() => navigate("/")}
        className="h-10 cursor-pointer"
      />

      {/* RIGHT SIDE */}
      <button
        onClick={() => navigate(isShelfPage ? "/" : "/shelf")}
        className="bg-red-400 font-semibold text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
      >
        {isShelfPage ? "Home" : "Shelf"}
      </button>
    </nav>
  );
};
