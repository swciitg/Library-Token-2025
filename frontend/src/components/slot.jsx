import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";
import "./shelf.css";
import { changeDb } from "../hooks/allotAndChange.js";

function Shelfs() {
  const navigate = useNavigate();
  const { showSlot, status, setShowSlot, setStatus, rollNumber } = useSlot();

  const newEntry = async () => {
    await changeDb(rollNumber, showSlot);
    console.log(`${rollNumber} , ${showSlot}`);
    setShowSlot("");
    setStatus("");
    navigate("/");
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        newEntry();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="rounded-xl border-4 border-green-500 bg-white shadow-xl p-10 w-96 text-center space-y-4">
        <p className="text-gray-800 text-3xl font-semibold mb-4">Slot Number</p>
        <div
          className={`p-6 text-4xl rounded-3xl text-black transition-all duration-500`}
        >
          {showSlot || "--"}
        </div>

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
