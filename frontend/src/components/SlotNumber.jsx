import { useState, useEffect } from 'react';

function SlotCard({ rollNumber }) {
  const [loading, setLoading] = useState(true);
  const [slotNumber, setSlot] = useState(null);

  useEffect(() => {
    async function fetchSlotNumber() {
      try {
        setLoading(true);
        const randomSlot = Math.floor(Math.random() * 1000) + 1;
        setSlot(randomSlot);
      } catch (err) {
        console.error(err);
        setSlot(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSlotNumber();
  }, [rollNumber]);

  if (loading) return <h2 className="loading">Fetching slot number...</h2>;
  if (slotNumber === null) return <h2 className="error">Error fetching slot</h2>;

  return (
    <div className="slot-number">
      Slot No.: <strong>{slotNumber}</strong>
    </div>
  );
}

export default SlotCard;
