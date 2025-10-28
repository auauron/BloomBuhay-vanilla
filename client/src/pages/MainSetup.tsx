import React, { useState } from "react";
import "../index.css";
import { CircleArrowLeftIcon, ChevronDownIcon } from "lucide-react";
import Pregnancy from "../components/Pregnancy";

export default function MainSetup() {
  return (
    <div className=" bg-bloomWhite min-h-screen flex flex-col">
      {/* Header */}

      <header className="fixed top-0 left-0 flex flex-row items-center w-full py-4 px-6">
        <div className="flex items-center space-x-4">
          <CircleArrowLeftIcon
            size={32}
            className="cursor-pointer text-bloomWhite fill-bloomPink"
          />
          <h1 className="text-3xl font-bold text-bloomPink">BloomBuhay</h1>
        </div>

        <img
          src="/assets/logo_pink.png"
          alt="Logo"
          style={{ width: "34px", height: "34px" }}
          className="object-contain"
        />
      </header>
      
      {/*main content */}
      <div className="main-container flex-1 flex items-center justify-center px-6">
        <div style={{ maxWidth: "800px" }} className="p-8 w-full">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold font-rubik text-bloomBlack mb-1">
              You're blooming beautifully, mama!
            </h1>
            <p className="text-[#474747]">
              Let's begin your pregnancy journey together.
            </p>
            <Pregnancy />
          </div>
        </div>
      </div>
    </div>
  );
}
