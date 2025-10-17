import React from 'react'
import SWClogo from '../images/logo.png';

export const Footer = () => {
  return (
          <div className="flex mt-6 mb-6 justify-between mx-4 items-center">
    
                <div
                  className="bg-gray-200 rounded-lg px-4 py-2 flex items-center justify-center space-x-2"
                  id="footer-box"
                >
                  <img src={SWClogo} alt="SWC Logo" className="h-6" />
                  <span className="text-sm font-semibold">Students' Web Committee</span>
                </div>
    
                <div
                    className="text-center text-md text-gray-900 mt-1"
                    style={{ width: "fit-content" }}
                >
                @2025 All Rights Reserved
                </div>
          </div>
  )
}
