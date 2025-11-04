import React, { useState, useMemo } from "react";
import "../index.css";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { Search } from "lucide-react";
import { Article, ArticleSection } from "../types/guide";
import ArticleModal from '../components/ArticleModal';
import { BookOpen } from "lucide-react";
import { pregnant, postpartum, earlyChildCare } from '../data';

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
  article,
  onClick 
}: { 
  article: Article;
  onClick: () => void;
}) => (
  <div 
    className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] group flex flex-col h-full cursor-pointer"
    onClick={onClick}
  >
    <div className="relative overflow-hidden">
      <img 
        src={article.image} 
        alt={article.title} 
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {article.category && (
        <div className="absolute top-3 left-3">
          <span 
            className="bg-gradient-to-r from-bloomPink via-bloomPink/90 to-bloomYellow text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg"
            style={{textShadow: '1px 1px 1px black'}}
          >
            {article.category}
          </span>
        </div>
      )}
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-gray-800 leading-tight mb-4 line-clamp-2 group-hover:text-bloomPink transition-colors flex-grow">
        {article.title}
      </h3>
      
      <div className="flex justify-end mt-auto pt-4">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (article.externalLink) {
              window.open(article.externalLink, '_blank');
            }
          }}
          className="bg-bloomPink text-white rounded-full hover:bg-gradient-to-r hover:from-bloomPink hover:to-bloomYellow transform group-hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
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
  stageCounts
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  stageCounts: { [key: string]: number };
}) => {
  const filters = [
    { key: "all", label: "All Articles", count: stageCounts.all || 0 },
    { key: "pregnant", label: "Pregnancy", count: stageCounts.pregnant || 0 },
    { key: "postpartum", label: "Postpartum", count: stageCounts.postpartum || 0 },
    { key: "earlyChildcare", label: "Early Childcare", count: stageCounts.earlyChildcare || 0 },
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get all articles using useMemo for performance
  const allArticles = useMemo(() => {
    const pregnantArticles = [
      ...pregnant.maternalTips.articles,
      ...pregnant.nutrition.articles,
      ...pregnant.symptoms.articles,
      ...pregnant.fitness.articles,
      ...pregnant.development.articles
    ];

    const postpartumArticles = [
      ...postpartum.mentalHealth.articles,
      ...postpartum.recovery.articles,
      ...postpartum.selfCare.articles,
      ...postpartum.breastfeeding.articles
    ];

    const earlyChildcareArticles = [
      ...earlyChildCare.newbornCare.articles,
      ...earlyChildCare.sleep.articles,
      ...earlyChildCare.feeding.articles,
      ...earlyChildCare.development.articles
    ];

    return {
      pregnant: pregnantArticles,
      postpartum: postpartumArticles,
      earlyChildcare: earlyChildcareArticles,
      all: [...pregnantArticles, ...postpartumArticles, ...earlyChildcareArticles]
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Helper function to filter articles by search query
  const filterArticlesBySearch = (articles: Article[]): Article[] => {
    if (!searchQuery.trim()) return articles;
    
    const query = searchQuery.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query) ||
      (article.content?.headline && article.content.headline.toLowerCase().includes(query)) ||
      (article.content?.intro && article.content.intro.toLowerCase().includes(query))
    );
  };

  // Calculate stage counts for filter buttons
  const stageCounts = useMemo(() => {
    const pregnantCount = filterArticlesBySearch(allArticles.pregnant).length;
    const postpartumCount = filterArticlesBySearch(allArticles.postpartum).length;
    const earlyChildcareCount = filterArticlesBySearch(allArticles.earlyChildcare).length;
    
    return {
      all: pregnantCount + postpartumCount + earlyChildcareCount,
      pregnant: pregnantCount,
      postpartum: postpartumCount,
      earlyChildcare: earlyChildcareCount
    };
  }, [searchQuery, allArticles]);

  // Filter articles based on active filter and search query
  const getFilteredArticles = (): ArticleSection => {
    let articlesToFilter: Article[] = [];

    // Get base articles based on active filter
    switch (activeFilter) {
      case "pregnant":
        articlesToFilter = allArticles.pregnant;
        break;
      case "postpartum":
        articlesToFilter = allArticles.postpartum;
        break;
      case "earlyChildcare":
        articlesToFilter = allArticles.earlyChildcare;
        break;
      default: // "all"
        articlesToFilter = allArticles.all;
    }

    // Apply search filtering
    const filteredArticles = filterArticlesBySearch(articlesToFilter);

    // If showing "all", group by stage for display
    if (activeFilter === "all") {
      const grouped: ArticleSection = {};
      
      filteredArticles.forEach(article => {
        // Determine which stage this article belongs to
        let stage = "";
        if (allArticles.pregnant.some(a => a.id === article.id)) {
          stage = "pregnant";
        } else if (allArticles.postpartum.some(a => a.id === article.id)) {
          stage = "postpartum";
        } else {
          stage = "earlyChildcare";
        }

        if (!grouped[stage]) {
          grouped[stage] = [];
        }
        grouped[stage].push(article);
      });

      return grouped;
    } else {
      // For specific stage filters, just return that stage
      return { [activeFilter]: filteredArticles };
    }
  };

  // Use useMemo to prevent unnecessary recalculations
  const filteredSections = useMemo(() => getFilteredArticles(), [activeFilter, searchQuery, allArticles]);

  // Check if search has no results
  const hasNoResults = Boolean(searchQuery && Object.keys(filteredSections).length === 0);

  // Handle article click
  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // === SECTION TITLE HELPER ===
  const getSectionTitle = (section: string) => {
    const titles = {
      pregnant: "Pregnancy Articles",
      postpartum: "Postpartum Care", 
      earlyChildcare: "Early Childcare"
    };
    return titles[section as keyof typeof titles] || section;
  };

  // === MAIN PAGE ===
  return (
    <div 
      className="bg-pink-50 flex flex-col font-poppins relative"
      style={{
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main scrollable content area */}
      <div 
        className={`flex-1 w-full ${isModalOpen ? 'blur-sm' : ''}`}
        style={{
          height: 'calc(100vh - 80px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          paddingTop: '20px'
        }}
      >
        {/* Background decorative element */}
        <div 
          className="fixed top-20 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse pointer-events-none"
          style={{
            zIndex: 0
          }}
        />

        {/* Content Container */}
        <div 
          className="relative z-10"
          style={{
            minHeight: '1000px'
          }}
        >
          {/* BLOOMGUIDE HEADER WITH LOGO */}
          <div className="text-center mt-5 px-6 py-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-bloomPink to-bloomYellow p-2 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <h1 className="font-poppins font-bold text-4xl bg-bloomPink bg-clip-text text-transparent">
                  BloomGuide
                </h1>
                <div className="font-rubik font-light text-md text-[#474747] -mt-1 -ml-2">know more, care better</div>
              </div>
            </div>
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
            stageCounts={stageCounts}
          />

          {/* ARTICLES SECTIONS */}
          <div className="pb-32">
            {Object.entries(filteredSections).map(([section, articles]) => (
              <section key={section} className="px-8 mb-12 mt-8">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-3xl font-bold text-bloomPink">
                    {getSectionTitle(section)}
                  </h2>
                  <span className="bg-bloomPink/10 text-bloomPink px-3 py-1 rounded-full text-sm font-medium">
                    {articles.length} {articles.length === 1 ? 'article' : 'articles'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article, i) => (
                    <ArticleCard 
                      key={`${article.id}-${i}`} 
                      article={article}
                      onClick={() => handleArticleClick(article)}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* Show message if no articles found */}
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
        </div>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 group">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
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