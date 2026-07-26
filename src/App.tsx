import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { AnalyzerForm } from "./components/AnalyzerForm";
import { AnalysisResults } from "./components/AnalysisResults";
import { ScamLibrary } from "./components/ScamLibrary";
import { SafetyQuiz } from "./components/SafetyQuiz";
import { HistoryList } from "./components/HistoryList";
import { AnalysisType, ScamAnalysisResult } from "./types";
import { ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";

import { analyzeWithClientGemini } from "./lib/clientAnalyzer";

export default function App() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "library" | "quiz" | "history">("analyzer");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<ScamAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Saved Scan History (Stored locally)
  const [savedHistory, setSavedHistory] = useState<ScamAnalysisResult[]>([]);

  // Load local history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("scamguard_saved_scans");
      if (stored) setSavedHistory(JSON.parse(stored));
    } catch {
      setSavedHistory([]);
    }
  }, []);

  // Sync changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("scamguard_saved_scans", JSON.stringify(savedHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [savedHistory]);

  const handleRunAnalysis = async (payload: {
    analysisType: AnalysisType;
    content: string;
    additionalInfo: {
      clientPlatform: string;
      offeredPay: string;
      paymentMethod: string;
      communicationChannel: string;
    };
    imageB64?: string;
    imageMime?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      let data: ScamAnalysisResult;

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          data = await res.json();
        } else {
          // If server API route is not found or fails (e.g. static hosting on Netlify / GitHub Pages)
          console.warn(`Server API returned status ${res.status}. Falling back to client-side Gemini analysis...`);
          data = await analyzeWithClientGemini(payload);
        }
      } catch (networkOrServerErr) {
        console.warn("Express API endpoint unreachable. Falling back to direct client-side Gemini AI analysis...", networkOrServerErr);
        data = await analyzeWithClientGemini(payload);
      }

      setActiveResult(data);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Failed to analyze input. Please check your network and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSave = (result: ScamAnalysisResult) => {
    const exists = savedHistory.some((item) => item.id === result.id);
    if (exists) {
      setSavedHistory((prev) => prev.filter((item) => item.id !== result.id));
    } else {
      setSavedHistory((prev) => [result, ...prev]);
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setSavedHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all saved scan reports?")) {
      setSavedHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white justify-between">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setError(null);
        }}
        savedCount={savedHistory.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero Banner (Shown when on analyzer tab & no active result) */}
        {activeTab === "analyzer" && !activeResult && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs relative overflow-hidden">
            <div className="max-w-3xl space-y-4 relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>End-to-End Client Vetting & Fraud Detection</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Scan Any Freelance Job Post, Client Email, or Contract Clause
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Paste suspicious client messages, Telegram handles, project descriptions, or upload screenshots. ShieldLance evaluates fake check equipment traps, off-platform steering, unpaid spec work, and bad contract terms in seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-2">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fake Check & Wire Trap Detection</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Telegram/WhatsApp Red Flag Alerts</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Safe Boundary Reply Generator</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ERROR DISPLAY BANNER */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded-lg transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: ANALYZER TAB */}
        {activeTab === "analyzer" && (
          <div>
            {activeResult ? (
              <AnalysisResults
                result={activeResult}
                onReset={() => setActiveResult(null)}
                onSave={handleToggleSave}
                isSaved={savedHistory.some((i) => i.id === activeResult.id)}
              />
            ) : (
              <AnalyzerForm onAnalyze={handleRunAnalysis} isLoading={isLoading} />
            )}
          </div>
        )}

        {/* TAB 2: SCAM LIBRARY TAB */}
        {activeTab === "library" && <ScamLibrary />}

        {/* TAB 3: SAFETY QUIZ TAB */}
        {activeTab === "quiz" && <SafetyQuiz />}

        {/* TAB 4: HISTORY TAB */}
        {activeTab === "history" && (
          <HistoryList
            history={savedHistory}
            onSelectResult={(item) => {
              setActiveResult(item);
              setActiveTab("analyzer");
            }}
            onClearHistory={handleClearHistory}
            onDeleteOne={handleDeleteHistoryItem}
          />
        )}
      </main>

      {/* Dark Footer Banner */}
      <footer className="h-16 bg-slate-900 border-t border-slate-800 text-slate-400 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 shrink-0 text-xs gap-2 py-2 sm:py-0">
        <div>
          <span>&copy; {new Date().getFullYear()} ShieldLance Safety Platform. Instant Access & No Sign-In Required.</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">Gemini AI Live Engine Active</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
