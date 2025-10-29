// src/components/Sidebar.tsx
import React from "react";
import { ArrowRightToLine, Home, BookOpen, Calendar, Heart, Baby, Book, User, Crown } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
        {/* Overlay */}
        <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-600 ease-in-out ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        />

        {/* Sidebar */}
        <div 
        className={`fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        >

          {/* Header */}
      <div className="bg-[#F875AA] text-white p-3">
        <div className="flex justify-between items-start mb-3">
          <div className="ml-3 mt-2">
            <h2 className="text-xl font-bold text-[#474747]">Bloom stage:</h2>
            <h2 className="text-xl font-bold text-white">Pregnant</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/10 rounded-lg transition-colors w-10 h-10 flex items-center justify-center">
            <ArrowRightToLine size={24} />
          </button>
        </div>
        <div className="w-full h-px bg-white/30 mb-2"></div>
     

          {/* User Profile */}
          <button className="w-full flex items-center space-x-3 p-1 hover:bg-white/10 rounded-lg transition-colors text-left">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <p className="font-semibold">Maria Clara</p>
              <p className="text-sm text-white/80">View and Edit Profile</p>
            </div>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="p-6">
          <nav className="space-y-2">
            {[
              { icon: Home, label: 'Home' },
              { icon: BookOpen, label: 'BloomGuide' },
              { icon: Calendar, label: 'Planner' },
              { icon: Heart, label: 'Biometrics' },
              { icon: Baby, label: 'BB\'s Tools' },
              { icon: Book, label: 'Journal' }
            ].map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

        {/* Premium Banner */}
        <button className="mt-8 p-2 bg-gradient-to-r from-[#F875AA] to-[#F4C69D] rounded-lg text-white absolute bottom-20 mb-2 left-4 right-4 hover:from-[#F9649C] hover:to-[#F3B287] transition-colors">
          <div className="flex items-center space-x-2 mb-2">
            <Crown size={20} />
            <span className="font-bold">Get BB Premium!</span>
          </div>
          <p className="text-sm text-white/90 text-left ml-1">Bloom Even Better.</p>
        </button>

          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 absolute bottom-0 mb-4 ml-[-8px] mr-8">
            <p className="text-center text-gray-500 text-xs">
                © 2025 BloomBuhay by Mixed Berries Productions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}