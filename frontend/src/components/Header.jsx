import React from 'react'
import logo from '../images/swc-logo.png';

export const Header = () => {
  return (
   
    <div>
          <div className="relative flex items-center px-6 py-4 border-b border-gray-300">
                <img onClick={()=>window.open("https://swc.iitg.ac.in","")} src={logo} alt="SWC Library Token" className=" h-10 cursor-pointer" />
            {/* <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold font-sans tracking-tight">
                SWC Library Token
            </h1> */}
            <button className="absolute right-6 bg-red-600 text-bold text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                Logout
            </button>

          </div>
    </div>
  );
}
