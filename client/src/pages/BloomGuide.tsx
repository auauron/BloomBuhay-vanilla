import React, { useState, useMemo, useEffect } from "react";
import "../index.css";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { Search } from "lucide-react";
import { Article, ArticleSection } from "../types/guide";
import ArticleModal from '../components/ArticleModal';
import { BookOpen } from "lucide-react";
import { pregnant, postpartum, earlyChildCare, generalMotherhood } from '../data';
import { useSearchParams } from "react-router-dom";
import AIChat from '../components/ai/AIChat';


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
            style={{textShadow: '0.5px 1px 0.5px black'}}
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
            style={{textShadow: '0.5px 0.5px 0.5px black'}}
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

// === MAIN STAGE FILTER BUTTONS ===
const StageFilterButtons = ({ 
  activeStage, 
  setActiveStage,
  setActiveCategory,
  searchQuery,
  stageCounts
}: {
  activeStage: string;
  setActiveStage: (stage: string) => void;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  stageCounts: { [key: string]: number };
}) => {
  const stages = [
    { key: "all", label: "All Articles", count: stageCounts.all || 0 },
    { key: "generalMotherhood", label: "General Motherhood", count: stageCounts.generalMotherhood || 0 },
    { key: "pregnant", label: "Pregnancy", count: stageCounts.pregnant || 0 },
    { key: "postpartum", label: "Postpartum", count: stageCounts.postpartum || 0 },
    { key: "earlyChildcare", label: "Early Childcare", count: stageCounts.earlyChildcare || 0 },
  ];

  return (
    <div className="flex flex-wrap gap-3 px-6 pb-4">
      {stages.map((stage) => (
        <button
          key={stage.key}
          onClick={() => {
            setActiveStage(stage.key);
            setActiveCategory("all"); // Reset category when stage changes
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
            activeStage === stage.key
              ? "bg-bloomPink text-white border-transparent shadow-lg"
              : "bg-white text-gray-600 border-bloomPink/30 hover:border-bloomPink hover:shadow-md"
          }`}
        >
          <span className="font-medium">{stage.label}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            activeStage === stage.key 
              ? "bg-white/20 text-white" 
              : "bg-bloomPink/10 text-bloomPink"
          }`}>
            {stage.count}
          </span>
        </button>
      ))}
    </div>
  );
};

