import { useState } from "react";
import { getSlotId } from "../hooks/getSlotId";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";

export default function RollEntry() {
  const [rollNo, setRollNo] = useState("");
  const [slotInfo, setSlotInfo] = useState("");
  const { setShowSlot, setStatus, setRollNumber } = useSlot();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");
    setSlotInfo("");

    const data = await getSlotId(rollNo);

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

    navigate("/shelf");
  };

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg space-y-6 w-80"
      >
        <label htmlFor="roll" className="text-lg font-semibold">
          Enter your Roll Number:
        </label>
        <input
          id="roll"
          type="number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter your roll number"
          autoFocus
          className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md w-full transition"
        >
          Get Slot
        </button>
      </form>
      {slotInfo && <p className="mt-4 text-center text-gray-700">{slotInfo}</p>}
    </div>
    </>
  );
}
