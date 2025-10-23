import { createContext, useContext, useState, useEffect } from "react";

// Create context
const SlotContext = createContext();

// Context provider component
export const SlotProvider = ({ children }) => {
  const [showSlot, setShowSlot] = useState(
    () => localStorage.getItem("showSlot") || ""
  );
  const [status, setStatus] = useState(
    () => localStorage.getItem("status") || ""
  );
  const [rollNumber, setRollNumber] = useState(
    () => localStorage.getItem("rollNumber") || ""
  );

  useEffect(() => {
    localStorage.setItem("showSlot", showSlot);
  }, [showSlot]);

  useEffect(() => {
    localStorage.setItem("status", status);
  }, [status]);

  useEffect(() => {
    localStorage.setItem("rollNumber", rollNumber);
  }, [rollNumber]);

  return (
    <SlotContext.Provider value={{ showSlot, setShowSlot, status, setStatus, rollNumber, setRollNumber }}>
      {children}
    </SlotContext.Provider>
  );
};

// Custom hook for easier use
export const useSlot = () => useContext(SlotContext);
