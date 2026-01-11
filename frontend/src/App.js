import './App.css';
import { useState } from 'react';
import InputPage from './pages/inputPage';
import ShelfPage from './pages/shelfPage';
import Slot from './pages/slotPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SlotProvider } from './context/SlotContext.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [showSlot, setShowSlot] = useState("");
  const [status, setStatus] = useState("");
  const base_route = '/test/library';
  return (
    <div className="App">
      <Router basename={base_route}>
        <SlotProvider>
          <Routes>
            <Route path="/" element={<InputPage />} />
            <Route path="/shelf" element={<ShelfPage />} />
            <Route path="/slot" element={<Slot />} />
          </Routes>
        </SlotProvider>
      </Router>
      <ToastContainer position="top-center" toastClassName="kiosk-toast" hideProgressBar={false} closeOnClick pauseOnHover 
        limit={2} />
    </div>
  );
}

export default App;
