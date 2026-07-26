import React, { useState } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Bookmark, 
  HelpCircle, 
  ArrowLeft, 
  Send, 
  FileText,
  Lock,
  Sparkles
} from "lucide-react";
import { ScamAnalysisResult, RiskSeverity } from "../types";

interface AnalysisResultsProps {
  result: ScamAnalysisResult;
  onReset: () => void;
  onSave: (result: ScamAnalysisResult) => void;
  isSaved: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  onReset,
  onSave,
  isSaved,
}) => {
  const [copiedReply, setCopiedReply] = useState(false);
  const [activeTab, setActiveTab] = useState<"redFlags" | "actions" | "reply" | "questions">("redFlags");

  const handleCopyReply = () => {
    navigator.clipboard.writeText(result.suggestedReply);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  // Determine Risk Color Themes
  const getRiskTheme = (score: number) => {
    if (score >= 75) {
      return {
        bg: "bg-white border-slate-200",
        badgeBg: "bg-red-100 text-red-700",
        stroke: "text-red-500",
        text: "text-red-600",
        meterBg: "bg-red-50",
        icon: ShieldAlert,
        levelText: "Extreme Risk Detected"
      };
    } else if (score >= 40) {
      return {
        bg: "bg-white border-slate-200",
        badgeBg: "bg-amber-100 text-amber-800",
        stroke: "text-amber-500",
        text: "text-amber-600",
        meterBg: "bg-amber-50",
        icon: AlertTriangle,
        levelText: "Moderate Concern Detected"
      };
    } else {
      return {
        bg: "bg-white border-slate-200",
        badgeBg: "bg-emerald-100 text-emerald-800",
        stroke: "text-emerald-500",
        text: "text-emerald-600",
        meterBg: "bg-emerald-50",
        icon: ShieldCheck,
        levelText: "Low Risk / Safe Verified"
      };
    }
  };

  const theme = getRiskTheme(result.riskScore);
  const IconComponent = theme.icon;

  const getSeverityBadge = (severity: RiskSeverity) => {
    switch (severity) {
      case "critical":
        return <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-red-600 text-white">Critical</span>;
      case "high":
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">High</span>;
      case "medium":
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">Medium</span>;
      default:
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar with Back button & Save */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>New Client Audit</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSave(result)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
              isSaved
                ? "bg-amber-500 text-slate-950 shadow-sm"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSaved ? "Saved to Cloud" : "Save Report"}</span>
          </button>
        </div>
      </div>

      {/* Main Score Banner */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Risk Meter Card */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 border border-slate-200 rounded-2xl flex flex-col items-center justify-center shadow-xs">
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle 
                cx="64" 
                cy="64" 
                r="56" 
                stroke="currentColor" 
                strokeWidth="12" 
                fill="transparent" 
                strokeDasharray="351" 
                strokeDashoffset={351 - (351 * result.riskScore) / 100} 
                className={theme.stroke} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900">{result.riskScore}%</span>
              <span className={`text-[10px] font-extrabold uppercase ${theme.text}`}>Risk Score</span>
            </div>
          </div>
          <p className="mt-3 text-sm font-bold text-slate-800">{theme.levelText}</p>
          <span className={`mt-2 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${theme.badgeBg}`}>
            {result.riskLevel}
          </span>
        </div>

        {/* Report Summary Card */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-widest">
              Audit Report: {result.titleSnippet || "Client Credentials"}
            </h3>
            <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase ${theme.badgeBg}`}>
              {result.scamType}
            </span>
          </div>

          <div className="p-6 space-y-4 flex-1">
            <div className="flex items-start space-x-3">
              <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${theme.text}`} />
              <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
                {result.summary}
              </p>
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Verified with ShieldLance AI Core</span>
            <span>ID: {result.id.slice(0, 8)}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("redFlags")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "redFlags"
              ? "border-red-600 text-red-600 bg-red-50/60"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Red Flags ({result.redFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("actions")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "actions"
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/60"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Action Plan ({result.recommendedActions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("reply")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "reply"
              ? "border-emerald-600 text-emerald-600 bg-emerald-50/60"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Send className="w-4 h-4 text-emerald-600" />
          <span>Safe Reply Generator</span>
        </button>

        <button
          onClick={() => setActiveTab("questions")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "questions"
              ? "border-amber-600 text-amber-600 bg-amber-50/60"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Probing Questions</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">

        {/* RED FLAGS TAB */}
        {activeTab === "redFlags" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Identified Fraud Signals & Vulnerabilities</span>
              </h3>

              {result.redFlags.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-200">
                  No explicit red flags detected in the provided client credentials.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {result.redFlags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          {getSeverityBadge(flag.severity)}
                          <span className="font-bold text-sm text-slate-900">{flag.title}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {flag.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-1 font-medium">
                        {flag.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Green Flags if any */}
            {result.greenFlags && result.greenFlags.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Legitimacy Signals</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.greenFlags.map((gFlag, idx) => (
                    <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs">
                      <span className="font-bold text-emerald-800 block mb-1">{gFlag.title}</span>
                      <span className="text-slate-600">{gFlag.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contract Concerns if any */}
            {result.contractConcerns && result.contractConcerns.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Contract & Escrow Clauses to Audit</span>
                </h3>
                <ul className="space-y-2">
                  {result.contractConcerns.map((concern, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 font-medium">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{concern}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ACTION PLAN TAB */}
        {activeTab === "actions" && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>Recommended Freelancer Protection Protocol</span>
            </h3>

            <div className="space-y-3">
              {result.recommendedActions.map((action, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SAFE REPLY GENERATOR TAB */}
        {activeTab === "reply" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Diplomatic Boundary Reply</span>
                </h3>
                <p className="text-xs text-slate-500">Send this copy to test client authenticity or safely decline off-platform traps.</p>
              </div>

              <button
                onClick={handleCopyReply}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {copiedReply ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Response</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-all">
              {result.suggestedReply}
            </div>
          </div>
        )}

        {/* PROBING QUESTIONS TAB */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Probing Questions to Test Client Intent</span>
            </h3>
            <p className="text-xs text-slate-500">
              Professional questions that force real clients to verify themselves without sounding accusatory.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {result.safeQuestionsToAsk.map((q, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-3">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
