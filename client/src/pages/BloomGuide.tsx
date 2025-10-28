import React from "react";
import "../index.css";

export default function BloomGuide() {
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
    <div className="min-h-screen font-poppins">
      {/* HEADER */}
      <header className="flex items-center bg-[#F875AA] px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center text-white text-3xl font-bold"
            style={{ transform: "translateY(-2px)" }}
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-white text-2xl font-extrabold leading-none">
              BloomBuhay
            </h1>
            <img
              src="/assets/logo_white.webp"
              alt="Logo"
              className="h-16"
              style={{ transform: "translateX(-6px)" }}
            />
          </div>
        </div>
      </header>

      {/* BLOOMGUIDE BAR */}
      <div className="text-[#F875AA] text-lg px-6 py-2 flex items-center gap-2">
        <span className="font-semibold">BloomGuide</span>
        <span>- know more, care better.</span>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-start px-6 py-4">
        <div className="relative w-[50%]">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full rounded-full pl-10 pr-4 py-2 border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700"
          />
          <span className="absolute left-3 top-2.5 text-pink-500 text-lg">🔍</span>
        </div>
      </div>

      {/* MATERNAL TIPS SECTION */}
      <section className="px-8">
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
      <section className="px-8 mt-6 pb-10">
        <h2 className="text-2xl font-semibold text-[#F875AA] mb-4">
          Mother Care
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
