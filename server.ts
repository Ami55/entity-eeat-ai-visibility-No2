import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization pattern for Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST Endpoint to trigger the E-E-A-T and Entity SEO audit
app.post("/api/analyze", async (req, res) => {
  try {
    const {
      url,
      brandName,
      industry,
      mainService,
      targetMarket,
      competitors,
      founderName,
      expertName,
    } = req.body;

    if (!url || !brandName || !industry || !mainService) {
      return res.status(400).json({
        error: "Missing required parameters: url, brandName, industry, and mainService are required.",
      });
    }

    const ai = getGenAI();

    const systemPrompt = `You are a premium, highly experienced Senior Entity SEO Architect and Digital Trust (E-E-A-T) Auditor.
Your client is a business seeking an executive-style Snapshot Audit report evaluating how ready their website/brand is to be trusted, understood, and cited by major search engines and modern AI engines like Google AI Overviews, ChatGPT, Gemini, and Perplexity.

Evaluate the website and inputs with a professional, strategic SEO consulting tone. Use rigorous scoring rules, avoiding generic template advice.
If an input is not provided (e.g. founderName, expertName, or competitors) or cannot be verified from typical sources, do not invent facts; mark corresponding elements as "Missing", "Weak" or "Not found", and provide clear strategic recommendations on how to create/validate those entity assets.

Return a JSON audit report of the brand and URL matching the requested details.`;

    const userPrompt = `Generate a detailed Entity E-E-A-T and AI Visibility Audit Report for the following inputs:
- Website URL: ${url}
- Brand Name: ${brandName}
- Industry: ${industry}
- Main Service/Product: ${mainService}
- Target Market/Country: ${targetMarket || "Global"}
- Main Competitors (Optional): ${competitors || "None listed"}
- Main Executive/Founder (Optional): ${founderName || "None listed"}
- Main Author/Expert (Optional): ${expertName || "None listed"}

Total score is 500 points. Make sure to calculate five categories, each worth 100 points:
1. Foundation & Trust (100 pts)
   - About page quality (15 pts)
   - Clear mission and brand story (10 pts)
   - Physical address or service area (10 pts)
   - Contact information (10 pts)
   - HTTPS/security (10 pts)
   - Privacy policy and terms pages (10 pts)
   - Core Web Vitals / performance signals (10 pts)
   - Content freshness (10 pts)
   - Reputation signals (10 pts)
   - Clear product/service explanation (5 pts)

2. Executive Entity Authority (100 pts)
   - Executive bio exists (15 pts)
   - Executive has dedicated profile page (10 pts)
   - LinkedIn/profile links available (10 pts)
   - External mentions/interviews/podcasts (20 pts)
   - Speaking events or media presence (15 pts)
   - Consistent identity across web (10 pts)
   - Thought leadership content (10 pts)
   - Reputation risk scan (10 pts)
   *Note: If no founderName/executive is provided, mark this category as very weak (~20-30 points max) and recommend establishing executive assets explicitly.*

3. Author / Expert Entity Authority (100 pts)
   - Author names visible on content (15 pts)
   - Author bio pages exist (15 pts)
   - Credentials/certifications shown (15 pts)
   - Social/profile links available (10 pts)
   - Article archive exists (10 pts)
   - Expert reviewer shown where needed (10 pts)
   - External validation/mentions (15 pts)
   - Person schema or author schema present (10 pts)
   *Note: If no expertName is provided, point out the gap and score low to moderate (~30-40 points).*

4. Experience Proof (100 pts)
   - Case studies exist (20 pts)
   - Testimonials/reviews exist (15 pts)
   - Quantifiable results are shown (20 pts)
   - Real customer/client examples (15 pts)
   - Original images/data/examples (10 pts)
   - First-hand process or methodology explained (10 pts)
   - Before/after or outcome proof (10 pts)

5. AI Visibility & Entity Readiness (100 pts)
   - Organization schema (10 pts)
   - Person schema (10 pts)
   - SameAs links (10 pts)
   - Knowledge Graph consistency (10 pts)
   - Brand mentions on third-party sites (15 pts)
   - Digital shadow strength (15 pts)
   - Original research/statistics/data (10 pts)
   - Citation-worthy content (10 pts)
   - Entity relationships are clear (10 pts) (Services, People, Industry, Locations, Author topics, Executive company, Company proof)

Please calculate overall score as the sum of all 5 category scores. Sum should be out of 500. Compute dynamic normalizedScore = round((overallScore / 500) * 100).

Your JSON output must match this specific structure:
{
  "websiteUrl": string,
  "brandName": string,
  "industry": string,
  "mainService": string,
  "country": string,
  "analysisDate": string,
  "overallScore": number (out of 500, sum of categories),
  "normalizedScore": number (out of 100),
  
  "executiveSummary": string (3 to 5 sentences briefing the overall entity readiness and critical warnings),
  
  "badges": [string] (exactly 5 concise visual highlights indicating concrete highlights or findings, e.g., ["HTTPS Secured", "Basic Legal Policies", "Schema Missing", "Low Executive Profile", "Needs Original Research"]),
  
  "categories": [
    {
      "id": "foundation" | "executive" | "author" | "experience" | "ai_readiness",
      "name": string,
      "score": number (out of 100),
      "description": string,
      "criteria": [
        {
          "name": string,
          "maxPoints": number,
          "pointsAwarded": number,
          "status": "Valid" | "Partial" | "Needs Improvement" | "Missing" | "Not Detected",
          "explanation": string
        }
      ]
    }
  ],
  
  "businessImpacts": [
    {
      "type": "organic" | "ad_spend" | "customer_confidence",
      "title": string,
      "impactLevel": "High" | "Medium" | "Low",
      "text": string
    }
  ],
  
  "detailedEeat": [
    {
      "name": "Experience" | "Expertise" | "Authoritativeness" | "Trustworthiness",
      "score": number,
      "definition": string,
      "keyFinding": string
    }
  ],
  
  "aiVisibilityAnalysis": [
    {
      "label": "Organization Entity Strength" | "Author/Person Entity Strength" | "Knowledge Graph Readiness" | "Schema Coverage" | "Digital Shadow Strength" | "AI Citation Readiness" | "Information Gain Score",
      "status": "Strong" | "Moderate" | "Weak" | "Missing",
      "justification": string
    }
  ],
  
  "snapshotChecklist": [
    {
      "area": "About Page Detail" | "Contact & Physical Address" | "HTTPS / Site Security" | "Core Web Vitals" | "Schema Markup" | "Author / Expert Pages" | "Executive Visibility" | "Case Studies" | "Reviews / Testimonials" | "Brand Mentions" | "Original Research" | "Policy Pages",
      "status": "Valid" | "Partial" | "Needs Improvement" | "Missing" | "Low" | "Strong",
      "impact": "High" | "Medium" | "Low",
      "recommendation": string
    }
  ],
  
  "roadmap": [
    {
      "phase": "Phase 1: Foundational Trust (0-30 Days)" | "Phase 2: Authority Building (30-60 Days)" | "Phase 3: AI Visibility Leadership (60-90 Days)",
      "items": [string] (at least 5 specific action items per phase)
    }
  ],
  
  "recommendations": [
    {
      "id": number (1 to 10),
      "title": string,
      "category": string,
      "impact": "High" | "Medium" | "Low",
      "difficulty": "High" | "Medium" | "Low",
      "timeline": string,
      "whyItMatters": string
    }
  ],
  
  "competitorComparison": [
    {
      "metric": "Overall Trust Signals" | "Author Expert Visibility" | "Schema Validation & Coverage" | "Total Brand Mentions" | "First-hand Content Depth" | "AI Citation Readiness",
      "yourBrand": string,
      "competitorBrands": [
        {
          "name": string,
          "value": string
        }
      ]
    }
  ]
}

Make sure of the following formatting constraints:
1. Ensure strict, standard JSON output.
2. In the "competitorComparison", if no competitors were provided, you can either omit the comparison or do a direct generic industry benchmark comparison comparing the brand with standard default industry competitors or average benchmarks. Mention "Industry Benchmark" in those cases.
3. Tailor the criteria explanations, justifications, roadmaps, and 10 recommendations strictly based on the URL and inputs provided. For example, if it's a finance URL, write finance-appropriate E-E-A-T warnings (such as YMYL guidelines, SEC disclosures, expert author validation). If it's a wellness brand or Software service, provide SaaS specific recommendations (such as developer schema type, case study metrics, review platform syndication).`;

    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash"
    ];

    let responseText = "";
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting E-E-A-T analysis with model: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          responseText = response.text.trim();
          console.log(`Success! E-E-A-T analysis completed successfully with model: ${modelName}`);
          break; // Exit loop on success
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or overloaded. Error details:`, err.message || err);
        lastError = err;
        // Continue to the next model in the fallback chain
      }
    }

    if (!responseText) {
      throw new Error(
        `E-E-A-T report generation failed across all tried models. Last error: ${
          lastError?.message || lastError || "Unknown error"
        }`
      );
    }

    const auditData = JSON.parse(responseText);
    return res.json(auditData);

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred during report generation.",
    });
  }
});

// Configure Vite or Serve Static Files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Serve index.html or bundle via Vite
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files inside dist/
    app.use(express.static(distPath));
    
    // Express v4 fallback to index.html for SPA routing
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
