import React from "react";
import {
  Shield,
  BookOpen,
  HelpCircle,
  History
} from "lucide-react";

interface NavbarProps {
  activeTab: "analyzer" | "library" | "quiz" | "history";
  setActiveTab: (tab: "analyzer" | "library" | "quiz" | "history") => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 text-slate-800 px-4 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
      {/* Brand & Live Badge */}
      <div className="flex items-center space-x-6">
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setActiveTab("analyzer")}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-indigo-600/30 group-hover:bg-indigo-700 transition-colors">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              ShieldLance
            </span>
            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-xs rounded">
              BETA
            </span>
          </div>
        </div>

        {/* Database Status */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="uppercase tracking-wider">Database Live: 1.2M Entries</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center space-x-1 sm:space-x-2">
        <button
          id="nav-analyzer-btn"
          onClick={() => setActiveTab("analyzer")}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "analyzer"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Shield className="w-4 h-4 text-indigo-600" />
          <span>Vetting Tool</span>
        </button>

        <button
          id="nav-library-btn"
          onClick={() => setActiveTab("library")}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "library"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Scam Database</span>
        </button>

        <button
          id="nav-quiz-btn"
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "quiz"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">Safety Test</span>
        </button>

        <button
          id="nav-history-btn"
          onClick={() => setActiveTab("history")}
          className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "history"
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <History className="w-4 h-4 text-indigo-600" />
          <span className="hidden sm:inline">History</span>
          {savedCount > 0 && (
            <span className="ml-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
              {savedCount}
            </span>
          )}
        </button>
      </nav>

      {/* Right Side Status Indicator */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Instant Access & Auto-Saved</span>
        </div>
      </div>
    </header>
  );
};
