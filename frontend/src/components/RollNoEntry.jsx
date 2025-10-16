import React from 'react';

function RollEntry({ rollNumber, setRollNumber }) {
  const handleChange = (e) => {
    setRollNumber(e.target.value);
  };

  return (
    <div className="roll-entry">
      <label htmlFor="roll">Enter Roll Number: </label>
      <input
        id="roll"
        type="text"
        value={rollNumber}
        onChange={handleChange}
        placeholder="Enter your Roll number"
      />
    </div>
  );
}

export default RollEntry;
