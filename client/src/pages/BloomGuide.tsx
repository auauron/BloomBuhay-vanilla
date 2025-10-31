import React, { useState, useMemo } from "react";
import "../index.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Search } from "lucide-react";
import { Article, ArticleSection } from "../types/guide";
import articlesData from '../data/articles.json';
import ArticleModal from '../components/ArticleModal';

// === GRADIENT SEARCH BAR COMPONENT ===
const GradientSearchBar = ({ 
  searchQuery, 
  setSearchQuery,
  hasNoResults 
}: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
  hasNoResults: boolean;
}) => {
  const [focused, setFocused] = useState(false);

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search articles..."
          className="w-full rounded-full py-3 pl-12 pr-12 bg-transparent focus:outline-none placeholder-transparent text-gray-800"
        />

        {hasNoResults && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bloomPink transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {!searchQuery && !focused && (
          <span className="absolute left-12 top-1/2 -translate-y-1/2 text-bloomPink pointer-events-none select-none">
            Search articles...
          </span>
        )}
      </div>
    </div>
  );
};

// === ARTICLE CARD COMPONENT ===
const ArticleCard = ({ 
  title, 
  image, 
  category, 
  onClick 
}: { 
  title: string; 
  image: string; 
  category?: string;
  onClick: () => void;
}) => (
  <div 
    className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group flex flex-col h-full cursor-pointer"
    onClick={onClick}
  >
    <div className="relative overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {category && (
        <div className="absolute top-3 left-3">
          <span 
            className="bg-gradient-to-r from-bloomPink via-bloomPink/90 to-bloomYellow text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
            style={{textShadow: '1px 1px 1px black'}}
          >
            {category}
          </span>
        </div>
      )}
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-800 leading-tight mb-4 line-clamp-2 group-hover:text-bloomPink transition-colors flex-grow">
        {title}
      </h3>
      
      <div className="flex justify-end mt-auto pt-4">
        <button className="bg-gradient-to-r from-bloomPink via-bloomPink/90 to-bloomYellow text-white rounded-full hover:shadow-lg transform group-hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg">
          <span 
            className="text-sm font-medium text-white px-4 py-2"
            style={{textShadow: '0.5px 0.5px 1px black'}}
          >
            Read more
          </span>
          <svg 
            className="w-4 h-4 mr-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{filter: 'drop-shadow(0.5px 0.5px 1.5px gray)'}}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

