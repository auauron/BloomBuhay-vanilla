import React from "react";

export default function ArticlePage() {
  const articles = [
    {
      title: "5 weeks pregnant – what to expect?",
      image: "/assets/article1.webp",
    },
    {
      title: "5 weeks pregnant – what to expect?",
      image: "/assets/article1.webp",
    },
    {
      title: "5 weeks pregnant – what to expect?",
      image: "/assets/article1.webp",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFEFF2] font-poppins">
      {/* Top navigation bar */}
      <header className="flex items-center justify-between bg-[#F875AA] px-6 py-3">
        <div className="flex items-center gap-3">
          <button className="text-white text-3xl font-bold">☰</button>
          <h1 className="text-white text-2xl font-extrabold flex items-center gap-2">
            BloomBuhay
            <img src="/assets/logo_white.webp" alt="Logo" className="h-7" />
          </h1>
        </div>
      </header>

      {/* BloomGuide bar */}
      <div className="bg-[#FFB6C1] text-[#D63384] font-semibold text-lg px-6 py-2 flex items-center gap-2">
        <span className="font-bold">BloomGuide</span>
        <span className="text-[#d16b8d]">– know more, care better.</span>
      </div>

      {/* Search Bar */}
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

      {/* Maternal Tips Section */}
      <section className="px-8">
        <h2 className="text-2xl font-semibold text-[#D63384] mb-4">
          Maternal Tips
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-pink-200 hover:shadow-lg transition-shadow"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-3 text-sm text-gray-700 text-center">
                {article.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mother Care Section */}
      <section className="px-8 mt-6 pb-10">
        <h2 className="text-2xl font-semibold text-[#D63384] mb-4">
          Mother Care
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {articles.slice(0, 1).map((article, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-pink-200 hover:shadow-lg transition-shadow"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-44 object-cover"
              />
              <div className="p-3 text-sm text-gray-700 text-center">
                {article.title}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
