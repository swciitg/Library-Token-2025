import './App.css';
import { useState } from 'react';
import RollEntry from './components/RollNoEntry';
import SlotCard from './components/SlotNumber';

function App() {
  const [rollNumber, setRollNumber] = useState('');
  const [showSlot, setShowSlot] = useState(false);
  const handleGetSlot = () => {
    if (rollNumber.trim() === '') {
      alert('Please enter a roll number first!');
      return;
    }
    setShowSlot(true); 
  };

  return (
    <div className="App">
      <h1>Slot Allocation</h1>
      <RollEntry rollNumber={rollNumber} setRollNumber={setRollNumber} />
      <button onClick={handleGetSlot}>Get Slot Number</button>
      {showSlot && <SlotCard rollNumber={rollNumber} />}
    </div>
  );
}

export default App;
