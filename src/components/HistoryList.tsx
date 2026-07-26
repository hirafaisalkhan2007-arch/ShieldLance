import React, { useState } from "react";
import { History, Trash2, ExternalLink, Bookmark, Download, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { ScamAnalysisResult } from "../types";

interface HistoryListProps {
  history: ScamAnalysisResult[];
  onSelectResult: (result: ScamAnalysisResult) => void;
  onClearHistory: () => void;
  onDeleteOne: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onDeleteOne,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((item) =>
    item.titleSnippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.scamType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `scam_audits_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Cloud Synced Audit History ({history.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review past client vulnerability reports and saved scam analyses across your sessions.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClearHistory}
              className="flex items-center space-x-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3 shadow-xs">
          <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Saved Audit Reports</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Run a client scan using the Vetting Tool and click "Save Report" to persist your audit findings safely in your profile.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-2xs"
            >
              <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => onSelectResult(item)}>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                      item.riskScore >= 75
                        ? "bg-red-100 text-red-700"
                        : item.riskScore >= 40
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    Risk {item.riskScore}% ({item.riskLevel})
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{item.titleSnippet}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{item.summary}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onSelectResult(item)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 flex items-center space-x-1"
                >
                  <span>View Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteOne(item.id)}
                  title="Delete Audit"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
