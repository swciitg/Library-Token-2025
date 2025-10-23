import './App.css';
import { useState } from 'react';
import InputPage from './pages/inputPage';
import ShelfPage from './pages/shelfPage';
import Slot from './pages/slotPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SlotProvider } from './context/SlotContext.js';


function App() {
  const [showSlot, setShowSlot] = useState("");
  const [status, setStatus] = useState("");
  console.log(showSlot);
  console.log(status);
  return (
    <div className="App">
      <Router basename='/library'>
        <SlotProvider>
          <Routes>
            <Route path="/" element={<InputPage />} />
            <Route path="/shelf" element={<ShelfPage />} />
            <Route path="/slot" element={<Slot />} />
          </Routes>
        </SlotProvider>
      </Router>
    </div>
  );
}

export default App;
