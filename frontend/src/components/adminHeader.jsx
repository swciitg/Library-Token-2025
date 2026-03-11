import React from "react";
import logo from "../images/swc-logo.png";

export const AdminHeader = () => {
  
  return (
    <div>
      <div className="relative flex items-center px-6 py-4 border-b border-gray-300">
        <img
          src={logo}
          alt="SWC Library Token"
          className=" h-10 cursor-pointer"
        />
      </div>
    </div>
  );
};
