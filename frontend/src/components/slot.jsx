import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSlot } from "../context/SlotContext.js";
import "./shelf.css";
import { changeDb } from "../hooks/allotAndChange.js";

function Shelfs() {
  const navigate = useNavigate();
  const { showSlot, status, setShowSlot, setStatus, rollNumber } = useSlot();

  const newEntry = async () => {
    if (status === "slot-allot") await changeDb(rollNumber, showSlot);
    console.log(`${rollNumber} , ${showSlot}`);
    setShowSlot("");
    setStatus("");
    navigate("/");
  };

  // const SlotClass = () => {
  //   if (status === "slot-allot")
  //     return "border-emerald-500 ring-4 ring-emerald-200";
  //   if (status === "checkout") return "border-rose-500 ring-4 ring-rose-200";
  //   return "border-gray-300";
  // };

  const SlotClass = () => {
    if (status === "slot-allot")
      return "border-emerald-500 ring-4 ring-emerald-200 bg-emerald-500";
    if (status === "checkout") return "border-rose-500 ring-4 ring-rose-200 bg-rose-500";
    return "border-gray-300";
  };

  useEffect(() => {
    let inputBuffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime;

      if (timeDiff > 100) inputBuffer = "";

      if (e.key !== "Enter") {
        inputBuffer += e.key;
        lastKeyTime = currentTime;
      } else {
        if (inputBuffer.length > 4 && timeDiff < 100) {
          console.log("Barcode scan detected:", inputBuffer);
          inputBuffer = "";
          return;
        }

        e.preventDefault();
        newEntry();
        inputBuffer = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  let shelfNo = "";
  if (showSlot < 85) shelfNo = "1";
  else if (showSlot < 141) shelfNo = "2";
  else if (showSlot < 225) shelfNo = "3";
  else if (showSlot < 315) shelfNo = "4-A";
  else if (showSlot < 405) shelfNo = "4-B";
  else if (showSlot < 495) shelfNo = "5-A";
  else shelfNo = "5-B";

  return (
    <div className=" font-[Inter] text-black">
   <div
  className={`${SlotClass()} rounded-2xl 
    w-[70vh]  flex flex-col gap-10 items-center justify-center 
    transition-all duration-300 p-0 bg-[#8ef7a8]
     shadow-lg`}
  style={{ 
    boxShadow: '0 10px 25px #34c759' // green shadow
  }}
> 

       {/* Shelf */}
       <div className="flex bg-white justify-center h-full items- w-full">
        <div className=" bg-[#8ef7a8] w-full rounded-tr-[40px] h-12  text-2xl">
          
        </div>
<div className="flex items-center justify-center gap-2 px-4 py-2  bg-white   shadow-sm">
  <span className="text-2xl font-semibold text-gray-800">
    Shelf:
  </span>
  <span className="text-2xl font-bold text-gray-900">
    {shelfNo || "--"}
  </span>
</div>
<div className=" bg-[#8ef7a8] rounded-tl-[40px] w-full h-12 text-2xl">
</div>

</div>
        {/* Slot */}
        <div className="flex flex-col items-center  justify-center">
          <span className="text-3xl tracking-wider  mb-2 font-semibold">
            Slot
          </span>
          <span className="text-[135px] font-extrabold  drop-shadow-md ">
            {showSlot || "--"}
          </span>
        </div>

        {/* Done button */}
        <button
          onClick={newEntry}
          className="w-[95%] rounded-lg  bg-white px-4 py-3 text-black text-lg font-semibold shadow-md hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        >
          DONE
        </button>
      </div>
    </div>
  );
}

export default Shelfs;
