export interface Criterion {
  name: string;
  maxPoints: number;
  pointsAwarded: number;
  status: "Valid" | "Partial" | "Needs Improvement" | "Missing" | "Not Detected";
  explanation: string;
}

export interface Category {
  id: "foundation" | "executive" | "author" | "experience" | "ai_readiness";
  name: string;
  score: number;
  description: string;
  criteria: Criterion[];
}

export interface BusinessImpact {
  type: "organic" | "ad_spend" | "customer_confidence";
  title: string;
  impactLevel: "High" | "Medium" | "Low";
  text: string;
}

export interface DetailedEeatItem {
  name: "Experience" | "Expertise" | "Authoritativeness" | "Trustworthiness";
  score: number;
  definition: string;
  keyFinding: string;
}

export interface AiVisibilityMetric {
  label: string;
  status: "Strong" | "Moderate" | "Weak" | "Missing";
  justification: string;
}

export interface ChecklistItem {
  area: string;
  status: "Valid" | "Partial" | "Needs Improvement" | "Missing" | "Low" | "Strong";
  impact: "High" | "Medium" | "Low";
  recommendation: string;
}

export interface RoadmapPhase {
  phase: string;
  items: string[];
}

export interface Recommendation {
  id: number;
  title: string;
  category: string;
  impact: "High" | "Medium" | "Low";
  difficulty: "High" | "Medium" | "Low" | "Easy" | "Hard";
  timeline: string;
  whyItMatters: string;
}

export interface CompetitorBrand {
  name: string;
  value: string;
}

export interface CompetitorMetric {
  metric: string;
  yourBrand: string;
  competitorBrands: CompetitorBrand[];
}

export interface AuditReport {
  websiteUrl: string;
  brandName: string;
  industry: string;
  mainService: string;
  country: string;
  analysisDate: string;
  overallScore: number;
  normalizedScore: number;
  executiveSummary: string;
  badges: string[];
  categories: Category[];
  businessImpacts: BusinessImpact[];
  detailedEeat: DetailedEeatItem[];
  aiVisibilityAnalysis: AiVisibilityMetric[];
  snapshotChecklist: ChecklistItem[];
  roadmap: RoadmapPhase[];
  recommendations: Recommendation[];
  competitorComparison?: CompetitorMetric[];
}

export interface AuditFormInputs {
  url: string;
  brandName: string;
  industry: string;
  mainService: string;
  targetMarket: string;
  competitors: string;
  founderName: string;
  expertName: string;
}
