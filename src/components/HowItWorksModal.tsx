import React from "react";
import { 
  X, 
  Brain, 
  ShieldCheck, 
  Award, 
  Target, 
  Network, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  HelpCircle
} from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: "01",
      title: "Input Brand & Entity Coordinates",
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      description: "Provide your domain, primary offering, target geography, and key personnel (founders, authors, or subject matter experts).",
      details: [
        "Identifies core entity nodes (Organization, Person, Service)",
        "Captures sector-specific YMYL (Your Money Your Life) requirements",
        "Establishes baseline digital footprint anchors"
      ]
    },
    {
      step: "02",
      title: "500-Point 5-Pillar E-E-A-T Audit",
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      description: "Scores your digital trust profile across 5 distinct 100-point vectors using rigorous search quality rater criteria.",
      details: [
        "Foundation & Trust (Security, Legal, Contact, Brand Story)",
        "Executive Authority (Leadership visibility, media, thought leadership)",
        "Author / Expert Entity (Bylines, certifications, peer reviews)",
        "Experience Proof (Case studies, data proof, client outcomes)",
        "AI Visibility & Entity Readiness (Schema, Knowledge Graph, SameAs links)"
      ]
    },
    {
      step: "03",
      title: "Generative AI Citation Simulation",
      icon: <Brain className="w-5 h-5 text-purple-600" />,
      description: "Simulates how Large Language Models (LLMs) and AI answer engines retrieve and cite your brand.",
      details: [
        "Tests for Information Gain and primary citation worthiness",
        "Evaluates entity clarity for Google AI Overviews, Perplexity & Gemini",
        "Highlights digital shadow gaps and missing schema relations"
      ]
    },
    {
      step: "04",
      title: "90-Day Execution Roadmap & PDF Export",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      description: "Generates prioritized strategic recommendations and an executive-ready report for stakeholders.",
      details: [
        "Phase 1 (0-30 Days): Foundational Trust fixes",
        "Phase 2 (30-60 Days): Authority & byline engineering",
        "Phase 3 (60-90 Days): AI Citation leadership & Knowledge Graph sync",
        "Clean, one-click PDF export for consulting presentations"
      ]
    }
  ];

  const pillars = [
    {
      name: "Foundation & Trust",
      points: "100 pts",
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      summary: "Evaluates HTTPS, about page story, transparent contact channels, privacy compliance, and verified business locations."
    },
    {
      name: "Executive Entity",
      points: "100 pts",
      icon: <Award className="w-4 h-4 text-purple-600" />,
      summary: "Checks CEO/founder profiles, executive bylines, speaking engagements, interviews, and third-party digital mentions."
    },
    {
      name: "Author / Expert",
      points: "100 pts",
      icon: <CheckCircle2 className="w-4 h-4 text-purple-600" />,
      summary: "Audits author bio pages, professional credentials (MD, PhD, CFA), article archives, and Person schema markup."
    },
    {
      name: "Experience Proof",
      points: "100 pts",
      icon: <Target className="w-4 h-4 text-purple-600" />,
      summary: "Audits real client case studies, quantifiable ROI/outcome metrics, verified reviews, and original visual proof."
    },
    {
      name: "AI & Schema Readiness",
      points: "100 pts",
      icon: <Cpu className="w-4 h-4 text-purple-600" />,
      summary: "Analyzes JSON-LD schema (Organization, Person, SameAs), Knowledge Graph synchronization, and AI citation readiness."
    }
  ];

  return (
    <div 
      id="how-it-works-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="how-it-works-modal-dialog"
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/60 via-indigo-50/40 to-white">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-600/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 block">
                Methodology &amp; Architecture
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                How the E-E-A-T &amp; AI Visibility Audit Works
              </h3>
            </div>
          </div>
          <button
            id="close-how-it-works-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 divide-y divide-slate-100">
          
          {/* Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Practical Instructions
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Enter the website URL, brand name, industry, main service, and target market. Add founder, expert, and competitor details when available, then select Run Audit. Review the five category scores, checklist, recommendations, competitor comparison, and 30/60/90-day roadmap. Use Print / Save PDF to export the completed report.
            </p>
          </div>

          {/* 4-Step Pipeline */}
          <div className="pt-6 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              The 4-Step Analysis Pipeline
            </h4>
            <div className="grid grid-cols-1 gap-4">
              {steps.map((s, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/70 rounded-xl p-4 transition duration-150 flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex sm:flex-col items-center sm:items-start justify-between shrink-0">
                    <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                      STEP {s.step}
                    </span>
                    <div className="hidden sm:block mt-3 p-2 bg-white rounded-lg border border-slate-200/60 shadow-xs">
                      {s.icon}
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <h5 className="text-sm font-bold text-slate-900">{s.title}</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                    <ul className="grid grid-cols-1 gap-1 text-[11px] text-slate-500 font-normal pt-1">
                      {s.details.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Framework */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                The 500-Point Scoring Framework
              </h4>
              <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                5 Pillars × 100 Points
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pillars.map((p, pIdx) => (
                <div 
                  key={pIdx} 
                  className={`p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-1.5 ${
                    pIdx === 4 ? "sm:col-span-2 bg-gradient-to-r from-purple-50/40 to-indigo-50/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      {p.icon}
                      <span>{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {p.points}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {p.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Outcomes */}
          <div className="pt-6 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Output Deliverables
            </h4>
            <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-mono uppercase">
                <FileText className="w-4 h-4" /> Comprehensive Executive Deliverable
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every audit delivers a normalized 0-100 score, business risk evaluation, 10 prioritized strategic recommendations sorted by impact and difficulty, a 30-60-90 day execution roadmap, and instant print/PDF generation.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Ready to audit your website?
          </span>
          <button
            id="modal-start-audit-btn"
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
          >
            <span>Start Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
export default HowItWorksModal;
