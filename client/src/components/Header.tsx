// src/components/Header.tsx
import React from "react";
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <nav className="bg-[#F875AA] text-white flex items-center justify-between px-6 py-3 shadow-md">
      <div className="flex items-center space-x--1">
        <button className="mr-3 hover:bg-white/10 rounded-lg transition-colors w-10 h-10 flex items-center justify-center" onClick={onMenuClick}>
          <Menu size={28} />
        </button>
        <h1 className="text-4xl font-extrabold mr-[-8px]">BloomBuhay</h1>
        <img src="/assets/logo_white.webp" alt="Logo" className="w-16" />
      </div>
    </nav>
  );
}