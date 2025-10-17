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

  // Helper to render slots for any shelf
  const renderSlots = (slotsArray, shelfNumber) => {
    if (shelfNumber === 1 || shelfNumber === "4A" || shelfNumber === "5A") {
      slotsArray = [...slotsArray].reverse();
    }
    return slotsArray.map((n) => (
      <div key={n} className={getSlotClass(n)}>
        {n}
      </div>
    ));
  };

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

  return (
    <div className="layout">
      {/* Display current slot and status */}
      <div className="current-status">
        <p>Roll number: {rollNumber}</p>
        <p>Selected Slot: {showSlot}</p>
        <p>Status: {status}</p>
        <button onClick={newEntry}>Done</button>
      </div>

      <div className="wall">
        <div className="shelf block">
          <div className="label">Shelf 2 (85-140)</div>
          <div className="slots wide">{renderSlots(shelfStructure[2])}</div>
        </div>
      </div>

      <div className="aisle">
        <div className="shelf block">
          <div className="label">Shelf 1 (1-84)</div>
          <div className="slots">{renderSlots(shelfStructure[1], 1)}</div>
        </div>

        <div className="pair">
          <div className="shelf block">
            <div className="label">Shelf 5-B (495-585)</div>
            <div className="slots">{renderSlots(shelfStructure[5].B)}</div>
          </div>
          <div className="shelf block">
            <div className="label">Shelf 5-A (405-494)</div>
            <div className="slots">
              {renderSlots(shelfStructure[5].A, "5A")}
            </div>
          </div>
        </div>

        <div className="pair">
          <div className="shelf block">
            <div className="label">Shelf 4-B (315-404)</div>
            <div className="slots">{renderSlots(shelfStructure[4].B)}</div>
          </div>
          <div className="shelf block">
            <div className="label">Shelf 4-A (225-314)</div>
            <div className="slots">
              {renderSlots(shelfStructure[4].A, "4A")}
            </div>
          </div>
        </div>

        <div className="shelf block">
          <div className="label">Shelf 3 (141-224)</div>
          <div className="slots">{renderSlots(shelfStructure[3])}</div>
        </div>
      </div>

      <div className="entry">Entry</div>
    </div>
  );
}

export default Shelfs;
