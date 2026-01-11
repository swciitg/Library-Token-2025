import React from "react";
import logo from "../images/swc-logo.png";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isShelfPage = location.pathname.split("/").pop() === "shelf";
  return (
    <div>
      <div className="relative flex items-center px-6 py-4 border-b border-gray-300">
        <img
          onClick={() => navigate("/")}
          src={logo}
          alt="SWC Library Token"
          className=" h-10 cursor-pointer"
        />

<button
      onClick={() => navigate(isShelfPage ? "/" : "/shelf")}
      className="absolute right-6 bg-red-400 font-semibold text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
    >
      {isShelfPage ? "Home" : "Shelf"}
    </button>
      </div>
    </div>
  );
};
