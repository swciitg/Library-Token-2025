import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";
import "./shelf.css";
import { changeDb } from "../hooks/allotAndChange.js";

function Shelfs() {
  const navigate = useNavigate();
  const { showSlot, status, setShowSlot, setStatus, rollNumber } = useSlot();

  const newEntry = async () => {
    if (status === "slot-allot") await changeDb(rollNumber, showSlot);
    console.log(`${rollNumber} , ${showSlot}`);
    setShowSlot("");
    setStatus("");
    navigate("/");



    
  };
  const SlotClass = () => {
    if (status === "slot-allot")
      return "border-green-500 ring-4 ring-green-100";
    if (status === "checkout") return "border-red-500 ring-4 ring-red-100";
    return "border-gray-300"; // default class when no status
  };

  useEffect(() => {
    let inputBuffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime;

      if (timeDiff > 100) inputBuffer = "";

      if (e.key !== "Enter") {
        inputBuffer += e.key;
        lastKeyTime = currentTime;
      } else {
        if (inputBuffer.length > 4 && timeDiff < 100) {
          console.log("Barcode scan detected:", inputBuffer);
          inputBuffer = "";
          return;
        }

        e.preventDefault();
        newEntry();
        inputBuffer = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  let shelfNo = "";
  if (showSlot < 85) {
     shelfNo = "1";
  } else if (showSlot < 141) {
    shelfNo = "2";
  } else if (showSlot < 225) {
    shelfNo = "3";
  } else if (showSlot < 315) {
    shelfNo = "4-A";
  } else if (showSlot < 405) {
    shelfNo = "4-B";
  } else if (showSlot < 495) {
    shelfNo = "5-A";
  } else {
    shelfNo = "5-B";
  }

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div
        className={`${SlotClass()} rounded-xl border-4  bg-white shadow-xl p-10 w-96 text-center space-y-4`}
      >
        <div className="flex mb-5">
        {/* Slot Section */}
        <div className="w-1/2 flex flex-col items-center text-indigo-700">
          <span className="text-lg font-medium uppercase tracking-wide text-gray-500 mb-2">
            Slot
          </span>
          <span className="text-6xl font-extrabold text-indigo-600 drop-shadow-sm">
            {showSlot || "--"}
          </span>
        </div>

        {/* Shelf Section */}
        <div className="w-1/2 flex flex-col items-center text-emerald-700">
          <span className="text-lg font-medium uppercase tracking-wide text-gray-500 mb-2">
            Shelf
          </span>
          <span className="text-6xl font-extrabold text-emerald-600 drop-shadow-sm">
            {shelfNo || "--"}
          </span>
        </div></div>

        <button
          onClick={newEntry}
          className="mt-5 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default Shelfs;
