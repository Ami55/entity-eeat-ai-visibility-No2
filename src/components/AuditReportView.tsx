import React from "react";
import { AuditReport } from "../types";
import {
  FileText,
  TrendingDown,
  DollarSign,
  UserX,
  Award,
  BookOpen,
  Briefcase,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Printer,
  ChevronRight,
  Sparkles,
  BarChart3,
  Search
} from "lucide-react";

interface AuditReportViewProps {
  report: AuditReport;
  onReset: () => void;
}

export default function AuditReportView({ report, onReset }: AuditReportViewProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  // Trigger modern print dialogue / high-fidelity download which leverages html2pdf.js with full fallback
  const handleExportPDF = () => {
    const element = document.getElementById("capture-audit-report");
    if (!element) {
      window.print();
      return;
    }

    setIsExporting(true);

    const executeHtml2Pdf = () => {
      // 1. Temporarily locate all <style> blocks and convert oklch colors to computed rgb
      const styleElements = Array.from(document.querySelectorAll("style"));
      const originalContents = styleElements.map(el => el.innerHTML);

      const oklchRegex = /oklch\([^)]+\)/g;
      const tempEl = document.createElement("div");
      tempEl.style.display = "none";
      document.body.appendChild(tempEl);

      const cache = new Map<string, string>();

      const convertOklchToRgb = (cssText: string) => {
        return cssText.replace(oklchRegex, (match) => {
          if (cache.has(match)) {
            return cache.get(match)!;
          }
          try {
            tempEl.style.color = "";
            tempEl.style.color = match;
            const computedColor = window.getComputedStyle(tempEl).color;
            if (computedColor && !computedColor.includes("oklch")) {
              cache.set(match, computedColor);
              return computedColor;
            }
          } catch (e) {
            console.error(e);
          }
          return match;
        });
      };

      // Perform conversion on css in style tags to prevent html2canvas parsing failures
      styleElements.forEach(styleEl => {
        try {
          styleEl.innerHTML = convertOklchToRgb(styleEl.innerHTML);
        } catch (err) {
          console.error("Failed to parse colors for style block:", err);
        }
      });

      document.body.removeChild(tempEl);

      const restoreOriginalStyles = () => {
        styleElements.forEach((styleEl, idx) => {
          try {
            styleEl.innerHTML = originalContents[idx];
          } catch (err) {
            console.error("Failed to restore style block:", err);
          }
        });
      };

      const opt = {
        margin: [10, 10, 10, 10], // clean 10mm standard border margins
        filename: `EEAT_Visibility_Audit_${report.brandName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] } // respects .print-break-before-page perfectly
      };

      try {
        const creator = (window as any).html2pdf();
        if (creator) {
          creator.set(opt).from(element).save().then(() => {
            setIsExporting(false);
            restoreOriginalStyles();
          }).catch((err: any) => {
            console.error("Dynamic html2pdf extraction failed, using system printer dialog:", err);
            setIsExporting(false);
            restoreOriginalStyles();
            window.print();
          });
        } else {
          setIsExporting(false);
          restoreOriginalStyles();
          window.print();
        }
      } catch (error) {
        console.error("PDF generation exception, trigger browser fallback prints:", error);
        setIsExporting(false);
        restoreOriginalStyles();
        window.print();
      }
    };

    if ((window as any).html2pdf) {
      executeHtml2Pdf();
    } else {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        executeHtml2Pdf();
      };
      script.onerror = () => {
        setIsExporting(false);
        window.print();
      };
      document.body.appendChild(script);
    }
  };

  const getBadgesColor = (badge: string) => {
    const b = badge.toLowerCase();
    if (b.includes("missing") || b.includes("need") || b.includes("low") || b.includes("attention") || b.includes("weak")) {
      return "bg-rose-50 text-rose-700 border-rose-100";
    }
    if (b.includes("secured") || b.includes("valid") || b.includes("legal") || b.includes("strong") || b.includes("exist")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
    return "bg-amber-50 text-amber-700 border-amber-100";
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "valid" || s === "strong" || s === "success" || s === "valid") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          {status}
        </span>
      );
    }
    if (s === "partial" || s === "moderate" || s === "needs improvement" || s === "low") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          {status}
        </span>
      );
    }
    // Missing, Not Detected, Weak
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {status}
      </span>
    );
  };

  const getImpactBadge = (impact: "High" | "Medium" | "Low") => {
    if (impact === "High") {
      return <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-xs">High Impact</span>;
    }
    if (impact === "Medium") {
      return <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-xs">Medium</span>;
    }
    return <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs">Low</span>;
  };

  const getDifficultyBadge = (diff: "High" | "Medium" | "Low" | "Easy" | "Hard") => {
    if (diff === "High" || diff === "Hard") {
      return <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded text-xs">Hard</span>;
    }
    if (diff === "Medium") {
      return <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">Medium</span>;
    }
    return <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-xs">Easy</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 print-width-full">
      {/* Control Banner for Screen */}
      <div className="print-hidden flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-5 shadow-lg shadow-purple-950/25">
        <div className="flex items-center gap-3">
          <span className="p-2 sm:p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </span>
          <div>
            <h3 className="font-semibold text-sm sm:text-base">Audit Compiled Successfully</h3>
            <p className="text-xs text-slate-300">Generated dynamic entity connections. Clean, print-ready layout available below.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none text-center px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg cursor-pointer transition"
          >
            New Audit
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer shadow-lg shadow-purple-600/30 transition disabled:opacity-75 disabled:cursor-wait"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Compiling PDF...</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>Export Premium PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Consulting Report Container - Formatted strictly for premium digital reading and PDF prints */}
      <div id="capture-audit-report" className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden print-shadow-none p-6 md:p-12 space-y-12">
        
        {/* SECTION 1: REPORT HEADER */}
        <header className="border-b border-slate-100 pb-8 relative">
          <div className="absolute top-0 right-0 bg-purple-50 border border-purple-100 rounded-xl px-3 py-1 text-right print-break-inside-avoid">
            <span className="text-[10px] font-mono text-purple-700 block uppercase tracking-wider font-semibold">Report Generated</span>
            <span className="text-xs text-slate-800 font-medium">{report.analysisDate}</span>
          </div>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-mono bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-widest mb-3">
              Consulting Audit Report
            </span>
            <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Entity E-E-A-T &amp; AI Visibility Snapshot
            </h1>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              A preliminary consulting analysis of trust signals, structured metadata, and entity clarity on behalf of <strong className="text-slate-800 font-semibold">{report.brandName}</strong>. Evaluate how ready your property is to be understood, cited, and summarized by major LLMs.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] md:text-xs text-slate-500">
            <div>
              <span className="font-mono text-slate-400 capitalize">Target Site:</span>{" "}
              <a
                href={report.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-0.5 underline transition"
              >
                {report.websiteUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div>
              <span className="font-mono text-slate-400">Industry:</span>{" "}
              <strong className="text-slate-800 font-medium">{report.industry}</strong>
            </div>
            <div>
              <span className="font-mono text-slate-400">Principal Agent:</span>{" "}
              <strong className="text-slate-800 font-medium">{report.mainService}</strong>
            </div>
            <div>
              <span className="font-mono text-slate-400">Market Constraint:</span>{" "}
              <strong className="text-slate-800 font-semibold">{report.country}</strong>
            </div>
          </div>
        </header>

        {/* SECTION 2: EXECUTIVE SUMMARY */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          {/* Executive Summary Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                I. Executive Advisory Summary
              </h2>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-normal">
                {report.executiveSummary}
              </p>
            </div>

            {/* Strengths & Weakness Badges */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-mono font-semibold text-slate-400 block mb-2.5">
                Observed System Status Signals:
              </span>
              <div className="flex flex-wrap gap-2">
                {report.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getBadgesColor(badge)}`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Score Chart Dial */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative print-break-inside-avoid">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold mb-3">
              Computed Trust Score
            </span>
            
            <div className="relative flex items-center justify-center w-36 h-36">
              {/* SVG Circle Loop */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-purple-600 transition-all duration-1000"
                  strokeWidth="8"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (263.89 * report.normalizedScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {report.normalizedScore}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">/100 PTS</span>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-500">
                Overall points collected: <strong className="text-slate-800 font-semibold">{report.overallScore}</strong> / 500 max points.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: BUSINESS IMPACTS */}
        <section className="space-y-4 print-break-inside-avoid pt-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            II. Commercial Business Impact Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.businessImpacts.map((impact, idx) => {
              const getIcon = (type: string) => {
                if (type === "organic") return <TrendingDown className="w-5 h-5 text-rose-600" />;
                if (type === "ad_spend") return <DollarSign className="w-5 h-5 text-amber-600" />;
                return <UserX className="w-5 h-5 text-slate-600" />;
              };

              const getBorderColor = (level: string) => {
                if (level === "High") return "border-rose-100 bg-rose-50/20";
                if (level === "Medium") return "border-amber-100 bg-amber-50/20";
                return "border-slate-100 bg-slate-50/20";
              };

              return (
                <div
                  key={idx}
                  className={`border rounded-xl p-5 ${getBorderColor(impact.impactLevel)} flex flex-col justify-between space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                      {getIcon(impact.type)}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                        impact.impactLevel === "High"
                          ? "bg-rose-100 text-rose-700"
                          : impact.impactLevel === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {impact.impactLevel} Risk
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{impact.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5">{impact.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: DETAILED E-E-A-T COGNITIVE ANALYSIS */}
        <section className="space-y-4 print-break-inside-avoid">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            III. Detailed E-E-A-T Component breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {report.detailedEeat.map((item, idx) => {
              const getBadgeIcon = (name: string) => {
                if (name === "Experience") return <Briefcase className="w-4 h-4 text-purple-600" />;
                if (name === "Expertise") return <Award className="w-4 h-4 text-purple-600" />;
                if (name === "Authoritativeness") return <BookOpen className="w-4 h-4 text-purple-600" />;
                return <ShieldCheck className="w-4 h-4 text-purple-600" />;
              };

              return (
                <div key={idx} className="border border-slate-100 rounded-xl p-5 bg-slate-50 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-purple-700 flex items-center gap-1">
                        {getBadgeIcon(item.name)}
                        {item.name}
                      </span>
                      <strong className="text-sm font-bold text-slate-800 font-mono">
                        {item.score}/100
                      </strong>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">{item.definition}</span>
                  </div>

                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-800 font-semibold block">Key Observation:</strong>
                      {item.keyFinding}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: AI VISIBILITY & ENTITY SPECIFICS */}
        <section className="space-y-4 print-break-inside-avoid">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            IV. Knowledge Graph &amp; AI Engine Retrieval Analysis
          </h2>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              AI crawlers build relation trees to link author entities back to known physical topics, ensuring high information gain. Below is the parsed credibility score of your brand’s overall digital shadow and on-site semantic schema files.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.aiVisibilityAnalysis.map((metric, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{metric.label}</span>
                    {getStatusBadge(metric.status)}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {metric.justification}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: CATEGORIES & RAW EVALUATION CRITERIA */}
        <div className="print-break-before-page"></div>
        <section className="space-y-6 pt-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            V. Exhaustive Categories Score sheets
          </h2>

          <div className="space-y-6">
            {report.categories.map((cat, idx) => (
              <div key={cat.id} className="border border-slate-200 rounded-2xl overflow-hidden print-break-inside-avoid">
                {/* Accordion/Category Title Bar */}
                <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-purple-300 uppercase block">
                      Category {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold">{cat.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-mono text-purple-300">
                      {cat.score}
                    </span>
                    <span className="text-xs text-slate-400 font-mono"> / 100 PTS</span>
                  </div>
                </div>

                <div className="bg-slate-50/50 p-4 border-b border-slate-100">
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Criteria Sublist Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/50 text-slate-400 text-[10px] uppercase font-mono tracking-wider">
                        <th className="py-2 px-4 border-b border-slate-200">Analysis Dimension</th>
                        <th className="py-2 px-4 border-b border-slate-200 w-24 text-center">Outcome</th>
                        <th className="py-2 px-4 border-b border-slate-200 w-24 text-right">Points</th>
                        <th className="py-2 px-4 border-b border-slate-200">Consultant Reasoning / Strategic Findings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {cat.criteria.map((crit, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="py-2.5 px-4 text-xs font-semibold text-slate-800">
                            {crit.name}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {getStatusBadge(crit.status)}
                          </td>
                          <td className="py-2.5 px-4 text-right text-xs font-mono font-medium text-slate-700">
                            {crit.pointsAwarded} / {crit.maxPoints}
                          </td>
                          <td className="py-2.5 px-4 text-xs text-slate-600 leading-relaxed">
                            {crit.explanation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: PHASE 1 SNAPSHOT CHECKLIST */}
        <div className="print-break-before-page"></div>
        <section className="space-y-4 pt-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            VI. Consolidated Verification Checklist
          </h2>
          <div className="border border-slate-200 rounded-2xl overflow-hidden print-break-inside-avoid">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] font-mono uppercase tracking-wider">
                    <th className="py-3 px-4">Area of Analysis</th>
                    <th className="py-3 px-4 w-32">Status</th>
                    <th className="py-3 px-4 w-32">E-E-A-T Impact</th>
                    <th className="py-3 px-4">Direct Strategic Recommendation Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {report.snapshotChecklist.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition duration-150">
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${
                          item.status === "Valid" || item.status === "Strong" ? "text-emerald-500" : "text-slate-200"
                        }`} />
                        {item.area}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="py-3.5 px-4">
                        {getImpactBadge(item.impact)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-700 font-normal leading-relaxed">
                        {item.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 8: 30/60/90 DAY GROWTH ROADMAP */}
        <section className="space-y-4 print-break-inside-avoid">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            VII. Growth Opportunity Roadmaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.roadmap.map((phase, idx) => {
              const bgHeaderColors = [
                "bg-purple-600 text-white",
                "bg-slate-900 text-white",
                "bg-slate-100 text-slate-800 border-b border-slate-200"
              ];
              const badgeColors = [
                "bg-purple-100 text-purple-800",
                "bg-slate-800 text-white",
                "bg-slate-200 text-slate-800"
              ];

              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col"
                >
                  <div className={`p-4 ${bgHeaderColors[idx]}`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-90 block mb-1">
                      Action Phase
                    </span>
                    <h3 className="text-xs font-bold font-mono truncate">{phase.phase}</h3>
                  </div>

                  <div className="p-4 flex-1">
                    <ul className="space-y-3.5">
                      {phase.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2.5">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 flex items-center justify-center w-5 h-5 ${badgeColors[idx]}`}>
                            {iIdx + 1}
                          </span>
                          <span className="text-xs text-slate-700 leading-relaxed font-normal">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 9: PRIORITY STRATEGIC RECOMMENDATIONS TABLE */}
        <div className="print-break-before-page"></div>
        <section className="space-y-4 pt-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            VIII. 10 Decisive Recommended Actions
          </h2>
          <div className="border border-slate-200 rounded-2xl overflow-hidden print-break-inside-avoid">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[10px] font-mono uppercase tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">ID</th>
                    <th className="py-3 px-4">Action Title</th>
                    <th className="py-3 px-4 w-32">Theme Block</th>
                    <th className="py-3 px-4 w-24">Impact</th>
                    <th className="py-3 px-4 w-24">Difficulty</th>
                    <th className="py-3 px-4 w-24">Timeline</th>
                    <th className="py-3 px-4">Target Outcome Reasoning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {report.recommendations.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition duration-150">
                      <td className="py-3 px-4 text-xs font-mono font-bold text-center text-slate-400">
                        {rec.id}
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-slate-900">
                        {rec.title}
                      </td>
                      <td className="py-3 px-4 text-[11px] font-mono text-slate-600">
                        {rec.category}
                      </td>
                      <td className="py-3 px-4">
                        {getImpactBadge(rec.impact)}
                      </td>
                      <td className="py-3 px-4">
                        {getDifficultyBadge(rec.difficulty)}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-semibold text-purple-700">
                        {rec.timeline}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 leading-relaxed font-normal">
                        {rec.whyItMatters}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 10: COMPETITOR COMPARISON INDEX */}
        {report.competitorComparison && report.competitorComparison.length > 0 && (
          <section className="space-y-4 print-break-inside-avoid">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              IX. Direct Market &amp; Competitor Citation Benchmark
            </h2>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[10px] font-mono uppercase tracking-wider">
                      <th className="py-3 px-4">Authority Metric Vector</th>
                      <th className="py-3 px-4 bg-purple-500/15 text-purple-300">
                        {report.brandName} (You)
                      </th>
                      {report.competitorComparison[0]?.competitorBrands.map((comp, cIdx) => (
                        <th key={cIdx} className="py-3 px-4 text-slate-300">
                          {comp.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {report.competitorComparison.map((metric, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition duration-150">
                        <td className="py-3 px-4 text-xs font-bold text-slate-800">
                          {metric.metric}
                        </td>
                        <td className="py-3 px-4 text-xs font-semibold text-purple-800 bg-purple-50/40">
                          {metric.yourBrand}
                        </td>
                        {metric.competitorBrands.map((comp, cIdx) => (
                          <td key={cIdx} className="py-3 px-4 text-xs text-slate-600 font-normal">
                            {comp.value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Footer Audit Signature block - Executive styling, no technical telemetry noise */}
        <footer className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-mono">
          <div>
            <span>SYSTEM ENVELOPE: E-E-A-T ENTITY ANALYSIS PROTOCOL</span>
          </div>
          <div className="text-right">
            <span>© 2026 Entity E-E-A-T &amp; AI Visibility Snapshot No. 2. Developed by Ami - SEO Girl. All rights reserved.</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