// === TRIMESTER/CATEGORY FILTER BUTTONS ===
const CategoryFilterButtons = ({ 
  activeStage,
  activeCategory, 
  setActiveCategory,
  searchQuery,
  categoryCounts
}: {
  activeStage: string;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  categoryCounts: { [key: string]: number };
}) => {
  // Define categories for each stage
  const stageCategories = {
    generalMotherhood: [
      { key: "all", label: "All General", count: categoryCounts.all || 0 },
      { key: "wellness", label: "Must Reads", count: categoryCounts.wellness || 0 },
      { key: "moods", label: "Moods & Emotions", count: categoryCounts.moods || 0 },
      { key: "symptoms", label: "Common Symptoms", count: categoryCounts.symptoms || 0 },
      { key: "tips", label: "Motherhood Tips", count: categoryCounts.tips || 0 },
      { key: "relationships", label: "Relationships", count: categoryCounts.relationships || 0 }
    ],
    pregnant: [
      { key: "all", label: "All Pregnancy", count: categoryCounts.all || 0 },
      { key: "first-trimester", label: "First Trimester", count: categoryCounts["first-trimester"] || 0 },
      { key: "second-trimester", label: "Second Trimester", count: categoryCounts["second-trimester"] || 0 },
      { key: "third-trimester", label: "Third Trimester", count: categoryCounts["third-trimester"] || 0 },
      { key: "nutrition", label: "Nutrition", count: categoryCounts.nutrition || 0 },
      { key: "fitness", label: "Fitness", count: categoryCounts.fitness || 0 },
      { key: "symptoms", label: "Symptoms", count: categoryCounts.symptoms || 0 }
    ],
    postpartum: [
      { key: "all", label: "All Postpartum", count: categoryCounts.all || 0 },
      { key: "recovery", label: "Physical Recovery", count: categoryCounts.recovery || 0 },
      { key: "mental-health", label: "Mental Health", count: categoryCounts["mental-health"] || 0 },
      { key: "breastfeeding", label: "Breastfeeding", count: categoryCounts.breastfeeding || 0 },
      { key: "self-care", label: "Self Care", count: categoryCounts["self-care"] || 0 }
    ],
    earlyChildcare: [
      { key: "all", label: "All Early Childcare", count: categoryCounts.all || 0 },
      { key: "newborn-care", label: "Newborn Care", count: categoryCounts["newborn-care"] || 0 },
      { key: "feeding", label: "Feeding", count: categoryCounts.feeding || 0 },
      { key: "sleep", label: "Sleep", count: categoryCounts.sleep || 0 },
      { key: "development", label: "Development", count: categoryCounts.development || 0 }
    ]
  };

  // Don't show category filters for "all" stage
  if (activeStage === "all") return null;

  const categories = stageCategories[activeStage as keyof typeof stageCategories] || [];

  return (
    <div className="flex flex-wrap gap-2 px-6 pb-4 border-b border-gray-200">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => setActiveCategory(category.key)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-sm ${
            activeCategory === category.key
              ? "bg-bloomPink/20 text-bloomPink border-bloomPink"
              : "bg-white text-gray-600 border-gray-300 hover:border-bloomPink"
          }`}
        >
          <span>{category.label}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
            activeCategory === category.key 
              ? "bg-bloomPink text-white" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
};

// === MAIN COMPONENT ===
export default function BloomGuide() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeStage, setActiveStage] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

    // Add URL parameter handling
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle URL parameters on component mount and when searchParams change
  useEffect(() => {
    const stage = searchParams.get('stage');
    const category = searchParams.get('category');
    
    if (stage) {
      setActiveStage(stage);
    }
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  
  // Update URL when filters change (optional)
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeStage !== "all") {
      params.set('stage', activeStage);
    }
    if (activeCategory !== "all") {
      params.set('category', activeCategory);
    }
    setSearchParams(params);
  }, [activeStage, activeCategory, setSearchParams]);


  // Get all articles using useMemo for performance
  const allArticles = useMemo(() => {
    const pregnantArticles = [
      ...pregnant.maternalTips.articles,
      ...pregnant.nutrition.articles,
      ...pregnant.symptoms.articles,
      ...pregnant.fitness.articles,
      ...pregnant.development.articles,
      ...pregnant.commonConcerns.articles,
      ...pregnant.medicalResearch.articles,
      ...pregnant.secondTrimester.articles,
      ...pregnant.earlyPregnancySigns.articles,
      ...pregnant.pregnancyConfirmation.articles,
      ...pregnant.trimesterSymptoms.articles,
      ...pregnant.exerciseChildbirth.articles,
      ...pregnant.safePregnancyExercise.articles,
      ...pregnant.nutritionBabyDevelopment.articles,
      ...pregnant.pregnancyNutritionGuide.articles,
      ...pregnant.pregnancyExerciseBenefits.articles,
      ...pregnant.maternalNutritionEssentials.articles
    ];

    const postpartumArticles = [
      ...postpartum.mentalHealth.articles,
      ...postpartum.recovery.articles,
      ...postpartum.selfCare.articles,
      ...postpartum.breastfeeding.articles,
      ...postpartum.physicalChanges.articles,
      ...postpartum.bf2.articles,
      ...postpartum.firstWeeksCare.articles,
      ...postpartum.maternalMentalHealth.articles
    ];

    const earlyChildcareArticles = [
      ...earlyChildCare.newbornCare.articles,
      ...earlyChildCare.sleep.articles,
      ...earlyChildCare.feeding.articles,
      ...earlyChildCare.development.articles,
      ...earlyChildCare.health.articles,
      ...earlyChildCare.infantFeedingWHO.articles,
      ...earlyChildCare.earlyNutritionCDC.articles,
      ...earlyChildCare.childcareFeedingPractices.articles,
      ...earlyChildCare.sleepDevelopment.articles,
      ...earlyChildCare.childcareSleepRoutines.articles,
      ...earlyChildCare.healthySleepHabits.articles
    ];

    // Use actual generalMotherhood data
    const generalMotherhoodArticles = [
      ...generalMotherhood.moods.articles,
      ...generalMotherhood.mustReads.articles,
      ...generalMotherhood.symptoms.articles,
      ...generalMotherhood.relationships.articles,
      ...generalMotherhood.tips.articles
    ];

    return {
      generalMotherhood: generalMotherhoodArticles,
      pregnant: pregnantArticles,
      postpartum: postpartumArticles,
      earlyChildcare: earlyChildcareArticles,
      all: [...generalMotherhoodArticles, ...pregnantArticles, ...postpartumArticles, ...earlyChildcareArticles]
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

  // Categorize general motherhood articles
  const categorizeGeneralMotherhoodArticles = (articles: Article[]) => {
    const categorized = {
      "moods": articles.filter(article => 
        article.category === "Moods" || 
        article.title.toLowerCase().includes("mood") ||
        article.title.toLowerCase().includes("emotional")
      ),
      "symptoms": articles.filter(article => 
        article.category === "Symptoms" || 
        article.title.toLowerCase().includes("symptom")
      ),
      "tips": articles.filter(article => 
        article.category === "Tips" || 
        article.title.toLowerCase().includes("tip") ||
        article.title.toLowerCase().includes("advice")
      ),
      "wellness": articles.filter(article => 
        article.category === "MustReads" || 
        article.title.toLowerCase().includes("mustreads") ||
        article.title.toLowerCase().includes("self-care") 
      ),
      "relationships": articles.filter(article => 
        article.category === "Relationships" || 
        article.title.toLowerCase().includes("relationship") ||
        article.title.toLowerCase().includes("partner")
      )
    };
    
    return categorized;
  };

  // Categorize pregnancy articles by trimester - UPDATED WITH SINGLE CATEGORY FIELD
    const categorizePregnancyArticles = (articles: Article[]) => {
      const categorized = {
        "first-trimester": articles.filter(article => 
          article.category.includes("First Trimester") ||
          article.id === "baby-development-5-weeks" ||
          article.id === "body-adjusting-pregnancy" ||
          article.id === "managing-morning-sickness" ||
          article.id === "early-pregnancy-signs-symptoms" ||
          article.id === "pregnancy-symptoms-confirmation" ||
          article.id === "comprehensive-pregnancy-symptoms-guide" ||
          article.id === "exercise-easier-childbirth" || // NEW - appears in fitness AND first-trimester
          article.id === "nutrition-baby-development"    // NEW - appears in nutrition AND first-trimester
        ),
        "second-trimester": articles.filter(article => 
          article.category.includes("Second Trimester") ||
          article.id === "pregnancy-second-trimester" ||
          article.title.includes("Second Trimester") ||
          article.id === "comprehensive-pregnancy-symptoms-guide" ||
          article.id === "safe-pregnancy-exercise-guide" || // appears in fitness AND second-trimester
          article.id === "nutrition-baby-development"       // appears in nutrition AND second-trimester
        ),
        "third-trimester": articles.filter(article => 
          article.category.includes("Third Trimester") ||
          article.id === "fetal-development-stages" ||
          article.title.includes("Third Trimester") ||
          article.id === "comprehensive-pregnancy-symptoms-guide" ||
          article.id === "safe-pregnancy-exercise-guide" || // appears in fitness AND third-trimester
          article.id === "nutrition-baby-development"       // ppears in nutrition AND third-trimester
        ),
        "nutrition": articles.filter(article => 
          article.category.includes("Nutrition") ||
          article.id === "nutrition-tips-early-pregnancy" ||
          article.id === "nutrition-baby-development" ||     
          article.id === "comprehensive-pregnancy-nutrition"  
        ),
        "fitness": articles.filter(article => 
          article.category.includes("Fitness") ||
          article.id === "exercise-first-trimester" ||
          article.id === "exercise-easier-childbirth" ||       
          article.id === "safe-pregnancy-exercise-guide"        
        ),
        "symptoms": articles.filter(article => 
          article.category.includes("Symptoms") ||
          article.id === "managing-morning-sickness" ||
          article.id === "early-pregnancy-signs-symptoms" ||
          article.id === "pregnancy-symptoms-confirmation" ||
          article.id === "comprehensive-pregnancy-symptoms-guide" ||
          article.id === "comprehensive-pregnancy-nutrition"    // appears in nutrition AND symptoms
        )
      };
    
    return categorized;
  };

  // Categorize early childcare articles for multiple filters
    const categorizeEarlyChildcareArticles = (articles: Article[]) => {
      const categorized = {
        "newborn-care": articles.filter(article => 
          article.category === "Baby Care" || 
          article.category === "Health" ||
          article.id === "who-infant-feeding-guidelines" ||    // Feeding article in newborn care too
          article.id === "early-nutrition-foundations" ||      // Feeding article in newborn care too
          article.id === "childcare-feeding-best-practices" || // Feeding article in newborn care too
          article.id === "stress-free-childcare-sleep" ||      // Sleep article in newborn care too
          article.id === "encouraging-healthy-sleep-habits"    // Sleep article in newborn care too
        ),
        "feeding": articles.filter(article => 
          article.category === "Feeding" ||
          article.id === "who-infant-feeding-guidelines" ||
          article.id === "early-nutrition-foundations" ||
          article.id === "childcare-feeding-best-practices"
        ),
        "sleep": articles.filter(article => 
          article.category === "Sleep" ||
          article.id === "sleep-early-childhood-development" ||
          article.id === "stress-free-childcare-sleep" ||
          article.id === "encouraging-healthy-sleep-habits"
        ),
        "development": articles.filter(article => 
          article.category === "Development" ||
          article.id === "sleep-early-childhood-development" ||  // Sleep article in development too
          article.id === "encouraging-healthy-sleep-habits"      // Sleep article in development too
        )
      };
      
      return categorized;
    };

  // Calculate stage counts for filter buttons
  const stageCounts = useMemo(() => {
    const generalCount = filterArticlesBySearch(allArticles.generalMotherhood).length;
    const pregnantCount = filterArticlesBySearch(allArticles.pregnant).length;
    const postpartumCount = filterArticlesBySearch(allArticles.postpartum).length;
    const earlyChildcareCount = filterArticlesBySearch(allArticles.earlyChildcare).length;
    
    return {
      all: generalCount + pregnantCount + postpartumCount + earlyChildcareCount,
      generalMotherhood: generalCount,
      pregnant: pregnantCount,
      postpartum: postpartumCount,
      earlyChildcare: earlyChildcareCount
    };
  }, [searchQuery, allArticles]);

  // Calculate category counts
  const categoryCounts = useMemo((): { [key: string]: number } => {
    if (activeStage === "all") return {};
    
    const stageArticles = allArticles[activeStage as keyof typeof allArticles];
    const filteredArticles = filterArticlesBySearch(stageArticles);
    
    if (activeStage === "generalMotherhood") {
      const categorized = categorizeGeneralMotherhoodArticles(filteredArticles);
      return {
        all: filteredArticles.length,
        "moods": categorized.moods?.length || 0,
        "symptoms": categorized.symptoms?.length || 0,
        "tips": categorized.tips?.length || 0,
        "wellness": categorized.wellness?.length || 0,
        "relationships": categorized.relationships?.length || 0
      };
    }
    
    if (activeStage === "pregnant") {
      const categorized = categorizePregnancyArticles(filteredArticles);
      return {
        all: filteredArticles.length,
        "first-trimester": categorized["first-trimester"]?.length || 0,
        "second-trimester": categorized["second-trimester"]?.length || 0,
        "third-trimester": categorized["third-trimester"]?.length || 0,
        "nutrition": categorized.nutrition?.length || 0,
        "fitness": categorized.fitness?.length || 0,
        "symptoms": categorized.symptoms?.length || 0
      };
    }
    
    if (activeStage === "postpartum") {
      return {
        all: filteredArticles.length,
        "recovery": filteredArticles.filter(a => a.category === "Fitness" || a.category === "Self-Care").length,
        "mental-health": filteredArticles.filter(a => a.category === "Mental Health").length,
        "breastfeeding": filteredArticles.filter(a => a.category === "Breastfeeding").length,
        "self-care": filteredArticles.filter(a => a.category === "Wellness").length
      };
    }
    
    if (activeStage === "earlyChildcare") {
      const categorized = categorizeEarlyChildcareArticles(filteredArticles);
      return {
        all: filteredArticles.length,
        "newborn-care": categorized["newborn-care"]?.length || 0,
        "feeding": categorized["feeding"]?.length || 0,
        "sleep": categorized["sleep"]?.length || 0,
        "development": categorized["development"]?.length || 0
      };
    }
    
    return {};
  }, [activeStage, searchQuery, allArticles]);

  // Filter articles based on active stage, category and search query
  const getFilteredArticles = (): ArticleSection => {
    let articlesToFilter: Article[] = [];

    // Get base articles based on active stage
    switch (activeStage) {
      case "generalMotherhood":
        articlesToFilter = allArticles.generalMotherhood;
        break;
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

    // Apply category filtering for specific stages
    if (activeStage === "generalMotherhood" && activeCategory !== "all") {
      const categorized = categorizeGeneralMotherhoodArticles(articlesToFilter);
      articlesToFilter = categorized[activeCategory as keyof typeof categorized] || [];
    } else if (activeStage === "pregnant" && activeCategory !== "all") {
      const categorized = categorizePregnancyArticles(articlesToFilter);
      articlesToFilter = categorized[activeCategory as keyof typeof categorized] || [];
    } else if (activeStage === "postpartum" && activeCategory !== "all") {
      switch (activeCategory) {
        case "recovery":
          articlesToFilter = articlesToFilter.filter(a => a.category === "Fitness" || a.category === "Self-Care");
          break;
        case "mental-health":
          articlesToFilter = articlesToFilter.filter(a => a.category === "Mental Health");
          break;
        case "breastfeeding":
          articlesToFilter = articlesToFilter.filter(a => a.category === "Breastfeeding");
          break;
        case "self-care":
          articlesToFilter = articlesToFilter.filter(a => a.category === "Wellness");
          break;
      }
    } else if (activeStage === "earlyChildcare" && activeCategory !== "all") {
        const categorized = categorizeEarlyChildcareArticles(articlesToFilter);
        articlesToFilter = categorized[activeCategory as keyof typeof categorized] || [];
      }

    // Apply search filtering
    const filteredArticles = filterArticlesBySearch(articlesToFilter);

    // If showing "all", group by stage for display
    if (activeStage === "all") {
      const grouped: ArticleSection = {};
      
      filteredArticles.forEach(article => {
        // Determine which stage this article belongs to
        let stage = "";
        if (allArticles.generalMotherhood.some(a => a.id === article.id)) {
          stage = "generalMotherhood";
        } else if (allArticles.pregnant.some(a => a.id === article.id)) {
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
      return { [activeStage]: filteredArticles };
    }
  };

  // Use useMemo to prevent unnecessary recalculations
  const filteredSections = useMemo(() => getFilteredArticles(), [activeStage, activeCategory, searchQuery, allArticles]);

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
      generalMotherhood: "General Motherhood",
      pregnant: "Pregnancy Articles",
      postpartum: "Postpartum Care", 
      earlyChildcare: "Early Childcare"
    };
    return titles[section as keyof typeof titles] || section;
  };

  // === MAIN PAGE ===
  return (
    <div 
      className="bg-white flex flex-col font-poppins relative"
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
     
        {/* Content Container */}
        <div 
          className="relative z-10"
          style={{
            minHeight: '1000px'
          }}
        >
          {/* BLOOMGUIDE HEADER WITH LOGO */}
          <div className="text-center py-8 px-4">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-bloomPink to-bloomYellow rounded-2xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-clip-text text-bloomPink">
                BloomGuide
              </h1>
            </div>
            <p className="text-bloomBlack font-rubik text-lg font-light max-w-2xl mx-auto">
              Know more, care better. <br></br>Wisdom for your motherhood journey.
            </p>
          </div>


          {/* SEARCH BAR */}
          <div className="w-full px-6 py-4">
            <GradientSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              hasNoResults={hasNoResults}
            />
          </div>

          {/* STAGE FILTER BUTTONS */}
          <StageFilterButtons 
            activeStage={activeStage}
            setActiveStage={setActiveStage}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            stageCounts={stageCounts}
          />

          {/* CATEGORY FILTER BUTTONS */}
          <CategoryFilterButtons 
            activeStage={activeStage}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            categoryCounts={categoryCounts}
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
      
      {/* ARTICLE MODAL */}
      <ArticleModal 
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AIChat />
    </div> 
  );
};