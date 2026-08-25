import React, { useState } from "react";
import { AuditFormInputs } from "../types";
import { Globe, Building2, Tag, ShieldCheck, HelpCircle, Sparkles, Send } from "lucide-react";

interface AuditFormProps {
  onSubmit: (inputs: AuditFormInputs) => void;
  isLoading: boolean;
}

const INDUSTRY_TEMPLATES = [
  {
    name: "YMYL Financial Blog",
    inputs: {
      url: "https://financewealthpro.com",
      brandName: "WealthPro Insights",
      industry: "Personal Finance & YMYL Advising",
      mainService: "Wealth Management & Retirement Planning Guides",
      targetMarket: "United States (US)",
      competitors: "NerdWallet, Investopedia, Seeking Alpha",
      founderName: "Marcus Sterling, CEO",
      expertName: "Sarah Mercer, CFP (Senior Certified Financial Planner)",
    },
  },
  {
    name: "SaaS Dev DevOps Tool",
    inputs: {
      url: "https://devflowengine.io",
      brandName: "DevFlow Engine",
      industry: "Software & Cloud Tech Infrastructure",
      mainService: "AI-Powered CI/CD Pipeline Automation",
      targetMarket: "Global Enterprise",
      competitors: "GitHub Actions, CircleCI, GitLab",
      founderName: "Vikram Mehta, CEO & Founder",
      expertName: "Alex Mercer, Devops Architect & Core Contributor",
    },
  },
  {
    name: "Local Wellness Clinic",
    inputs: {
      url: "https://lotuswellnessspa.com",
      brandName: "Lotus Wellness Center",
      industry: "Holistic Health, Physical Therapy & Spa Services",
      mainService: "Premium Acupuncture & Therapeutic Massage Treatments",
      targetMarket: "San Diego, California (Local)",
      competitors: "Elysium Massage, Balance Yoga Spa",
      founderName: "Elena Rostova, Founder",
      expertName: "Dr. Julianna Carter, LAc (Licensed Acupuncturist)",
    },
  },
];

export default function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [inputs, setInputs] = useState<AuditFormInputs>({
    url: "",
    brandName: "",
    industry: "",
    mainService: "",
    targetMarket: "",
    competitors: "",
    founderName: "",
    expertName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyTemplate = (templateInputs: AuditFormInputs) => {
    setInputs(templateInputs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.url || !inputs.brandName || !inputs.industry || !inputs.mainService) {
      alert("Please fill in all required fields (URL, Brand Name, Industry, and Main Product/Service).");
      return;
    }
    onSubmit(inputs);
  };

  return (
    <div id="audit-form-container" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
      {/* Templates Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-semibold text-slate-700">Quick-Launch Sandbox Templates:</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Click an industry card below to pre-populate the auditor with rich structured authority information and test the full-blown Gemini evaluation engine instantly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INDUSTRY_TEMPLATES.map((tpl) => (
            <button
              key={tpl.name}
              type="button"
              onClick={() => handleApplyTemplate(tpl.inputs)}
              className="flex flex-col items-start p-3 text-left border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition duration-150 group cursor-pointer"
            >
              <span className="text-xs font-semibold text-purple-700 mb-1">{tpl.name}</span>
              <span className="text-[11px] text-slate-500 truncate w-full">URL: {tpl.inputs.url}</span>
              <span className="text-[11px] text-slate-400 truncate w-full">Brand: {tpl.inputs.brandName}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-slate-400 uppercase font-mono tracking-wider">Or Input Your Brand Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* URL Box */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-400" />
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="url"
              placeholder="e.g., https://example.com"
              value={inputs.url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Full URL of the portal to be evaluated</span>
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              Brand / Merchant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brandName"
              placeholder="e.g., Acme Tech Solutions"
              value={inputs.brandName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Brand entity represented</span>
          </div>

          {/* Industry Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-slate-400" />
              Industry / Niche Sector <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="industry"
              placeholder="e.g., YMYL Personal Finance, Enterprise SaaS"
              value={inputs.industry}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">YMYL niches require stricter evidence thresholds</span>
          </div>

          {/* Main Service/Product */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Main Product / Principal Service <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mainService"
              placeholder="e.g., Portfolio Auditing, DevOps automation"
              value={inputs.mainService}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Your core commercial entity relationship</span>
          </div>
        </div>

        {/* Optional Section Divider */}
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-xs font-semibold uppercase text-slate-400 font-mono tracking-wider mb-4">
            Demographics & Entity Identifiers (Highly Recommended)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Target Market / Primary Jurisdiction
              </label>
              <input
                type="text"
                name="targetMarket"
                placeholder="e.g., United States, UK, Europe"
                value={inputs.targetMarket}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Determines local citations and physical trust checks</span>
            </div>

            {/* Competitors */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                Competitor URL/Brands <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="competitors"
                placeholder="e.g., CompetitorA.com, CompetitorB.com"
                value={inputs.competitors}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Triggers direct E-E-A-T and citation bench comparison</span>
            </div>

            {/* Founder */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                Main Executive / Founder / CEO <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="founderName"
                placeholder="e.g., Jeffrey Bezos, Jane Doe"
                value={inputs.founderName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Evaluates Knowledge Graph readiness of key officer</span>
            </div>

            {/* Expert Author */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                Principal Author / Subject Matter Expert <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="expertName"
                placeholder="e.g., Dr. Hannah Jacobs, Senior Developer"
                value={inputs.expertName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Checks person schema links and author bio footprint</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all flex items-center justify-center gap-2 relative shadow-lg shadow-purple-600/15 disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Executing SEO Knowledge Graph & E-E-A-T Real-time Audit...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <span>Compile Executive Trust & AI Visibility Report</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Trust Signoff - No Telemetry Slop */}
      <p className="text-center text-[10px] text-slate-400 mt-6 max-w-lg mx-auto leading-relaxed">
        The tool uses advanced linguistic parsing relative to YMYL guidelines to calculate trust percentages, Schema compliance, and Digital Shadow visibility signals.
      </p>
    </div>
  );
}
