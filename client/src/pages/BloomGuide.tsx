import React from "react";
import "../index.css";
import { useState } from "react";
import Header from '../components/Header';
import Sidebar from "../components/Sidebar";
import { Search } from 'lucide-react';

export default function BloomGuide() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const closeSidebar = () => {
      setIsSidebarOpen(false);
    };
  
  // === DATA SECTION ===
  const maternalTips = [
    {
      title: "The Baby: Development at 5 Weeks",
      image: "/assets/article1.webp",
    },
    {
      title: "Nutrition Tips for Early Pregnancy",
      image: "/assets/article1.webp",
    },
    {
      title: "Signs Your Body is Adjusting to Pregnancy",
      image: "/assets/article1.webp",
    },
  ];

  const motherCare = [
    {
      title: "Postpartum Self-Care Routine",
      image: "/assets/article1.webp",
    },
    {
      title: "Caring for Yourself While Caring for Baby",
      image: "/assets/article1.webp",
    },
  ];

  // === REUSABLE CARD COMPONENT ===
  const ArticleCard = ({ title, image }: { title: string; image: string }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-pink-200 hover:shadow-lg transition-shadow">
      <img src={image} alt={title} className="w-full h-44 object-cover" />
      <div className="p-3 text-sm text-gray-700 text-center">{title}</div>
    </div>
  );

  // === MAIN PAGE ===
  return (
      <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

  
      {/* BLOOMGUIDE BAR */}
      <div className="text-[#F875AA] text-4xl mt-5 px-6 py-2 flex items-center gap-2">
        <span className="font-semibold">BloomGuide</span>
        <span>- know more, care better.</span>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-start px-6 py-4">
        <div className="relative w-[100%]">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full rounded-full pl-10 pr-4 py-2 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
          />
          <span className="absolute left-3 top-2.5 text-pink-500 text-lg"><Search /></span>
        </div>
      </div>

      {/* MATERNAL TIPS SECTION */}
      <section className="px-8 mb-4 mt-4">
        <h2 className="text-2xl font-semibold text-[#F875AA] mb-4">
          Maternal Tips
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {maternalTips.map((a, i) => (
            <ArticleCard key={i} title={a.title} image={a.image} />
          ))}
        </div>
      </section>

      {/* MOTHER CARE SECTION */}
      <section className="px-8 pb-10 mt-4">
        <h2 className="text-2xl font-semibold text-[#F875AA] mb-4">
          Mother Care
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {motherCare.map((a, i) => (
            <ArticleCard key={i} title={a.title} image={a.image} />
          ))}
        </div>
      </section>

      {/* BABY CARE SECTION */}
      <section className="px-8 pb-10 mb-4">
        <h2 className="text-2xl font-semibold text-[#F875AA] mb-4">
          Baby Care
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {motherCare.map((a, i) => (
            <ArticleCard key={i} title={a.title} image={a.image} />
          ))}
        </div>
      </section>
    </div>
  );
}
