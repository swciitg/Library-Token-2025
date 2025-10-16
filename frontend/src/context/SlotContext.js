import { createContext, useContext, useState } from "react";

// Create context
const SlotContext = createContext();

// Context provider component
export const SlotProvider = ({ children }) => {
  const [showSlot, setShowSlot] = useState("");
  const [status, setStatus] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  return (
    <SlotContext.Provider value={{ showSlot, setShowSlot, status, setStatus, rollNumber, setRollNumber }}>
      {children}
    </SlotContext.Provider>
  );
};

// Custom hook for easier use
export const useSlot = () => useContext(SlotContext);
