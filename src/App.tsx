import React, { useState } from "react";
import AuditForm from "./components/AuditForm";
import AuditReportView from "./components/AuditReportView";
import HowItWorksModal from "./components/HowItWorksModal";
import { AuditFormInputs, AuditReport } from "./types";
import { 
  ShieldCheck, 
  Award, 
  Target, 
  Brain, 
  FileText, 
  AlertCircle, 
  BookOpen, 
  Star, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  Layers,
  TrendingUp,
  Cpu,
  CheckCircle2
} from "lucide-react";

// Pre-packaged offline reference sample that loads instantly so users can test immediately.
const DEMO_PRESET_REPORT: AuditReport = {
  websiteUrl: "https://mayoclinic.org",
  brandName: "Mayo Clinic",
  industry: "YMYL Health & Medical Information",
  mainService: "Clinical Services, Medical Research, and Health Education Publications",
  country: "United States (US) & International",
  analysisDate: "2026-06-10",
  overallScore: 465,
  normalizedScore: 93,
  executiveSummary: "Mayo Clinic represents the gold-standard reference model for digital E-E-A-T. By employing verified medical professionals as peer-review authors, declaring organizational and physical entities via schema, and maintaining direct citation backlinks across billions of external digital properties, search engines and modern AI frameworks (Google AI Overviews, Perplexity, Gemini, and ChatGPT) attribute maximum confidence scores. Current visibility signals suggest direct references in 94% of standard medical retrieval intents.",
  badges: ["Gold Standard E-E-A-T", "HTTPS Secured", "Expert Peer-Reviewed", "Fully Schema Valid", "Robust Digital Shadow"],
  categories: [
    {
      id: "foundation",
      name: "Foundation & Trust Indicators",
      score: 98,
      description: "Checks foundational technical credibility, including server trust parameters, physical representation indexes, security compliance, brand history accuracy, and standard legal policies.",
      criteria: [
        { name: "About page quality", maxPoints: 15, pointsAwarded: 15, status: "Valid", explanation: "Highly comprehensive multi-page executive background detailing mission statement, clinical goals, and global locations." },
        { name: "Clear mission and brand story", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Mission regarding healthcare delivery, education, and research is deeply integrated throughout design structure." },
        { name: "Physical address or service area", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Verified multiple clinical facilities with granular local geo-coordinates and maps integration." },
        { name: "Contact information", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Toll-free hotlines, dedicated clinical department contacts, and global customer support teams." },
        { name: "HTTPS/security", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Secure modern TLS protocol, with HSTS headers enabled." },
        { name: "Privacy policy and terms pages", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Granular HIPPA disclosures, user agreement policies, and global web cookie consents." },
        { name: "Core Web Vitals / performance signals", maxPoints: 10, pointsAwarded: 8, status: "Valid", explanation: "High response indexes, though some image sizes could benefit from extra Next-Gen compression." },
        { name: "Content freshness", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "All articles contain a clearly declared updated-on trigger with visible historical revision cycles." },
        { name: "Reputation signals", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Multiple gold healthcare awards, BBB accreditation, and outstanding ratings in health safety boards." },
        { name: "Clear product/service explanation", maxPoints: 5, pointsAwarded: 5, status: "Valid", explanation: "Unrestricted directory of physical clinical services, treatments, and remote telehealth appointments." }
      ]
    },
    {
      id: "executive",
      name: "Executive Entity Authority",
      score: 90,
      description: "Measures whether business leaders possess an established credibility layer verified by third-party knowledge repositories and corporate disclosures.",
      criteria: [
        { name: "Executive bio exists", maxPoints: 15, pointsAwarded: 15, status: "Valid", explanation: "Detailed CEO and Board officer histories with clear academic credentials and degrees appended." },
        { name: "Executive has dedicated profile page", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Dedicated leadership directory page linking direct medical and civic roles." },
        { name: "LinkedIn/profile links available", maxPoints: 10, pointsAwarded: 8, status: "Valid", explanation: "Most chief directors maintain high-activity verified LinkedIn assets." },
        { name: "External mentions/interviews/podcasts", maxPoints: 20, pointsAwarded: 18, status: "Valid", explanation: "Interviews on national television, CNN, medical journals, and leading healthcare systems podcasts." },
        { name: "Speaking events or media presence", maxPoints: 15, pointsAwarded: 14, status: "Valid", explanation: "Keynotes at major WHO Congress panels, research seminars, and educational summits." },
        { name: "Consistent identity across web", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Name strings match exactly across Wikipedia, Crunchbase, and leading database platforms." },
        { name: "Thought leadership content", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Regularly published medical op-eds on global healthcare architecture and wellness trends." },
        { name: "Reputation risk scan", maxPoints: 10, pointsAwarded: 5, status: "Needs Improvement", explanation: "Minor organizational search queries trigger historical regulatory debates; requires proactive PR messaging." }
      ]
    },
    {
      id: "author",
      name: "Author / Expert Entity Authority",
      score: 95,
      description: "Audits if public-facing writing and advisories are authored or validated by certified subject matter specialists to withstand critical search analysis.",
      criteria: [
        { name: "Author names visible on content", maxPoints: 15, pointsAwarded: 15, status: "Valid", explanation: "All content items have fully transparent bylines identifying doctor or credentials." },
        { name: "Author bio pages exist", maxPoints: 15, pointsAwarded: 15, status: "Valid", explanation: "Rich, comprehensive bio card with credentials, medical awards, education, and board certs." },
        { name: "Credentials/certifications shown", maxPoints: 15, pointsAwarded: 15, status: "Valid", explanation: "Visible MDs, PhDs, CFPs, and Board certifications attached to all author entities." },
        { name: "Social/profile links available", maxPoints: 10, pointsAwarded: 8, status: "Valid", explanation: "Direct links back to LinkedIn, ResearchGate, or clinical rosters." },
        { name: "Article archive exists", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Comprehensive index showcasing author's entire written history under Mayo Clinic." },
        { name: "Expert reviewer shown where needed", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Many lifestyle articles are double-certified: Written by an editor and peer-reviewed by an experienced Physician." },
        { name: "External validation/mentions", maxPoints: 15, pointsAwarded: 13, status: "Valid", explanation: "Authors frequently quoted in external medical press like WebMD, Healthline, and peer publications." },
        { name: "Person schema or author schema present", maxPoints: 10, pointsAwarded: 9, status: "Valid", explanation: "Person schema is embedded directly alongside bylines, declaring verified qualifications." }
      ]
    },
    {
      id: "experience",
      name: "Experience Proof",
      score: 92,
      description: "Audits whether the site features robust indicators of first-hand physical experience rather than recycled text or AI boilerplate syntheses.",
      criteria: [
        { name: "Case studies exist", maxPoints: 20, pointsAwarded: 18, status: "Valid", explanation: "Extensive peer-reviewed clinical trials and rare treatment case histories catalogued." },
        { name: "Testimonials/reviews exist", maxPoints: 15, pointsAwarded: 14, status: "Valid", explanation: "Patient care feedback, patient stories, and verified outcomes published with video consent." },
        { name: "Quantifiable results are shown", maxPoints: 20, pointsAwarded: 18, status: "Valid", explanation: "Survival rates, high transplant success percentage records, and clinical trial statistics." },
        { name: "Real customer/client examples", maxPoints: 15, pointsAwarded: 15, status: "Valid", explanation: "Authentic patient journeys clearly presented detailing unique conditions and solutions." },
        { name: "Original images/data/examples", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Actual clinic photos, medical diagrams, and clinical charts, completely avoiding vector stock photography." },
        { name: "First-hand process or methodology explained", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Step-by-step diagnostic workflows, surgery procedures, and clinical assessment plans." },
        { name: "Before/after or outcome proof", maxPoints: 10, pointsAwarded: 7, status: "Partial", explanation: "Excellent visual condition charts, though some therapeutic disciplines could utilize extra process photos." }
      ]
    },
    {
      id: "ai_readiness",
      name: "AI Visibility & Entity Readiness",
      score: 90,
      description: "Evaluates the site's capability to be crawled, linked, and successfully cited as an authoritative answer repository by Generative AI systems.",
      criteria: [
        { name: "Organization schema", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Fully compliant schema.org/MedicalOrganization JSON-LD format markup on base page." },
        { name: "Person schema", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Schema.org/Person declared cleanly with 'knowsAbout' referencing clinical coordinates." },
        { name: "SameAs links", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "SameAs anchors explicitly direct search crawlers back to verified Wikidata, Wikipedia, and NPI profiles." },
        { name: "Knowledge Graph consistency", maxPoints: 10, pointsAwarded: 9, status: "Valid", explanation: "Official Google Knowledge Graph ID is verified, sharing precise business info globally." },
        { name: "Brand mentions on third-party sites", maxPoints: 15, pointsAwarded: 14, status: "Valid", explanation: "Mentioned on academic publications, NIH files, CDC libraries, and newspapers." },
        { name: "Digital shadow strength", maxPoints: 15, pointsAwarded: 14, status: "Valid", explanation: "Exceptional shadow; reference brand relationships are fully synchronized in Google's semantic index." },
        { name: "Original research/statistics/data", maxPoints: 10, pointsAwarded: 10, status: "Valid", explanation: "Publishes primary medical journals, clinical findings, and annual global health reports." },
        { name: "Citation-worthy content", maxPoints: 10, pointsAwarded: 9, status: "Valid", explanation: "Definitions and treatment guidelines are worded clearly, making them incredibly easy for LLM scrappers to copy with credit." },
        { name: "Entity relationships are clear", maxPoints: 10, pointsAwarded: 4, status: "Needs Improvement", explanation: "While basic relationships exist, nested author-topic schema could be linked more directly in blog sub-paths." }
      ]
    }
  ],
  businessImpacts: [
    {
      type: "organic",
      title: "Missed Organic Traffic",
      impactLevel: "Low",
      text: "With high trust score levels, organic risk is minimal. However, missing schema in nested subcategories could lead to slight ranking variations across algorithmic core updates."
    },
    {
      type: "ad_spend",
      title: "Potentially Wasted Ad Spend",
      impactLevel: "Low",
      text: "Outstanding conversion trust metrics. Patient landing pages have strong proof signals, guaranteeing maximum ad utility and CPA values."
    },
    {
      type: "customer_confidence",
      title: "Lower Customer Confidence",
      impactLevel: "Low",
      text: "Outstanding credibility presence. Patients feel maximal legal and physical safety signals across terms of care policies and verified medical credentials."
    }
  ],
  detailedEeat: [
    { name: "Experience", score: 92, definition: "Real-world experience indicators", keyFinding: "A wealth of original medical diagrams and direct clinical results proofs." },
    { name: "Expertise", score: 95, definition: "Subject matter specialist qualifications", keyFinding: "Each guide is peer-authored by board-certified physicians." },
    { name: "Authoritativeness", score: 90, definition: "Third-party validation & citations", keyFinding: "Backlinks are highly concentrated in global educational databases." },
    { name: "Trustworthiness", score: 98, definition: "Commercial and security trust safety", keyFinding: "Explicit HTTPS parameters matched with legal HIPAA disclosures." }
  ],
  aiVisibilityAnalysis: [
    { label: "Organization Entity Strength", status: "Strong", justification: "Declared via explicit Schema and supported by multiple authoritative wiki entries." },
    { label: "Author/Person Entity Strength", status: "Strong", justification: "Authors contain unique profile archives paired with NPI medical identifier credentials." },
    { label: "Knowledge Graph Readiness", status: "Strong", justification: "Official Wikidata nodes established and directly referenced via sameAs arrays." },
    { label: "Schema Coverage", status: "Strong", justification: "Deep utilization of schema.org vocabulary including MedicalCondition, MedicalTherapy, and Person." },
    { label: "Digital Shadow Strength", status: "Strong", justification: "Omnipresent backlinks across high DA government (.gov) and academic (.edu) platforms." },
    { label: "AI Citation Readiness", status: "Strong", justification: "Clear definitions and direct research outputs make quoting highly favorable for AI scrapers." },
    { label: "Information Gain Score", status: "Strong", justification: "Consistently publishes new clinical findings, adding true original value to the LLM index." }
  ],
  snapshotChecklist: [
    { area: "About Page Detail", status: "Valid", impact: "High", recommendation: "Maintain the clear chronological timeline and historical mission statement." },
    { area: "Contact & Physical Address", status: "Valid", impact: "High", recommendation: "No changes needed; physical addresses are clearly syndicating to local maps lists." },
    { area: "HTTPS / Site Security", status: "Valid", impact: "High", recommendation: "Active secure protocols. Ensure older, non-HTTPS pages redirect comprehensively." },
    { area: "Core Web Vitals", status: "Needs Improvement", impact: "Medium", recommendation: "Fine-tune script priorities to speed up layout load times on 3G devices." },
    { area: "Schema Markup", status: "Valid", impact: "High", recommendation: "Schema coverage is vast. Maintain active structured formats." },
    { area: "Author / Expert Pages", status: "Valid", impact: "High", recommendation: "Author rosters are fully established. Continue attaching credentials on newer clinical writers." },
    { area: "Executive Visibility", status: "Valid", impact: "Medium", recommendation: "Executive board bios are clean. Encourage extra media columns and expert podcasts." },
    { area: "Case Studies", status: "Valid", impact: "High", recommendation: "Active reporting of outcomes. No action requested." },
    { area: "Reviews / Testimonials", status: "Valid", impact: "Medium", recommendation: "Continue leveraging clean, consented video diaries from treatment patients." },
    { area: "Brand Mentions", status: "Valid", impact: "High", recommendation: "Mentions are highly organic. Focus on tracking third-party citations daily." },
    { area: "Original Research", status: "Valid", impact: "High", recommendation: "Outstanding original academic database support; keep publishing peer-reviewed trials." },
    { area: "Policy Pages", status: "Valid", impact: "Medium", recommendation: "Add structured schema to privacy policy to verify compliance directly for crawlers." }
  ],
  roadmap: [
    {
      phase: "Phase 1: Foundational Trust (0-30 Days)",
      items: [
        "Audit existing category-level canonical structures to resolve any meta duplicates.",
        "Include machine-readable schema on existing corporate contact and support portals.",
        "Add explicit 'Verified Medical Reviewer' indicators to all lifestyle articles.",
        "Verify privacy policy schema references are fully compliant with GDPR regulations.",
        "Compress heavy imagery on standard landing paths to enhance Core Web Vitals layout rates."
      ]
    },
    {
      phase: "Phase 2: Authority Building (30-60 Days)",
      items: [
        "Synthesize clinical case study outcomes into simplified, graphic infographics.",
        "Syndicate executive team board bios on medical registry directories for citation links.",
        "Introduce structural author entity hubs so readers can navigate credentials in one place.",
        "Gather video review diaries from consenting patients seeking therapy advice services.",
        "Integrate additional external SameAs nodes linking authors back to ResearchGate networks."
      ]
    },
    {
      phase: "Phase 3: AI Visibility Leadership (60-90 Days)",
      items: [
        "Publish annual Medical Trends health statistics with fully open-access raw CSV datasets.",
        "Establish direct PR syndication for clinical executives highlighting pioneering trial wins.",
        "Configure automated schema validators inside CMS flow to enforce 100% compliance.",
        "Create dedicated, definition-rich FAQ semantic schema outputs for smart assistant citation.",
        "Engage in academic collaborative studies with partner research labs to cement brand mentions."
      ]
    }
  ],
  recommendations: [
    { id: 1, title: "Optimize Web Vitals Speed Metrics", category: "Technical Foundation", impact: "High", difficulty: "Medium", timeline: "30 Days", whyItMatters: "Search models prefer quick, reliable sites when citing data." },
    { id: 2, title: "Include HIPAA / Privacy Schema Code", category: "Security & Legal", impact: "High", difficulty: "Easy", timeline: "15 Days", whyItMatters: "Validates strict YMYL user data compliance directly for search bot engines." },
    { id: 3, title: "Audit Redirect Status on Canonical Links", category: "Technical Link", impact: "Medium", difficulty: "Easy", timeline: "15 Days", whyItMatters: "Ensures crawlers aren't confused by duplicate versions of the pages." },
    { id: 4, title: "Establish External SameAs Citation Anchors", category: "Entity SEO", impact: "High", difficulty: "Medium", timeline: "45 Days", whyItMatters: "Links author entities to verified Wikidata databases for Knowledge Graph mapping." },
    { id: 5, title: "Expand Executive Podcasting Presence", category: "Executive PR", impact: "Medium", difficulty: "Medium", timeline: "60 Days", whyItMatters: "Builds third-party mentions on leading radio and news streaming catalogs." },
    { id: 6, title: "Introduce Author Biography Index Hub", category: "Author Credibility", impact: "High", difficulty: "Easy", timeline: "30 Days", whyItMatters: "Makes it simple for AI crawlers to build semantic relational profiles of writers." },
    { id: 7, title: "Translate Complex Case Studies Into Graphics", category: "Experience Proof", impact: "Medium", difficulty: "Medium", timeline: "45 Days", whyItMatters: "Creates visual blocks that are often featured in AI visual overview slides." },
    { id: 8, title: "Syndicate Patient Outcomes to Youtube Channel", category: "Multimedia trust", impact: "Medium", difficulty: "High", timeline: "90 Days", whyItMatters: "Diversifies brand footprint into Google visual and search video assets." },
    { id: 9, title: "Publish Primary Hospital Research Datasets", category: "AI Citation", impact: "High", difficulty: "High", timeline: "90 Days", whyItMatters: "Provides valuable original data points that LLMs will parse and link back to directly." },
    { id: 10, title: "Automate Schema Validation Inside CMS", category: "Structured Data", impact: "High", difficulty: "Medium", timeline: "60 Days", whyItMatters: "Guarantees that all updates maintain clean, zero-error microformats." }
  ],
  competitorComparison: [
    { metric: "Overall Trust Signals", yourBrand: "98% Validated", competitorBrands: [{ name: "WebMD", value: "92% Validated" }, { name: "Healthline", value: "94% Validated" }] },
    { metric: "Author Expert Visibility", yourBrand: "Clinical Peer Bylines", competitorBrands: [{ name: "WebMD", value: "Freelance Editors" }, { name: "Healthline", value: "Verified Advisers" }] },
    { metric: "Schema Validation & Coverage", yourBrand: "Full Medical Schema", competitorBrands: [{ name: "WebMD", value: "Basic Schema" }, { name: "Healthline", value: "Advanced Schema" }] },
    { metric: "Total Brand Mentions", yourBrand: "Extremely Dynamic", competitorBrands: [{ name: "WebMD", value: "Vast Reach" }, { name: "Healthline", value: "Vast Reach" }] },
    { metric: "First-hand Content Depth", yourBrand: "Clinical Trials Proof", competitorBrands: [{ name: "WebMD", value: "General Summaries" }, { name: "Healthline", value: "General Summaries" }] },
    { metric: "AI Citation Readiness", yourBrand: "96% Structured Index", competitorBrands: [{ name: "WebMD", value: "88% Indexed" }, { name: "Healthline", value: "90% Indexed" }] }
  ]
};

export default function App() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const handleRunAudit = async (inputs: AuditFormInputs) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch("https://gemini-proxy-2-pearl.vercel.app/api/entity-eeat-audit-v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });

      if (!response) {
        throw new Error("No response received from the analysis engine. Please try again.");
      }

      const text = await response.text();
      if (!text || text.trim() === "") {
        throw new Error(`The analysis engine returned an empty response (Status: ${response.status}). Please confirm your server or GEMINI_API_KEY environment variable.`);
      }

      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        throw new Error(`Failed to parse server response as valid JSON (Status: ${response.status}). The server might be unavailable or returned an error page.`);
      }

      if (!response.ok) {
        throw new Error(parsedData.error || `Analysis request failed with status code ${response.status}.`);
      }

      setReport(parsedData);
      
      // Scroll to view generated content
      setTimeout(() => {
        const target = document.getElementById("capture-audit-report");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected network error occurred while running the Gemini audit engine.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemoPreset = () => {
    setReport(DEMO_PRESET_REPORT);
  };

  const handleReset = () => {
    setReport(null);
    setErrorMsg(null);
    setTimeout(() => {
      const target = document.getElementById("audit-form-container");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* Header Banner - Screen Only */}
      <nav className="print-hidden border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-purple-600 text-white rounded-lg shadow-md shadow-purple-600/10">
              <Brain className="w-5 h-5" />
            </span>
            <div>
              <span className="font-mono text-[9px] font-bold text-purple-700 tracking-wider block uppercase leading-none">AISTUDIO CAPABILITY ACTIVE</span>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">EEAT &amp; AI Visibility Snapshot</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 transition hover:bg-purple-100 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" /> How It Works
            </button>
            <button
              onClick={handleLoadDemoPreset}
              className="text-xs text-purple-800 font-semibold bg-purple-50 hover:bg-purple-100 border border-purple-200/50 px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer"
            >
              Load Gold-Standard Model Live Case
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* Intro Hero Section - Screen Only */}
        {!report && (
          <section className="print-hidden text-center max-w-3xl mx-auto space-y-4 py-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono leading-none font-bold uppercase tracking-widest bg-purple-100 text-purple-800">
              <Star className="w-3 h-3 fill-purple-600 text-purple-600" /> Executive Trust Snapshot
            </div>
            <h2 className="text-3xl md:text-4.5xl font-black text-slate-900 tracking-tight leading-none">
              Is Your Business Content Ready for <br className="hidden md:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                AI Search &amp; Citations?
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Google AI Overviews, Gemini, ChatGPT, and Perplexity don't just search for keywords—they build semantic trees from on-site schemas, verified expert authors, first-hand case results, and company founders. Audit your property now.
            </p>
          </section>
        )}

        {/* Audit Form Interface */}
        {!report && (
          <div className="print-hidden">
            <AuditForm onSubmit={handleRunAudit} isLoading={isLoading} />
          </div>
        )}

        {/* Loading Spinner Overlays */}
        {isLoading && (
          <div className="print-hidden max-w-2xl mx-auto bg-white rounded-2xl border border-slate-100 p-8 space-y-6 text-center animate-fade-in shadow-sm">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800">Analyzing Organic Trust Vector Graph</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Evaluating YMYL schema variables, parsing SameAs digital shadows, reviewing author credibility tags, and computing roadmap recommendations via Gemini-3.5-flash...
              </p>
            </div>
            {/* Fake progress indications for feedback */}
            <div className="inline-grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-400 font-mono text-left max-w-sm mx-auto">
              <div>✓ Foundational check: HTTP and Policy files</div>
              <div>✓ Extracting founder identity link arrays</div>
              <div>✓ Scanning reviews and physical address indicators</div>
              <div>✓ Preparing structured 10-point roadmap data</div>
            </div>
          </div>
        )}

        {/* Error Output Indicator */}
        {errorMsg && !isLoading && (
          <div className="print-hidden max-w-2xl mx-auto bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <h4 className="font-bold text-xs">Analysis Error Raised</h4>
              <p className="text-xs text-rose-700 leading-relaxed mt-1">
                {errorMsg}
              </p>
              <button
                onClick={handleLoadDemoPreset}
                className="mt-3 text-xs bg-white text-rose-800 px-3 py-1 rounded border border-rose-200 font-medium hover:bg-rose-100/50 cursor-pointer transition"
              >
                Launch Sandbox Model Instead
              </button>
            </div>
          </div>
        )}

        {/* Audit Report View Result */}
        {report && !isLoading && (
          <div className="animate-fade-in transition-all">
            <AuditReportView report={report} onReset={handleReset} />
          </div>
        )}

        {/* Bottom Core Guide Section  - Screen Only */}
        {!report && !isLoading && (
          <section className="print-hidden grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-white border border-slate-100 p-5 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-purple-600" />
                1. Foundation &amp; Trust
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                About pages, real contact details, HTTPS protocol, valid policies, and active performance compliance metrics that verify actual organizational state.
              </p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-purple-600" />
                2. Expert Authority Bylines
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Articles authored by credentialed specialists. Includes bio files, LinkedIn social proof connections, and proper Schema mapping representation.
              </p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Target className="w-4.5 h-4.5 text-purple-600" />
                3. First-Hand Experience
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Case studies, quantifiable treatment outputs, genuine user testimonials, and original media blocks verifying true physical experience.
              </p>
            </div>
          </section>
        )}

      </main>

      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />

      <footer className="print-hidden mt-16 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>&copy; 2026 Entity E-E-A-T &amp; AI Visibility Snapshot No. 2. Developed by <strong className="text-slate-700">Ami - SEO Girl</strong>. All rights reserved.</p>
      </footer>
    </div>
  );
}
