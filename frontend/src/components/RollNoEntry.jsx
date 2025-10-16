import { useState } from "react";
import { getSlotId } from "../hooks/getSlotId";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";

export default function RollEntry() {
  const [rollNo, setRollNo] = useState("");
  // const [status, setStatus] = useState("");
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
    <div className="roll-entry">
      <form onSubmit={handleSubmit}>
        <label htmlFor="roll">Enter Roll Number:</label>
        <input
          id="roll"
          type="number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter your roll number"
          autoFocus
        />
        <button type="submit">Get Slot</button>
      </form>
      {/* <p>{status}</p> */}
      <p>{slotInfo}</p>
    </div>
  );
}
