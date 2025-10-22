import React from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Slot from "../components/slot";

const SlotPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Slot />
      </div>

      <Footer />
    </div>
  );
};

export default SlotPage;
