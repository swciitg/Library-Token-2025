import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";
import { allSlot } from "../hooks/allotAndChange.js";
import axios from "axios";
import "./shelf.css";


const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AdminShelfs() {
  const navigate = useNavigate();
  const { showSlot, status, setShowSlot, setStatus } = useSlot();
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  const [popup, setPopup] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

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

  // ── Fetch slots (extracted to reuse after block/unblock) ─────
  const fetchSlots = async () => {
    try {
      const data = await allSlot();
      if (!Array.isArray(data)) throw new Error("Invalid slot data format");
      setSlots(data);
    } catch (err) {
      setError(err.message || "Failed to fetch slots");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const slotById = useMemo(() => {
    const m = new Map();
    slots.forEach((s) => {
      if (s && typeof s.id !== "undefined") m.set(Number(s.id), s);
    });
    return m;
  }, [slots]);

  // ── Get slot data ────────────────────────────────────────────
  // isBlocked: true                        → grey  (blocked)
  // isBlocked: false, isEmpty: false       → red   (occupied)
  // isBlocked: false, isEmpty: true        → white (empty)
  const getSlotData = (slotNumber) => {
    const slotData = slotById.get(Number(slotNumber));
    if (!slotData) return { isBlocked: false, isEmpty: true };
    return { isBlocked: slotData.isBlocked, isEmpty: slotData.isEmpty };
  };

  // ── CSS class per status ─────────────────────────────────────
  const getSlotClass = (slotNumber) => {
    if (Number(showSlot) === Number(slotNumber)) {
      if (status === "slot-allot") return "slot highlight checkin";
      if (status === "checkout")   return "slot highlight checkout";
    }
    const { isBlocked, isEmpty } = getSlotData(slotNumber);
    if (isBlocked)  return "slot blocked";
    if (!isEmpty)   return "slot occupied";
    return "slot empty";
  };

  // ── Click slot → open popup ──────────────────────────────────
  const handleSlotClick = (slotNumber) => {
    setUpdateMsg("");
    const { isBlocked, isEmpty } = getSlotData(slotNumber);
    const currentStatus = isBlocked ? "blocked" : isEmpty ? "empty" : "occupied";
    setPopup({ slotNumber, currentStatus });
  };

  // ── Block slot ───────────────────────────────────────────────
  const handleBlock = async () => {
    if (!popup) return;
    setUpdating(true);
    try {
      await axios.post(
        `${BASE_URL}/admin/slot/block`,
        { slotId: popup.slotNumber },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchSlots(); // ← refetch so colors update
      setPopup((prev) => ({ ...prev, currentStatus: "blocked" }));
      setUpdateMsg(`Slot ${popup.slotNumber} blocked.`);
      setTimeout(() => { setPopup(null); setUpdateMsg(""); }, 1200);
    } catch (err) {
      setUpdateMsg("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  // ── Unblock slot → always goes to empty ─────────────────────
  const handleUnblock = async () => {
    if (!popup) return;
    setUpdating(true);
    try {
      await axios.post(
        `${BASE_URL}/admin/slot/unblock`,
        { slotId: popup.slotNumber },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await fetchSlots(); // ← refetch so colors update
      setPopup((prev) => ({ ...prev, currentStatus: "empty" }));
      setUpdateMsg(`Slot ${popup.slotNumber} unblocked.`);
      setTimeout(() => { setPopup(null); setUpdateMsg(""); }, 1200);
    } catch (err) {
      setUpdateMsg("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  // ── Render slots ─────────────────────────────────────────────
  const renderSlots = (slotsArray, shelfNumber) => {
    if (shelfNumber === 1 || shelfNumber === "4A" || shelfNumber === "5A") {
      slotsArray = [...slotsArray].reverse();
    }
    return slotsArray.map((n) => (
      <div
        key={n}
        className={getSlotClass(n)}
        data-slot={n}
        id={`slot-${n}`}
        onClick={() => handleSlotClick(n)}
        style={{ cursor: "pointer" }}
      >
        {n}
      </div>
    ));
  };

  // ── Auto-scroll ──────────────────────────────────────────────
  useEffect(() => {
    if (!showSlot) return;
    const el =
      document.querySelector(`[data-slot="${showSlot}"]`) ||
      document.querySelector(`[data-slot="${Number(showSlot)}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }, [showSlot]);

  // ── Enter key ────────────────────────────────────────────────
  const newEntry = () => { setShowSlot(""); setStatus(""); navigate("/"); };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") { e.preventDefault(); newEntry(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      

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
              <div className="slots">{renderSlots(shelfStructure[5].A, "5A")}</div>
            </div>
          </div>

          <div className="pair">
            <div className="shelf block">
              <div className="label sticky">Shelf 4-B (315-404)</div>
              <div className="slots">{renderSlots(shelfStructure[4].B)}</div>
            </div>
            <div className="shelf block">
              <div className="label sticky">Shelf 4-A (225-314)</div>
              <div className="slots">{renderSlots(shelfStructure[4].A, "4A")}</div>
            </div>
          </div>

          <div className="shelf block">
            <div className="label sticky">Shelf 3 (141-224)</div>
            <div className="slots">{renderSlots(shelfStructure[3])}</div>
          </div>
        </div>

        <div className="entry">Entry</div>
      </div>

      {/* ── Popup ── */}
      {popup && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
        }}>
          <div style={{
            background: "#fff", borderRadius: 14, padding: 24, width: 300,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center",
          }}>

            <div style={{ fontSize: 28, marginBottom: 8 }}>
              {popup.currentStatus === "blocked" ? "🔒" : popup.currentStatus === "occupied" ? "📦" : "📭"}
            </div>

            <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
              Slot {popup.slotNumber}
            </div>

            <div style={{ marginBottom: 20 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                background:
                  popup.currentStatus === "blocked"  ? "#f3f4f6" :
                  popup.currentStatus === "occupied" ? "#fef2f2" : "#f5f5f5",
                color:
                  popup.currentStatus === "blocked"  ? "#6b7280" :
                  popup.currentStatus === "occupied" ? "#ef4444" : "#64748b",
              }}>
                {popup.currentStatus.toUpperCase()}
              </span>
            </div>

            {updateMsg && (
              <div style={{
                fontSize: 12, marginBottom: 14, padding: "7px 12px", borderRadius: 8,
                background: updateMsg.startsWith("Error") ? "#fef2f2" : "#f0fdf4",
                color: updateMsg.startsWith("Error") ? "#ef4444" : "#16a34a",
                border: `1px solid ${updateMsg.startsWith("Error") ? "#fecaca" : "#bbf7d0"}`,
              }}>
                {updateMsg}
              </div>
            )}

            {/* Blocked → Unblock only */}
            {popup.currentStatus === "blocked" && (
              <>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
                  Unblocking will set this slot to <strong style={{ color: "#64748b" }}>empty</strong>.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setPopup(null)} disabled={updating} style={cancelBtn}>Cancel</button>
                  <button onClick={handleUnblock} disabled={updating} style={{ ...actionBtn, background: "#22c55e" }}>
                    {updating ? "Saving..." : "Unblock"}
                  </button>
                </div>
              </>
            )}

            {/* Empty or Occupied → Block only */}
            {popup.currentStatus !== "blocked" && (
              <>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
                  This slot will be <strong style={{ color: "#9ca3af" }}>blocked</strong> and unavailable.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setPopup(null)} disabled={updating} style={cancelBtn}>Cancel</button>
                  <button onClick={handleBlock} disabled={updating} style={{ ...actionBtn, background: "#9ca3af" }}>
                    {updating ? "Saving..." : "Block"}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}

const cancelBtn = {
  flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13,
  fontWeight: 600, border: "1px solid #e2e8f0", background: "#fff",
  color: "#64748b", cursor: "pointer",
};

const actionBtn = {
  flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13,
  fontWeight: 600, border: "none", cursor: "pointer", color: "#fff",
};

export default AdminShelfs;