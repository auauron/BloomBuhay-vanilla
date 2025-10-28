import React, { useState } from "react";
import Landing from "./pages/Landing";
import ArticlePage from "./pages/ArticlePage";

export default function App() {
  const [page, setPage] = useState<"landing" | "articles">("articles");

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 space-x-2">
        <button className="px-3 py-1 rounded bg-white/80" onClick={() => setPage("landing")}>Landing</button>
        <button className="px-3 py-1 rounded bg-white/80" onClick={() => setPage("articles")}>ArticlePage</button>
      </div>
      {page === "landing" ? <Landing /> : <ArticlePage />}
    </div>
  );
}
