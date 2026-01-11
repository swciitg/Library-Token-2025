import React, { useState, useEffect, useMemo } from "react";
import "./shelf.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";
import { allSlot } from "../hooks/allotAndChange.js";

function Shelfs() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const { showSlot, status, setShowSlot, setStatus } = useSlot();
  const [occupiedSlots, setOccupiedSlots] = useState(new Set());
  

  // 🔹 Shelf structure (kept as is)
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

 useEffect(() => {
  const fetchSlots = async () => {
    try {
      const data = await allSlot();

      if (!Array.isArray(data)) {
        throw new Error("Invalid slot data format");
      }

      setSlots(data);

      const occupied = data
        .filter((slot) => slot.isEmpty === false)
        .map((slot) => Number(slot.id));
      
      setOccupiedSlots(new Set(occupied));
      
    } catch (err) {
      setError(err.message || "Failed to fetch slots");
    }
  };

  fetchSlots();

}, []);


  const slotById = useMemo(() => {
    const m = new Map();
    slots.forEach((s) => {
      if (s && typeof s.id !== "undefined") m.set(Number(s.id), s);
    });
    return m;
  }, [slots]);

  // 🔹 Function to determine slot color
  const getSlotClass = (slotNumber) => {
  const isOccupied = occupiedSlots.has(Number(slotNumber));
  
  if (Number(showSlot) === Number(slotNumber)) {
    if (status === "slot-allot") return "slot highlight checkin";
    if (status === "checkout") return "slot highlight checkout";
  }
  
  if (isOccupied) return "slot occupied";
  
  return "slot empty";
};


  const isSlotEmpty = (slotNumber) => {
    const n = Number(slotNumber);
    const slotData = slotById.get(n);

    if (!slotData) {
      return "unknown";
    }

    return slotData.isEmpty ? "empty" : "occupied";
  };

  // 🔹 Render each shelf’s slots
  const renderSlots = (slotsArray, shelfNumber) => {
    if (shelfNumber === 1 || shelfNumber === "4A" || shelfNumber === "5A") {
      slotsArray = [...slotsArray].reverse();
    }
    return slotsArray.map((n) => (
      <div
        key={n}
        className={`${getSlotClass(n)} ${isSlotEmpty(n)}`}
        data-slot={n}
        id={`slot-${n}`}
      >
        {n}
      </div>
    ));
  };

  // 🔹 Auto-scroll to the selected slot
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

  // 🔹 “Enter” key returns to main page
  const newEntry = () => {
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

  // 🔹 Render shelves only (no top token box)
  return (
    <>
      <Header />
      <div className="layout pt-36 pr-80 px-4">
        <div className="wall">
          <div className="shelf block">
            <div className="label">Shelf 2 (85-140)</div>
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
      <Footer />
    </>
  );
}

export default Shelfs;
