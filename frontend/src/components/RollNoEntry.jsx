import { useState } from "react";
import { getSlotId } from "../hooks/getSlotId";
import { allotSlot } from "../hooks/allotAndChange.js";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";
import Loader from "./Loader.jsx";
import QRscan from "../images/QR-scan.png";

export default function RollEntry() {
  const [rollNo, setRollNo] = useState("");
  const [slotInfo, setSlotInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const { setShowSlot, setStatus, setRollNumber } = useSlot();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedRoll = rollNo;
    setStatus("Processing...");
    setSlotInfo("");
    setLoading(true);

    try {
      const data = await allotSlot(submittedRoll);

      if (data.error) {
        setStatus(data.error);
        setSlotInfo("");
        setShowSlot("");
        setLoading(false);
        return;
      }

      setStatus(data.message);

      if (data.checkin_slot) {
        setSlotInfo(`Slot allotted: ${data.checkin_slot}`);
        setShowSlot(data.checkin_slot);
        setStatus(data.status);
        setRollNo("");
      } else if (data.checkout_slot) {
        setSlotInfo(`Slot released: ${data.checkout_slot}`);
        setShowSlot(data.checkout_slot);
        setRollNo("");
        setStatus(data.status);
      } else {
        setSlotInfo("");
        setShowSlot("");
      }

      setRollNumber(submittedRoll);

      setLoading(false);
      navigate("/slot");
    } catch (err) {
      console.error(err);
      setStatus(err?.message || "Network error!");
      setSlotInfo("");
      setShowSlot("");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Full-screen overlay loader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg space-y-6 w-80"
        >
          <label htmlFor="roll" className="text-lg font-semibold">
            Scan the QR code
          </label>
          <img src={QRscan} alt="QR Code" className="w-64 h-64" />
          <input
            id="roll"
            type="number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            placeholder="Enter your roll number"
            autoFocus
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 sr-only"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md w-full transition sr-only"
          >
            Get Slot
          </button>
        </form>
        {slotInfo && (
          <p className="mt-4 text-center text-gray-700">{slotInfo}</p>
        )}
      </div>
    </>
  );
}
