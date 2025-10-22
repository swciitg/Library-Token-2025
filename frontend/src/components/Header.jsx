import React from 'react'
import logo from '../images/swc-logo.png';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  return (
   
    <div>
      <div className="relative flex items-center px-6 py-4 border-b border-gray-300">
        <img
          onClick={() => window.open("https://swc.iitg.ac.in", "")}
          src={logo}
          alt="SWC Library Token"
          className=" h-10 cursor-pointer"
        />

                <button onClick={() => navigate("/shelf")} className="absolute right-6 bg-blue-600 text-bold text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                  Shelf
                </button>
          </div>
    </div>
  );
}
