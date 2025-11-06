import React, { useState, ReactElement } from "react";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { Sprout, Flower, Flower2 } from "lucide-react";
import "../index.css";

export default function PremiumPage(): ReactElement {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const plans = [
    {
      title: "Basic",
      price: (
        <>
          ₱ 0 - Free
        </>
      ),
      bullets: [
        "Dashboard — For pregnancy only",
        "BloomGuide — 3 reads per week",
        "Planner — Basic To Do List only",
        "Health Tracker — Weight & Mood only",
        "BB's Tools — Due Date Calculator only",
        "Journal — Notes and 5 photos only",
      ],
      cta: "Return to Basic",
      variant: "basic",
      Icon: Sprout,
    },
    {
      title: "Advanced",
      price: (
        <>
          ₱ 149 <span className="text-black">/month</span>
        </>
      ),
      bullets: [
        "Dashboard — For pregnancy & postpartum only",
        "BloomGuide — 8 reads per week",
        "Planner — To Do List + Calendar",
        "Health Tracker — Weight, BMI, Mood, Heart rate only",
        "BB's Tools — All pregnant tools + Feeding log only",
        "Journal — Notes + 2 unlimited Photo Albums",
      ],
      cta: "You're Currently Using",
      variant: "advanced",
      Icon: Flower,
    },
    {
      title: "Premium",
      price: (
        <>
          ₱ 299 <span className="text-black">/month</span>
        </>
      ),
      bullets: [
        "Dashboard — For all stages",
        "BloomGuide — Unlimited reads",
        "Planner — To Do List + Calendar",
        "Health Tracker — All Health, Mood, and Symptom Logs",
        "BB's Tools — All tools for the baby",
        "Journal — Unlimited Notes + Photo Album",
      ],
      cta: "Choose Premium",
      variant: "premium",
      Icon: Flower2,
    },
  ];

  const buttonFor = (variant: string) => {
    if (variant === "advanced") {
      return (
        <button
          aria-disabled
          className="w-full py-2 rounded-full font-semibold shadow-md bg-gradient-to-r from-[#F875AA] to-[#F3E198] text-bloomWhite pointer-events-none"
        >
          You're Currently Using
        </button>
      );
    }
    if (variant === "premium") {
      return (
        <button className="w-full py-2 rounded-full font-semibold shadow-md bg-gradient-to-r from-[#F875AA] to-[#F3E198] text-bloomWhite hover:opacity-95 transition">
          Choose Premium
        </button>
      );
    }
    return (
      <button className="w-full py-2 rounded-full font-semibold shadow-md bg-gradient-to-r from-[#F875AA] to-[#F3E198] text-bloomWhite hover:opacity-95 transition">
        Return to Basic
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header onMenuClick={toggleSidebar} />

      {/* Sidebar controlled by state */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-bloomPink tracking-tight">
            Subscription Plans
          </h1>
          <p className="mt-2 text-gray-600">Find your plan, find your bloom.</p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.Icon;
            return (
              <section
                key={plan.title}
                className={`rounded-2xl p-6 backdrop-blur-sm border shadow-xl flex flex-col justify-between h-full transition-all duration-200 ${
                  plan.variant === "advanced"
                    ? "bg-pink-50 border-pink-200 ring-1 ring-pink-100"
                    : "bg-white/95 border-gray-100"
                }`}
              >
                <div>
                  <div className="flex flex-col items-center text-center">
                    {/* Icon in rounded square with gradient background (matches provided image) */}
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
                        style={{
                          background:
                            "linear-gradient(135deg, #F875AA 0%, #F3E198 100%)",
                        }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h2 className="text-2xl font-bold text-bloomPink">
                        {plan.title}
                      </h2>
                    </div>

                    {/* Price inline with vertical gradient for the price part */}
                    <p className="text-lg font-semibold bg-gradient-to-b from-[#F875AA] to-[#F3E198] bg-clip-text text-transparent">
                      {plan.price}
                    </p>
                  </div>

                  <ul className="mt-6 space-y-3 text-sm text-gray-600 divide-y divide-gray-100">
                    {plan.bullets.map((b, i) => (
                      <li key={i} className="py-2 flex items-start gap-3">
                        <span className="mt-1 mr-2 text-pink-400">•</span>
                        <span className="leading-tight">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">{buttonFor(plan.variant)}</div>
              </section>
            );
          })}
        </div>

        {/* FAQ box */}
        <div className="mt-8 rounded-2xl bg-white p-6 border border-gray-100 shadow-lg">
          <h3 className="text-xl font-semibold text-bloomPink">
            Frequently Asked Questions
          </h3>
          <div className="mt-4 text-gray-700 space-y-4">
            <div>
              <p className="font-semibold">Can I change my plan later?</p>
              <p className="text-sm text-gray-600 mt-1">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                will be applied at the start of your next billing cycle.
              </p>
            </div>

            <div>
              <p className="font-semibold">Is there a free trial?</p>
              <p className="text-sm text-gray-600 mt-1">
                Yes, all new users get a 7-day free trial of the Premium plan to
                explore all features of BloomBuhay.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-gray-500">
        © {new Date().getFullYear()} BloomBuhay
      </footer>
    </div>
  );
}