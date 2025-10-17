import React, { useEffect } from "react";
import "./shelf.css";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";

function Shelfs() {
  const navigate = useNavigate();
  const { showSlot, status, setShowSlot, setStatus, rollNumber } = useSlot();

  const shelfStructure = {
    1: Array.from({ length: 84 }, (_, i) => i + 1),
    2: Array.from({ length: 56 }, (_, i) => i + 85),
    3: Array.from({ length: 84 }, (_, i) => i + 141),
    4: {
      A: Array.from({ length: 90 }, (_, i) => i + 225),
      B: Array.from({ length: 90 }, (_, i) => i + 315),
    },
    5: {
      A: Array.from({ length: 90 }, (_, i) => i + 405),
      B: Array.from({ length: 90 }, (_, i) => i + 495),
    },
  };

  const getSlotClass = (slotNumber) => {
    if (Number(showSlot) === Number(slotNumber)) {
      if (status === "checkin") return "slot highlight checkin";
      if (status === "checkout") return "slot highlight checkout";
    }
    return "slot";
  };

  const renderSlots = (slotsArray, shelfNumber) => {
    if (shelfNumber === 1 || shelfNumber === "4A" || shelfNumber === "5A") {
      slotsArray = [...slotsArray].reverse();
    }
    return slotsArray.map((n) => (
      <div
        key={n}
        className={getSlotClass(n)}
        data-slot={n} // <-- add a data attribute
        id={`slot-${n}`} // <-- optional id
      >
        {n}
      </div>
    ));
  };

  useEffect(() => {
    if (!showSlot) return;
    
    const selector = `[data-slot="${showSlot}"]`;
    let el =
      document.querySelector(selector) ||
      document.querySelector(`[data-slot="${Number(showSlot)}"]`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [showSlot]);
  
  const newEntry = () => {
    setShowSlot("");
    setStatus("");
    navigate("/");
  };
  // press enter to go newEntry
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

  const statusBorderClass =
    status === "checkin" ? "bg-green-500 , border-4" : status === "checkout" ? "bg-red-500" : "border-indigo-100";

  return (
    <div className="layout pt-36 pr-80 px-4">
      {/* Display current slot and status */}
      <div className={`current-status fixed right-8  w-72 rounded-xl border  bg-white/95 backdrop-blur shadow-xl p-5 space-y-2 z-50 text-base text-gray-800`}>
        {/* <p className="font-semibold">Roll number: {rollNumber}</p> */}
        <p className="font-semibold flex-col"><p className="mb-2">Slot No:</p> <div className={`${statusBorderClass} p-10 text-4xl rounded-xl text-white `}>{showSlot}</div></p>
        {/* <p className="font-semibold">Status: {status}</p> */}
        <button onClick={newEntry} className="mt-3 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Done
        </button>
      </div>

      <div className="wall"> 
        <div className="shelf block">
          <div className="label ">Shelf 2 (85-140)</div>
          <div className="slots wide">{renderSlots(shelfStructure[2])}</div>
        </div>
      </div>

      <div className="aisle">
        <div className="shelf block">
          <div className="label sticky">Shelf 1 (1-84)</div>
          <div className="slots">{renderSlots(shelfStructure[1], 1)}</div>
        </div>

        <div className="pair">
          <div className="shelf block">
              <div className="label sticky">Shelf 5-B (495-585)</div>
            <div className="slots">{renderSlots(shelfStructure[5].B)}</div>
          </div>
          <div className="shelf block">
            <div className="label sticky">Shelf 5-A (405-494)</div>
            <div className="slots">
              {renderSlots(shelfStructure[5].A, "5A")}
            </div>
          </div>
        </div>

        <div className="pair">
          <div className="shelf block">
            <div className="label sticky">Shelf 4-B (315-404)</div>
            <div className="slots">{renderSlots(shelfStructure[4].B)}</div>
          </div>
          <div className="shelf block">
            <div className="label sticky">Shelf 4-A (225-314)</div>
            <div className="slots">
              {renderSlots(shelfStructure[4].A, "4A")}
            </div>
          </div>
        </div>

        <div className="shelf block">
          <div className="label sticky">Shelf 3 (141-224)</div>
          <div className="slots">{renderSlots(shelfStructure[3])}</div>
        </div>
      </div>

      <div className="entry">Entry</div>
    </div>
  );
}

export default Shelfs;
