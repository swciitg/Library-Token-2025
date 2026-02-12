import { useState, useEffect, useRef } from "react";
import { allotSlot } from "../hooks/allotAndChange.js";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";
import Loader from "./Loader.jsx";
import QRscan from "../images/QR-scan.png";

/* Toast utilities */
import {
  showScannerNotReady,
  clearScannerNotReady,
} from "../utils/scannerToasts.js";
import { showErrorToast, handleBackendError } from "../utils/errorToasts.js";

export default function RollEntry() {
  const [rollNo, setRollNo] = useState("");
  const [slotInfo, setSlotInfo] = useState("");
  const [processing, setProcessing] = useState(false);

  const inputRef = useRef(null);
  const scannerErrorActive = useRef(false);

  const { setShowSlot, setStatus, setRollNumber } = useSlot();
  const navigate = useNavigate();

  /* Always focus input */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBlur = () => {
    setTimeout(() => {
      if (document.hasFocus()) {
        inputRef.current?.focus();
      }
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (processing || !rollNo) return;

    const submittedRoll = rollNo;

    setProcessing(true);
    setStatus("Processing...");
    setSlotInfo("");

    const slowTimer = setTimeout(() => {
      showErrorToast(
        "System is slow. Please wait.",
        scannerErrorActive.current
      );
    }, 4000);

    try {
      const data = await allotSlot(submittedRoll);
      clearTimeout(slowTimer);

      if (data?.error) {
        handleBackendError(data.error, scannerErrorActive.current);
        setStatus(data.error);
        setShowSlot("");
        return;
      }

      setStatus(data.message);

      if (data.checkin_slot) {
        setSlotInfo(`Slot allotted: ${data.checkin_slot}`);
        setShowSlot(data.checkin_slot);
        setStatus(data.status);
      } else if (data.checkout_slot) {
        setSlotInfo(`Slot released: ${data.checkout_slot}`);
        setShowSlot(data.checkout_slot);
        setStatus(data.status);
      } else {
        setShowSlot("");
      }

      setRollNumber(submittedRoll);
      setRollNo("");

      navigate("/slot", { state: data });
    } catch (err) {
      console.error(err);
      setStatus(err?.message || "Network error!");
      showErrorToast("Network error!", scannerErrorActive.current);
      setShowSlot("");
    } finally {
      clearTimeout(slowTimer);
      setProcessing(false);
    }
  };

  /* Scanner focus handling */
  useEffect(() => {
    const handleWindowBlur = () => {
      if (processing) return;
      showScannerNotReady();
      scannerErrorActive.current = true;
    };

    const handleWindowFocus = () => {
      scannerErrorActive.current = false;
      clearScannerNotReady();
      inputRef.current?.focus();
    };

    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [processing]);

  return (
    <>
      {/* Loader overlay (from first code) */}
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-white p-8 rounded-lg shadow-lg space-y-6 w-[500px]"
        >
          <label className="text-2xl font-semibold">Scan the QR code</label>
          <label className="text-xl font-semibold">QR कोड को स्कैन करें</label>

          <img src={QRscan} alt="QR Code" className="w-64 h-64" />

          <input
            ref={inputRef}
            onBlur={handleBlur}
            type="text"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            autoFocus
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 sr-only"
          />

          <button
            type="submit"
            disabled={processing}
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
