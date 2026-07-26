import React, { useState } from "react";
import { 
  FileText, 
  MessageSquare, 
  FileCheck, 
  Globe, 
  Upload, 
  X, 
  Sparkles, 
  AlertTriangle, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Image as ImageIcon,
  Search
} from "lucide-react";
import { AnalysisType } from "../types";
import { PRESET_SAMPLES, PresetSample } from "../data/presets";

interface AnalyzerFormProps {
  onAnalyze: (req: {
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
  }) => void;
  isLoading: boolean;
}

export const AnalyzerForm: React.FC<AnalyzerFormProps> = ({ onAnalyze, isLoading }) => {
  const [analysisType, setAnalysisType] = useState<AnalysisType>("job_post");
  const [content, setContent] = useState<string>("");
  const [clientPlatform, setClientPlatform] = useState<string>("Upwork");
  const [offeredPay, setOfferedPay] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [communicationChannel, setCommunicationChannel] = useState<string>("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleApplyPreset = (sample: PresetSample) => {
    setAnalysisType(sample.analysisType);
    setContent(sample.content);
    setClientPlatform(sample.additionalInfo.clientPlatform);
    setOfferedPay(sample.additionalInfo.offeredPay);
    setPaymentMethod(sample.additionalInfo.paymentMethod);
    setCommunicationChannel(sample.additionalInfo.communicationChannel);
    setErrorMsg(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 8MB. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setImagePreview(b64);
      setImageMime(file.type || "image/png");
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageMime(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) {
      setErrorMsg("Please paste job details, email, or message text, OR upload a screenshot.");
      return;
    }
    setErrorMsg(null);
    onAnalyze({
      analysisType,
      content,
      additionalInfo: {
        clientPlatform,
        offeredPay,
        paymentMethod,
        communicationChannel,
      },
      imageB64: imagePreview || undefined,
      imageMime: imageMime || undefined,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-slate-800 space-y-6">
      
      {/* Type Selector Tabs */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          1. Select Audit Material Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setAnalysisType("job_post")}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
              analysisType === "job_post"
                ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Job Listing</span>
          </button>

          <button
            type="button"
            onClick={() => setAnalysisType("client_message")}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
              analysisType === "client_message"
                ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Client Message</span>
          </button>

          <button
            type="button"
            onClick={() => setAnalysisType("contract_terms")}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
              analysisType === "contract_terms"
                ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <FileCheck className="w-4 h-4 text-indigo-600" />
            <span>Contract Terms</span>
          </button>

          <button
            type="button"
            onClick={() => setAnalysisType("url_domain")}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
              analysisType === "url_domain"
                ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-2xs"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Website / URL</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Load Buttons */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Quick Preset Test Cases (1-Click Fill):
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleApplyPreset(sample)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold transition-colors flex items-center space-x-1 shadow-2xs"
            >
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Main Text Content Input */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            2. Paste Job Listing, Email, Message, Contract or Domain URL
          </label>
          <textarea
            id="scam-content-input"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              analysisType === "job_post"
                ? "e.g., 'Looking for remote Graphic Designer. $60/hr. Contact hr_talent_dept@telegram for fast interview process...'"
                : analysisType === "client_message"
                ? "e.g., 'We will send you a check for $4,500 to purchase equipment from our certified vendor prior to starting...'"
                : analysisType === "contract_terms"
                ? "e.g., 'Client reserves right to withhold payment if work requires unlimited revisions within 90 days...'"
                : "e.g., 'https://global-talent-recruitment-portal.tech'"
            }
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-sans transition-all"
          />
        </div>

        {/* Image Screenshot Upload */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            3. Upload Screenshot / Proof Image (Optional)
          </label>
          {imagePreview ? (
            <div className="relative inline-block rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2">
              <img
                src={imagePreview}
                alt="Screenshot Preview"
                className="max-h-48 rounded-lg object-contain"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center w-full px-4 py-4 bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer hover:bg-indigo-50/50 transition-all group">
              <div className="flex items-center space-x-3 text-slate-500 group-hover:text-indigo-700">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-semibold">
                  Upload screenshot of chat / proposal / email offer (PNG, JPG)
                </span>
                <Upload className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Advanced Context Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-slate-800 py-1 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <span>Additional Audit Attributes (Platform, Rate, Channel)</span>
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Platform / Source
                </label>
                <select
                  value={clientPlatform}
                  onChange={(e) => setClientPlatform(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Upwork">Upwork</option>
                  <option value="Fiverr">Fiverr</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Freelancer.com">Freelancer.com</option>
                  <option value="Direct Email">Direct Email / Cold Outreach</option>
                  <option value="Reddit / Discord">Reddit / Discord</option>
                  <option value="Telegram / WhatsApp">Telegram / WhatsApp</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Offered Pay / Rate
                </label>
                <input
                  type="text"
                  value={offeredPay}
                  onChange={(e) => setOfferedPay(e.target.value)}
                  placeholder="e.g. $60/hr or $5,000 fixed"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Proposed Payment Method
                </label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="e.g. Check, Crypto, Zelle, Wire, Escrow"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Main Contact Channel
                </label>
                <input
                  type="text"
                  value={communicationChannel}
                  onChange={(e) => setCommunicationChannel(e.target.value)}
                  placeholder="e.g. Telegram @handle, Email, Signal"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          id="run-analysis-btn"
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Scanning Global Scam Database...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5 text-white" />
              <span className="uppercase tracking-wider text-xs font-extrabold">Vet Client & Scan Red Flags</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