// === FILTER BUTTONS COMPONENT ===
const FilterButtons = ({ 
  activeFilter, 
  setActiveFilter, 
  searchQuery,
  maternalTips,
  motherCare, 
  babyCare 
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  maternalTips: Article[];
  motherCare: Article[];
  babyCare: Article[];
}) => {
  // Helper function to filter articles by search query
  const filterArticlesBySearch = (articles: Article[]): Article[] => {
    if (!searchQuery.trim()) return articles;
    
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Calculate counts based on current search results
  const getFilterCount = (filterKey: string) => {
    if (!searchQuery.trim()) {
      // No search, use original counts
      switch (filterKey) {
        case "maternal": return maternalTips.length;
        case "mother": return motherCare.length;
        case "baby": return babyCare.length;
        case "all": return maternalTips.length + motherCare.length + babyCare.length;
        default: return 0;
      }
    } else {
      // With search, count filtered results
      const maternalFiltered = filterArticlesBySearch(maternalTips);
      const motherFiltered = filterArticlesBySearch(motherCare);
      const babyFiltered = filterArticlesBySearch(babyCare);
      
      switch (filterKey) {
        case "maternal": return maternalFiltered.length;
        case "mother": return motherFiltered.length;
        case "baby": return babyFiltered.length;
        case "all": return maternalFiltered.length + motherFiltered.length + babyFiltered.length;
        default: return 0;
      }
    }
  };

  const filters = [
    { key: "all", label: "All Articles", count: getFilterCount("all") },
    { key: "maternal", label: "Maternal Tips", count: getFilterCount("maternal") },
    { key: "mother", label: "Mother Care", count: getFilterCount("mother") },
    { key: "baby", label: "Baby Care", count: getFilterCount("baby") },
  ];

  return (
    <div className="flex flex-wrap gap-3 px-6 pb-4">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => setActiveFilter(filter.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
            activeFilter === filter.key
              ? "bg-bloomPink text-white border-transparent shadow-lg"
              : "bg-white text-gray-600 border-bloomPink/30 hover:border-bloomPink hover:shadow-md"
          }`}
        >
          <span className="font-medium">{filter.label}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            activeFilter === filter.key 
              ? "bg-white/20 text-white" 
              : "bg-bloomPink/10 text-bloomPink"
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

// === MAIN COMPONENT ===
export default function BloomGuide() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // === DATA SECTION ===
  const maternalTips: Article[] = [
    {
      title: "The Baby: Development at 5 Weeks",
      image: "/assets/article1.webp",
      category: "Pregnancy",
      section: "maternal"
    },
    {
      title: "Nutrition Tips for Early Pregnancy",
      image: "/assets/article1.webp",
      category: "Nutrition",
      section: "maternal"
    },
    {
      title: "Signs Your Body is Adjusting to Pregnancy",
      image: "/assets/article1.webp",
      category: "Health",
      section: "maternal"
    },
    {
      title: "Exercise During First Trimester",
      image: "/assets/article1.webp",
      category: "Fitness",
      section: "maternal"
    },
    {
      title: "Managing Morning Sickness",
      image: "/assets/article1.webp",
      category: "Health",
      section: "maternal"
    },
  ];

  const motherCare: Article[] = [
    {
      title: "Postpartum Self-Care Routine",
      image: "/assets/article1.webp",
      category: "Self-Care",
      section: "mother"
    },
    {
      title: "Caring for Yourself While Caring for Baby",
      image: "/assets/article1.webp",
      category: "Wellness",
      section: "mother"
    },
    {
      title: "Mental Health After Birth",
      image: "/assets/article1.webp",
      category: "Mental Health",
      section: "mother"
    },
    {
      title: "Returning to Exercise Postpartum",
      image: "/assets/article1.webp",
      category: "Fitness",
      section: "mother"
    },
  ];

  const babyCare: Article[] = [
    {
      title: "Newborn Care Essentials",
      image: "/assets/article1.webp",
      category: "Baby Care",
      section: "baby"
    },
    {
      title: "Understanding Baby's Sleep Patterns",
      image: "/assets/article1.webp",
      category: "Sleep",
      section: "baby"
    },
    {
      title: "Feeding Guide for Newborns",
      image: "/assets/article1.webp",
      category: "Feeding",
      section: "baby"
    },
    {
      title: "Baby Development Milestones",
      image: "/assets/article1.webp",
      category: "Development",
      section: "baby"
    },
    {
      title: "Common Newborn Health Concerns",
      image: "/assets/article1.webp",
      category: "Health",
      section: "baby"
    },
  ];

  const topMaternalTips = maternalTips.slice(0, 3);
  const topMotherCare = motherCare.slice(0, 3);
  const topBabyCare = babyCare.slice(0, 3);

  // Helper function to filter articles by search query
  const filterArticlesBySearch = (articles: Article[]): Article[] => {
    if (!searchQuery.trim()) return articles;
    
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filter articles based on active filter and search query
  const getFilteredArticles = (): ArticleSection => {
    let baseArticles;
    
    switch (activeFilter) {
      case "maternal":
        baseArticles = { maternal: maternalTips };
        break;
      case "mother":
        baseArticles = { mother: motherCare };
        break;
      case "baby":
        baseArticles = { baby: babyCare };
        break;
      default: // "all"
        baseArticles = {
          maternal: topMaternalTips,
          mother: topMotherCare,
          baby: topBabyCare
        };
    }

    // Apply search filtering to each section
    const filteredSections: ArticleSection = {};
    Object.entries(baseArticles).forEach(([section, articles]) => {
      const filtered = filterArticlesBySearch(articles);
      if (filtered.length > 0) {
        filteredSections[section as keyof ArticleSection] = filtered;
      }
    });

    return filteredSections;
  };

  // Use useMemo to prevent unnecessary recalculations
  const filteredSections = useMemo(() => getFilteredArticles(), [activeFilter, searchQuery, maternalTips, motherCare, babyCare]);

  // Check if search has no results
  const hasNoResults = Boolean(searchQuery && Object.keys(filteredSections).length === 0);

  // Handle article click
  const handleArticleClick = (title: string) => {
    const article = articlesData.articles.find(a => a.title === title);
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // === SECTION TITLE HELPER ===
  const getSectionTitle = (section: string) => {
    const titles = {
      maternal: "Maternal Tips",
      mother: "Mother Care", 
      baby: "Baby Care"
    };
    return titles[section as keyof typeof titles] || section;
  };

  // === MAIN PAGE ===
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins relative overflow-hidden">
      <div className={`transition-all duration-300 ${isModalOpen ? 'blur-sm' : ''}`}>
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Background decorative elements */}
        <div className="fixed top-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" />

        {/* BLOOMGUIDE BAR */}
        <div className="text-[#F875AA] text-center mt-5 px-6 py-2">
          <div className="font-semibold text-3xl">BloomGuide</div>
          <div className="text-lg font-rubik text-[#474747]">know more, care better.</div>
        </div>

        {/* SEARCH BAR */}
        <div className="w-full px-6 py-4">
          <GradientSearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            hasNoResults={hasNoResults}
          />
        </div>

        {/* FILTER BUTTONS */}
        <FilterButtons 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          maternalTips={maternalTips}
          motherCare={motherCare}
          babyCare={babyCare}
        />

        {/* ARTICLES SECTIONS */}
        <div className="flex-1 pb-20">
          {Object.entries(filteredSections).map(([section, articles]) => (
            <section key={section} className="px-8 mb-8 mt-8">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold text-bloomPink">
                  {getSectionTitle(section)}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, i) => (
                  <ArticleCard 
                    key={i} 
                    title={article.title} 
                    image={article.image} 
                    category={article.category}
                    onClick={() => handleArticleClick(article.title)}
                  />
                ))}
              </div>
            </section>
          ))}

          {/* Show message if no articles found for a specific filter */}
          {Object.keys(filteredSections).length === 0 && (
            <div className="text-center py-12 px-8">
              <div className="text-gray-400 text-6xl mb-4">
                {searchQuery ? "🔍" : "📚"}
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery ? `No articles found for "${searchQuery}"` : "No articles found"}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "Try a different search term or clear your search to see all articles."
                  : "Try selecting a different filter or search term."
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-8 right-8">
          <button className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* ARTICLE MODAL */}
      <ArticleModal 
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div> 
  );
}