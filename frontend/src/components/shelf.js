import {useState, useEffect} from 'react';
import './shelf.css';

function Shelfs(){
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
    B: Array.from({ length: 91 }, (_, i) => i + 495),
  },
};

  const [error, setError] = useState(null);
  const [tohighlight, settohighlight] = useState({});
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/mock_data.json");
        if (!res.ok) throw new Error("Network response was not ok");
        await res.json();
      } catch (err) {
        setError("Failed to fetch shelf data");
        console.error(err);
      }
    };
    fetchData();
    settohighlight({rollno:"230151014", slotid:"256", status:"checkin"});

  }, []);

    const getSlotClass = (slotNumber) => {
      const isSameSlot =
        tohighlight && Number(tohighlight.slotid) === Number(slotNumber);
      if (isSameSlot) {
        const status = String(tohighlight.status || '').toLowerCase();
        if (status === 'checkin') return 'slot highlight checkin';
        if (status === 'checkout') return 'slot highlight checkout';
      }
      return 'slot';
    };

    return (
    <>
     {error && <div className="error">{error}</div>}

     <div className="layout">
      <div className="wall">
        <div className="shelf block">
          <div className="label">Shelf 2 (85-140)</div>
          <div className="slots wide">
            {shelfStructure[2].map((n) => (
              <div key={n} className={getSlotClass(n)}>{n}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="aisle">
        <div className="shelf block">
          <div className="label">Shelf 1 (1-84)</div>
          <div className="slots">
            {shelfStructure[1].map((n) => (
              <div key={n} className={getSlotClass(n)}>{n}</div>
            ))}
          </div>
        </div>

        <div className="pair">
          <div className="shelf block">
            <div className="label">Shelf 5-B (495-585)</div>
            <div className="slots">
              {shelfStructure[5].B.map((n) => (
                <div key={n} className={getSlotClass(n)}>{n}</div>
              ))}
            </div>
          </div>

          <div className="shelf block">
            <div className="label">Shelf 5-A(405-494)</div>
            <div className="slots">
              {shelfStructure[5].A.map((n) => (
                <div key={n} className={getSlotClass(n)}>{n}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="pair">
          <div className="shelf block">
            <div className="label">Shelf 4 B (315-404)</div>
            <div className="slots">
              {shelfStructure[4].B.map((n) => (
                <div key={n} className={getSlotClass(n)}>{n}</div>
              ))}
            </div>
          </div>

          <div className="shelf block">
            <div className="label">Shelf 4-A (225-314)</div>
            <div className="slots">
              {shelfStructure[4].A.map((n) => (
                <div key={n} className={getSlotClass(n)}>{n}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="shelf block">
          <div className="label">Shelf 3 (141-224)</div>
          <div className="slots">
            {shelfStructure[3].map((n) => (
              <div key={n} className={getSlotClass(n)}>{n}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="entry">Entry</div>
    </div>
    </>
    );
    
}
export default Shelfs;