import React, { useState } from "react";
import "../index.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Search } from "lucide-react";

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
      category: "Pregnancy"
    },
    {
      title: "Nutrition Tips for Early Pregnancy",
      image: "/assets/article1.webp",
      category: "Nutrition"
    },
    {
      title: "Signs Your Body is Adjusting to Pregnancy",
      image: "/assets/article1.webp",
      category: "Health"
    },
  ];

  const motherCare = [
    {
      title: "Postpartum Self-Care Routine",
      image: "/assets/article1.webp",
      category: "Self-Care"
    },
    {
      title: "Caring for Yourself While Caring for Baby",
      image: "/assets/article1.webp",
      category: "Wellness"
    },
  ];

  const babyCare = [
    {
      title: "Newborn Care Essentials",
      image: "/assets/article1.webp",
      category: "Baby Care"
    },
    {
      title: "Understanding Baby's Sleep Patterns",
      image: "/assets/article1.webp",
      category: "Sleep"
    },
    {
      title: "Feeding Guide for Newborns",
      image: "/assets/article1.webp",
      category: "Feeding"
    },
  ];

  // === REUSABLE CARD COMPONENT ===
  const ArticleCard = ({ title, image, category }: { title: string; image: string; category?: string }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group flex flex-col h-full">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {category && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              {category}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 leading-tight mb-4 line-clamp-2 group-hover:text-pink-600 transition-colors flex-grow">
          {title}
        </h3>
        
        <div className="flex justify-end mt-auto pt-4">
          <button className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-4 py-2 rounded-full hover:shadow-lg transform group-hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <span className="text-sm font-medium">Read more</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // === STYLED SEARCH BAR COMPONENT ===
  const GradientSearchBar = () => {
    const [focused, setFocused] = useState(false);
    const [query, setQuery] = useState("");

    return (
      <div
        className={`w-full rounded-full p-[2px] transition-all duration-300 ${
          focused
            ? "bg-white shadow-[0_0_12px_rgba(248,117,170,0.4)]"
            : "bg-gradient-to-r from-bloomPink to-bloomYellow"
        }`}
      >
        <div className="bg-white rounded-full relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bloomPink text-lg">
            <Search />
          </span>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search articles..."
            className="w-full rounded-full py-3 pl-12 pr-4 bg-transparent focus:outline-none placeholder-transparent text-gray-800"
          />

          {/* Gradient placeholder overlay */}
          {!query && !focused && (
            <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-gradient-to-r from-bloomPink to-bloomYellow bg-clip-text text-transparent pointer-events-none select-none">
              Search articles...
            </span>
          )}
        </div>
      </div>
    );
  };

  // === MAIN PAGE ===
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins relative overflow-hidden">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Background decorative elements */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" />

      {/* BLOOMGUIDE BAR */}
      <div className="text-[#F875AA] text-xl mt-5 px-6 py-2 flex items-center gap-2">
        <span className="font-semibold">BloomGuide</span>
        <span>- know more, care better.</span>
      </div>

      {/* SEARCH BAR */}
      <div className="w-full px-6 py-4">
        <GradientSearchBar />
      </div>

      {/* MATERNAL TIPS SECTION */}
      <section className="px-8 mb-8 mt-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-bloomPink to-bloomYellow bg-clip-text text-transparent">
            Maternal Tips
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {maternalTips.map((a, i) => (
            <ArticleCard key={i} title={a.title} image={a.image} category={a.category} />
          ))}
        </div>
      </section>

      {/* MOTHER CARE SECTION */}
      <section className="px-8 pb-10 mt-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-bloomPink to-bloomYellow bg-clip-text text-transparent">
            Mother Care
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {motherCare.map((a, i) => (
            <ArticleCard key={i} title={a.title} image={a.image} category={a.category} />
          ))}
        </div>
      </section>

      {/* BABY CARE SECTION */}
      <section className="px-8 pb-10 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-bloomPink to-bloomYellow bg-clip-text text-transparent">
            Baby Care
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {babyCare.map((a, i) => (
            <ArticleCard key={i} title={a.title} image={a.image} category={a.category} />
          ))}
        </div>
      </section>

      {/* Floating Help Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}