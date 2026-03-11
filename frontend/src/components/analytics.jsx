import React, { useState, useEffect, useMemo } from "react";
import { allSlot } from "../hooks/allotAndChange.js";


function Analytics() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await allSlot();
        if (data?.error) { setError(data.error); return; }
        if (!Array.isArray(data)) throw new Error("Invalid slot data format");
        setSlots(data);
      } catch (err) {
        setError(err.message || "Failed to fetch slots");
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  const stats = useMemo(() => {
    const total = slots.length;
    const blocked = slots.filter((s) => s.isBlocked === true).length;
    const occupied = slots.filter((s) => s.isEmpty === false && s.isBlocked === false).length;
    const empty = slots.filter((s) => s.isEmpty === true && s.isBlocked === false).length;
    const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const emptyPct = total > 0 ? Math.round((empty / total) * 100) : 0;
    const blockedPct = total > 0 ? Math.round((blocked / total) * 100) : 0;
    return { total, blocked, occupied, empty, occupancyPct, emptyPct, blockedPct };
  }, [slots]);

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-sm text-gray-400">Loading analytics...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
       
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-sm text-red-500">{error}</div>
        </div>
      </>
    );
  }

  const cards = [
    { label: "Total Slots",    value: stats.total,    color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-100" },
    { label: "Occupied",       value: stats.occupied, color: "text-green-600",  bg: "bg-green-50",   border: "border-green-100"  },
    { label: "Empty",          value: stats.empty,    color: "text-gray-600",   bg: "bg-gray-50",    border: "border-gray-200"   },
    { label: "Blocked",        value: stats.blocked,  color: "text-orange-500", bg: "bg-orange-50",  border: "border-orange-100" },
  ];

  const bars = [
    { label: "Occupied", pct: stats.occupancyPct, color: "bg-green-500",  textColor: "text-green-600"  },
    { label: "Empty",    pct: stats.emptyPct,     color: "bg-gray-300",   textColor: "text-gray-500"   },
    { label: "Blocked",  pct: stats.blockedPct,   color: "bg-orange-400", textColor: "text-orange-500" },
  ];

  return (
    <>


      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
            <p className="text-sm text-gray-400 mt-1">Live slot usage overview</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
            {cards.map((c) => (
              <div key={c.label} className={`bg-white border ${c.border} rounded-xl p-5`}>
                <div className={`text-3xl font-bold ${c.color} mb-1`}>{c.value}</div>
                <div className="text-xs text-gray-400 font-medium">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Occupancy Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-6">Slot Distribution</h2>

            {/* Stacked bar */}
            <div className="flex h-5 rounded-full overflow-hidden mb-6">
              <div className="bg-green-500  transition-all" style={{ width: `${stats.occupancyPct}%` }} />
              <div className="bg-gray-200   transition-all" style={{ width: `${stats.emptyPct}%` }} />
              <div className="bg-orange-400 transition-all" style={{ width: `${stats.blockedPct}%` }} />
            </div>

            {/* Individual bars */}
            <div className="space-y-4">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-gray-600">{b.label}</span>
                    <span className={`text-xs font-bold ${b.textColor}`}>{b.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${b.color} h-2.5 rounded-full transition-all duration-700`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100">
              {[
                { color: "bg-green-500",  label: "Occupied" },
                { color: "bg-gray-300",   label: "Empty"    },
                { color: "bg-orange-400", label: "Blocked"  },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  <span className="text-xs text-gray-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Analytics;