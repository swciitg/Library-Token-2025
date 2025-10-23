import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import toast, { Toaster } from "react-hot-toast";
import { allotSlot } from "../hooks/allotAndChange.js";
import { useSlot } from "../context/SlotContext.js";
import QRscan from "../images/QR-scan.png";

function RollEntry() {
  const [rollNo, setRollNo] = useState("");
  const [slotInfo, setSlotInfo] = useState("");
  const { setShowSlot, setStatus, setRollNumber } = useSlot();
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("Processing...");
      setSlotInfo("");

      const data = await allotSlot(rollNo);

      if (data.error) {
        setStatus(data.error);
        setSlotInfo("");
        setShowSlot("");
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

      setRollNumber(rollNo);
      navigate("/slot", { state: data });
    } catch (error) {
        throw toast.error(`Something went wrong: ${error.message}`, { duration: 4000 });
      }

  };

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      {/* Toaster for top-right notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg space-y-4 w-80"
      >
        <label htmlFor="roll" className="text-2xl font-bold">
          Scan the QR Code
        </label>
        <img src={QRscan} alt="QR Code" className="w-64 h-64" />

        <input
          id="roll"
          type="number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter your roll number"
          autoFocus
          className="absolute opacity-0 pointer-events-none"
        />

        {/* <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md w-full transition"
        >
          Get Slot
        </button> */}
      </form>

      {slotInfo && (
        <p className="mt-4 text-center text-gray-700">{slotInfo}</p>
      )}
    </div>
  );
}

// Wrap with ErrorBoundary using toast notifications
export default function RollEntryWithBoundary() {
  return (
    <ErrorBoundary
      fallbackRender={() => null} // Don't block the UI
      onError={(error, info) => {
        // Show non-blocking toast
        toast.error(`Something went wrong: ${error.message}`, {
          duration: 4000,
        });
        console.error(error, info);
      }}
    >
      <RollEntry />
    </ErrorBoundary>
  );
}
