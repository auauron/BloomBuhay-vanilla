import React from "react";
import { Info, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PregnancyTips from "../ui/pregnancyTips";
import PostpartumTip from "../ui/postpartumTips";
import EarlyChildcareTips from "../ui/earlyChildcareTips";
import { motion } from "framer-motion";

interface TipsSectionProps {
  canonicalStageKey: string | null;
}

export default function DashboardTipsSection({ canonicalStageKey }: TipsSectionProps) {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    let stage = "all";
    if (canonicalStageKey === "pregnant") stage = "pregnant";
    if (canonicalStageKey === "postpartum") stage = "postpartum"; 
    if (canonicalStageKey === "childcare") stage = "earlyChildcare";
    
    navigate(`/bloomguide?stage=${stage}`);
  };

  const getStageTitle = () => {
    switch (canonicalStageKey) {
      case "pregnant":
        return "Pregnancy Tips";
      case "postpartum":
        return "Postpartum Tips";
      case "childcare":
        return "Childcare Tips";
      default:
        return "Tips";
    }
  };

  return (
    <div className="bg-gradient-to-r from-bloomPink to-bloomYellow p-[16px] rounded-2xl shadow-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl ml-2 font-bold text-white">{getStageTitle()}</h3>
        <button
          onClick={handleLearnMore}
          className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200 group"
          title="Learn more about this stage"
        >
          <Info className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[14px] p-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        <div className="space-y-3">
          {canonicalStageKey === "pregnant" && (
            <>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <PregnancyTips className="text-sm text-gray-700 leading-relaxed" />
              </div>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <PregnancyTips className="text-sm text-gray-700 leading-relaxed" />
              </div>
            </>
          )}
          {canonicalStageKey === "postpartum" && ( 
            <>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <PostpartumTip className="text-sm text-gray-700 leading-relaxed" />
              </div>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <PostpartumTip className="text-sm text-gray-700 leading-relaxed" />
              </div>
            </>
          )}
          {canonicalStageKey === "childcare" && ( 
            <>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <EarlyChildcareTips className="text-sm text-gray-700 leading-relaxed" />
              </div>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <EarlyChildcareTips className="text-sm text-gray-700 leading-relaxed" />
              </div>
            </>
          )}
          {!canonicalStageKey && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-bloomPink/10 to-bloomYellow/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Info className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Complete Your Profile</p>
              <p className="text-gray-500 text-sm mt-1">Get personalized tips for your stage</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}