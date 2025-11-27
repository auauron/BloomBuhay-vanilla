// src/components/Header.tsx
import React from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F875AA] text-white flex items-center justify-between px-6 py-3 shadow-md">
      <div className="flex items-center space-x--1">
        <button
          className="mr-3 hover:bg-white/10 rounded-lg transition-colors w-10 h-10 flex items-center justify-center"
          onClick={onMenuClick}
        >
          <Menu size={28} />
        </button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mr-[-8px]">BloomBuhay</h1>
        <img src="assets/logo_white.png" alt="Logo" className="w-12 sm:w-14 md:w-16 ml-1" />
      </div>
    </nav>
  );
}