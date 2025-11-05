import React, { useState } from "react";
import Header from "../components/ui/Header";



export default function SubscriptionPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const plans = [
    {
      title: "Basic",
      price: "₱ 0 - Free",
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
    },
    {
      title: "Advanced",
      price: "₱ 149 /month",
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
    },
    {
      title: "Premium",
      price: "₱ 299 /month",
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
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header onMenuClick={toggleSidebar} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-pink-600">Subscription Plans</h1>
          <p className="mt-2 text-gray-600">Find your plan, find your bloom.</p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {plans.map((plan) => (
            <section
              key={plan.title}
              className={`rounded-2xl p-6 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-xl flex flex-col justify-between h-full`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-pink-600">{plan.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{plan.price}</p>
                  </div>
                  {/* Simple decorative icon circle */}
                  <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zM6 20a6 6 0 0112 0H6z" />
                    </svg>
                  </div>
                </div>

                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  {plan.bullets.map((b, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mt-1 mr-3">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <button
                  className={`w-full py-2 rounded-full font-semibold shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-pink-200 `}
                >
                  {plan.cta}
                </button>
              </div>
            </section>
          ))}
        </div>

        {/* FAQ box */}
        <div className="mt-8 rounded-2xl bg-white p-6 border border-gray-100 shadow-lg">
          <h3 className="text-xl font-semibold text-pink-600">Frequently Asked Questions</h3>
          <div className="mt-4 text-gray-700 space-y-4">
            <div>
              <p className="font-semibold">Can I change my plan later?</p>
              <p className="text-sm text-gray-600 mt-1">Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next billing cycle.</p>
            </div>

            <div>
              <p className="font-semibold">Is there a free trial?</p>
              <p className="text-sm text-gray-600 mt-1">Yes, all new users get a 7-day free trial of the Premium plan to explore all features of BloomBuhay.</p>
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
