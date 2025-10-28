import React, { useState } from "react";
import "../index.css";
import { CircleArrowLeftIcon, ChevronDownIcon } from "lucide-react";
import Pregnancy from "../components/Pregnancy"; 

export default function MainSetup() {
  return (
    <div className=" bg-[#FFF6F6] min-h-screen flex flex-col">
      {/* Header */}

      <header className="setup-container p-10 flex flex-row items-center w-full py-4 px-6">
        <div className="flex items-center p-10 space-x-8">
          <CircleArrowLeftIcon
            size={32}
            className="back-button cursor-pointer mr-8 text-[#FFF6F6] fill-[#F875AA]"
          />
          <h1 className="text-xl font-semibold text-[#F875AA]">BloomBuhay</h1>
        </div>

        <img
          src="/assets/logo_pink.png"
          alt="Logo"
          style={{ width: "40px", height: "40px" }}
          className="object-contain"
        />
      </header>

      {/*main content */}
      <div className="main-container flex-1 flex items-center justify-center px-6">
        <div className="shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="intro text-2xl font-bold font-rubik text-[#474747] mb-1">
              You're blooming beautifully, mama!
            </h1>
            <p className="text-[#474747]">
              Let's begin your pregnancy journey together.
            </p>
          </div>
          <Pregnancy/>
        </div>
      </div>
    </div>
  );
}
