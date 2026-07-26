import React, { useState } from "react";
import { Search, BookOpen, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Copy, Check, Filter } from "lucide-react";
import { COMMON_SCAM_PATTERNS } from "../data/scamPatterns";
import { ScamPattern } from "../types";

export const ScamLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>("check-equipment");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["All", "Payment Scams", "Communication Traps", "Work Exploitation", "Identity Theft", "Malware & Phishing"];

  const filteredPatterns = COMMON_SCAM_PATTERNS.filter((pattern) => {
    const matchesCategory = selectedCategory === "All" || pattern.category === selectedCategory;
    const matchesSearch =
      pattern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.redFlagTriggers.some((rf) => rf.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyExample = (pattern: ScamPattern) => {
    navigator.clipboard.writeText(pattern.exampleMessage);
    setCopiedId(pattern.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Freelance Fraud Taxonomy & Scam Database
            </h2>
          </div>
          <p className="text-sm text-slate-600">
            Comprehensive catalog of scam vectors targeting remote developers, designers, copywriters, and virtual assistants.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scam catalog (e.g., check, Telegram, deposit, Figma test, overpayment)..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pattern Cards List */}
      <div className="space-y-4">
        {filteredPatterns.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
            No scam patterns found matching your query.
          </div>
        ) : (
          filteredPatterns.map((pattern) => {
            const isExpanded = expandedId === pattern.id;

            return (
              <div
                key={pattern.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-all shadow-2xs"
              >
                {/* Collapsible Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : pattern.id)}
                  className="p-5 sm:p-6 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {pattern.category}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">
                        Avg Risk: {pattern.riskScoreAvg}%
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{pattern.title}</h3>
                    <p className="text-xs text-slate-500">{pattern.tagline}</p>
                  </div>

                  <button className="p-2 text-slate-400 hover:text-slate-700">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Overview</h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{pattern.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* How It Works */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>Mechanism / Attack Vector</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {pattern.howItWorks.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-slate-400 font-bold">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Red Flag Triggers */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                          <span>Key Red Flag Phrases</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {pattern.redFlagTriggers.map((rf, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="text-red-500 font-bold">•</span>
                              <span>{rf}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* How to Protect */}
                    <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Countermeasures & Defense Protocol</span>
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-950 font-medium">
                        {pattern.howToProtect.map((prot, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{prot}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Example Message Snippet */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Real-World Example Snippet
                        </span>
                        <button
                          onClick={() => handleCopyExample(pattern)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 font-bold"
                        >
                          {copiedId === pattern.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === pattern.id ? "Copied!" : "Copy Example"}</span>
                        </button>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-700 italic">
                        "{pattern.exampleMessage}"
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
